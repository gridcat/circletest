#!/usr/bin/env node
const { spawn } = require('child_process');

const requireEnv = (varName) => {
  const value = process.env[varName]
  if (!value) {
    throw new Error(`Environment variable ${varName} must be set`)
  }
  return value
}

const spawnGetStdout = (cmd, args) => {
  return new Promise((resolve, reject) => {
    let stdoutString = ''
    let stderrString = ''

    const proc = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    proc.stdout.on('data', (line) => {
      if (stdoutString === '') {
        stdoutString = line.toString()
      } else {
        stdoutString += line.toString()
      }
    })
    proc.stderr.on('data', (line) => {
      if (stderrString === '') {
        stderrString = line.toString()
      } else {
        stderrString += line.toString()
      }
    })

    proc.on('close', (code) => {
      if (!code) {
        resolve(stdoutString)
      } else {
        reject(stderrString)
      }
    })
  })
}



async function main() {
  const changeOutput = (
    await spawnGetStdout('lerna', [
      'list',
      '--parseable',
      '--all',
      // '--long',
      // '--since',
      // changesSinceCommit,
    ])
  ).trim();

  const buildUrl = requireEnv('CIRCLE_BUILD_URL')
    const slugAndBuildNumber = /circleci\.com\/(.*\/.*\/.*)\//.exec(
      buildUrl,
    )[1];

  if (slugAndBuildNumber) {
    
  }

  console.log(changeOutput)
}

main();