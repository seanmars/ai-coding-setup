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
      const resetDate = new Date(data.resets_at * 1000);
      if (key === 'seven_day') {
        const mm = String(resetDate.getMonth() + 1).padStart(2, '0');
        const dd = String(resetDate.getDate()).padStart(2, '0');
        const day = resetDate.toLocaleDateString([], { weekday: 'short' });
        const hh = String(resetDate.getHours()).padStart(2, '0');
        const min = String(resetDate.getMinutes()).padStart(2, '0');
        resetsStr = `${mm}-${dd}(${day}) ${hh}:${min}`;
      } else {
        resetsStr = resetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      }
    }

    const color = getColor(filled, 33, 66);
    parts.push(`${LIGHT_BLUE}${label}${RESET} ${color}${filled}%${RESET} at ${resetsStr}`);
  }

  return parts.join(' ');
}

function getTotalCostDisplay(input) {
  if (!input.costs) return '';

  const totalCost = input.costs.total_cost_usd || 0;
  return `${YELLOW}\uf0d6${RESET} ${totalCost.toFixed(2)}`;
}

// Read JSON input from stdin
let inputData = '';
process.stdin.on('data', chunk => inputData += chunk);
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(inputData);
    const cwd = input.workspace.current_dir;

    const folder = currentFolderName(cwd);
    const gitInfo = getGitBranch(cwd);

    let firstLine = `${getModelDisplay(input)} | ${folder}`;
    if (gitInfo) firstLine += ` | ${gitInfo}`;

    const statusContextUsed = contextUsed(input);
    const statusRateLimit = getRateLimitDisplay(input);
    const statusTotalCost = getTotalCostDisplay(input);

    let output = firstLine;
    const secondLineParts = [statusContextUsed, statusRateLimit, statusTotalCost].filter(Boolean);
    if (secondLineParts.length) {
      output += '\n' + secondLineParts.join(' ');
    }

    console.log(output);

  } catch (error) {
    console.error('Error:', error.message);
  }
});
