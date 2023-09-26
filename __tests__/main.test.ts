import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import {readBumpType, parseNextBumpFromVersion} from '../src/read-policies'

test('readBumpType', () => {
  expect(readBumpType('./__tests__/test-rush')).toBe('patch')
  expect(readBumpType('./__tests__/test-rush-2', 'test')).toBe('prerelease')
})

test('parseNextBumpFromVersion', () => {
  expect(parseNextBumpFromVersion('1.0.0-alpha.0')).toBe('prerelease')
  expect(parseNextBumpFromVersion('1.0.0')).toBe('major')
  expect(parseNextBumpFromVersion('0.0.0')).toBe('major')
  expect(parseNextBumpFromVersion('2.0.0')).toBe('major')
  expect(parseNextBumpFromVersion('3.0.0')).toBe('major')

  expect(parseNextBumpFromVersion('0.1.0')).toBe('minor')
  expect(parseNextBumpFromVersion('1.1.0')).toBe('minor')
  expect(parseNextBumpFromVersion('2.1.0')).toBe('minor')
  expect(parseNextBumpFromVersion('3.1.0')).toBe('minor')

  expect(parseNextBumpFromVersion('0.1.1')).toBe('patch')
  expect(parseNextBumpFromVersion('1.1.2')).toBe('patch')
  expect(parseNextBumpFromVersion('2.1.3')).toBe('patch')
  expect(parseNextBumpFromVersion('3.1.4')).toBe('patch')
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test run when only set rush path', () => {
  process.env['INPUT_RUSH_PATH'] = './__tests__/test-rush'
  process.env['INPUT_IS_PRERELEASE'] = 'true'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

test('test run when set is_prerelease', () => {
  process.env['INPUT_RUSH_PATH'] = './__tests__/test-rush-2'
  process.env['INPUT_IS_PRERELEASE'] = 'false'
  process.env['INPUT_RELEASE_VERSION'] = '1.1.0'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

test('test when the release version is equal to the version of version-policy', () => {
  process.env['INPUT_RUSH_PATH'] = './__tests__/test-rush'
  process.env['INPUT_IS_PRERELEASE'] = 'false'
  process.env['INPUT_RELEASE_VERSION'] = '0.5.2'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  try {
    cp.execFileSync(np, [ip], options)
  } catch (e) {
    expect(e).not.toBeUndefined()
    expect((e as any).toString().includes('Error')).toBeTruthy()
  }
})

test('test when the release version is smaller than the version of version-policy', () => {
  process.env['INPUT_RUSH_PATH'] = './__tests__/test-rush'
  process.env['INPUT_IS_PRERELEASE'] = 'false'
  process.env['INPUT_RELEASE_VERSION'] = '0.5.1'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  try {
    cp.execFileSync(np, [ip], options)
  } catch (e) {
    expect(e).not.toBeUndefined()
    expect((e as any).toString().includes('Error')).toBeTruthy()
  }
})

test('test when the release version is greater than the version of version-policy', () => {
  process.env['INPUT_RUSH_PATH'] = './__tests__/test-rush'
  process.env['INPUT_IS_PRERELEASE'] = 'false'
  process.env['INPUT_RELEASE_VERSION'] = '0.5.7'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  try {
    cp.execFileSync(np, [ip], options)
  } catch (e) {
    expect(e).not.toBeUndefined()
    expect((e as any).toString()).toBe('')
  }
})
