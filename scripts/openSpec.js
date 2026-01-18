import { $ } from 'zx';

export async function ensureOpenSpec() {
  console.log('Installing OpenSpec...');

  await $`npm install -g @fission-ai/openspec@latest`;

  console.log('Installed OpenSpec.');
}