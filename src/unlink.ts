import { getConfig } from "./util";
import { cat } from "shelljs";
import { writeFileSync } from "fs";
import { resolve } from "dns";

export function unlink(){
  const config = getConfig()
  // config.forEach(c => {
    // const pj = JSON.parse(cat(c.path))
    // Object.keys(pj.dependencies||{}).filter(d=>config.find(c=>c.name===d)).forEach(d=>{
    //   pj.dependencies[d] = resolve(config.find(c=>c.name===d).path)
    // })
    // writeFileSync(c.path, JSON.stringify(pj, null, 2))
  // });
}