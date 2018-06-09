import Executive from 'executive';
// import { pwd } from "shelljs";
import { resolve } from "path";
import { ConfigEntry, YamatConfig } from "./types";
import { getConfig, getPackagePath, parseJSON, parsePackageJson, writePackageJson } from "./util";
const exec: Executive = require('executive')

// * list all versions of given external dependency used by all managed packages
// * utilities to make sure all managed projects are using the same version of a given external dependency : ex:
//   yamat force-dependency-version "typescript@2.9.1"
// * utility similar as before but forcing all packages are using latest version of given external dep - use npm
//   show ts-simple-ast version. ie : yamat force-dependency-latest typescript
// * same as before but for all dependencies yamat force-dependencies-latest


export interface ForceLatestDependenciesConfig extends YamatConfig {
  exclude: 'dependencies' | 'dev-dependencies' | 'none'
}

export async function forceLatestDependencies(forceConfig: ForceLatestDependenciesConfig): Promise<ForceLatestDependenciesResult[][]> {
  const results: ForceLatestDependenciesResult[][] = []
  const config = getConfig(forceConfig)
  config.forEach(async c => {
    const pj = parsePackageJson(forceConfig, c.path)
    if (forceConfig.exclude !== 'dependencies') {
      const result = await modifyJSONDeps(pj, 'dependencies', forceConfig, c)
      results.push(result)
    }
    if (forceConfig.exclude !== 'dev-dependencies') {
      const result = await modifyJSONDeps(pj, 'devDependencies', forceConfig, c)
      results.push(result)
    }
    writePackageJson(forceConfig, c.path, pj)
  })
  console.log(`Results of forceLatestDependencies command:\n${JSON.stringify(results, null, 2)}`) // TODO: console.log should be responsibility of cli
  return results
}

export interface ForceLatestDependenciesResult {
  errorCause?: string,
  package: string,
  newVersion?: string,
  oldVersion?: string,
  cmd?: string
}

async function modifyJSONDeps(pj: any, propertyName: string, forceConfig: ForceLatestDependenciesConfig, c: ConfigEntry): Promise<ForceLatestDependenciesResult[]> {
  const config = getConfig(forceConfig)
  const result: ForceLatestDependenciesResult[] = []
  Object.keys(pj[propertyName] || {})
    .filter(d => !config.find(c => c.name === d))
    .forEach(async d => {
      const cmd = `npm show ${d} version --json`
      console.log(`dependency ${d} executing command ${cmd}`);
      const p = await exec(cmd)
      console.log(`dependency ${d} command ${cmd} ended with status ${p.status}`);
      if (p.status) {
        result.push({ cmd, package: d, errorCause: `Command "${cmd}" failed with return status ${p.status}` })
        return
      }
      const parsed = parseJSON(p.stdout.toString())
      if (parsed instanceof Error) {
        result.push({ cmd, package: d, errorCause: `Cannot parse response of "${cmd}" command: ${p.stdout.toString()}` })
        return
      }
      const currentVersion = pj[propertyName][d] + ''
      const parsedVersion = parsed + ''
      if (!currentVersion.endsWith(parsedVersion)) { // cause current could have tildes, etc
        const prefix = resolve(getPackagePath(forceConfig, c.path))
        const cmd2 = `npm install --no-color --no-progress --prefix "${prefix}" ${propertyName === 'dependencies' ? '--save' : '--save-dev'} ${d}@${parsedVersion}`

        console.log(`dependency ${d} executing command ${cmd2}`);
        const p2 = await exec(cmd2)
        console.log(`dependency ${d} command ${cmd2} ended with status ${p2.status}`);
        if (p2.status) {
          result.push({ cmd: cmd2, package: d, errorCause: `Command "${cmd2}" failed with return status ${p2.status}` })
          return
        }
        result.push({ cmd: cmd2, package: d, newVersion: parsedVersion, oldVersion: currentVersion })
      }
    })
  return result

}