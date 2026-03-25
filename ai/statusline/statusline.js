#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

function getModelDisplay(input) {
  let model = 'Unknown Model';
  if (input.model && input.model.display_name) {
    model = input.model.display_name;
  }

  // Green color
  return `\uee0d \x1b[38;5;207m${model}\x1b[0m`;
}

function currentFolderName(cwd) {
  const dirName = path.basename(cwd);

  if (dirName) {
    return `\udb80\ude4b \x1b[36m${dirName}\x1b[0m`;
  }

  return '';
}

function getGitBranch(cwd) {
  try {
    // Check if directory is a git repository
    execSync('git rev-parse --git-dir', {
      cwd,
      stdio: 'pipe',
      encoding: 'utf8'
    });

    // Get current branch
    const branch = execSync('git --no-optional-locks rev-parse --abbrev-ref HEAD', {
      cwd,
      stdio: 'pipe',
      encoding: 'utf8'
    }).trim();

    return `\ue725 \x1b[34m${branch}\x1b[0m`;
  } catch (e) {
    // Not a git repository or git command failed
    return '';
  }
}

function contextUsed(input) {
  let usedPct = input.context_window?.used_percentage;
  if (usedPct === null || usedPct === undefined) {
    usedPct = 0;
  }

  const pct = Math.floor(usedPct);
  const barLength = 20;
  const filled = Math.floor(pct * barLength / 100);
  const empty = barLength - filled;

  // Choose color based on percentage
  let color;
  if (pct <= 50) {
    // Green
    color = '\x1b[32m';
  } else if (pct <= 75) {
    // Yellow
    color = '\x1b[33m';
  } else {
    // Red
    color = '\x1b[31m';
  }
  const reset = '\x1b[0m';

  // Create percentage text
  const pctText = `${pct}%`;
  const textLength = pctText.length;

  // Calculate how many chars on each side of the text
  const totalChars = barLength - textLength;
  const leftChars = Math.floor(totalChars / 2);
  const rightChars = totalChars - leftChars;

  // Build the bar with text in the middle
  let leftFilled = Math.min(filled, leftChars);
  let leftEmpty = leftChars - leftFilled;

  let rightFilled = Math.max(0, filled - leftChars - textLength);
  let rightEmpty = rightChars - rightFilled;

  const leftBar = `${color}${'▓'.repeat(leftFilled)}${reset}${'░'.repeat(leftEmpty)}`;
  const rightBar = `${color}${'▓'.repeat(rightFilled)}${reset}${'░'.repeat(rightEmpty)}`;

  const bar = `\udb80\ude38 ${color}${pctText}${reset}`;

  return bar;
}

function getRateLimitDisplay(input) {
  if (!input.rate_limits) {
    return '';
  }

  const windows = [
    { key: 'five_hour', label: "\udb84\udfab" },
    { key: 'seven_day', label: '\uf073' }
  ];

  const parts = [];

  for (const { key, label } of windows) {
    const data = input.rate_limits[key];
    if (!data) {
      continue;
    }

    const filled = data.used_percentage || 0;

    let resetsStr = '';
    if (data.resets_at) {
      const resetDate = new Date(data.resets_at * 1000);
      let opt = { hour: '2-digit', minute: '2-digit', hour12: false };
      if (key === 'seven_day') {
        opt = { month: '2-digit', day: '2-digit', weekday: 'short', ...opt };
      }
      resetsStr = `${resetDate.toLocaleTimeString([], opt)}`;
    }

    let color;
    if (filled <= 33) {
      color = '\x1b[32m'; // green
    } else if (filled <= 66) {
      color = '\x1b[33m'; // yellow
    } else {
      color = '\x1b[31m'; // red
    }
    const reset = '\x1b[0m';

    parts.push(`${label}:${color}${filled}%${reset}[${resetsStr}]`);
  }

  return parts.join(' ');
}

// Read JSON input from stdin
let inputData = '';
process.stdin.on('data', chunk => inputData += chunk);
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(inputData);

    // Extract values
    const model = getModelDisplay(input);
    const usedPct = input.context_window?.used_percentage;
    const cwd = input.workspace.current_dir;

    // Get folder name
    const folder = currentFolderName(cwd);

    // Get git branch
    let gitInfo = getGitBranch(cwd);

    // Build first line
    let firstLine = `${model} | ${folder}`;
    if (gitInfo) {
      firstLine += ` | ${gitInfo}`;
    }

    // Create progress bar with color on second line
    let secondLine = contextUsed(input);

    // Create rate limit display on third line
    let thirdLine = getRateLimitDisplay(input);

    // Output status line
    let output = firstLine;
    if (secondLine) output += `\n${secondLine}`;
    if (thirdLine) output += `\n${thirdLine}`;
    console.log(output);

  } catch (error) {
    console.error('Error:', error.message);
  }
});
