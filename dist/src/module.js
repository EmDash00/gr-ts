const ModuleConfig = {
    preRun: [],
    postRun: [],
    onRuntimeInitialized: function () { },
    locateFile: function (filename) { },
    printErr: function (text) {
        if (arguments.length > 1) {
            text = Array.prototype.slice.call(arguments).join(" ");
        }
        if (0) {
            this.dump(text + "\n");
        }
        else {
            console.warn(text);
        }
    },
    canvas: null,
    context: null,
    dpr: 1,
    dpr_per_canvas: [],
    setStatus: function (text) { },
    totalDependencies: 0,
    get_dash_list: function (linetype) {
        const list = this._malloc(10 * 16);
        this.ccall("gks_get_dash_list", "", ["number", "number", "number"], [linetype, 1.0, list]);
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
window.onerror = function (event) { };
