import { YamatConfig } from "./types";
export interface ForceLatestDependenciesConfig extends YamatConfig {
    exclude: 'dependencies' | 'dev-dependencies' | 'none';
}
export declare function forceLatestDependencies(forceConfig: ForceLatestDependenciesConfig): ForceLatestDependenciesResult[][];
export interface ForceLatestDependenciesResult {
    errorCause?: string;
    package: string;
    newVersion?: string;
    oldVersion?: string;
    cmd?: string;
}
