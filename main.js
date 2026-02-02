import { useBash, usePwsh } from 'zx';
import { ensureClaudePluginsOfficial } from './scripts/claudePluginsOfficial.js';
import { ensureClaudePluginsCode } from './scripts/claudePlugin.js';
import { ensureOpenSpec } from './scripts/openSpec.js';
import { ensureSuperpowersMarketplace } from './scripts/superpowers.js';
import { install3rdPartyCommandTools } from './scripts/install3rd.js';

(async () => {
  console.log('Starting setup...');
  if (process.platform === 'win32') {
    usePwsh();
  } else {
    useBash();
  }

  try {
    await ensureClaudePluginsOfficial();
    await ensureClaudePluginsCode();
    await ensureOpenSpec();
    await ensureSuperpowersMarketplace();
    await install3rdPartyCommandTools();

    console.log('Setup completed successfully.');
  } catch (error) {
    console.error('Error executing command:', error);
  } finally {
    // Cleanup or final steps can be added here if necessary
  }
})();
