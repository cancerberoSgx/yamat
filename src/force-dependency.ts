import { YamatConfig } from "./types";

// * list all versions of given external dependency used by all managed packages
// * utilities to make sure all managed projects are using the same version of a given external dependency : ex:
//   yamat force-dependency-version "typescript@2.9.1"
// * utility similar as before but forcing all packages are using latest version of given external dep - use npm
//   show ts-simple-ast version. ie : yamat force-dependency-latest typescript
// * same as before but for all dependencies yamat force-dependencies-latest


export function forceLatestDependencies(config: YamatConfig) {

}