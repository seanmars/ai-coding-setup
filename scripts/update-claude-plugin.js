import 'zx/globals';
import { useBash, usePwsh } from 'zx';
import { access } from 'node:fs/promises';
import { constants, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

function renderProgressBar(current, total, pluginName = '') {
  if (!process.stdout.isTTY) {
    console.log(`Updating plugins ${current}/${total}${pluginName ? ` - ${pluginName}` : ''}`);
    return;
  }

  const width = 30;
  const percent = total === 0 ? 100 : Math.floor((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const bar = `${'█'.repeat(filled)}${'░'.repeat(width - filled)}`;
  const message = `Updating plugins [${bar}] ${String(percent).padStart(3)}% (${current}/${total})${pluginName ? ` - ${pluginName}` : ''}`;
  process.stdout.write(`\r${message}`);

  if (current === total) {
    process.stdout.write('\n');
  }
}

(async () => {
  console.log('Starting update...');
  if (process.platform === 'win32') {
    usePwsh();
  } else {
    useBash();
  }

  try {
    // check whether the Claude settings file exists
    const claudePluginPath = join(homedir(), '.claude', 'settings.json');

    let fileExists = true;
    try {
      await access(claudePluginPath, constants.F_OK);
    } catch {
      fileExists = false;
    }

    if (!fileExists) {
      console.error('Claude plugin settings file does not exist. Please run the setup script first.');
      return;
    }

    // load the settings file and check all plugins
    const settings = JSON.parse(readFileSync(claudePluginPath, 'utf-8'));
    const plugins = settings.enabledPlugins || {};
    let pluginNames = Object.keys(plugins);

    if (pluginNames.length === 0) {
      return;
    }

    renderProgressBar(0, pluginNames.length);

    for (let index = 0; index < pluginNames.length; index++) {
      const plugin = pluginNames[index];
      await $`claude plugin update ${plugin}`;
      renderProgressBar(index + 1, pluginNames.length, plugin);
    }
  } catch (error) {
    console.error('Error executing command:', error);
  } finally {
    console.log('Update completed.');
    // Cleanup or final steps can be added here if necessary
  }
})();