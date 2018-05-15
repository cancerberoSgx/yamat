import { ConfigEntry, UnlinkConfig } from ".";
import { YamatConfig } from "./types";
export declare function getConfig(config: YamatConfig): Array<ConfigEntry>;
export declare function writeFile(file: string, data: string): void;
export declare function getPackageJsonPath(unlinkConfig: UnlinkConfig, packagePath: string): string;
