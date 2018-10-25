import { sep } from "path";
import { cd, exec, pwd, ExecOutputReturnValue } from "shelljs";
import { YamatConfig } from ".";
import { getConfig } from "./util";
import { ConfigEntry } from "./types";

/**
 * Runs given command on each package serially. 
 *
 * By default it will run them all no matter if there are errors (some command ends with exit code
 * different than zero) and list each commend errors in a final report. If --breakOnError is passed
 * in which case it will break on first commend error and exit with the same command exit code. 
 */
export async function run(runConfig: RunConfig):Promise< RunResult[]> { // TODO: return RunResult with all report information currenlty printed to stdout
  console.log(`Running in all packages command : ${JSON.stringify(runConfig)}`);
  const originalDir = pwd()
  const config = getConfig(runConfig)
  const results: RunResult[] = []
  config.forEach(c => {
    cd(runConfig.rootPath + sep + c.path)
    const p = exec(runConfig.cmd)
    const code = p.code
    if (code !== 0) {
      console.error(`ERROR while trying to execute command "${runConfig.cmd}" in ${c.path}`)
      if (runConfig.breakOnError) {
        process.exit(code)
      }
    } else {
      console.log(`Command "${runConfig.cmd}" finish successfully in ${c.path}`)
    }
    results.push({...p, cmd: runConfig.cmd, path: c.path, code, config: c })
    cd(originalDir)
  })
  if (results.length && results.find(r => r.code !== 0)) {
    console.error(`\nERRORs thrown when executing the following commands on some packages: 
${JSON.stringify(results.filter(r => r.code !== 0), null, 2)}
    `)
  } else {
    console.log(`Command "${runConfig.cmd}" successfully run in all packages without errors`);
  }
  return results
}

export interface RunResult extends ExecOutputReturnValue {
  cmd: string,
  path: string,
  config: ConfigEntry
}

export interface RunConfig extends YamatConfig {
  cmd: string,
  breakOnError: boolean
}
