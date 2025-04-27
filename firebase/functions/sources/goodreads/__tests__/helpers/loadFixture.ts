import * as fs from 'fs';
import * as path from 'path';

export function loadFixture(fixturePath: string): string {
  const fixtureFullPath = path.join(__dirname, '..', fixturePath);
  return fs.readFileSync(fixtureFullPath, 'utf8');
}
