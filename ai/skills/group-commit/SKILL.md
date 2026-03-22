---
name: group-commit
description: Git commit skill that intelligently groups changed files by functionality and creates separate, well-structured commits for each group. Use this skill whenever the user wants to commit changes, asks to "commit", wants to group commits, or says things like "help me commit these changes", "split my commits", "commit by feature", "organize my commits", "group-commit", or "/group-commit". Always use this skill instead of a plain git commit when there are multiple changed files that might belong to different features or concerns.
---

# Group Commit (group-commit)

This skill analyzes your git working tree, groups changed files by functional area or purpose, and creates clean, atomic commits — one per logical group.

## Why atomic commits matter

When changes span multiple features or concerns (e.g., a bug fix + a refactor + some docs), cramming them into one commit makes history hard to read and cherry-picks hard to do. Splitting by intent produces a cleaner, more meaningful history.

## Workflow

Follow these steps in order — do not skip the plan-review step.

### Step 1: Gather all changes

Run these to understand the full picture:

```bash
git status
git diff HEAD          # all unstaged + staged combined diff
git diff --cached      # staged only
git diff               # unstaged only
```

If there are no changes at all, tell the user and stop.

### Step 2: Analyze and group

For each changed file (new, modified, deleted, renamed), figure out:
- **What it does** — read the diff, not just the filename
- **Why it changed** — feature addition, bug fix, refactor, docs, test, config/chore?
- **What it belongs with** — files that work together toward the same goal go in the same group

**Grouping heuristics:**
- Files in the same module/component that change together for the same reason → same group
- Test files (`*.test.*`, `*.spec.*`, `__tests__/`) belong with the feature they test, unless they're standalone test-only changes
- `package.json` + lockfile changes → `chore(deps):` group
- Only docs/README changes → `docs:` group
- Migration files → `chore(db):` or `feat(db):` depending on what they add
- Config files (`.eslintrc`, `tsconfig`, `vite.config`, etc.) → `chore(config):` unless tied to a feature

When in doubt, keep groups small rather than large. Two commits is better than one overstuffed one.

### Step 3: Determine conventional commit messages

Use conventional commits format: `type(scope): description`

**Types:**
- `feat` — new feature or behavior the user can see
- `fix` — bug fix
- `refactor` — restructuring without behavior change
- `perf` — performance improvement
- `test` — tests only
- `docs` — documentation only
- `style` — formatting/whitespace only (not CSS styles)
- `chore` — build, deps, tooling, config
- `ci` — CI/CD config

**Scope** is optional but helpful: `feat(auth):`, `fix(api):`, `chore(deps):`

Keep the description lowercase, imperative, no period at end. Max ~72 chars.

Good examples:
```
feat(auth): add JWT refresh token endpoint
fix(ui): correct button alignment on mobile
refactor(store): extract user state into separate slice
chore(deps): update eslint to v9
docs: add API authentication guide
test(auth): add refresh token edge case tests
```

### Step 4: Present the plan

Before committing anything, show the user the full plan in this format:

```
📦 Commit Plan — N commits

── Commit 1 ─────────────────────────────────────
feat(auth): add JWT refresh token endpoint
  • src/auth/refresh.ts         (new)
  • src/auth/refresh.test.ts    (new)
  • src/routes/auth.ts          (modified)

── Commit 2 ─────────────────────────────────────
chore(deps): update eslint and prettier
  • package.json                (modified)
  • package-lock.json           (modified)
  • .eslintrc.json              (modified)

── Commit 3 ─────────────────────────────────────
docs: update README with auth setup steps
  • README.md                   (modified)
```

Then use the `AskUserQuestion` tool to ask for confirmation with these exact options:
- `✅ Proceed` → execute the plan
- `✏️ Edit plan` → ask what to adjust (merge groups, split, rename message, move a file)
- `❌ Cancel` → stop, do nothing

Based on the user's selection:
- **✅ Proceed** → execute the plan
- **✏️ Edit plan** → ask what to adjust, update the plan, then show it again and ask with `AskUserQuestion` once more
- **❌ Cancel** → stop, do nothing

### Step 5: Execute commits

For each group, in order:

1. Reset staging area first (to avoid leftover staged files from previous steps):
   ```bash
   git reset HEAD
   ```

2. Stage only the files in this group:
   ```bash
   git add path/to/file1 path/to/file2
   ```
   For deleted files, `git add` still works (it stages the deletion).
   For renamed files, add both old and new path, or just the new path if git already tracks the rename.

3. Commit:
   ```bash
   git commit -m "feat(scope): description"
   ```

4. Confirm the commit succeeded before moving to the next group.

After all commits, run `git log --oneline -N` (where N = number of commits made) and show the user the result.

## Edge cases

**Mixed staged/unstaged:** Treat all changes (staged + unstaged) as the pool to group. You'll be staging specific files per group anyway, so it doesn't matter what was staged before.

**Untracked new files:** Include them in grouping normally. Use `git add path/to/newfile` to stage them.

**Partially changed files (same file, multiple concerns):** This is rare but possible. If a file clearly has two unrelated changes (e.g., a bug fix and a refactor in the same file), mention this to the user and suggest which group it fits better — don't try to split hunks automatically unless the user explicitly asks for it.

**No meaningful grouping (all files belong together):** Say so clearly: "All changes appear to be part of a single feature — I suggest one commit:" and propose the single message.

**Already staged files:** Treat staged files the same as unstaged — they're all part of the working set to be grouped and committed.

**Merge conflicts / rebase in progress:** Check for these with `git status` first. If found, stop and tell the user to resolve conflicts before committing.

## What NOT to do

- Don't use `git add .` or `git add -A` — always add specific files per group
- Don't skip the plan review step — always show the plan and wait for confirmation
- Don't amend existing commits unless the user explicitly asks
- Don't push — committing locally only unless told otherwise
- Don't add unnecessary scope if it doesn't add clarity (`fix: correct typo` is fine without a scope)
