const { Configuration, OpenAIApi } = require('openai');
const { Octokit } = require('@octokit/rest');
const { execSync } = require('child_process');
const fs = require('fs');

const diff = process.argv[2];

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function reviewCode() {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
          You are an expert full-stack tech lead and product builder. 
          Review the following Git diff.
          
          Please structure your feedback clearly into:
          1. High-Impact Improvements 🔥
          2. Medium-Impact Suggestions 🛠️
          3. Low-Impact Cleanups 🧹
          4. Reusable Component Opportunities 🧩
          5. Security Alerts 🔒
          6. Growth Suggestions 📈
          7. Praises for Good Patterns 🏆
          
          Prioritize actionable, specific suggestions. 
          Format feedback cleanly using Markdown.
          
          Always think like a solo founder: speed, scalability, security, user experience, and business growth are equally important.
          
          End with a final overall comment about the PR health.
        `,
        },
        { role: 'user', content: `Please review this Git diff:\n\n${diff}` },
      ],
    });

    const feedback = response.data.choices[0].message.content;

    console.log('🔍 AI Feedback:\n', feedback);

    // Post the comment back to GitHub PR
    const eventPath = process.env.GITHUB_EVENT_PATH;
    const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
    const prNumber = event.pull_request.number;
    const repo = event.repository.full_name;

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.error('GITHUB_TOKEN not available');
      process.exit(1);
    }

    const octokit = new Octokit({ auth: token });

    await octokit.issues.createComment({
      owner: repo.split('/')[0],
      repo: repo.split('/')[1],
      issue_number: prNumber,
      body: feedback,
    });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

reviewCode();
