"""將 AGENTS.md 同步到 ~/.claude/CLAUDE.md.

用法: uv run sync.py
"""

import shutil
from datetime import datetime
from pathlib import Path

SOURCE = Path(__file__).resolve().parent / "AGENTS.md"
TARGET = Path.home() / ".claude" / "CLAUDE.md"


def main() -> None:
    if not SOURCE.is_file():
        raise SystemExit(f"找不到來源檔案: {SOURCE}")

    if TARGET.is_file() and TARGET.read_bytes() == SOURCE.read_bytes():
        print(f"已是最新, 無需同步: {TARGET}")
        return

    TARGET.parent.mkdir(parents=True, exist_ok=True)

    if TARGET.is_file():
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        backup = TARGET.with_name(f"{TARGET.stem}_{timestamp}{TARGET.suffix}")
        shutil.copy2(TARGET, backup)
        print(f"已備份: {backup}")

    shutil.copyfile(SOURCE, TARGET)
    print(f"已同步: {SOURCE} -> {TARGET}")


if __name__ == "__main__":
    main()
