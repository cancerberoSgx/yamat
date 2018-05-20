import { pwd } from "shelljs";
import { link } from "./link";
import { UnlinkConfig, unlink, UnlinkVersion } from "./unlink";
import { run } from "./run";
import { YamatConfig } from ".";

const args = require('yargs-parser')(process.argv.slice(2));


export function main() {
  const config: YamatConfig = {
    rootPath: args.rootPath || pwd().toString(),
    yamatJsonFile: args.yamatJsonFile || 'yamat.json'
  }
  const firstArg = args._[0]
  if (firstArg === 'unlink') {
    return unlink({...config, version: args.version || UnlinkVersion.local})
  }
  else if (firstArg === 'run') {
    const cmd = [].concat(args._).slice(1).join(' ')
    return run({...config, cmd})
  }
  else if (firstArg === 'link') {
    return link(config)
  }
  else throw new Error('Incorrect call. TODO: usage instructions')
}
