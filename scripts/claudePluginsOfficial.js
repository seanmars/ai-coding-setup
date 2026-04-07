#!/usr/bin/env zx

import { $ } from 'zx';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const DEFAULT_REPO_URL =
  'https://github.com/anthropics/claude-plugins-official';
const DEFAULT_MARKETPLACE = 'claude-plugins-official';
const WANTED_PLUGINS = [
  'skill-creator',
  'frontend-design',
  'code-simplifier',
  'csharp-lsp',
  'typescript-lsp',
  'gopls-lsp',
];

const defaultMarketplaceDir = path.join(
  os.homedir(),
  '.claude',
  'plugins',
  'marketplaces',
  DEFAULT_MARKETPLACE,
);

export async function ensureClaudePluginsOfficial({
  marketplaceDir = defaultMarketplaceDir,
  marketplaceName = DEFAULT_MARKETPLACE,
  repoUrl = DEFAULT_REPO_URL,
} = {}) {
  console.log('Setup Claude Official Plugins...');

  await assertClaudeCliAvailable();

  const exists = await fs
    .access(marketplaceDir)
    .then(() => true)
    .catch(() => false);

  if (exists) {
    await $`claude plugin marketplace update ${marketplaceName}`;
    console.log(`Updated marketplace ${marketplaceName}.`);
  } else {
    await $`claude plugin marketplace add ${repoUrl}`;
    console.log(`Added marketplace ${marketplaceName} from ${repoUrl}.`);
  }

  for (const plugin of WANTED_PLUGINS) {
    await installPlugins(plugin);
    console.log(`Installed plugin ${plugin}.`);
  }
}

async function installPlugins(pluginName) {
  const command = $`claude plugin install ${pluginName}`;
  const result = await command.nothrow();
  if (result.exitCode !== 0) {
    throw new Error(
      `Failed to install plugin ${pluginName}: ${result.stderr.trim()}`,
    );
  }
}

async function assertClaudeCliAvailable() {
  const probeCommand =
    process.platform === 'win32'
      ? $`where claude`
      : $`command -v claude`;

  const probe = await probeCommand.nothrow();
  if (probe.exitCode !== 0) {
    throw new Error(
      'Claude CLI not found in PATH. Install it and ensure the `claude` command is available before running this script.',
    );
  }
}
