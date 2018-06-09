import { pwd } from "shelljs";
import { YamatConfig } from ".";
import { forceLatestDependencies } from "./force-dependency";
import { link } from "./link";
import { run } from "./run";
import { unlink, UnlinkVersion } from "./unlink";
import { getConfigPath } from "./util";

const args = require('yargs-parser')(process.argv.slice(2));

export async function main() {
  const config: YamatConfig = {
    rootPath: args.rootPath || pwd().toString(),
    yamatJsonFile: args.yamatJsonFile
  }
  config.yamatJsonFile = getConfigPath(config)

  const firstArg = args._[0]
  console.log(`yamat command "${firstArg}" called with config: ${JSON.stringify(config)}`)

  if (firstArg === 'unlink') {
    return unlink({ ...config, version: args.version || UnlinkVersion.local })
  }
  else if (firstArg === 'run') {
    const cmd = [].concat(args._).slice(1).join(' ')
    return run({ ...config, cmd, breakOnError: args.breakOnError !== 'no' })
  }
  else if (firstArg === 'forceDependenciesLatest') {
    return await forceLatestDependencies({ ...config, exclude: args.exclude || 'none' })
    // console.log('cli end')
    // return
  }
  else if (firstArg === 'link') {
    return link(config)
  }
  else throw new Error('Incorrect call. TODO: usage instructions')
}
