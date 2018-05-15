import { pwd } from "shelljs";
import { link } from "./link";
import { UnlinkConfig, unlink, UnlinkVersion } from "./unlink";

const args = require('yargs-parser')(process.argv.slice(2));
const shell = require('shelljs')

export function main() {
  const config: UnlinkConfig = {
    rootPath: args.rootPath || pwd(),
    yamatJsonFile: args.yamatJsonFile || 'yamat.json',
    version: args.version || UnlinkVersion.local
  }
  if (args._.includes('unlink')) {
    return unlink(config)
  }
  else if (args._.includes('link')) {
    return link(config)
  }
  else throw new Error('Incorrect call. TODO: usage instructions')
}
