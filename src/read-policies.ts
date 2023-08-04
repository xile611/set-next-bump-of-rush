import * as core from '@actions/core'
import {join} from 'path'
import {readFileSync, writeFileSync} from 'fs'
import {parse, SemVer} from 'semver'

// interface RushJson {
//   projects: {
//     packageName: string
//     tags?: string[]
//     projectFolder: string
//     shouldPublish?: boolean
//     versionPolicyName?: string
//   }[]
// }
interface VersionPolicyItem {
  definitionName?: 'lockStepVersion' | 'individualVersion'
  policyName: string
  version: string
  mainProject?: string
  nextBump?: 'patch' | 'minor' | 'major' | 'prerelease'
}

export const writeJsonFile = (
  path: string,
  filename: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): void => {
  const filePath = join(path, filename)
  writeFileSync(filePath, JSON.stringify(json))
}

export const findJsonFile = <T>(path: string, filename: string): T | null => {
  try {
    const filePath = join(path, filename)
    core.info(`[info] read json file: ${filePath}`)
    return JSON.parse(readFileSync(join(path, filename)).toString())
  } catch (e) {
    return null
  }
}

export const readBumpType = (
  rushPath = './',
  policyName?: string
): string | undefined => {
  const versionPoliciesJson = findJsonFile<VersionPolicyItem[]>(
    rushPath,
    'common/config/rush/version-policies.json'
  )

  if (!versionPoliciesJson) {
    core.warning(`[warn] can't read version policies file`)
    return
  }

  if (!versionPoliciesJson.length) {
    core.warning(`[warn] version-policies is empty`)
    return
  }

  if (policyName) {
    const item = versionPoliciesJson?.find(
      entry => entry.policyName === policyName
    )

    return item?.nextBump
  } else {
    return versionPoliciesJson?.[0]?.nextBump
  }
}

export const parseNextBumpFromVersion = (
  versionString: string
): VersionPolicyItem['nextBump'] | undefined => {
  const parsed: SemVer | null = parse(versionString)

  if (!parsed) {
    return
  }

  if (parsed.prerelease && parsed.prerelease.length) {
    return 'prerelease'
  } else if (parsed.patch === 0) {
    return parsed.minor === 0 ? 'major' : 'minor'
  }

  return 'patch'
}

export const writeNextBump = (
  nextBump: VersionPolicyItem['nextBump'],
  rushPath = './',
  policyName?: string
): void => {
  const versionPoliciesPath = 'common/config/rush/version-policies.json'
  const versionPoliciesJson = findJsonFile<VersionPolicyItem[]>(
    rushPath,
    versionPoliciesPath
  )

  if (policyName) {
    const item = versionPoliciesJson?.find(
      entry => entry.policyName === policyName
    )

    if (item) {
      item.nextBump = nextBump
      writeJsonFile(rushPath, versionPoliciesPath, versionPoliciesJson)
    } else if (versionPoliciesJson?.length) {
      core.warning(`[warn] can't find version policy: ${policyName}`)
    }
  } else if (versionPoliciesJson?.length) {
    versionPoliciesJson[0].nextBump = nextBump
    writeJsonFile(rushPath, versionPoliciesPath, versionPoliciesJson)
  } else {
    core.warning(`[warn] can't read version policies file`)
  }
}
