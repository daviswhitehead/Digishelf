"use strict";
// __tests__/mocks/goodreadsMock.js
const mockGoodreadsResponse = books => {
    return `
      <html>
        <body>
          <div id="reviewPagination">
            <a>1</a>
            <a>2</a>
            <a rel="next">next »</a>
          </div>
          <table>
            ${books
        .map(book => `
              <tr class="bookalike review">
                <td class="field cover">
                  <img src="${book.coverImage || 'https://example.com/cover.jpg'}" />
                </td>
                <td class="field title">
                  <a href="${book.canonicalURL || 'https://www.goodreads.com/book/show/123'}">${book.title}</a>
                </td>
                <td class="field author">
                  <a>${book.author}</a>
                </td>
                <td class="field rating">
                  <span class="staticStars" title="${book.rating || 'really liked it'}"></span>
                </td>
                <td class="field review">
                  <span id="freeTextreview123">${book.review || ''}</span>
                </td>
              </tr>
            `)
        .join('')}
          </table>
        </body>
      </html>
    `;
};
module.exports = {
    mockGoodreadsResponse,
};
//# sourceMappingURL=goodreadsMock.js.map