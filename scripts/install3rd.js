import { $ } from 'zx';

const isWindows = process.platform === 'win32';
const wingetPackages = [
  'Git.Git',
  // https://github.com/jqlang/jq
  'jqlang.jq',
  // https://github.com/BurntSushi/ripgrep
  'BurntSushi.ripgrep.MSVC',
  // https://github.com/sharkdp/fd
  'sharkdp.fd',
  // https://github.com/junegunn/fzf
  'junegunn.fzf',
];

const npmPackages = [
  //https://github.com/ast-grep/ast-grep
  '@ast-grep/cli',
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

  for (const pkg of npmPackages) {
    await installNpmPackage(pkg);
  }
}

async function installNpmPackage(name) {
  try {
    console.log(`Installing ${name} via npm...`);
    await $`npm install -g ${name}`;
    console.log(`${name} installed successfully.`);
  } catch (error) {
    console.error(`Failed to install ${name}:`, error);
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