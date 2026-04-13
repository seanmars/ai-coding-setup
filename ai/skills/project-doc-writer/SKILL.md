---
name: project-doc-writer
description: 閱讀專案並撰寫一份完整的繁體中文使用手冊 how-to-use-{name}.md (name 取自專案名稱或目錄名稱)。當使用者要求`寫使用手冊`、`產生說明文件`、`幫我寫文件`、`document this project`、`write usage guide`、`generate how-to`，或是任何想要為一個 project/tool/library/CLI/SDK 產生使用說明的情境，都應該使用這個 skill。就算使用者沒有明確說要繁體中文，只要他們想要為一個存在的 project 產生使用文件，就觸發這個 skill。
---

# Project Documentation Writer

這個 skill 引導 Claude 徹底閱讀一個專案，並產生一份完整、實用的使用手冊 `how-to-use-{name}.md`，以正體中文台灣用語撰寫，技術詞彙保持英文。

---

## 目標

產出一份 `how-to-use-{name}.md`，讓任何讀者都能從中找到兩個核心問題的答案:
1. **如何使用 (How?)** — 完整的安裝、設定、操作步驟
2. **最佳範例 (Examples)** — 真實可執行的範例，涵蓋主要使用情境

---

## 第一階段: 徹底探索專案

在寫任何一個字之前，先完整了解這個專案。探索目標:

### 1. 閱讀專案結構並確定輸出檔名

先確定 `{name}` 的值, 再繼續閱讀目錄配置 (`src/`, `lib/`, `cmd/`, `scripts/`, `examples/`, `docs/` 等):

**`{name}` 取得優先順序:**

1. **使用者明確指定**: 若使用者在指令中提供了名稱或路徑 (e.g., "幫 stripe-sdk 寫文件", "針對 /path/to/my-tool 產生文件"), 直接以此為準
2. **讀取 package manifest**:
   - `package.json` → `name` 欄位
   - `go.mod` → module 路徑最後一段 (e.g., `github.com/foo/bar-cli` → `bar-cli`)
   - `pyproject.toml` 或 `setup.py` → `name`
   - `Cargo.toml` → `[package] name`
3. **使用當前目錄名稱**: 以上均無法取得時, 使用工作目錄的資料夾名稱作為 fallback

確定 `{name}` 後, 後續所有步驟的輸出檔名一律使用 `how-to-use-{name}.md`.

> 範例: 目錄為 `stripe-node/`, package.json 中 `"name": "stripe"` → 輸出 `how-to-use-stripe.md`

### 2. 閱讀現有文件
- `README.md` — 最重要，幾乎所有關鍵資訊都在這裡
- `CHANGELOG.md` — 了解演進歷史，找出重要功能
- `docs/`, `wiki/` 目錄下的任何 `.md` 文件
- 根目錄的 `*.md` 文件

### 3. 閱讀核心原始碼
- Entry points: `main.go`, `index.ts`, `__main__.py`, `cli.js` 等
- 主要 export 的 API、struct、class、function
- CLI 的 command/flag 定義 (cobra, argparse, yargs 等)

### 4. 尋找現有範例
- `examples/`, `demo/`, `sample/` 目錄
- 測試文件中的使用範例 (`*.test.*`, `*_test.go`, `spec/`)
- 原始碼中的 doc comment 範例

### 5. 確認依賴與設定
- `package.json`, `go.mod`, `pyproject.toml`, `Cargo.toml` 等
- `config/`, `.env.example`, 任何設定文件範本

探索完成後，問自己: **「一個從來沒用過這個工具的開發者，需要知道什麼才能在 5 分鐘內跑起一個範例?」**

---

## 第二階段: 規劃章節架構

根據探索結果，決定要寫哪些章節。以下是建議的章節清單，依實際情況取捨 — 沒有真實內容可填的章節直接省略:

| 章節 | 必要性 | 說明 |
|------|--------|------|
| 標題與簡介 | 必要 | 一段話說清楚這個工具是什麼、適合誰用 |
| 安裝方式 | 必要 | 具體的安裝指令 |
| 快速開始 | 必要 | 最短路徑到第一個可運行的範例 |
| 使用情境 | 必要 | 列出這個工具適合解決的典型問題 |
| 核心功能說明 | 必要 | 每個主要功能配說明和範例 |
| 最佳範例 | 必要 | 2-5 個真實的完整使用情境 |
| 設定說明 | 視情況 | config 選項、環境變數 |
| API 參考 | 視情況 | Library 類型的專案才需要 |
| 常見問題 | 建議 | 預期使用者會踩到的坑 |
| 進階用法 | 視情況 | power user 的使用技巧 |

---

## 第三階段: 撰寫規範

### 語言規則 (最重要)

**全篇使用正體中文台灣用語**，技術詞彙保持英文。

**禁止使用中國用語** (以下是常見對照):

| 錯誤 (中國用語) | 正確 (台灣用語) |
|-----------------|-----------------|
| 软件 | 軟體 |
| 程序 | 程式 |
| 函数 | 函式 |
| 文件 (指 file) | 檔案 |
| 接口 | 介面 |
| 组件 | 元件 |
| 实现 | 實作 |
| 调试 | 除錯 |
| 链接 | 連結 |
| 点击 | 點選 / 按下 |
| 获取 | 取得 |
| 终端 | 終端機 |
| 运行 | 執行 |
| 应用 (app) | 應用程式 |
| 配置 (名詞) | 設定 / 組態 |
| 版本号 | 版本號碼 / 版本 |

### 格式規則

**不使用 icon 或 emoji** — 文件中禁止使用任何 icon、emoji 或裝飾性符號 (如 📦 ✅ ⚡ 🚀 等)，除非使用者明確要求。

**程式碼區塊一律標明語言**:

```bash
npm install my-tool --save-dev
```

```typescript
import { createClient } from 'my-tool';
const client = createClient({ apiKey: 'sk-...' });
```

用 blockquote 標記重要提示 (文字形式，不用 icon):

> **注意**: 此功能需要 Node.js 18 以上版本.

> **提示**: 可以用 `--dry-run` 旗標先預覽結果再實際執行.

### 內容品質規則

**程式碼範例必須真實且可執行** — 對照原始碼確認方法名稱、參數、回傳值都正確。不要發明不存在的 API。

**具體勝於模糊** — 用真實的值、真實的檔名、真實的輸出，而不是 `your-file.json` 或 `<your-value>`。

**遞進式複雜度** — 從簡單的開始，逐步帶到進階用法。

---

## 第四階段: 撰寫 how-to-use-{name}.md

將文件寫到專案根目錄的 `how-to-use-{name}.md` (依第一階段判斷的專案類型填入 `{type}`)，除非使用者指定其他路徑。

### 文件開頭範例

```markdown
# [專案名稱]

[一段話: 這個工具是什麼、適合誰用]

## 安裝方式

[安裝指令]

## 使用情境

- 情境 1: [描述典型的使用場景]
- 情境 2: [另一種使用場景]

## 快速開始

[最短路徑到第一個可運行的範例]
```

### 最佳範例章節的寫法

這是整份文件最重要的部分之一。每個範例應該:
- 有一個清楚的標題 (這個範例在做什麼)
- 完整的程式碼 (可以直接複製貼上執行)
- 說明預期的輸出結果
- 解釋關鍵選項的意義

範例格式:

```markdown
### 範例 1: 解析 CSV 並輸出 JSON

這個範例示範如何將一個 CSV 檔案轉換為 JSON 格式，並過濾掉空值欄位.

```typescript
import { parse } from 'my-csv-tool';

const result = await parse('data.csv', {
  skipEmpty: true,    // 跳過空值欄位
  headers: true,      // 第一列作為欄位名稱
  encoding: 'utf-8'
});

console.log(result.rows);
// 輸出:
// [{ name: 'Alice', age: '30' }, { name: 'Bob', age: '25' }]
```

---

## 完成前的品質檢查

寫完後逐一確認:

- [ ] **全文掃描半形符號**: 搜尋 `，。：（）！？` — 任何一個出現都必須改成半形再繼續
- [ ] 全篇沒有中國用語
- [ ] 文件中沒有 icon 或 emoji (除非使用者要求)
- [ ] 沒有「為何使用」或「系統需求」章節
- [ ] **使用情境** 章節有列出 2 個以上的典型場景
- [ ] **最佳範例** 章節有至少 2 個完整、可執行的範例
- [ ] **快速開始** 章節能讓讀者在 5 分鐘內跑出第一個結果
- [ ] 每個程式碼範例都對照原始碼確認過正確性
- [ ] 文件可以獨立閱讀 — 讀者不需要看原始碼就能上手

完成後告知使用者文件的路徑，並簡短說明文件的章節結構。
