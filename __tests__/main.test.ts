import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

// shows how the runner will run a javascript action with env / stdout protocol
test('test run when only set rush path', () => {
  process.env['INPUT_RUSH_PATH'] = './__tests__/test-rush'
  process.env['RELEASE_VERSION'] = '1.1.0'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

// test('test run when set is_prerelease', () => {
//   process.env['INPUT_RUSH_PATH'] = './__tests__/test-rush'
//   process.env['RELEASE_VERSION'] = '1.1.0'
//   const np = process.execPath
//   const ip = path.join(__dirname, '..', 'lib', 'main.js')
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   }
//   console.log(cp.execFileSync(np, [ip], options).toString())
// })
