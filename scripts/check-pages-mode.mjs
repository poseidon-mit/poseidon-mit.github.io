#!/usr/bin/env node

import process from 'node:process';

function parseArg(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

async function main() {
  const repository = parseArg('repo') ?? process.env.GITHUB_REPOSITORY;
  const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;

  if (!repository) {
    console.error('check-pages-mode: missing repository. Pass --repo=owner/name or set GITHUB_REPOSITORY.');
    process.exit(1);
  }

  if (!token) {
    console.error('check-pages-mode: missing GH_TOKEN/GITHUB_TOKEN.');
    process.exit(1);
  }

  const response = await fetch(`https://api.github.com/repos/${repository}/pages`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`check-pages-mode: API request failed (${response.status})`);
    console.error(body);
    process.exit(1);
  }

  const payload = await response.json();
  const buildType = payload?.build_type;

  console.log(`check-pages-mode: repo=${repository} build_type=${buildType}`);

  if (buildType !== 'workflow') {
    console.error(
      `check-pages-mode: expected build_type "workflow" but got "${buildType}". ` +
      'Switch Pages source to GitHub Actions before deploy.',
    );
    process.exit(1);
  }

  console.log('check-pages-mode: ok');
}

main().catch((error) => {
  console.error('check-pages-mode: unexpected failure');
  console.error(error);
  process.exit(1);
});

