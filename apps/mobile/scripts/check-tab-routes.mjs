import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const TABS_DIR = 'src/app/(tabs)';
const LAYOUT = join(TABS_DIR, '_layout.tsx');

const layout = readFileSync(LAYOUT, 'utf8');

const routes = readdirSync(TABS_DIR)
  .filter((file) => /\.tsx$/.test(file) && file !== '_layout.tsx')
  .map((file) => file.replace(/\.tsx$/, ''));

const declared = new Set(
  [...layout.matchAll(/<Tabs\.Screen\s+name="([^"]+)"/g)].map(
    (match) => match[1]
  )
);

const problems = [];

for (const route of routes) {
  if (!declared.has(route)) {
    problems.push(
      `${route} has no <Tabs.Screen> in _layout.tsx; it will render as an unintended tab`
    );
  }
}

for (const name of declared) {
  if (!routes.includes(name)) {
    problems.push(
      `_layout.tsx declares "${name}", but no such route file exists`
    );
  }
}

if (problems.length > 0) {
  console.error(problems.map((problem) => `  !! ${problem}`).join('\n'));
  console.error(`\n${problems.length} TAB ROUTE PROBLEM(S)`);
  process.exit(1);
}

console.log(`OK: all ${routes.length} tab routes are declared`);
