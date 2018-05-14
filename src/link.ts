import { getConfig, writeFile } from "./util";
import { cat } from "shelljs";
import { relative } from "path";

export function link(){
  const config = getConfig()
  config.forEach(c => {
    const pj = JSON.parse(cat(c.path))
    Object.keys(pj.dependencies||{})
    .filter(d=>config.find(c=>c.name===d))
    .forEach(d=>{
      pj.dependencies[d] = relative(c.path, config.find(c=>c.name===d).path)
    })
    writeFile(c.path, JSON.stringify(pj, null, 2))
  });
}