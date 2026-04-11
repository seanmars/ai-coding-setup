# Notes

## .claude/settings.local.json on Windows

`settings.local.json` 應該是會自動忽略的，但官方在 Windows 上設置的忽略規則有錯誤設定成 `**/.claude\settings.local.json`，導致無法正確忽略該文件。建議手動修改忽略規則為 `**/.claude/settings.local.json`。

設定檔案的路徑: `~/.config/git/ignore`
