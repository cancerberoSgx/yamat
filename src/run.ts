import { sep } from "path";
import { cd, exec, pwd } from "shelljs";
import { YamatConfig } from ".";
import { getConfig } from "./util";

/**
 * Runs given command on each package serially. If some fails, abort and exit with that status code
 * TODO: config for running them all no matter if some fails. 
 */
export function run(runConfig: RunConfig) {
  console.log(`Running in all packages command : ${JSON.stringify(runConfig)}`);
  const originalDir = pwd()
  const config = getConfig(runConfig)
  const results: { cmd: string, path: string, code: number }[] = []
  config.forEach(c => {
    cd(runConfig.rootPath + sep + c.path)
    const code = exec(runConfig.cmd).code
    if (code !== 0) {
      console.error(`ERROR while trying to execute command "${runConfig.cmd}" in ${c.path}`)
      if (runConfig.breakOnError) {
        process.exit(code)
      }
    } else {
      console.log(`Command "${runConfig.cmd}" finish successfully in ${c.path}`)
    }
    results.push({ cmd: runConfig.cmd, path: c.path, code })
    cd(originalDir)
  })
  if (results.length) {
    console.error(`\nERRORs when executing the following commands on some packages: \n${JSON.stringify(results.map(r=>r.code!==0), null, 2)}`)
  } else {
    console.log(`Command "${runConfig.cmd}" successfully run in all packages without errors`);
  }
}

export interface RunConfig extends YamatConfig {
  cmd: string,
  breakOnError: boolean
}