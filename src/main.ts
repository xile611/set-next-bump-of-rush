import * as core from '@actions/core'
import {
  parseNextBumpFromVersion,
  readBumpType,
  writeNextBump
} from './read-policies'

async function run(): Promise<void> {
  try {
    const rushPath = core.getInput('rush_path')
    const policyName = core.getInput('policy_name')
    const releaseVersion = core.getInput('release_version')
    const isPrerelease = core.getInput('is_prerelease')
    const needWrite = core.getInput('write_next_bump')

    const parsedBump =
      isPrerelease === 'true'
        ? 'prerelease'
        : releaseVersion
        ? parseNextBumpFromVersion(releaseVersion)
        : undefined

    if (!parsedBump) {
      if (isPrerelease !== 'true' && !releaseVersion) {
        core.warning(
          `[warn] you should add parameter 'release_version' when 'is_prerelease' is false or empty`
        )
      } else {
        core.warning(
          `[warm] can not parse nextBump from release_verison: ${releaseVersion}`
        )
      }
    } else {
      core.info(
        `[info] parse nextBump(${parsedBump}) from release_verison: ${releaseVersion}`
      )
    }

    if (needWrite === 'true' && parsedBump) {
      const nextBump = readBumpType(rushPath, policyName)

      if (!nextBump) {
        core.info(`[info] can't read nextBump`)
      } else {
        core.info(`[info] current nextBump: ${nextBump}`)
      }

      if (parsedBump !== nextBump) {
        writeNextBump(parsedBump, rushPath, policyName)
      }
    }

    core.setOutput('next_bump', parsedBump)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
