import { YamatConfig } from './types';
export interface ForceLatestDependenciesConfig extends YamatConfig {
    exclude: 'dependencies' | 'dev-dependencies' | 'none';
    excludeDependencies: string[];
}
export declare function forceLatestDependencies(forceConfig: ForceLatestDependenciesConfig): Promise<(ForceLatestDependenciesResult | undefined)[][][]>;
export interface ForceLatestDependenciesResult {
    errorCause?: string;
    package: string;
    newVersion?: string;
    oldVersion?: string;
    cmd?: string;
}
