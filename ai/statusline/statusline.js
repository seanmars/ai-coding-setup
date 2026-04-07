#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const RESET = '\x1b[0m';
const PINK = '\x1b[38;5;218m';
const LIGHT_BLUE = '\x1b[38;5;153m';
const MODEL_COLOR = '\x1b[38;5;222m';
const YELLOW = '\x1b[38;5;226m';

function getColor(pct, mid, high) {
  if (pct <= mid) return '\x1b[32m';
  if (pct <= high) return '\x1b[33m';
  return '\x1b[31m';
}

function getModelDisplay(input) {
  const model = input.model?.display_name ?? 'Unknown Model';
  return `${MODEL_COLOR}\uee0d${RESET} \x1b[38;5;207m ${model}${RESET}`;
}

function currentFolderName(cwd) {
  const dirName = path.basename(cwd);
  return dirName ? `${YELLOW}\udb80\ude4b${RESET} \x1b[36m${dirName}${RESET}` : '';
}

function getGitBranch(cwd) {
  try {
    const branch = execSync('git --no-optional-locks rev-parse --abbrev-ref HEAD', {
      cwd,
      stdio: 'pipe',
      encoding: 'utf8'
    }).trim();
    return `\x1b[32m\ue725${RESET} \x1b[34m${branch}${RESET}`;
  } catch (e) {
    return '';
  }
}

function contextUsed(input) {
  const pct = Math.floor(input.context_window?.used_percentage ?? 0);
  const color = getColor(pct, 50, 75);
  return `${PINK}\udb80\ude38${RESET} ${color}${pct}%${RESET}`;
}

function getRateLimitDisplay(input) {
  if (!input.rate_limits) return '';

  const windows = [
    { key: 'five_hour', label: "\udb84\udfab" },
    { key: 'seven_day', label: '\uf073' }
  ];

  const parts = [];

  for (const { key, label } of windows) {
    const data = input.rate_limits[key];
    if (!data) continue;

    const filled = Math.floor(data.used_percentage || 0);

    let resetsStr = '';
    if (data.resets_at) {
      const diffMs = data.resets_at * 1000 - Date.now();
      if (diffMs > 0) {
        const totalMinutes = Math.ceil(diffMs / (1000 * 60));
        const days = Math.floor(totalMinutes / (24 * 60));
        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
        const mins = totalMinutes % 60;
        if (days > 0) {
          resetsStr = `${days}d${hours}h${mins}m`;
        } else {
          resetsStr = `${hours}h${mins}m`;
        }
      } else {
        resetsStr = '0h0m';
      }
    }

    const color = getColor(filled, 33, 66);
    parts.push(`${LIGHT_BLUE}${label}${RESET} ${color}${filled}%${RESET} ${resetsStr}`);
  }

  return parts.join(' ');
}

function getTotalCostDisplay(input) {
  const moneySymbol = '\ued0b';
  if (!input.cost) {
    return `${YELLOW}${moneySymbol}${RESET} $0.00!`;
  }

  const totalCost = input.cost.total_cost_usd || 0;
  return `${YELLOW}${moneySymbol}${RESET} $${totalCost.toFixed(2)}`;
}

function getCacheHitRateDisplay(input) {
  if (
    !input.context_window ||
    !input.context_window.current_usage) {
    return '';
  }


  const {
    cache_read_input_tokens,
    input_tokens,
    cache_creation_input_tokens
  } = input.context_window.current_usage;
  const hitRate = (
    cache_read_input_tokens /
    (input_tokens + cache_creation_input_tokens + cache_read_input_tokens)
  ) * 100;

  return `${PINK}\uf49b${RESET} ${hitRate.toFixed(2)}%`;
}

// Read JSON input from stdin
let inputData = '';
process.stdin.on('data', chunk => inputData += chunk);
process.stdin.on('end', () => {
  // write inputData to a file for debugging
  // require('fs').writeFileSync('./statusline_input.json', inputData);

  try {
    const input = JSON.parse(inputData);
    const cwd = input.workspace.current_dir;

    const sessionId = input.session_id;

    const folder = currentFolderName(cwd);
    const gitInfo = getGitBranch(cwd);
    const statusContextUsed = contextUsed(input);
    const statusRateLimit = getRateLimitDisplay(input);
    const statusTotalCost = getTotalCostDisplay(input);
    const statusCacheHitRate = getCacheHitRateDisplay(input);

    let firstLine = `${getModelDisplay(input)} | ${folder}`;
    if (gitInfo) {
      firstLine += ` | ${gitInfo}`;
    }
    firstLine += ` | ${statusTotalCost}`;
    firstLine += ` | ${statusCacheHitRate}`;


    let output = firstLine;
    const secondLineParts = [statusContextUsed, statusRateLimit].filter(Boolean);
    if (secondLineParts.length) {
      output += '\n' + secondLineParts.join(' ');
    }

    output += '\n' + `${sessionId}`;

    console.log(output);

  } catch (error) {
    console.error('Error:', error.message);
  }
});
