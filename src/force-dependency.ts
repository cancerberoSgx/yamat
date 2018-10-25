// import { quiet as exec } from 'executive';
import pMap from 'p-map';
import { resolve } from 'path';
import { rm, cat, exec } from 'shelljs';
import { ConfigEntry, YamatConfig } from './types';
import { getConfig, getPackagePath, parseJSON, parsePackageJson, writePackageJson } from './util';
import { exec0 } from '../spec/testUtil';

// TODO
// * --abort-on-first-error
// * list all versions of given external dependency used by all managed packages
// * utilities to make sure all managed projects are using the same version of a given external dependency : ex:
//   yamat force-dependency-version 'typescript@2.9.1'
// * utility similar as before but forcing all packages are using latest version of given external dep - use npm
//   show ts-simple-ast version. ie : yamat force-dependency-latest typescript
// * same as before but for all dependencies yamat force-dependencies-latest

export interface ForceLatestDependenciesConfig extends YamatConfig {
  exclude: 'dependencies' | 'dev-dependencies' | 'none'
  excludeDependencies: string[]
}

export async function forceDependenciesLatest(forceConfig: ForceLatestDependenciesConfig): Promise<(ForceLatestDependenciesResult | undefined)[][][]> {
  const config = getConfig(forceConfig)
  const mapper = async (c: ConfigEntry): Promise<(ForceLatestDependenciesResult | undefined)[][]> => {
    const results: (ForceLatestDependenciesResult | undefined)[][] = []
    console.log('\nUpdating dependencies of project ' + c.name + '\n')
    const pj = parsePackageJson(forceConfig, c.path)
    if (forceConfig.exclude !== 'dependencies') {
      const result = await modifyJSONDeps(pj, 'dependencies', forceConfig, c)
      results.push(result)
    }
    if (forceConfig.exclude !== 'dev-dependencies') {
      const result = await modifyJSONDeps(pj, 'devDependencies', forceConfig, c)
      results.push(result)
    }
    return results
  }
  return pMap(config, mapper, { concurrency: 1 })
}

export interface ForceLatestDependenciesResult {
  errorCause?: string,
  package: string,
  newVersion?: string,
  oldVersion?: string,
  cmd?: string
}

async function modifyJSONDeps(pj: any, propertyName: string, forceConfig: ForceLatestDependenciesConfig, c: ConfigEntry): Promise<(ForceLatestDependenciesResult | undefined)[]> {
  const config = getConfig(forceConfig)
  const dependencies = pj[propertyName] || {}
  const dependencyNames = Object.keys(dependencies)
    .filter(d => !config.find(c => c.name === d))
  const mapper = async (d: string) => {
    if (forceConfig.excludeDependencies.includes(d)) {
      return
    }
    const cmd = `npm show ${d} version --json`
    const p = exec(cmd)
    if (p.code) {
      return { cmd, package: d, errorCause: `Command '${cmd}' failed with return status ${p.code}` }
    }
    const parsed = parseJSON(p.stdout.toString())
    if (parsed instanceof Error) {
      return { cmd, package: d, errorCause: `Cannot parse response of '${cmd}' command: ${p.stdout.toString()}` }
    }
    const currentVersion = dependencies[d] + ''
    const parsedVersion = parsed + ''
    if (!currentVersion.endsWith(parsedVersion)) { // endsWith because current could have tildes, etc
      const prefix = resolve(getPackagePath(forceConfig, c.path))
      rm('-rf', `${prefix}/package-lock.json`) // Heads up - remove package-lock will prevent several errors when trying to execute cmd2
      const cmd2 = `npm install --no-color --no-progress --prefix '${prefix}' ${propertyName === 'dependencies' ? '--save' : '--save-dev'} ${d}@${parsedVersion}`
      const p2 = exec(cmd2)
      console.log(`dependency ${d} command ${cmd2} ended with status ${p2.code}`);
      if (p2.code) {
        return { cmd: cmd2, package: d, errorCause: `Command '${cmd2}' failed with return status ${p2.code}. \nstderr was: ${p2.stderr}` }
      }
      return { cmd: cmd2, package: d, newVersion: parsedVersion, oldVersion: currentVersion }
    }
  }
  const result = await pMap(dependencyNames, mapper, { concurrency: 1 })
  return result
}
