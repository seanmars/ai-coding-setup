# Guidelines
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
## Important Reminders
**NEVER**:
- IMPORTANT: DO NOT USEING 全形符號, 永遠使用半形符號. ex:
  - "，" should be ","
  - "。" should be "."
  - "；" should be ";"
  - "：" should be ":"
  - "！" should be "!"
  - "？" should be "?"
  - "（" should be "("
  - "）" should be ")"
- Use `--no-verify` to bypass commit hooks
- Disable tests instead of fixing them
- Commit code that doesn't compile
- Make assumptions - verify with existing code
**ALWAYS**:
- Update plan documentation as you go
- Stop after 3 failed attempts and reassess
- IMPORTANT:Response in Traditional Chinese, and use Taiwanese terms. But technical terms should be kept in English.
- DO NOT create a new markdown file to document each chage or summarize your work unless specifically requested by the user.
## Documentation
When writing documentation or README content, use Traditional Chinese (繁體中文) unless otherwise specified. Keep descriptions concise — avoid over-documenting with verbose usage details.
## Tooling for shell interactions (Install if missing)
Is it about finding FILES? use 'fd'
Is it about finding TEXT/strings? use 'rg'
Is it about finding CODE STRUCTURE? use 'ast-grep'
Is it about SELECTING from multiple results? pipe to 'fzf'
Is it about interacting with JSON? use 'jq'
Is it about interacting with YAML or XML? use 'yq'
- You run in an environment where `ast-grep` is available; whenever a search requires syntax-aware or structural matching, default to `ast-grep --lang rust -p '<pattern>'` (or set `--lang` appropriately) and avoid falling back to text-only tools like `rg` or `grep` unless I explicitly request a plain-text search.