import { Soundfont } from "./Soundfont";

export interface Preset {
  readonly soundfont: Soundfont;
  readonly name: string;
  readonly bankNum: number;
  readonly num: number;
}
