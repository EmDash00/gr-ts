import { MainModule } from "./libgr";

interface Extras {
  preRun: [];
  postRun: [];
  dpr: number
  dpr_per_canvas: [];
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  totalDependencies: number;
  onRuntimeInitialized(): void;
  locateFile(filename: string): void;
  printErr(text: string): void;
  get_dash_list(linetype: number): number[];
  setStatus(text: string): void;
}

export type GRModule = Partial<MainModule> & Extras;

const ModuleConfig: GRModule = {
  preRun: [],
  postRun: [],
  onRuntimeInitialized: function() {},
  locateFile: function(filename: string) {},
  printErr: function (text) {
    if (arguments.length > 1) {
      text = Array.prototype.slice.call(arguments).join(" ");
    }
    if (0) {
      this.dump(text + "\n");
    } else {
      console.warn(text);
    }
  },
  canvas: null,
  context: null,
  dpr: 1,
  dpr_per_canvas: [],
  setStatus: function (text) {},
  totalDependencies: 0,
  get_dash_list: function (linetype) {
    const list = this._malloc(10 * 16);
    this.ccall(
      "gks_get_dash_list",
      "",
      ["number", "number", "number"],
      [linetype, 1.0, list],
    );
    const result = [];
    const len = this.getValue(list, "i16");
    for (let i = 1; i < len + 1; i++) {
      result.push(this.getValue(list + i * 4, "i16"));
    }
    this._free(list);
    return result;
  },
};

export default ModuleConfig;
window.onerror = function (event) {};
