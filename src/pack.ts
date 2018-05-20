import { ConfigEntry, UnlinkConfig } from ".";
import { mkdir, pwd, cd, exec, rm, ls } from "shelljs";
import { getInternalFolder, getPackagePath } from "./util";
import { ok } from "assert";
import { join } from "path";
/**
 * creates the pack file  for given targetConfig and return the path to the tgz
 */
export function pack(config: UnlinkConfig, targetConfig: ConfigEntry): string {
  const cwd = pwd()
  cd(getInternalFolder(config))
  rm('-rf', targetConfig.name + '-*.tgz')
  const p = exec('npm pack ' + getPackagePath(config, targetConfig.path))
  ok(p.code === 0)
  const tgzs = ls(targetConfig.name + '-*.tgz')
  ok(tgzs.length === 1)
  cd(cwd)
  return join(getInternalFolder(config), tgzs[0])
}