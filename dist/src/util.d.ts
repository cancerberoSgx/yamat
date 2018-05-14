import { ConfigEntry } from ".";
import { YamatConfig } from "./types";
export declare function getConfig(config: YamatConfig): Array<ConfigEntry>;
export declare function writeFile(file: string, data: string): void;
