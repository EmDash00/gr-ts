export { NOCLIP, CLIP, ARROWSTYLE, COLOR_MODEL, INTERP2_METHOD, LINESPEC, PRINT_TYPE, COLORMAP, FILL_INTSTYLE, FONT, GRM_EVENT, LINETYPE, MARKERTYPE, PATH_CODE, PRINT_FORMAT, PRINT_MODE, PRINT_ORIENTATION, SCALE_OPTION, SCIENTIFIC_FORMAT_OPTION, SPLINE_SMOOTHING, SURFACE_OPTION, TEXT_HALIGN, TEXT_PATH, TEXT_PRECISION, TEXT_VALIGN, XFORM, } from "./constants.js";
export { default } from "./module.js";
export declare let isReady: boolean;
export declare let readyCallbacks: (() => void)[];
export declare function onGRReady(callback: () => void): any;
export declare function loadGRRuntime(): Promise<typeof import("./runtime.js")>;
