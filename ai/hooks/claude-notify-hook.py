#!/usr/bin/env python3
"""
Claude Code Windows 通知 Hook
此 hook 會在特定事件發生時發送 Windows 通知
"""

import sys
import os
import subprocess
from pathlib import Path


def send_notification(event_type, tool_name=None):
    """
    根據事件類型發送對應的通知

    Args:
        event_type: 事件類型
        tool_name: 工具名稱（可選）
    """
    # 取得通知腳本路徑
    script_dir = Path(__file__).parent
    notify_script = script_dir / "notify.py"

    if not notify_script.exists():
        print(f"錯誤: 找不到通知腳本 {notify_script}", file=sys.stderr)
        return 1

    # 根據不同的事件類型設定通知內容
    notifications = {
        "user-input-required": {
            "title": "Claude Code - 需要回應",
            "message": "Claude Code 需要您的輸入",
            "timeout": "15"
        },
        "task-completed": {
            "title": "Claude Code - 任務完成",
            "message": "Claude Code 已完成任務",
            "timeout": "10"
        },
        "tool-call": {
            "title": "Claude Code - 工具執行",
            "message": f"正在執行: {tool_name or 'unknown'}",
            "timeout": "5"
        },
        "error": {
            "title": "Claude Code - 錯誤",
            "message": "執行時發生錯誤，請檢查",
            "timeout": "15"
        }
    }

    # 取得對應的通知設定，如果找不到則使用預設值
    notify_config = notifications.get(event_type, {
        "title": "Claude Code",
        "message": f"事件: {event_type}",
        "timeout": "10"
    })

    # 執行通知腳本
    try:
        result = subprocess.run(
            [
                sys.executable,
                str(notify_script),
                "--title", notify_config["title"],
                "--message", notify_config["message"],
                "--timeout", notify_config["timeout"]
            ],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print(result.stdout)
        else:
            print(result.stderr, file=sys.stderr)

        return result.returncode
    except Exception as e:
        print(f"執行通知腳本時發生錯誤: {e}", file=sys.stderr)
        return 1


def main():
    # 從命令列參數或環境變數獲取事件類型
    event_type = None
    tool_name = None

    if len(sys.argv) > 1:
        event_type = sys.argv[1]
        if len(sys.argv) > 2:
            tool_name = sys.argv[2]

    if not event_type:
        event_type = os.environ.get("CLAUDE_HOOK_EVENT", "unknown")

    return send_notification(event_type, tool_name)


if __name__ == "__main__":
    sys.exit(main())
