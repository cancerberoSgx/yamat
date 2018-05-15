import { getConfig, writeFile } from "./util";
import { cat } from "shelljs";
import { relative } from "path";
import { YamatConfig } from ".";

export function link(yamatConfig : YamatConfig){
  const config = getConfig(yamatConfig)
  config.forEach(c => {
    const pj = JSON.parse(cat(c.path+'/package.json'))
    Object.keys(pj.dependencies||{})
    .filter(d=>config.find(c=>c.name===d))
    .forEach(d=>{
      pj.dependencies[d] = relative(c.path, config.find(c=>c.name===d).path)
    })
    writeFile(c.path, JSON.stringify(pj, null, 2))
  });
}



