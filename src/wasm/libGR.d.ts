// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    function intArrayFromString(arg0: string, arg1?: boolean | undefined, arg2?: number | undefined): any;
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Arguments|Array=} args
     * @param {Object=} opts
     */
    function ccall(ident: any, returnType?: (string | null) | undefined, argTypes?: any[] | undefined, args?: (Arguments | any[]) | undefined, opts?: any | undefined): any;
    /**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */
    function cwrap(ident: any, returnType?: string | undefined, argTypes?: any[] | undefined, opts?: any | undefined): any;
    /**
     * @param {number} ptr
     * @param {string} type
     */
    function getValue(ptr: number, type?: string): any;
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
    function setValue(ptr: number, value: number, type?: string): void;
    /** @param {string=} sig */
    function addFunction(func: any, sig?: string | undefined): any;
    function removeFunction(index: any): void;
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */
    function UTF8ToString(ptr: number, maxBytesToRead?: number | undefined): string;
    function stringToUTF8(str: any, outPtr: any, maxBytesToWrite: any): any;
    function lengthBytesUTF8(str: any): number;
    let HEAPF32: any;
    let HEAPF64: any;
    let HEAP_DATA_VIEW: any;
    let HEAP8: any;
    let HEAPU8: any;
    let HEAP16: any;
    let HEAPU16: any;
    let HEAP32: any;
    let HEAPU32: any;
    let HEAP64: any;
    let HEAPU64: any;
    let FS_createPath: any;
    function FS_createDataFile(parent: any, name: any, fileData: any, canRead: any, canWrite: any, canOwn: any): void;
    function FS_createPreloadedFile(parent: any, name: any, url: any, canRead: any, canWrite: any, onload: any, onerror: any, dontCreateFile: any, canOwn: any, preFinish: any): void;
    function FS_unlink(path: any): any;
    let FS_createLazyFile: any;
    let FS_createDevice: any;
    let addRunDependency: any;
    let removeRunDependency: any;
}
interface WasmModule {
  _free(_0: number): void;
  _grm_args_delete(_0: number): void;
  _malloc(_0: number): number;
  _grm_args_new(): number;
  _grm_args_push(_0: number, _1: number, _2: number, _3: number): number;
  _grm_dump(_0: number, _1: number): void;
  _grm_dump_json(_0: number, _1: number): void;
  _grm_dump_json_str(): number;
  _grm_register(_0: number, _1: number): number;
  _grm_unregister(_0: number): number;
  _grm_input(_0: number): number;
  _gr_savestate(): void;
  _gr_setviewport(_0: number, _1: number, _2: number, _3: number): void;
  _gr_setwindow(_0: number, _1: number, _2: number, _3: number): void;
  _gr_setscale(_0: number): number;
  _gr_wctondc(_0: number, _1: number): void;
  _gr_restorestate(): void;
  _gr_ndctowc(_0: number, _1: number): void;
  _grm_is3d(_0: number, _1: number): number;
  _grm_get_box(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number, _8: number): number;
  _grm_get_tooltip(_0: number, _1: number): number;
  _grm_read(_0: number, _1: number): number;
  _grm_load_from_str(_0: number): number;
  _grm_merge(_0: number): number;
  _grm_merge_named(_0: number, _1: number): number;
  _grm_plot(_0: number): number;
  _gr_beginprint(_0: number): void;
  _gr_endprint(): void;
  _grm_switch(_0: number): number;
  _grm_get_stdout(): number;
  _gr_selectcontext(_0: number): void;
  _gr_inqcolor(_0: number, _1: number): void;
  _gr_setcolorrep(_0: number, _1: number, _2: number, _3: number): void;
  _gr_destroycontext(_0: number): void;
  _gr_setcolormap(_0: number): void;
  _gr_inqscale(_0: number): void;
  _gr_panzoom(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number): void;
  _gr_setscientificformat(_0: number): void;
  _gr_setclip(_0: number): void;
  _gr_inqtext(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _gr_setcharheight(_0: number): void;
  _gr_settransparency(_0: number): void;
  _gr_selntran(_0: number): void;
  _gr_setfillintstyle(_0: number): void;
  _gr_setfillcolorind(_0: number): void;
  _gr_fillrect(_0: number, _1: number, _2: number, _3: number): void;
  _gr_setbordercolorind(_0: number): void;
  _gr_setcharexpan(_0: number): void;
  _gr_setcharspace(_0: number): void;
  _gr_setcharup(_0: number, _1: number): void;
  _gr_selectclipxform(_0: number): void;
  _gr_setfillstyle(_0: number): void;
  _gr_settextfontprec(_0: number, _1: number): void;
  _gr_setlinecolorind(_0: number): void;
  _gr_uselinespec(_0: number): number;
  _gr_setlinetype(_0: number): void;
  _gr_setlinewidth(_0: number): void;
  _gr_setmarkercolorind(_0: number): void;
  _gr_setmarkersize(_0: number): void;
  _gr_setmarkertype(_0: number): void;
  _gr_setspace(_0: number, _1: number, _2: number, _3: number): number;
  _gr_settextalign(_0: number, _1: number): void;
  _gr_settextcolorind(_0: number): void;
  _gr_settextencoding(_0: number): void;
  _gr_setwsviewport(_0: number, _1: number, _2: number, _3: number): void;
  _gr_setwswindow(_0: number, _1: number, _2: number, _3: number): void;
  _gr_clearws(): void;
  _gr_updatews(): void;
  _gr_inqviewport(_0: number, _1: number, _2: number, _3: number): void;
  _gr_inqwindow(_0: number, _1: number, _2: number, _3: number): void;
  _gr_axes3d(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number, _8: number, _9: number): void;
  _gr_cellarray(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number, _8: number, _9: number, _10: number): void;
  _gr_inqlinecolorind(_0: number): void;
  _gr_drawarc(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): void;
  _gr_drawgraphics(_0: number): number;
  _gr_drawimage(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number): void;
  _gr_drawrect(_0: number, _1: number, _2: number, _3: number): void;
  _gr_fillarc(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): void;
  _gr_fillarea(_0: number, _1: number, _2: number): void;
  _gr_polyline(_0: number, _1: number, _2: number): void;
  _gr_polyline3d(_0: number, _1: number, _2: number, _3: number): void;
  _gr_polymarker(_0: number, _1: number, _2: number): void;
  _gr_textext(_0: number, _1: number, _2: number): number;
  _gr_mathtex(_0: number, _1: number, _2: number): void;
  _gr_text(_0: number, _1: number, _2: number): void;
  _gr_titles3d(_0: number, _1: number, _2: number): void;
  _gr_inqmarkercolorind(_0: number): void;
  _gr_gridit(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number, _8: number): void;
  _gr_contour(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number): void;
  _gr_shadepoints(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): void;
  _gr_surface(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): void;
  _gr_hexbin(_0: number, _1: number, _2: number, _3: number): number;
  _gr_inqspace(_0: number, _1: number, _2: number, _3: number): void;
  _gr_adjustrange(_0: number, _1: number): void;
  _gr_tick(_0: number, _1: number): number;
  _gr_opengks(): void;
  _gr_closegks(): void;
  _gr_inqdspsize(_0: number, _1: number, _2: number, _3: number): void;
  _gr_openws(_0: number, _1: number, _2: number): void;
  _gr_closews(_0: number): void;
  _gr_activatews(_0: number): void;
  _gr_deactivatews(_0: number): void;
  _gr_spline(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _gr_inqlinetype(_0: number): void;
  _gr_inqlinewidth(_0: number): void;
  _gr_inqmarkertype(_0: number): void;
  _gr_settextpath(_0: number): void;
  _gr_createseg(_0: number): void;
  _gr_copysegws(_0: number): void;
  _gr_redrawsegws(): void;
  _gr_setsegtran(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number): void;
  _gr_closeseg(): void;
  _gr_emergencyclosegks(): void;
  _gr_updategks(): void;
  _gr_inqtextext(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _gr_axes(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number): void;
  _gr_grid(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): void;
  _gr_verrorbars(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _gr_herrorbars(_0: number, _1: number, _2: number, _3: number, _4: number): void;
  _gr_drawarrow(_0: number, _1: number, _2: number, _3: number): void;
  _gr_inqcolormap(_0: number): void;
  _gr_colorbar(): void;
  _gr_inqcolorfromrgb(_0: number, _1: number, _2: number): number;
  _gr_hsvtorgb(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): void;
  _gr_validaterange(_0: number, _1: number): number;
  _gr_beginprintext(_0: number, _1: number, _2: number, _3: number): void;
  _gr_inqborderwidth(_0: number): void;
  _gr_drawpath(_0: number, _1: number, _2: number, _3: number): void;
  _gr_setarrowstyle(_0: number): void;
  _gr_setshadow(_0: number, _1: number, _2: number): void;
  _gr_setcoordxform(_0: number): void;
  _gr_begingraphics(_0: number): void;
  _gr_endgraphics(): void;
  _gr_readimage(_0: number, _1: number, _2: number, _3: number): number;
  _gr_beginselection(_0: number, _1: number): void;
  _gr_endselection(): void;
  _gr_moveselection(_0: number, _1: number): void;
  _gr_resizeselection(_0: number, _1: number, _2: number): void;
  _gr_inqbbox(_0: number, _1: number, _2: number, _3: number): void;
  _gr_precision(): number;
  _gr_setregenflags(_0: number): void;
  _gr_inqregenflags(): number;
  _gr_shade(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number, _6: number, _7: number, _8: number): void;
  _gr_shadelines(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): void;
  _gr_path(_0: number, _1: number, _2: number, _3: number): void;
  _gr_setborderwidth(_0: number): void;
  _gr_inqbordercolorind(_0: number): void;
  _gr_inqclipxform(_0: number): void;
  _gr_importgraphics(_0: number): number;
  _gks_get_dash_list(_0: number, _1: number, _2: number): void;
}

interface EmbindModule {
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
