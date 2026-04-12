# TODOs

將以下三個 tips 製作成 command/skill pattern，讓使用者可以輸入相關的 context 來使用以下三個 command/skill 來增加使用效率。

## 自主的 Propose-Implement-Test-Archive Pipeline

你的 OpenSpec 工作流程 (提案 → 套用 → 歸檔) 已經高度結構化——Claude 可以自主執行整個週期，為每個任務群組生成 sub-agents，在每次變更後執行測試，只在最終提交時暫停等待你的核准。這消除了你為了單一功能而跨 3-4 個 session 來回的模式，可以將你的 27 任務權限逾時功能壓縮為單一無人值守的執行。

**開始嘗試:** 使用 Claude Code 的 headless 模式搭配 TaskCreate/TaskUpdate 進行並行 sub-agents，並將現有的測試套件作為各階段間的關卡。

貼入 Claude Code:
`Run the full OpenSpec lifecycle for this change autonomously: 1) Generate proposal, design, delta-spec, and task-plan artifacts. 2) Spawn a sub-agent per task group to implement changes in parallel where dependencies allow. 3) After each task group, run`go test ./...` and `npm run test`— if tests fail, debug and fix before proceeding. 4) When all tasks pass, run opsx:archive, then present me a summary diff and ask for final commit approval. Change description: [YOUR FEATURE DESCRIPTION]. Do not stop to ask me questions unless tests fail more than 3 times on the same issue.`

## 具有回歸防護的自我修復 Bug 修復

Bug 修復是你的第一目標 (18 個 session)，而「有問題的程式碼」是你最主要的摩擦來源——表示修復有時會引入新問題。Claude 可以採用一套工作流程，每次 bug 修復都從撰寫會失敗的回歸測試開始，然後實作修復、執行完整測試套件，最後掃描整個程式碼庫中相同的反模式。你的 null safety crash 和 concurrent map bug 是完美的例子，全程式碼庫掃描可以找到兄弟問題。

**開始嘗試:** 使用 Claude Code 搭配 Go 和 Vue 測試執行器作為迭代檢查點，並使用 Grep/Glob 跨程式碼庫掃描模式兄弟問題。

貼入 Claude Code:
`Fix this bug using a regression-proof workflow: 1) Reproduce the issue by reading the relevant code and identifying the root cause. 2) Write a failing test that captures this exact bug. 3) Implement the minimal fix and verify the new test passes. 4) Run the full test suite (`go test ./...` and `npm run test`) and fix any regressions. 5) Use Grep to search the entire codebase for the same anti-pattern (e.g., missing nil checks, unsynchronized map access, missing DeepCopy) and fix all siblings. 6) Commit with a message explaining the root cause and scope of the fix. Bug: [DESCRIBE THE BUG]`

## 前後端並行多 Agent 功能建置

你的功能一貫橫跨 Go 後端和 Vue 前端 (25 個 session 涉及兩者的多檔案變更)。Claude 可以不再循序實作，而是生成兩個並行的 sub-agents——一個負責後端 API/邏輯，一個負責前端元件/store——基於共用的介面合約運作，然後由第三個 agent 整合並執行端對端測試。這模擬了兩人團隊的工作方式，可以將你的功能實作時間縮短大約一半。

**開始嘗試:** 使用 TaskCreate 以共用介面規格生成後端和前端 sub-agents，然後由最終整合 agent 將它們串接並執行測試。

貼入 Claude Code:
`Implement this feature using parallel backend/frontend agents: 1) First, define the interface contract — Go struct types, API method signatures, and TypeScript types that both sides will use. Write these to a shared spec file. 2) Spawn a backend sub-agent: implement the Go-side logic, bindings, and unit tests based on the contract. 3) Simultaneously spawn a frontend sub-agent: implement the Vue components, Pinia store updates, and component tests based on the contract. 4) Once both agents complete, integrate by verifying the Wails bindings generate correctly, run`go test ./...` and `npm run test`, and fix any integration mismatches. 5) Present a summary of all changes. Feature: [YOUR FEATURE DESCRIPTION]`
