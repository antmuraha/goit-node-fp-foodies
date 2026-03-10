---
description: "Use when creating git commits, writing commit messages, or preparing staged changes. Enforces conventional commit format and commit hygiene."
name: "Git Commit Conventions"
---

# Git Commit Conventions

- Use Conventional Commits in lowercase: `<type>(<scope>): <subject>`.
- Allowed `type` values: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `revert`.
- Keep the subject in imperative mood, lowercase (except proper nouns), and under 72 characters.
- Make each commit atomic: one logical change per commit.
- Do not use vague messages like `wip`, `updates`, or `fix stuff`.
- Add a body when needed to explain why, tradeoffs, or migration notes.
- Use `BREAKING CHANGE:` footer when behavior or API compatibility changes.
- Before committing, ensure relevant tests or checks for changed code pass.
- Include related docs or schema updates in the same commit when they are required for correctness.

## Message Template

```text
<type>(<scope>): <short imperative subject>

<optional body explaining why>

<optional footer, e.g. BREAKING CHANGE: ...>
```
