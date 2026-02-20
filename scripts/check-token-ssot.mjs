#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TOKENS_FILE = path.join(ROOT, 'src', 'styles', 'system', 'tokens.css')
const POSEIDON_LAYER_FILE = path.join(ROOT, 'src', 'styles', 'layers', 'poseidon.css')

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function collectCssVariables(source) {
  const map = new Map()
  const pattern = /--([a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g
  let match
  while ((match = pattern.exec(source)) !== null) {
    const name = match[1]
    const value = match[2].trim()
    map.set(name, value)
  }
  return map
}

const failures = []

if (!fs.existsSync(TOKENS_FILE)) {
  failures.push('src/styles/system/tokens.css is missing.')
}
if (!fs.existsSync(POSEIDON_LAYER_FILE)) {
  failures.push('src/styles/layers/poseidon.css is missing.')
}

if (failures.length > 0) {
  console.error('Token SSoT checks failed:')
  failures.forEach((entry) => console.error(`- ${entry}`))
  process.exit(1)
}

const tokenVars = collectCssVariables(read(TOKENS_FILE))
const poseidonVars = collectCssVariables(read(POSEIDON_LAYER_FILE))

const duplicateNames = [...poseidonVars.keys()].filter((name) => tokenVars.has(name))

if (duplicateNames.length > 0) {
  console.error('Token SSoT checks failed:')
  console.error('- src/styles/layers/poseidon.css must not redefine variables from src/styles/system/tokens.css.')
  for (const name of duplicateNames) {
    console.error(`  - --${name}`)
  }
  process.exit(1)
}

console.log(
  `Token SSoT checks passed. (tokens=${tokenVars.size}, poseidonLayer=${poseidonVars.size}, duplicates=0)`,
)
