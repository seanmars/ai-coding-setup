import { useBash, usePwsh } from 'zx';
import { ensureClaudePluginsOfficial } from './claudePluginsOfficial.js';
import { ensureClaudePluginsCode } from './claudePlugin.js';
import { ensureSuperpowersMarketplace } from './superpowers.js';
import { install3rdPartyCommandTools } from './install3rd.js';

(async () => {
  console.log('Starting setup...');
  if (process.platform === 'win32') {
    usePwsh();
  } else {
    useBash();
  }

  try {
    await install3rdPartyCommandTools();
    await ensureClaudePluginsOfficial();
    await ensureClaudePluginsCode();
    await ensureSuperpowersMarketplace();

    console.log('Setup completed successfully.');
  } catch (error) {
    console.error('Error executing command:', error);
  } finally {
    // Cleanup or final steps can be added here if necessary
  }
})();
