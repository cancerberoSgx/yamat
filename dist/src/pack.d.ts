import { ConfigEntry, UnlinkConfig } from ".";
/**
 * creates the pack file  for given targetConfig and return the path to the tgz
 */
export declare function pack(config: UnlinkConfig, targetConfig: ConfigEntry): string;
