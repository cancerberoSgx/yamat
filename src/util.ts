import { ConfigEntry } from ".";
import { cat } from "shelljs";
import * as shell from 'shelljs'
export function getConfig():Array<ConfigEntry>{
  return JSON.parse(cat('yamat.json'))
 }

 export function writeFile(file:string, data:string){
   (shell as any).ShellString(data).to(file)
 }