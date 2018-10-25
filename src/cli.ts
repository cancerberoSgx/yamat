import { pwd } from "shelljs";
import { YamatConfig } from ".";
import { forceLatestDependencies } from "./force-dependency";
import { helpAndExit } from "./help";
import { link } from "./link";
import { run } from "./run";
import { unlink, UnlinkVersion } from "./unlink";
import { getConfigPath, flattenDeep } from "./util";

const args = require('yargs-parser')(process.argv.slice(2));

export async function main() {
  const config: YamatConfig = {
    rootPath: args.rootPath || pwd().toString(),
    yamatJsonFile: args.yamatJsonFile
  }
  config.yamatJsonFile = getConfigPath(config)
  const firstArg = args._[0]
  if (args.help) {
    helpAndExit(0)
  }
  else if (firstArg === 'unlink') {
    return unlink({ ...config, version: args.version || UnlinkVersion.local })
  }
  else if (firstArg === 'run') {
    const cmd = [].concat(args._).slice(1).join(' ')
    return run({ ...config, cmd, breakOnError: args.breakOnError !== 'no' })
  }
  else if (firstArg === 'forceDependenciesLatest') {
    let result = await forceLatestDependencies({ ...config, exclude: args.exclude || 'none', excludeDependencies: (args.excludeDependencies || '').split(',') })
    result = flattenDeep(result).find(r => r && r.errorCause)
    if (result.length) {
      console.log('ERROR occurred when trying to update dependencies in some projects. Probably you will need to `rm package-lock.json node_modules` manually - I won\'t. Examine the results below, go to each error and remove node_modules and package-lock.json will solve the issues of npm install, in general.\n Errors: \n' + JSON.stringify(result, null, 2) + '\nAborted.');
      process.exit(1)
    }
  }
  else if (firstArg === 'link') {
    return link(config)
  }
  else throw new Error('Incorrect call. TODO: usage instructions')
}
