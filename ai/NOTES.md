# Notes

## Markdown Front Matter(frontmatter)

在 Markdown 文件的最頂端，由 `---` 包圍的區塊通常被稱為 YAML Front Matter(或者是簡稱為 Front Matter)。它是一種用於在 Markdown 文件中嵌入元數據(metadata)的格式，通常使用 YAML 語法來定義這些元數據。

## .claude/settings.local.json on Windows

`settings.local.json` 應該是會自動忽略的，但官方在 Windows 上設置的忽略規則有錯誤設定成 `**/.claude\settings.local.json`，導致無法正確忽略該文件。建議手動修改忽略規則為 `**/.claude/settings.local.json`。

設定檔案的路徑: `~/.config/git/ignore`

## typescript-lsp plugin fails on Windows

REF: <https://github.com/anthropics/claude-code/issues/19658>

### Workaround

Edit `~/.claude/plugins/marketplaces/claude-plugins-official/.claude-plugin/marketplace.json` and change the typescript-lsp entry from:

```json
"command": "typescript-language-server",
"args": ["--stdio"],
```

to:

```json
"command": "cmd",
"args": ["/c", "typescript-language-server", "--stdio"],
```
