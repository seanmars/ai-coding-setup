import { $ } from 'zx';

const isWindows = process.platform === 'win32';
const wingetPackages = [
  'Git.Git',
  'jqlang.jq',
  'BurntSushi.ripgrep.MSVC'
];

export async function install3rdPartyCommandTools() {
  console.log('Installing 3rd party command-line tools...');

  if (!isWindows) {
    console.log('Non-Windows OS detected. Skipping 3rd party tool installation.');
    return;
  }

  for (const pkg of wingetPackages) {
    await installWinGetPackage(pkg);
  }
}

async function installWinGetPackage(name) {
  try {
    console.log(`Installing ${name} via winget...`);
    await $`winget install --id=${name} -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity`;
    console.log(`${name} installed successfully.`);
  } catch (error) {
    const stdout = error?.stdout ?? '';
    const stderr = error?.stderr ?? '';
    const output = `${stdout}\n${stderr}`;

    const alreadyInstalledNoUpgrade =
      output.includes('Found an existing package already installed') &&
      output.includes('No available upgrade found');

    if (alreadyInstalledNoUpgrade) {
      console.log(`${name} is already installed and no upgrade is available.`);
      return;
    }

    console.error(`Failed to install ${name}:`, error);
  }
}