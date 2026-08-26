import { readFileSync } from "node:fs";

const message =
  process.argv[2] === "--title"
    ? (process.argv[3] ?? "").trim()
    : readFileSync(process.argv[2], "utf8").trim();
const conventionalCommit =
  /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9._/-]+\))?!?: .+/;

if (!conventionalCommit.test(message.split("\n", 1)[0])) {
  console.error(
    "Commit message must use Conventional Commits (for example: feat: add budgets).",
  );
  process.exit(1);
}
