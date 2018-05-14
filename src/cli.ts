import { link } from "./link";
import { unlink } from "./unlink";

const args = require('yargs-parser')(process.argv.slice(2));
const shell = require('shell')

export function main (){
  if(args.link){
    return link()
  } 
  if(args.unlink){
    return unlink()
  }
}
