# ai-coding-setup

提供一鍵式的環境初始化流程，用來安裝 Claude CLI 相關外掛市集與常用插件，並安裝 OpenSpec。此專案以 Node.js 搭配 zx 執行，適合在 Windows、macOS、Linux 上快速完成 AI Coding 相關基礎工具的安裝。

## 專案在做什麼

執行後會依序完成下列工作：

1. 設定 Claude 官方外掛市集（claude-plugins-official）並安裝指定插件：
   - code-simplifier
   - csharp-lsp
   - frontend-design
   - typescript-lsp
2. 設定 Superpowers 外掛市集（superpowers-dev）並安裝插件：
   - superpowers@superpowers-dev
3. 全域安裝 OpenSpec 套件：
   - @fission-ai/openspec@latest

## 使用方式

### 前置需求

- Node.js 18+（建議 LTS）
- pnpm
- Claude CLI（需能在 PATH 內直接執行 claude）

### 安裝相依套件

```bash
pnpm install
```

### 執行初始化

```bash
pnpm run setup
```

## 相關 URLs

- [Claude 官方 Plugin](https://github.com/anthropics/claude-plugins-official)
- [Superpowers](https://github.com/obra/superpowers)
- [OpenSpec](https://www.npmjs.com/package/@fission-ai/openspec)
