import ModuleConfig from "./module.js";
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
        return "./libgr/libgr.wasm";
    }
};
async function loadGRRuntime() {
    return await import("./runtime.js");
}
