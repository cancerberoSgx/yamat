import { link } from "./link";
import { unlink, UnlinkConfig } from "./unlink";
import { YamatConfig } from "./types";
import { pwd } from "shelljs";

const args = require('yargs-parser')(process.argv.slice(2));
const shell = require('shell')

// export function main (){
//   if(args.link){
//     return link()
//   } 
//   if(args.unlink){
//     const config: UnlinkConfig = {
//       rootPath :args.rootPath || pwd(),
//       yamatJsonFile: args.yamatJsonFile || 'yamat.json',
//       version: args.version || 'local'
//     }
//   }
// }
