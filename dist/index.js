import ModuleConfig from "./module.js";
export { NOCLIP, CLIP, ARROWSTYLE, COLOR_MODEL, INTERP2_METHOD, LINESPEC, PRINT_TYPE, COLORMAP, FILL_INTSTYLE, FONT, GRM_EVENT, LINETYPE, MARKERTYPE, PATH_CODE, PRINT_FORMAT, PRINT_MODE, PRINT_ORIENTATION, SCALE_OPTION, SCIENTIFIC_FORMAT_OPTION, SPLINE_SMOOTHING, SURFACE_OPTION, TEXT_HALIGN, TEXT_PATH, TEXT_PRECISION, TEXT_VALIGN, XFORM, } from "./constants.js";
export { default } from "./module.js";
export let isReady = false;
export let readyCallbacks = [];
export function onGRReady(callback) {
    if (!isReady) {
        readyCallbacks.push(callback);
        return this;
    }
    callback();
    return this;
}
ModuleConfig.locateFile = async function (filename) {
    if (filename.endsWith(".wasm")) {
        return "./libgr.wasm";
    }
};
export async function loadGRRuntime() {
    return await import("./runtime.js");
}
