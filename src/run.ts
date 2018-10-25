import { sep } from "path";
import { cd, exec, ExecOutputReturnValue, pwd } from "shelljs";
import { YamatConfig } from ".";
import { ConfigEntry } from "./types";
import { getConfig } from "./util";

/**
 * Runs given command on each package serially. 
 *
 * By default it will run them all no matter if there are errors (some command ends with exit code
 * different than zero) and list each commend errors in a final report. If --breakOnError is passed
 * in which case it will break on first commend error and exit with the same command exit code. 
 */
export async function run(runConfig: RunConfig): Promise<RunResult[]> { // TODO: return RunResult with all report information currenlty printed to stdout
  runConfig.silent && console.log(`Running in all packages command : ${JSON.stringify(runConfig)}`);
  const originalDir = pwd()
  const configEntry = getConfig(runConfig)
  let doBreak: boolean = false
  const results:RunResult[] = configEntry
    .map(config => {
      if(doBreak){
        return undefined
      }
      cd(runConfig.rootPath + sep + config.path)
      const p = exec(runConfig.cmd)
      const code = p.code
      if (code !== 0) {
        runConfig.silent && console.error(`ERROR while trying to execute command "${runConfig.cmd}" in ${config.path}`)
        if (runConfig.breakOnError) {
          if (runConfig.exitOnBreak) {
            process.exit(code)
          }
          else {
            doBreak=true
            return { ...p, cmd: runConfig.cmd, path: config.path, config: config }
          }
        }
      } else {
        runConfig.silent && console.log(`Command "${runConfig.cmd}" finish successfully in ${config.path}`)
      }
      cd(originalDir)
      return { ...p, cmd: runConfig.cmd, path: config.path, config: config }
    })
    .filter(result => result!==undefined) as RunResult[]
  if (results.length && results.find(r => r.code !== 0)) {
    runConfig.silent && console.error(`\nERRORs thrown when executing the following commands on some packages: 
${JSON.stringify(results.filter(r => r.code !== 0), null, 2)}
    `)
  } else {
    runConfig.silent && console.log(`Command "${runConfig.cmd}" successfully run in all packages without errors`);
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
  breakOnError: boolean,
  exitOnBreak?: boolean,
  silent?: boolean
}
