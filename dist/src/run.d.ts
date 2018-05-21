import { YamatConfig } from ".";
/**
 * Runs given command on each package serially. If some fails, abort and exit with that status code
 * TODO: config for running them all no matter if some fails.
 */
export declare function run(runConfig: RunConfig): void;
export interface RunConfig extends YamatConfig {
    cmd: string;
    breakOnError: boolean;
}
