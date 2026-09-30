# CLAUDE

## Response Guidelines

- 所有回應一律使用正體中文台灣用語,只保留技術詞彙使用英文.
- 一律使用半形符號,不使用全形符號: "," "." ";" ":" "!" "?" "(" ")" 而不是 "，" "。" "；" "：" "！" "？" "（" "）".
- 除了 output style 要求的 Insight 區塊外,回應內容請盡量簡潔,避免過度說明或冗長的使用說明,除非使用者特別要求.
- 有修改檔案的任務,結尾用三個標題做摘要: `待我處理`, `已修改`, `發現`.

## Working Mode

- When a step doesn't need my input, keep going. Put status notes in the same message as your next action.
- Stop and ask only when you can't continue without me, or before anything destructive: deleting data, force-pushing, or changing anything outside the working directory.
- Done means: the code builds, related tests pass, and no test was disabled or skipped to get there.
- After 3 failed attempts at the same problem, stop and reassess the approach.

## Philosophy

### Core Beliefs

- **Incremental progress over big bangs** - Small changes that compile and pass tests
- **Learning from existing code** - Study and plan before implementing
- **Pragmatic over dogmatic** - Adapt to project reality
- **Clear intent over clever code** - Be boring and obvious

### Simplicity Means

- Single responsibility per function/class
- Avoid premature abstractions
- No clever tricks - choose the boring solution
- If you need to explain it, it's too complex

## Rules

- Don't use `--no-verify` to bypass commit hooks.
- Fix failing tests instead of disabling them.
- Don't commit code that doesn't compile.
- Verify assumptions against existing code instead of guessing.
- If an openspec change is in progress, check off its `tasks.md` as steps complete; otherwise keep any existing plan document in sync.
- Don't create a new markdown file to document each change unless I ask for it.

## Documentation

When writing documentation or README content, use Traditional Chinese (繁體中文) unless otherwise specified. Keep descriptions concise - avoid over-documenting with verbose usage details.

## Tooling for shell interactions

If a tool below is missing, ask me before installing it.

- Finding FILES: `fd`
- Finding TEXT/strings: `rg`
- Finding CODE STRUCTURE: `ast-grep` (set `--lang` to the project's language, e.g. `--lang csharp -p '<pattern>'`)
- SELECTING from multiple results: pipe to `fzf --filter '<query>'` (non-interactive; plain `fzf` needs a TTY)
- JSON: `jq`
- YAML or XML: `yq`

## Notes

- 如果有切換到其他目錄 (cd to other directory),結束動作後要切換回到主目錄 (cd back to session start directory),以免影響後續動作.
