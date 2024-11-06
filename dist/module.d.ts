import { MainModule } from "./wasm/libGR.js";
interface Extras {
    preRun: [];
    postRun: [];
    dpr: number;
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
declare const ModuleConfig: GRModule;
export default ModuleConfig;
