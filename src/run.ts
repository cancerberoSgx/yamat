import { cd, exec, pwd } from "shelljs";
import { YamatConfig } from ".";
import { getConfig } from "./util";
import { sep } from "path";

/**
 * Runs given command on each package serially. If some fails, abort and exit with that status code
 * TODO: config for running them all no matter if some fails. 
 */
export function run(runConfig: RunConfig) {
  console.log(`Running command "${runConfig.cmd}" in all packages`);
  const originalDir = pwd()
  const config = getConfig(runConfig)
  config.forEach(c => {
    cd(runConfig.rootPath+sep+c.path)
    const code = exec(runConfig.cmd).code
    if (code !== 0) {
      console.log(`ERROR while trying to execute command "${runConfig.cmd}" in ${c.path}`)
      process.exit(code)
    } else {
      console.log(`Command "${runConfig.cmd}" finish successfully in ${c.path}`)
    }
    cd(originalDir)
  })
  console.log(`Command "${runConfig.cmd}" successfully run in all packages without errors`);
}

export interface RunConfig extends YamatConfig {
  cmd: string
}