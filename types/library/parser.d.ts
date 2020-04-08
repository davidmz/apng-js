import { APNG, Frame } from './structs';
export declare function isNotPNG(err: unknown): boolean;
export declare function isNotAPNG(err: unknown): boolean;
/**
 * Parse APNG data
 *
 */
export default function parseAPNG(buffer: ArrayBuffer): Error | APNG;

export type { APNG, Frame };
