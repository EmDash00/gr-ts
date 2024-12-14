import libGR from "./libgr.js";
import { assertEqualLength, getContainer, getLength } from "./util.js";
import ModuleConfig from "./module.js";
import { COLOR_MODEL, GRM_EVENT, } from "./constants.js";
const Module = (await libGR(ModuleConfig));
function create_default_canvas(canvasID) {
    console.log("gr.js: will auto create canvas object");
    const tempHtml = '<canvas id="' + canvasID + '" width="500" height="500"></canvas>';
    const tempElem = document.createElement("canvas");
    tempElem.innerHTML = tempHtml;
    document.getElementsByTagName("body")[0].appendChild(tempElem.firstChild);
}
var MemType;
(function (MemType) {
    MemType[MemType["I8"] = 0] = "I8";
    MemType[MemType["U8"] = 1] = "U8";
    MemType[MemType["I16"] = 2] = "I16";
    MemType[MemType["U16"] = 3] = "U16";
    MemType[MemType["I32"] = 4] = "I32";
    MemType[MemType["U32"] = 5] = "U32";
    MemType[MemType["I64"] = 6] = "I64";
    MemType[MemType["U64"] = 7] = "U64";
    MemType[MemType["F32"] = 8] = "F32";
    MemType[MemType["F64"] = 9] = "F64";
})(MemType || (MemType = {}));
const HEAP_MAP = {
    [MemType.I8]: Module.HEAP8,
    [MemType.U8]: Module.HEAPU8,
    [MemType.I16]: Module.HEAP16,
    [MemType.U16]: Module.HEAPU16,
    [MemType.I32]: Module.HEAP32,
    [MemType.U32]: Module.HEAPU32,
    [MemType.I64]: Module.HEAP64,
    [MemType.U64]: Module.HEAPU64,
    [MemType.F32]: Module.HEAPF32,
    [MemType.F64]: Module.HEAPF64,
};
const MEMTYPE_SIZE = {
    [MemType.I8]: 1,
    [MemType.U8]: 1,
    [MemType.I16]: 2,
    [MemType.U16]: 2,
    [MemType.I32]: 4,
    [MemType.U32]: 4,
    [MemType.I64]: 8,
    [MemType.U64]: 8,
    [MemType.F32]: 4,
    [MemType.F64]: 8,
};
/**
 * Preallocated memory pool for buffers.
 */
class MemoryPool {
    _capacity;
    _memtype;
    _ptr;
    static MAX_SIZE_BYTES = 1048576 * 16; // 16 MiB
    constructor(capacity, memtype) {
        this._capacity = capacity;
        this._memtype = memtype;
        this._ptr = Module._malloc(capacity * MEMTYPE_SIZE[memtype]);
    }
    get ptr() {
        return this._ptr;
    }
    get capacity_bytes() {
        return this._capacity * MEMTYPE_SIZE[this._memtype];
    }
    get capacity() {
        return this._capacity;
    }
    reserve(capacity) {
        let bytes = capacity * MEMTYPE_SIZE[this._memtype];
        if (bytes > MemoryPool.MAX_SIZE_BYTES) {
            bytes = Math.max(bytes, MemoryPool.MAX_SIZE_BYTES);
            console.log("Maximum buffer size of 16 MiB reached for GR plotting.");
        }
        this._ptr = Module._realloc(this._ptr, bytes);
    }
    copyFrom(container) {
        const N = Math.max(getLength(container));
        let array = this.asArray();
        for (let i = 0; i < N; i++) {
            if (i >= this.capacity) {
                this.grow();
                array = this.asArray();
            }
            array[i] = getContainer(container, i);
        }
    }
    grow() {
        this._capacity *= 2;
        const new_capacity_bytes = Math.max(this.capacity_bytes, MemoryPool.MAX_SIZE_BYTES);
        this._ptr = Module._realloc(this._ptr, new_capacity_bytes);
        if (!this._ptr) {
            throw new Error("Module._realloc failed. Out of memory?");
        }
    }
    asArray(index = 0, length = this.capacity) {
        const heap = HEAP_MAP[this._memtype];
        const byteSize = MEMTYPE_SIZE[this._memtype];
        const ptr = this._ptr / byteSize;
        return heap.subarray(ptr + index, ptr + index + length);
    }
}
const F64_MEM_POOLS = Array.from({ length: 4 }, () => new MemoryPool(2048, MemType.F64));
export class GRCanvas {
    _original_canvas_size;
    _dpr;
    canvas;
    context;
    constructor(canvasID) {
        if (typeof canvasID == "undefined") {
            console.log("gr.js: no canvas name given. Will use default canvas with id 'canvas'");
            canvasID = "canvas";
        }
        if (document.getElementById(canvasID) == null) {
            console.log(`Unable to find canvas with ID '${canvasID}'. Creating...`);
            create_default_canvas(canvasID);
        }
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext("2d");
        this.context.save();
        /* Store the initial size of the canvas.
         * JSTerm uses style properties to set canvas width,
         * plain gr.js sets width and height of the canvas directly so
         * clientWidth and clientHeight
         * are used. */
        if (this.canvas.style.width && this.canvas.style.height) {
            this._original_canvas_size = [
                parseInt(this.canvas.style.width, 10),
                parseInt(this.canvas.style.height, 10),
            ];
        }
        else {
            this._original_canvas_size = [
                this.canvas.clientWidth,
                this.canvas.clientHeight,
            ];
        }
        this.select_canvas();
    }
    _set_dpr() {
        this._dpr = window.devicePixelRatio || 1;
        /* JSTerm uses multiple overlay canvases and replaces `this.canvas`.
         * Therefore, the `dpr` must be
         *  set and compared for each individual canvas.
         */
        if (!(this.canvas.id in Module.dpr_per_canvas) ||
            this._dpr !== Module.dpr_per_canvas[this.canvas.id]) {
            /* Set the size in memory
             * (https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#correcting_resolution_in_a_canvas)
             */
            this.canvas.width = this._original_canvas_size[0] * this._dpr;
            this.canvas.height = this._original_canvas_size[1] * this._dpr;
            this.context.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
            // Set the display size if not already set
            if (!(this.canvas.style.width && this.canvas.style.height)) {
                this.canvas.style.width = this._original_canvas_size[0] + "px";
                this.canvas.style.height = this._original_canvas_size[1] + "px";
            }
            Module.dpr = this._dpr;
            Module.dpr_per_canvas[this.canvas.id] = this._dpr;
        }
    }
    select_canvas() {
        Module.canvas = this.canvas;
        Module.context = this.context;
        this._set_dpr();
        //Module.set_dpr();
    }
    /**
     * Get the current display size.
     * Depending on the current workstation type, the current display might be the
     * primary screen (e.g. when using gksqt or GKSTerm) or a purely virtual display
     * (e.g. when using Cairo). When a high DPI screen is used as the current display,
     * width and height will be in logical pixels.
     *
     * @return `[mwidth, meight, width, height]` where:
     *  `mwidth` is the display width in meters
     *  `mheight` is the display height in meters
     *  `width` is the display width in pixels
     *  `height` is the display height in pixels
     */
    inqdspsize() {
        let _mwidth = Module._malloc(8);
        let _mheight = Module._malloc(8);
        let _width = Module._malloc(4);
        let _height = Module._malloc(4);
        gr_inqdspsize_c(_mwidth, _mheight, _width, _height);
        let result = [
            Module.HEAPF64.subarray(_mwidth / 8, _mwidth / 8 + 1)[0],
            Module.HEAPF64.subarray(_mheight / 8, _mheight / 8 + 1)[0],
            Module.HEAP32.subarray(_width / 4, _width / 4 + 1)[0],
            Module.HEAP32.subarray(_height / 4, _height / 4 + 1)[0],
        ];
        freearray(_mwidth);
        freearray(_mheight);
        freearray(_width);
        freearray(_height);
        return result;
    }
    open_gks() {
        gr_opengks_c();
    }
    close_gks() {
        gr_closegks_c();
    }
    /**
     * Open a graphical workstation
     *
     * @param{number} workstation_id - A workstation identifier.
     * @param{string} connection - A connection identifier
     * @param{number} type - The desired workstation type.
     */
    openws(workstation_id, connection, type) {
        let _connection = uint8arrayfromstring(connection);
        gr_openws_c(workstation_id, _connection, type);
        freearray(_connection);
    }
    /**
     * Close the specified graphical workstation
     *
     * @param{number} workstation_id - A workstation identifier.
     */
    closews(workstation_id) {
        gr_closews_c(workstation_id);
    }
    /**
     * Activate the specified graphical workstation
     *
     * @param{number} workstation_id - A workstation identifier.
     */
    activatews(workstation_id) {
        gr_activatews_c(workstation_id);
    }
    /**
     * Deactivate the specified graphical workstation
     *
     * @param{number} workstation_id - A workstation identifier.
     */
    deactivatews(workstation_id) {
        gr_deactivatews_c(workstation_id);
    }
    clearws() {
        gr_clearws_c();
    }
    updatews() {
        gr_updatews_c();
    }
    /**
     * Draw a polyline using the current line attributes, starting from the
     * first data point and ending at the last data point.
     * @param {number[]} x - An array of the x coordinates.
     * @param {number[]} y - An array of the y coordinates.
     */
    polyline(x, y) {
        const n = assertEqualLength(x, y);
        const _x = floatarray(x, 0);
        const _y = floatarray(y, 1);
        this.select_canvas();
        gr_polyline_c(n, _x, _y);
    }
    /**
     * Draw marker symbols centered at the given data points.
     * @param {number[]} x - An array of the x coordinates.
     * @param {number[]} y - An array of the y coordinates.
     */
    polymarker(x, y) {
        const n = assertEqualLength(x, y);
        const _x = floatarray(x, 0);
        const _y = floatarray(y, 1);
        this.select_canvas();
        gr_polymarker_c(n, _x, _y);
    }
    text = function (x, y, str) {
        this.select_canvas();
        let _string = uint8arrayfromstring(str);
        gr_text_c(x, y, _string);
        freearray(_string);
    };
    inqtext(x, y, str) {
        let _string = uint8arrayfromstring(str);
        let _tbx = Module._malloc(8 * 4);
        let _tby = Module._malloc(8 * 4);
        gr_inqtext_c(x, y, _string, _tbx, _tby);
        let result = [
            Array.prototype.slice.call(Module.HEAPF64.subarray(_tbx / 8, _tbx / 8 + 4)),
            Array.prototype.slice.call(Module.HEAPF64.subarray(_tby / 8, _tby / 8 + 4)),
        ];
        freearray(_string);
        freearray(_tbx);
        freearray(_tby);
        return result;
    }
    /**
     * Allows you to specify a polygonal shape of an area to be filled.
     *
     * The attributes that control the appearance of fill areas are fill area interior
     * style, fill area style index and fill area color index.
     *
     * @param {ArrayLike<number> | NdArray} x - A list containing the X coordinates.
     * @param {ArrayLike<number> | NdArray} y - A list containing the Y coordinates.
     */
    fillarea(x, y) {
        const n = assertEqualLength(x, y);
        const _x = floatarray(x, 0);
        const _y = floatarray(y, 1);
        this.select_canvas();
        gr_fillarea_c(n, _x, _y);
    }
    /**
     * Display rasterlike images in a device-independent manner. The cell array
     * function partitions a rectangle given by two corner points into DIMX X DIMY
     * cells, each of them colored individually by the corresponding color index
     * of the given cell array.
     * @param{number} xmin - Lower left edge of the image.
     * @param{number} xmax - Lower right edge of the image.
     * @param{number} ymin - Upper left edge of the image.
     * @param{number} ymax - Upper right edge of the image.
     * @param{number} dimx - X dimension of the color index array.
     * @param{number} dimy - Y dimension of the color index array.
     * @param{ArrayLike<number> | NdArray} color - Color index array.
     */
    cellarray(xmin, xmax, ymin, ymax, dimx, dimy, color) {
        this.select_canvas();
        const _color = intarray(color);
        gr_cellarray_c(xmin, xmax, ymin, ymax, dimx, dimy, 1, 1, dimx, dimy, _color);
        freearray(_color);
    }
    /**
     * Generate a cubic spline-fit, starting from the first data point and
     * ending at the last data point.
     * @param{ArrayLike<number> | NdArray} px - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} py - A list containing the y coordinates.
     * @param{number} m - The number of points to be drawn (`m` > `px.length`).
     * @param{SPLINE_SMOOTHING} method - The smoothing method.
     *
     * The values for `x` and `y` are in world coordinates. The attributes that
     * control the appearance of a spline-fit are linetype, linewidth and color
     * index.
     */
    spline(px, py, m, method) {
        const n = assertEqualLength(px, py);
        const _px = floatarray(px, 0);
        const _py = floatarray(py, 1);
        this.select_canvas();
        gr_spline_c(n, _px, _py, m, method);
    }
    /**
     * Interpolate data from arbitrary points at points on a rectangular grid.
     *
     * @param{ArrayLike<number> | NdArray} xd -
     *  A list containing the X coordinates of the input points.
     * @param{ArrayLike<number> | NdArray} yd -
     *  A list containing the Y coordinates of the input points.
     * @param{ArrayLike<number> | NdArray} zd -
     *  A list containing the Z coordinates of the input points.
     * @param{number} nx - The number of points in the X direction for the output grid.
     * @param{number} ny - The number of points in the Y direction for the output grid.
     *
     * @return `[x, y, z]` where `x` and `y` are lists containing the points
     * in the X and Y direction in the output grid and `z` a list containing the
     * interpolated values on the `nx` x `ny` grid points.
     */
    gridit(xd, yd, zd, nx, ny) {
        const nd = assertEqualLength(xd, yd, zd);
        const _xd = floatarray(xd, 0);
        const _yd = floatarray(yd, 1);
        const _zd = floatarray(zd, 2);
        const _x = Module._malloc(nx * 8);
        const x = Module.HEAPF64.subarray(_x / 8, _x / 8 + nx);
        const _y = Module._malloc(ny * 8);
        const y = Module.HEAPF64.subarray(_y / 8, _y / 8 + ny);
        const _z = Module._malloc(nx * ny * 8);
        const z = Module.HEAPF64.subarray(_z / 8, _z / 8 + nx * ny);
        this.select_canvas();
        gr_gridit_c(nd, _xd, _yd, _zd, nx, ny, _x, _y, _z);
        const result = [
            new Float64Array(new ArrayBuffer(nx * 8)),
            new Float64Array(new ArrayBuffer(ny * 8)),
            new Float64Array(new ArrayBuffer(nx * ny * 8)),
        ];
        result[0].set(x);
        result[1].set(y);
        result[2].set(z);
        return result;
    }
    /**
     * Set the line style for polylines.
     * @param{LINETYPE} linetype - The polyline type to apply.
     */
    setlinetype(linetype) {
        gr_setlinetype_c(linetype);
    }
    /**
     * Get the line style for polylines.
     */
    inqlinetype() {
        const _ltype = Module._malloc(4);
        gr_inqlinetype_c(_ltype);
        const result = Module.HEAP32.subarray(_ltype / 4, _ltype / 4 + 1)[0];
        freearray(_ltype);
        return result;
    }
    /**
     * Set the line width of subsequent polyline output primitives.
     *
     * The line width is calculated as the nominal line width generated
     * on the workstation multiplied by the line width scale factor.
     * This value is mapped by the workstation to the nearest available line width.
     * The default line width is 1.0, or 1 times the line width generated on the
     * graphics device.
     *
     * @param{number} width - The polyline line width scale factor.
     */
    setlinewidth(width) {
        gr_setlinewidth_c(width);
    }
    inqlinewidth() {
        const _width = Module._malloc(8);
        gr_inqlinewidth_c(_width);
        const result = Module.HEAPF64.subarray(_width / 8, _width / 8 + 1)[0];
        freearray(_width);
        return result;
    }
    /**
     * Set the color of subsequent line output primitives.
     *
     * @param{number} colorind - The line color index (`colorind` < 1256).
     */
    setlinecolorind(colorind) {
        gr_setlinecolorind_c(colorind);
    }
    /**
     * Get the current line color.
     */
    inqlinecolorind() {
        const _coli = Module._malloc(4);
        gr_inqlinecolorind_c(_coli);
        const result = Module.HEAP32.subarray(_coli / 4, _coli / 4 + 1)[0];
        freearray(_coli);
        return result;
    }
    /**
     * Set the marker type for polymarkers.
     * @param{MARKERTYPE} markertype - The polymarker type to use.
     */
    setmarkertype(markertype) {
        gr_setmarkertype_c(markertype);
    }
    /**
     * Get the marker type for polymarkers.
     */
    inqmarkertype() {
        const _mtype = Module._malloc(4);
        gr_inqmarkertype_c(_mtype);
        const result = Module.HEAP32.subarray(_mtype / 4, _mtype / 4 + 1)[0];
        freearray(_mtype);
        return result;
    }
    /**
     * Set the size of the markersize for polymarkers.
     *
     * The polymarker size is calculated as the nominal size generated
     * on the graphics device multiplied by the marker size scale factor.
     *
     * @param{number} markersize -
     *  The scale factor to apply to the nominal marker size.
     */
    setmarkersize(markersize) {
        gr_setmarkersize_c(markersize);
    }
    /**
     * Set the color of subsequent polymarker output primitives.
     *
     * @param{number} colorind - The polymarker color index (`colorind` < 1256).
     */
    setmarkercolorind(colorind) {
        gr_setmarkercolorind_c(colorind);
    }
    /**
     * Specify the text font and precision for subsequent text output primitives.
     * @param{FONT} font - Text font.
     * @param{precision} font - Text precision.
     */
    settextfontprec(font, precision) {
        gr_settextfontprec_c(font, precision);
    }
    /**
     * Get the color of polymarker output primitives.
     */
    inqmarkercolorind() {
        const _coli = Module._malloc(4);
        gr_inqmarkercolorind_c(_coli);
        const result = Module.HEAP32.subarray(_coli / 4, _coli / 4 + 1)[0];
        freearray(_coli);
        return result;
    }
    /**
     * Set the current character expansion factor (width to height ratio).
     *
     * `setcharexpan` defines the width of subsequent text output primitives.
     * The expansion factor alters the width of the generated characters, but not
     * their height. The default text expansion factor is 1, or one times the
     * normal width-to-height ratio of the text.
     *
     * @param{number} factor -
     *  The text expansion factor applied to the nominal text width-to-height ratio.
     */
    setcharexpan(factor) {
        gr_setcharexpan_c(factor);
    }
    setcharspace(factor) {
        gr_setcharspace_c(factor);
    }
    /**
     * Set the color of subsequent text output primitives.
     *
     * @param{number} colorind - The text color index (`colorind` < 1256).
     */
    settextcolorind(colorind) {
        gr_settextcolorind_c(colorind);
    }
    /**
     * Set the current character height.
     *
     * `setcharheight` defines the height of subsequent text output primitives.
     * Text height is defined as a percentage of the default window. GR uses the
     * default text height of 0.027 (2.7% of the height of the default window).
     *
     * @param{number} height - Text height value.
     */
    setcharheight(height) {
        gr_setcharheight_c(height);
    }
    /**
     * Set the current character text angle up vector.
     * `setcharup` defines the vertical rotation of subsequent text output primitives.
     * The text up vector is initially set to (0, 1), horizontal to the baseline.
     *
     * @param{number} ux - Text up vector x component.
     * @param{number} uy - Text up vector y component.
     */
    setcharup(ux, uy) {
        gr_setcharup_c(ux, uy);
    }
    /**
     * Set the direction in which subsequent text will be draw.
     *
     * @param{TEXT_PATH} textPath - The text path.
     */
    settextpath(textPath) {
        gr_settextpath_c(textPath);
    }
    /**
     * Set the current horizontal and vertical alignment for text.
     *
     * `settextalign` specifies how the characters in a text primitive will be aligned
     * in horizontal and vertical space. The default text alignment indicates
     * horizontal left alignment and vertical baseline alignment.
     *
     * @param{TEXT_HALIGN} halign - Horizontal text alignment.
     * @param{TEXT_VALIGN} valign - Vertical text alignment.
     */
    settextalign(halign, valign) {
        gr_settextalign_c(halign, valign);
    }
    /**
     * Set the fill area interior style to be used for fill areas.
     * The default interior style is HOLLOW.
     *
     * @param{FILL_INTSTYLE} style - The style of fill to use.
     */
    setfillintstyle(style) {
        gr_setfillintstyle_c(style);
    }
    /**
     * Sets the fill style to be used for subsequent fill areas.
     *
     * `setfillstyle` specifies an index when PATTERN fill or HATCH fill is requested
     * by the `setfillintstyle` function. If the interior style is set to PATTERN, the
     * fill style index points to a device-independent pattern table. If interior style
     * is set to HATCH the fill style index indicates different hatch styles. If HOLLOW
     * or SOLID is specified for the interior style, the fill style index is unused.
     *
     * @param{number} index - The fill style index to use.
     */
    setfillstyle(index) {
        gr_setfillstyle_c(index);
    }
    /**
     * Set the color of subsequent fill area output primitives.
     *
     * @param{number} colorind - The fill area color index (`colorind` < 1256).
     */
    setfillcolorind(colorind) {
        gr_setfillcolorind_c(colorind);
    }
    setcolorrep(colorind, red, green, blue) {
        gr_setcolorrep_c(colorind, red, green, blue);
    }
    /**
     * Sets the type of transformation to be used for subsequent GR output
     * primitives.
     *
     * The options may be or'ed together. GR uses these options for all
     * subsequent output primitives until another value is provided. The scale options
     * are used to transform points from an abstract logarithmic or semi-logarithmic
     * coordinate system, which may be flipped along each axis, into the world
     * coordinate system.
     *
     * @param{SCALE_OPTION} scale - Scale specification.
     */
    setscale(scale) {
        return gr_setscale_c(scale);
    }
    /**
     * Get the current type of transformation used for GR output primitives.
     */
    inqscale() {
        const _options = Module._malloc(4);
        gr_inqscale_c(_options);
        const result = Module.HEAP32.subarray(_options / 4, _options / 4 + 1)[0];
        freearray(_options);
        return result;
    }
    /**
     * Establish a window, or rectangular subspace, of world coordinates to be
     * plotted. If you desire log scaling or mirror-imaging of axes, use the
     * SETSCALE function.
     *
     * `setwindow` defines the rectangular portion of the World Coordinate
     * space (WC) to be associated with the specified normalization
     * transformation. The WC window and the Normalized Device Coordinates
     * (NDC) viewport define the normalization transformation through which
     * all output primitives are mapped. The WC window is mapped onto the
     * rectangular NDC viewport which is, in turn, mapped onto the display surface
     * of the open and active workstation, in device coordinates. By default,
     * GR uses the range [0,1] x [0,1], in world coordinates, as the normalization
     * transformation window.
     *
     * @param{number} xmin - The left horizontal coordinate of the window
     *  (`xmin` < `xmax`).
     * @param{number} xmax - The right horizontal coordinate of the window
     *  (`xmin` < `xmax`).
     * @param{number} ymin - The bottom vertical coordinate of the window
     *  (`ymin` < `ymax`).
     * @param{number} ymax - The top vertical coordinate of the window
     *  (`xmin` < `xmax`).
     */
    setwindow(xmin, xmax, ymin, ymax) {
        gr_setwindow_c(xmin, xmax, ymin, ymax);
    }
    /**
     * Get the window, or rectangular subspace, of world coordinates being
     * plotted.
     */
    inqwindow() {
        const _xmin = Module._malloc(8);
        const _xmax = Module._malloc(8);
        const _ymin = Module._malloc(8);
        const _ymax = Module._malloc(8);
        gr_inqwindow_c(_xmin, _xmax, _ymin, _ymax);
        const result = [
            Module.HEAPF64.subarray(_xmin / 8, _xmin / 8 + 1)[0],
            Module.HEAPF64.subarray(_xmax / 8, _xmax / 8 + 1)[0],
            Module.HEAPF64.subarray(_ymin / 8, _ymin / 8 + 1)[0],
            Module.HEAPF64.subarray(_ymax / 8, _ymax / 8 + 1)[0],
        ];
        freearray(_xmin);
        freearray(_xmax);
        freearray(_ymin);
        freearray(_ymax);
        return result;
    }
    /**
     * Establish a rectangular subspace of normalized device coordinates.
     *
     * `setviewport` defines the rectangular portion of the Normalized Device
     * Coordinate (NDC) space to be associated with the specified normalization
     * transformation. The NDC viewport and World Coordinate (WC) window define
     * the normalization transformation through which all output primitives pass.
     * The WC window is mapped onto the rectangular NDC viewport which is, in turn,
     * mapped onto the display surface of the open and active
     * workstation, in device coordinates.
     *
     * @param{number} xmin - The left horizontal coordinate of the viewport.
     *  (`xmin` < `xmax`).
     * @param{number} xmax - The right horizontal coordinate of the viewport.
     *  (`xmin` < `xmax`).
     * @param{number} ymin - The bottom vertical coordinate of the viewport.
     *  (`ymin` < `ymax`).
     * @param{number} ymax - The top vertical coordinate of the viewport.
     *  (`xmin` < `xmax`).
     */
    setviewport(xmin, xmax, ymin, ymax) {
        gr_setviewport_c(xmin, xmax, ymin, ymax);
    }
    /**
     * Get the rectangular subspace of normalized device coordinates.
     */
    inqviewport() {
        const _xmin = Module._malloc(8);
        const _xmax = Module._malloc(8);
        const _ymin = Module._malloc(8);
        const _ymax = Module._malloc(8);
        gr_inqviewport_c(_xmin, _xmax, _ymin, _ymax);
        const result = [
            Module.HEAPF64.subarray(_xmin / 8, _xmin / 8 + 1)[0],
            Module.HEAPF64.subarray(_xmax / 8, _xmax / 8 + 1)[0],
            Module.HEAPF64.subarray(_ymin / 8, _ymin / 8 + 1)[0],
            Module.HEAPF64.subarray(_ymax / 8, _ymax / 8 + 1)[0],
        ];
        freearray(_xmin);
        freearray(_xmax);
        freearray(_ymin);
        freearray(_ymax);
        return result;
    }
    selntran(transform) {
        gr_selntran_c(transform);
    }
    /**
     * Set the clipping indicator.
     *
     * Clipping is defined as the removal of those portions of the graph that lie
     * outside of the defined viewport. If clipping is on, GR does not draw generated
     * output primitives past the viewport boundaries. If clipping is off, primitives
     * may exceed the viewport boundaries, and they will be drawn to the edge of the
     * workstation window. By default, clipping is on.
     */
    setclip(enableClipping) {
        gr_setclip_c(+enableClipping);
    }
    /**
     * Set the area of the NDC viewport that is to be drawn in the workstation window.
     *
     * `setwswindow` defines the rectangular area of the Normalized Device Coordinate
     * space (NDC) to output to the device. By default, the workstation transformation
     * will map the range [0,1] x [0,1] in NDC onto the largest square on the
     * workstation’s display surface. The aspect ratio of the workstation window is
     * maintained at 1 to 1.
     *
     * @param{number} xmin - The left horizontal coordinate of the window
     *  (`xmin` < `xmax`).
     * @param{number} xmax - The right horizontal coordinate of the window
     *  (`xmin` < `xmax`).
     * @param{number} ymin - The bottom vertical coordinate of the window
     *  (`ymin` < `ymax`).
     * @param{number} ymax - The top vertical coordinate of the window
     *  (`xmin` < `xmax`).
     */
    setwswindow(xmin, xmax, ymin, ymax) {
        gr_setwswindow_c(xmin, xmax, ymin, ymax);
    }
    /**
     * Define the size of the workstation graphics window in meters.
     *
     * `setwsviewport` places a workstation window on the display of the specified
     * size in meters. This command allows the workstation window to be accurately
     * sized for a display or hardcopy device, and is often useful for sizing graphs
     * for desktop publishing applications.
     *
     * @param{number} xmin -
     *  The left horizontal coordinate of the workstation viewport. (`xmin` < `xmax`).
     * @param{number} xmax -
     *  The right horizontal coordinate of the workstation viewport. (`xmin` < `xmax`).
     * @param{number} ymin -
     *  The bottom vertical coordinate of the workstation viewport. (`ymin` < `ymax`).
     * @param{number} ymax -
     *  The top vertical coordinate of the workstation viewport. (`xmin` < `xmax`).
     */
    setwsviewport(xmin, xmax, ymin, ymax) {
        gr_setwsviewport_c(xmin, xmax, ymin, ymax);
    }
    createseg(segment) {
        gr_createseg_c(segment);
    }
    copysegws(segment) {
        gr_copysegws_c(segment);
    }
    redrawsegws() {
        gr_redrawsegws_c();
    }
    setsegtran(segment, fx, fy, transx, transy, phi, scalex, scaley) {
        gr_setsegtran_c(segment, fx, fy, transx, transy, phi, scalex, scaley);
    }
    closeseg() {
        gr_closeseg_c();
    }
    emergencyclosegks() {
        gr_emergencyclosegks_c();
    }
    updategks() {
        gr_updategks_c();
    }
    /**
     * Set the abstract Z-space used for mapping three-dimensional output primitives
     * into the current world coordinate space.
     *
     * `setspace` establishes the limits of an abstract Z-axis and defines the angles
     * for rotation and for the viewing angle (tilt) of a simulated three-dimensional
     * graph, used for mapping corresponding output primitives into the current window.
     * These settings are used for all subsequent three-dimensional output primitives
     * until other values are specified. Angles of rotation and viewing angle must be
     * specified between 0° and 90°.
     *
     * @param{number} zmin - Minimum value for the Z-axis.
     * @param{number} zmax - Maximum value for the Z-axis.
     * @param{number} rotation - Angle for the rotation of the X-axis, in degrees.
     * @param{number} tilt - Viewing angle for the Z-axis, in degrees.
     */
    setspace(zmin, zmax, rotation, tilt) {
        gr_setspace_c(zmin, zmax, rotation, tilt);
    }
    /**
     * Get the abstract Z-space used for mapping three-dimensional output primitives
     * into the current world coordinate space.
     *
     * @return `[zmin, zmax, rotation, tilt]` where:
     * `zmin` is the minimum value for the Z-axis.
     * `zmax` is the maximum value for the Z-axis.
     * `rotation` is angle of rotation of the X-axis, in degrees.
     * `tilt` is Viewing angle for the Z-axis, in degrees.
     */
    inqspace() {
        const _zmin = Module._malloc(8);
        const _zmax = Module._malloc(8);
        const _rotation = Module._malloc(4);
        const _tilt = Module._malloc(4);
        gr_inqspace_c(_zmin, _zmax, _rotation, _tilt);
        const result = [
            Module.HEAPF64.subarray(_zmin / 8, _zmin / 8 + 1)[0],
            Module.HEAPF64.subarray(_zmax / 8, _zmax / 8 + 1)[0],
            Module.HEAP32.subarray(_rotation / 4, _rotation / 4 + 1)[0],
            Module.HEAP32.subarray(_tilt / 4, _tilt / 4 + 1)[0],
        ];
        freearray(_zmin);
        freearray(_zmax);
        freearray(_rotation);
        freearray(_tilt);
        return result;
    }
    /**
     * Draw a text at position `x`, `y` using the current text attributes.
     * Strings can be defined to create basic mathematical expressions and
     * Greek letters.
     *
     * The values for X and Y are in normalized device coordinates.
     * The attributes that control the appearance of text are text font and precision,
     * character expansion factor, character spacing, text color index, character
     * height, character up vector, text path and text alignment.
     *
     * The character string is interpreted to be a simple mathematical formula.
     * The following notations apply:
     *
     * Subscripts and superscripts: These are indicated by carets ('^') and
     * underscores ('_'). If the sub/superscript contains more than one character,
     * it must be enclosed in curly braces ('{}').
  
     * Fractions are typeset with A '/' B, where A stands for the numerator and
     * B for the denominator.
  
      To include a Greek letter you must specify the corresponding keyword after a
      backslash ('\') character. The text translator produces uppercase or lowercase
      Greek letters depending on the case of the keyword.
     * @param{number} x - The x coordinate of the text string in world coordinates.
     * @param{number} y - The y coordinate of the text string in world coordinates.
     * @param{string} str - The text to be drawn.
     */
    textext(x, y, str) {
        const _string = uint8arrayfromstring(str);
        gr_textext_c(x, y, _string);
        freearray(_string);
    }
    inqtextext(x, y, str) {
        const _string = uint8arrayfromstring(str);
        const _tbx = Module._malloc(8 * 4);
        const _tby = Module._malloc(8 * 4);
        gr_inqtextext_c(x, y, _string, _tbx, _tby);
        const result = [
            Array.prototype.slice.call(Module.HEAPF64.subarray(_tbx / 8, _tbx / 8 + 4)),
            Array.prototype.slice.call(Module.HEAPF64.subarray(_tby / 8, _tby / 8 + 4)),
        ];
        freearray(_string);
        freearray(_tbx);
        freearray(_tby);
        return result;
    }
    /**
     * Specify the format to be used when scientific notation is used.
     * @param{SCIENTIFIC_FORMAT_OPTION} format - The format option to use.
     */
    setscientificformat(format) {
        gr_setscientificformat_c(format);
    }
    /**
     * Draw X and Y coordinate axes with linear and/or logarithmically spaced
     * tick marks.
     *
     * Tick marks are positioned along each axis so that major tick marks fall
     * on the axes origin (whether visible or not). Major tick marks are labeled
     * with the corresponding data values. Axes are drawn according to the scale
     * of the window. Axes and tick mark are drawn using solid lines; line color
     * and width can be modified using the `setlinetype` and `setlinewidth` functions.
     * Axes are drawn according to the linear or logarithmic transformation
     * established by the `setscale` function.
  
     * @param{number} x_tick - The interval between minor x ticks.
     *
     * @param{number} y_tick - The interval between minor y ticks.
     *
     * @param{number} x_org - The world coordinate of the origin (point of)
     *  intersection of the X axis.
     *
     * @param{number} y_org - The world coordinate of the origin (point of)
     *  intersection of the Y axis.
     *
     * @param{number} major_x -
     *  Unitless integer values specifying the number of minor tick intervals
     *  between major X tick marks. Values of 0 or 1 imply no minor ticks.
     *  Negative values specify no labels will be drawn for the associated axis.
     *
     * @param{number} major_y -
     *  Unitless integer values specifying the number of minor tick intervals
     *  between major Y tick marks. Values of 0 or 1 imply no minor ticks.
     *  Negative values specify no labels will be drawn for the associated axis.
     *
     * @param{number} tick_size -
     *  The length of minor tick marks specified in a normalized device
     *  coordinate unit. Major tick marks are twice as long as minor tick marks.
     *  A negative value reverses the tick marks on the axes from inward facing
     *  to outward facing (or vice versa).
     *
     */
    axes(x_tick, y_tick, x_org, y_org, major_x, major_y, tick_size) {
        gr_axes_c(x_tick, y_tick, x_org, y_org, major_x, major_y, tick_size);
    }
    /**
     * Draw a linear and/or logarithmic grid.
     *
     * Major grid lines correspond to the axes origin and major tick marks
     * whether visible or not. Minor grid lines are drawn at points equal
     * to minor tick marks. Major grid lines are drawn using black lines
     * and minor grid lines are drawn using gray lines.
     *
     * @param{number} x_tick -
     *  The length in world coordinates of the interval between minor grid
     *  x lines.
     *
     * @param{number} y_tick -
     *  The length in world coordinates of the interval between minor grid
     *  y lines.
     *
     * @param{number} x_org -
     *  The x coordinate of the origin (point of intersection) of the grid
     *
     * @param{number} y_org -
     *  The y coordinate of the origin (point of intersection) of the grid
     *
     * @param{number} major_x -
     *  Unitless integer values specifying the number of minor grid x lines
     *  between major grid lines. Values of 0 or 1 imply no grid lines.
     *
     * @param{number} major_y -
     *  Unitless integer values specifying the number of minor grid y lines
     *  between major grid lines. Values of 0 or 1 imply no grid lines.
     */
    grid(x_tick, y_tick, x_org, y_org, major_x, major_y) {
        gr_grid_c(x_tick, y_tick, x_org, y_org, major_x, major_y);
    }
    /**
     * Draw a standard vertical error bar graph.
     * @param{ArrayLike<number> | NdArray} px - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} py - A list containing the y coordinates.
     * @param{ArrayLike<number> | NdArray} e1 -
     *  The absolute values of the lower error bar data.
     * @param{ArrayLike<number> | NdArray} e2 -
     *  The absolute values of the upper error bar data.
     */
    verrorbars(px, py, e1, e2) {
        const n = assertEqualLength(px, py, e1, e2);
        const _px = floatarray(px, 0);
        const _py = floatarray(py, 1);
        const _e1 = floatarray(e1, 2);
        const _e2 = floatarray(e2, 3);
        this.select_canvas();
        gr_verrorbars_c(n, _px, _py, _e1, _e2);
    }
    /**
     * Draw a standard horizontal error bar graph.
     * @param{ArrayLike<number> | NdArray} px - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} py - A list containing the y coordinates.
     * @param{ArrayLike<number> | NdArray} e1 -
     *  The absolute values of the lower error bar data.
     * @param{ArrayLike<number> | NdArray} e2 -
     *  The absolute values of the upper error bar data.
     */
    herrorbars(px, py, e1, e2) {
        const n = assertEqualLength(px, py, e1, e2);
        const _px = floatarray(px, 0);
        const _py = floatarray(py, 1);
        const _e1 = floatarray(e1, 2);
        const _e2 = floatarray(e2, 3);
        gr_herrorbars_c(n, _px, _py, _e1, _e2);
    }
    /**
     * Draw a 3D curve using the current line attributes, starting from the
     * first data point and ending at the last data point.
     * @param {ArrayLike<number> | NdArray} px - An array of the x coordinates.
     * @param {ArrayLike<number> | NdArray} py - An array of the y coordinates.
     * @param {ArrayLike<number> | NdArray} pz - An array of the y coordinates.
     *
     * The values for `x`, `y` and `z` are in world coordinates. The attributes that
     * control the appearance of a polyline are linetype, linewidth and color
     * index.
     */
    polyline3d(px, py, pz) {
        const n = assertEqualLength(px, py, pz);
        const _px = floatarray(px, 0);
        const _py = floatarray(py, 1);
        const _pz = floatarray(pz, 2);
        gr_polyline3d_c(n, _px, _py, _pz);
    }
    /**
     * Draw X, Y, and Z coordinate axes with linear and/or logarithmically spaced
     * tick marks.
     *
     * Tick marks are positioned along each axis so that major tick marks fall
     * on the axes origin (whether visible or not). Major tick marks are labeled
     * with the corresponding data values. Axes are drawn according to the scale
     * of the window. Axes and tick mark are drawn using solid lines; line color
     * and width can be modified using the `setlinetype` and `setlinewidth` functions.
     * Axes are drawn according to the linear or logarithmic transformation
     * established by the `setscale` function.
  
     * @param{number} x_tick - The interval between minor x ticks.
     *
     * @param{number} y_tick - The interval between minor y ticks.
     *
     * @param{number} z_tick - The interval between minor z ticks.
     *
     * @param{number} x_org - The world coordinate of the origin (point of
     *  intersection) of the X axis.
     *
     * @param{number} y_org - The world coordinate of the origin (point of
     *  intersection) of the Y axis.
     *
     * @param{number} z_org - The world coordinate of the origin (point of
     *  intersection) of the Z axis.
     *
     * @param{number} major_x -
     *  Unitless integer values specifying the number of minor tick intervals
     *  between major X tick marks. Values of 0 or 1 imply no minor ticks.
     *  Negative values specify no labels will be drawn for the associated axis.
     *
     * @param{number} major_y -
     *  Unitless integer values specifying the number of minor tick intervals
     *  between major Y tick marks. Values of 0 or 1 imply no minor ticks.
     *  Negative values specify no labels will be drawn for the associated axis.
     *
     * @param{number} major_z -
     *  Unitless integer values specifying the number of minor tick intervals
     *  between major Z tick marks. Values of 0 or 1 imply no minor ticks.
     *  Negative values specify no labels will be drawn for the associated axis.
     *
     * @param{number} tick_size -
     *  The length of minor tick marks specified in a normalized device
     *  coordinate unit. Major tick marks are twice as long as minor tick marks.
     *  A negative value reverses the tick marks on the axes from inward facing
     *  to outward facing (or vice versa).
     *
     */
    axes3d(x_tick, y_tick, z_tick, x_org, y_org, z_org, major_x, major_y, major_z, tick_size) {
        gr_axes3d_c(x_tick, y_tick, z_tick, x_org, y_org, z_org, major_x, major_y, major_z, tick_size);
    }
    /**
     * Draw a linear and/or logarithmic grid.
     *
     * Major grid lines correspond to the axes origin and major tick marks
     * whether visible or not. Minor grid lines are drawn at points equal
     * to minor tick marks. Major grid lines are drawn using black lines
     * and minor grid lines are drawn using gray lines.
     *
     * @param{number} x_tick -
     *  The length in world coordinates of the interval between minor grid
     *  x lines.
     *
     * @param{number} y_tick -
     *  The length in world coordinates of the interval between minor grid
     *  y lines.
     *
     * @param{number} z_tick -
     *  The length in world coordinates of the interval between minor grid
     *  z lines.
     *
     * @param{number} x_org -
     *  The x coordinate of the origin (point of intersection) of the grid
     *
     * @param{number} y_org -
     *  The y coordinate of the origin (point of intersection) of the grid
     *
     * @param{number} z_org -
     *  The z coordinate of the origin (point of intersection) of the grid
     *
     * @param{number} major_x -
     *  Unitless integer values specifying the number of minor grid X lines
     *  between major grid lines. Values of 0 or 1 imply no grid lines.
     *
     * @param{number} major_y -
     *  Unitless integer values specifying the number of minor grid Y lines
     *  between major grid lines. Values of 0 or 1 imply no grid lines.
     *
     * @param{number} major_z -
     *  Unitless integer values specifying the number of minor grid Z lines
     *  between major grid lines. Values of 0 or 1 imply no grid lines.
     */
    grid3d(x_tick, y_tick, z_tick, x_org, y_org, z_org, major_x, major_y, major_z) {
        gr_grid3d_c(x_tick, y_tick, z_tick, x_org, y_org, z_org, major_x, major_y, major_z);
    }
    titles3d(x_title, y_title, z_title) {
        const _x_title = uint8arrayfromstring(x_title);
        const _y_title = uint8arrayfromstring(y_title);
        const _z_title = uint8arrayfromstring(z_title);
        gr_titles3d_c(_x_title, _y_title, _z_title);
        freearray(_x_title);
        freearray(_y_title);
        freearray(_z_title);
    }
    /**
     * Draw a three-dimensional surface plot for the given data points.
     * @param{ArrayLike<number> | NdArray} px - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} py - A list containing the y coordinates.
     * @param{ArrayLike<number> | NdArray} pz -
     *  A list of length `px.length` * `py.length` or an appropriately
     *  dimensioned array containing the z coordinates.
     * @param{SURFACE_OPTION} option - Surface display option.
     */
    surface(px, py, pz, option) {
        const Nx = getLength(px);
        const Ny = getLength(py);
        const Nz = getLength(pz);
        if (Nz != Nx * Ny) {
            throw Error("Sequences have incorrect length or dimension");
        }
        const _px = floatarray(px, 0);
        const _py = floatarray(py, 1);
        const _pz = floatarray(pz, 2);
        gr_surface_c(Nx, Ny, _px, _py, _pz, option);
    }
    /**
     * Draw contours of a three-dimensional data set whose values are specified
     * over a rectangular mesh. Contour lines may optionally be labeled.
     * @param{ArrayLike<number> | NdArray} px - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} py - A list containing the y coordinates.
     * @param{ArrayLike<number> | NdArray} h -
     *  A list containing the z coordinates for the height.
     * @param{ArrayLike<number> | NdArray} pz -
     *  A list of length `x.length` * `y.length` containing the z coordinates.
     * @param{number} major_h -
     *  Directs GR to label contour lines. For example, a value of 3 would label
     *  every third line. A value of 1 will label every line. A value of 0
     *  produces no labels. To produce colored contour lines, add an offset
     *  of 1000 to `major_h`.
     */
    contour(px, py, h, pz, major_h) {
        const Nx = getLength(px);
        const Ny = getLength(py);
        const Nz = getLength(pz);
        const Nh = getLength(h);
        if (Nz != Nx * Ny) {
            throw Error("Sequences have incorrect length or dimension");
        }
        const _px = floatarray(px, 0);
        const _py = floatarray(py, 1);
        const _h = floatarray(h, 2);
        const _pz = floatarray(pz, 3);
        this.select_canvas();
        gr_contour_c(Nx, Ny, Nh, _px, _py, _h, _pz, major_h);
    }
    hexbin(n, x, y, nbins) {
        const _x = floatarray(x, 0);
        const _y = floatarray(y, 1);
        const cntmax = gr_hexbin_c(n, _x, _y, nbins);
        return cntmax;
    }
    /**
     * Set the current GR colormap.
     * For a list of built-in colormaps, see https://gr-framework.org/colormaps.html.
     * @param{COLORMAP} colormap - The colormap to use.
     */
    setcolormap(colormap) {
        gr_setcolormap_c(colormap);
    }
    /**
     * Get the current GR colormap.
     */
    inqcolormap() {
        const _index = Module._malloc(4);
        gr_inqcolormap_c(_index);
        const result = Module.HEAP32.subarray(_index / 4, _index / 4 + 1)[0];
        freearray(_index);
        return result;
    }
    colorbar() {
        gr_colorbar_c();
    }
    inqcolor(color) {
        const _rgb = Module._malloc(4);
        gr_inqcolor_c(color, _rgb);
        const result = Module.HEAP32.subarray(_rgb / 4, _rgb / 4 + 1)[0];
        freearray(_rgb);
        return result;
    }
    inqcolorfromrgb(red, green, blue) {
        return gr_inqcolorfromrgb_c(red, green, blue);
    }
    hsvtorgb(h, s, v) {
        const _r = Module._malloc(8);
        const _g = Module._malloc(8);
        const _b = Module._malloc(8);
        gr_hsvtorgb_c(h, s, v, _r, _g, _b);
        const result = [
            Module.HEAPF64.subarray(_r / 8, _r / 8 + 1)[0],
            Module.HEAPF64.subarray(_g / 8, _g / 8 + 1)[0],
            Module.HEAPF64.subarray(_b / 8, _b / 8 + 1)[0],
        ];
        freearray(_r);
        freearray(_g);
        freearray(_b);
        return result;
    }
    tick(amin, amax) {
        return gr_tick_c(amin, amax);
    }
    validaterange(amin, amax) {
        return gr_validaterange_c(amin, amax);
    }
    adjustrange(amin, amax) {
        const _amin = floatarray([amin], 0);
        const _amax = floatarray([amax], 1);
        gr_adjustrange_c(_amin, _amax);
        amin = Module.HEAPF64[_amin / 8];
        amax = Module.HEAPF64[_amax / 8];
        return [amin, amax];
    }
    beginprint(pathname) {
        const _pathname = uint8arrayfromstring(pathname);
        gr_beginprint_c(_pathname);
        freearray(_pathname);
    }
    beginprintext(pathname, mode, format, orientation) {
        const _pathname = uint8arrayfromstring(pathname);
        const _mode = uint8arrayfromstring(mode);
        const _format = uint8arrayfromstring(format);
        const _orientation = uint8arrayfromstring(orientation);
        gr_beginprintext_c(_pathname, _mode, _format, _orientation);
        freearray(_pathname);
        freearray(_mode);
        freearray(_format);
        freearray(_orientation);
    }
    endprint() {
        gr_endprint_c();
    }
    ndctowc(x, y) {
        const __x = Module._malloc(8);
        const _x = Module.HEAPF64.subarray(__x / 8, __x / 8 + 1);
        _x[0] = x;
        const __y = Module._malloc(8);
        const _y = Module.HEAPF64.subarray(__y / 8, __y / 8 + 1);
        _y[0] = y;
        gr_ndctowc_c(__x, __y);
        const result = [_x[0], _y[0]];
        freearray(__x);
        freearray(__y);
        return result;
    }
    wctondc(x, y) {
        const __x = Module._malloc(8);
        const _x = Module.HEAPF64.subarray(__x / 8, __x / 8 + 1);
        _x[0] = x;
        const __y = Module._malloc(8);
        const _y = Module.HEAPF64.subarray(__y / 8, __y / 8 + 1);
        _y[0] = y;
        gr_wctondc_c(__x, __y);
        const result = [_x[0], _y[0]];
        freearray(__x);
        freearray(__y);
        return result;
    }
    /**
     * Draw a rectangle using the current line attributes.
     * @param{number} xmin - Lower left edge of the rectangle.
     * @param{number} xmax - Lower right edge of the rectangle.
     * @param{number} ymin - Upper left edge of the rectangle.
     * @param{number} ymax - Upper right edge of the rectangle.
     */
    drawrect(xmin, xmax, ymin, ymax) {
        gr_drawrect_c(xmin, xmax, ymin, ymax);
    }
    /**
     * Draw a filled rectangle using the current fill attributes.
     * @param{number} xmin - Lower left edge of the rectangle.
     * @param{number} xmax - Lower right edge of the rectangle.
     * @param{number} ymin - Upper left edge of the rectangle.
     * @param{number} ymax - Upper right edge of the rectangle.
     */
    fillrect(xmin, xmax, ymin, ymax) {
        gr_fillrect_c(xmin, xmax, ymin, ymax);
    }
    /**
     * Draw a circular or ellipitical arc using the current line attributes.
     * @param{number} xmin - Lower left edge of the rectangle.
     * @param{number} xmax - Lower right edge of the rectangle.
     * @param{number} ymin - Upper left edge of the rectangle.
     * @param{number} ymax - Upper right edge of the rectangle.
     * @param{number} a1 - The start angle.
     * @param{number} a2 - The end angle.
     */
    drawarc(xmin, xmax, ymin, ymax, a1, a2) {
        gr_drawarc_c(xmin, xmax, ymin, ymax, a1, a2);
    }
    /**
     * Fill a circular or elliptical filled rectangle using the current fill
     * attributes.
     * @param{number} xmin - Lower left edge of the rectangle.
     * @param{number} xmax - Lower right edge of the rectangle.
     * @param{number} ymin - Upper left edge of the rectangle.
     * @param{number} ymax - Upper right edge of the rectangle.
     * @param{number} a1 - The start angle.
     * @param{number} a2 - The end angle.
     */
    fillarc(xmin, xmax, ymin, ymax, a1, a2) {
        gr_fillarc_c(xmin, xmax, ymin, ymax, a1, a2);
    }
    // TODO: Check if this actually works...
    drawpath(n, vertices, codes, fill) {
        const _codes = uint8array(codes);
        const _vertices = vertexarray(vertices);
        gr_drawpath_c(n, _vertices, _codes, +fill);
        free_vertexarray(_vertices, vertices.length);
        freearray(_codes);
    }
    /**
     * Set the arrow style to be used for subsequent arrow commands.
     * @param{ARROWSTYLE} style - The arrow style to use.
     */
    setarrowstyle(style) {
        gr_setarrowstyle_c(style);
    }
    /**
     * Set the arrow size to be used for subsequent arrow commands.
     * The default arrow size is 1.
     * @param{number} size - The arrow size to be used.
     */
    setarrowsize(size) {
        gr_setarrowsize_c(size);
    }
    /**
     * Draw an arrow between two points.
     * @param{number} x1 - Starting x coordinate of the arrow (tail).
     * @param{number} y1 - Starting y coordinate of the arrow (tail).
     * @param{number} x2 - Ending x coordinate of the arrow (head).
     * @param{number} y2 - Ending y coordinate of the arrow (head).
     */
    drawarrow(x1, y1, x2, y2) {
        gr_drawarrow_c(x1, y1, x2, y2);
    }
    readimage(path) {
        const _path = uint8arrayfromstring(path);
        const _width = Module._malloc(4);
        const _height = Module._malloc(4);
        const _data = Module._malloc(4);
        gr_readimage_c(_path, _width, _height, _data);
        const result = [
            Module.HEAP32.subarray(_width / 4, _width / 4 + 1)[0],
            Module.HEAP32.subarray(_height / 4, _height / 4 + 1)[0],
            Module.HEAP32.subarray(_data / 4, _data / 4 + 1)[0],
        ];
        freearray(_path);
        freearray(_width);
        freearray(_height);
        freearray(_data);
        return result;
    }
    /**
     * Draw an image into a given rectangular area.
     * @param{number} xmin - Lower left edge of the image.
     * @param{number} xmax - Lower right edge of the image.
     * @param{number} ymin - Upper left edge of the image.
     * @param{number} ymax - Upper right edge of the image.
     * @param{number} width - The width of the image.
     * @param{number} height - The height of the image.
     * @param{number[]} data - An array of color values dimensioned by width and
     *   height.
     * @param{COLOR_MODEL} model - The color model to use
     *  (default: COLOR_MODEL.RGB).
     */
    drawimage(xmin, xmax, ymin, ymax, width, height, data, model = COLOR_MODEL.RGB) {
        this.select_canvas();
        const _data = intarray(data);
        gr_drawimage_c(xmin, xmax, ymin, ymax, width, height, _data, model);
        freearray(_data);
    }
    importgraphics(path) {
        const _path = uint8arrayfromstring(path);
        gr_importgraphics_c(_path);
        freearray(_path);
    }
    setshadow(offsetx, offsety, blur) {
        gr_setshadow_c(offsetx, offsety, blur);
    }
    settransparency(alpha) {
        gr_settransparency_c(alpha);
    }
    // TODO: ??? Wtf is this?
    setcoordxform(mat) {
        gr_setcoordxform(mat);
    }
    begingraphics(path) {
        const _path = uint8arrayfromstring(path);
        gr_begingraphics_c(_path);
        freearray(_path);
    }
    endgraphics() {
        gr_endgraphics();
    }
    drawgraphics(str) {
        const _string = uint8arrayfromstring(str);
        gr_drawgraphics_c(_string);
        freearray(_string);
    }
    /**
     * Generate a character string starting at the given location.
     * Strings can be  defined to create mathematical symbols and
     * Greek letters using LaTeX syntax.
     * @param{number} x - The x coordinate of the text string in world coordinates.
     * @param{number} y - The y coordinate of the text string in world coordinates.
     * @param{string} str - The text to be drawn.
     */
    mathtex(x, y, str) {
        const _string = uint8arrayfromstring(str);
        gr_mathtex_c(x, y, _string);
        freearray(_string);
    }
    beginselection(index, type) {
        gr_beginselection_c(index, type);
    }
    endselection() {
        gr_endselection_c();
    }
    moveselection(x, y) {
        gr_moveselection_c(x, y);
    }
    resizeselection(type, x, y) {
        gr_resizeselection_c(type, x, y);
    }
    inqbbox() {
        const _xmin = Module._malloc(8);
        const _xmax = Module._malloc(8);
        const _ymin = Module._malloc(8);
        const _ymax = Module._malloc(8);
        gr_inqbbox_c(_xmin, _xmax, _ymin, _ymax);
        const result = [
            Module.HEAPF64.subarray(_xmin / 8, _xmin / 8 + 1)[0],
            Module.HEAPF64.subarray(_xmax / 8, _xmax / 8 + 1)[0],
            Module.HEAPF64.subarray(_ymin / 8, _ymin / 8 + 1)[0],
            Module.HEAPF64.subarray(_ymax / 8, _ymax / 8 + 1)[0],
        ];
        freearray(_xmin);
        freearray(_xmax);
        freearray(_ymin);
        freearray(_ymax);
        return result;
    }
    precision() {
        return gr_precision_c();
    }
    setregenflags(flags) {
        gr_setregenflags_c(flags);
    }
    inqregenflags() {
        return gr_inqregenflags_c();
    }
    savestate() {
        gr_savestate_c();
    }
    restorestate() {
        gr_restorestate_c();
    }
    selectcontext(context) {
        gr_selectcontext_c(context);
    }
    destroycontext(context) {
        gr_destroycontext_c(context);
    }
    uselinespec(str) {
        const _string = uint8arrayfromstring(str);
        const result = gr_uselinespec_c(_string);
        freearray(_string);
        return result;
    }
    shade(x, y, lines, xform, roi, w, h) {
        const n = assertEqualLength(x, y, roi);
        const _x = floatarray(x, 0);
        const _y = floatarray(y, 1);
        const _roi = floatarray(roi, 2);
        const _bins = Module._malloc(w * h * 4);
        gr_shade_c(n, _x, _y, lines, xform, _roi, w, h, _bins);
        const result = Module.HEAP32.subarray(_bins / 4, _bins / 4 + w * h);
        freearray(_bins);
        return result;
    }
    /**
     * Display a point set as an aggregated and rasterized image. The values
     * for `x` and `y` are in world coordinates.
     *
     * @param{ArrayLike<number> | NdArray} x - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} y - A list containing the y coordinates.
     * @param{XFORM} xform - The transformation type to use for color mapping.
     * @param{[number, number]} dims - The size of the grid used for rasterization
     *  (default: `[1200, 1200]`)
     */
    shadepoints(x, y, xform, dims = [1200, 1200]) {
        const n = assertEqualLength(x, y);
        const _x = floatarray(x, 0);
        const _y = floatarray(y, 1);
        this.select_canvas();
        gr_shadepoints_c(_x, _y, xform, dims[0], dims[1]);
    }
    /**
     * Display a line set as an aggregated and rasterized image. The values
     * for `x` and `y` are in world coordinates.
     *
     * @param{ArrayLike<number> | NdArray} x - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} y - A list containing the y coordinates.
     * @param{XFORM} xform - The transformation type to use for color mapping.
     * @param{[number, number]} dims - The size of the grid used for rasterization
     *  (default: `[1200, 1200]`)
     */
    shadelines(x, y, xform, dims = [1200, 1200]) {
        const n = assertEqualLength(x, y);
        const _x = floatarray(x, 0);
        const _y = floatarray(y, 1);
        this.select_canvas();
        gr_shadelines_c(n, _x, _y, xform, dims[0], dims[1]);
    }
    /**
     * Set the pan and zoom attributes for the current window.
     * @param{number} x - The X coordinate of the pan/zoom point.
     * @param{number} y - The Y coordinate of the pan/zoom point.
     * @param{number} zoom - The zoom factor to be apply to the current window's scale.
     * @return An array of `[xmin, xmax, ymin, ymax]` specifying the new window
     *   after the requested zoom operation.
     */
    panzoom(x, y, zoom) {
        const _xmin = Module._malloc(8);
        const _xmax = Module._malloc(8);
        const _ymin = Module._malloc(8);
        const _ymax = Module._malloc(8);
        gr_panzoom_c(x, y, zoom, _xmin, _xmax, _ymin, _ymax);
        const result = [
            Module.HEAPF64.subarray(_xmin / 8, _xmin / 8 + 1)[0],
            Module.HEAPF64.subarray(_xmax / 8, _xmax / 8 + 1)[0],
            Module.HEAPF64.subarray(_ymin / 8, _ymin / 8 + 1)[0],
            Module.HEAPF64.subarray(_ymax / 8, _ymax / 8 + 1)[0],
        ];
        freearray(_xmin);
        freearray(_xmax);
        freearray(_ymin);
        freearray(_ymax);
        return result;
    }
    path(n, x, y, codes) {
        const _x = floatarray(x, 0);
        const _y = floatarray(y, 1);
        const _codes = uint8arrayfromstring(codes);
        gr_path_c(n, _x, _y, _codes);
        freearray(_codes);
    }
    setborderwidth(width) {
        gr_setborderwidth_c(width);
    }
    inqborderwidth() {
        const _width = Module._malloc(8);
        gr_inqborderwidth_c(_width);
        const result = Module.HEAPF64.subarray(_width / 8, _width / 8 + 1)[0];
        freearray(_width);
        return result;
    }
    setbordercolorind(colorind) {
        gr_setbordercolorind_c(colorind);
    }
    inqbordercolorind() {
        const _coli = Module._malloc(4);
        gr_inqbordercolorind_c(_coli);
        const result = Module.HEAP32.subarray(_coli / 4, _coli / 4 + 1)[0];
        freearray(_coli);
        return result;
    }
    selectclipxform(tnr) {
        gr_selectclipxform_c(tnr);
    }
    inqclipxform() {
        const _tnr = Module._malloc(4);
        gr_inqclipxform_c(_tnr);
        const result = Module.HEAP32.subarray(_tnr / 4, _tnr / 4 + 1)[0];
        freearray(_tnr);
        return result;
    }
    settextencoding(encoding) {
        gr_settextencoding_c(encoding);
    }
}
export class GRM {
    canvas;
    context;
    callbacks;
    _dpr;
    _original_canvas_size;
    select_canvas() {
        Module.canvas = this.canvas;
        Module.context = this.context;
        this._set_dpr();
    }
    constructor(canvasID) {
        if (typeof canvasID == "undefined") {
            console.log("gr.js: no canvas name given. Will use default canvas with id 'canvas'");
            canvasID = "canvas";
        }
        if (document.getElementById(canvasID) == null) {
            console.log(`Unable to find canvas with ID '${canvasID}'. Creating...`);
            create_default_canvas(canvasID);
        }
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext("2d");
        this.callbacks = [
            Function.prototype,
            Function.prototype,
            Function.prototype,
            Function.prototype,
        ];
        grm_register_c(GRM_EVENT.NEW_PLOT, Module.addFunction(function (evt) {
            const evt_data = {
                evt_type: Module.HEAP32.subarray(evt / 4, evt / 4 + 1)[0],
                plot_id: Module.HEAP32.subarray(evt / 4 + 1, evt / 4 + 2)[0],
            };
            this.callbacks[this.EVENT_NEW_PLOT](evt_data);
        }.bind(this), "vi"));
        grm_register_c(GRM_EVENT.UPDATE_PLOT, Module.addFunction(function (evt) {
            const evt_data = {
                evt_type: Module.HEAP32.subarray(evt / 4, evt / 4 + 1)[0],
                plot_id: Module.HEAP32.subarray(evt / 4 + 1, evt / 4 + 2)[0],
            };
            this.callbacks[this.EVENT_UPDATE_PLOT](evt_data);
        }.bind(this), "vi"));
        grm_register_c(GRM_EVENT.SIZE, Module.addFunction(function (evt) {
            const evt_data = {
                evt_type: Module.HEAP32.subarray(evt / 4, evt / 4 + 1)[0],
                plot_id: Module.HEAP32.subarray(evt / 4 + 1, evt / 4 + 2)[0],
                width: Module.HEAP32.subarray(evt / 4 + 2, evt / 4 + 3)[0],
                height: Module.HEAP32.subarray(evt / 4 + 3, evt / 4 + 4)[0],
            };
            this.callbacks[this.EVENT_SIZE](evt_data);
        }.bind(this), "vi"));
        grm_register_c(GRM_EVENT.MERGE_END, Module.addFunction(function (evt) {
            const evt_data = {
                evt_type: Module.HEAP32.subarray(evt / 4, evt / 4 + 1)[0],
                identificator: Module.UTF8ToString(Module.HEAP32.subarray(evt / 4 + 1, evt / 4 + 2)[0]),
            };
            this.callbacks[this.EVENT_MERGE_END](evt_data);
        }.bind(this), "vi"));
    }
    _set_dpr() {
        this._dpr = window.devicePixelRatio || 1;
        /* JSTerm uses multiple overlay canvases and replaces `this.canvas`.
         * Therefore, the `dpr` must be
         *  set and compared for each individual canvas.
         */
        if (!(this.canvas.id in Module.dpr_per_canvas) ||
            this._dpr !== Module.dpr_per_canvas[this.canvas.id]) {
            /* Set the size in memory
             * (https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#correcting_resolution_in_a_canvas)
             */
            this.canvas.width = this._original_canvas_size[0] * this._dpr;
            this.canvas.height = this._original_canvas_size[1] * this._dpr;
            this.context.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
            // Set the display size if not already set
            if (!(this.canvas.style.width && this.canvas.style.height)) {
                this.canvas.style.width = this._original_canvas_size[0] + "px";
                this.canvas.style.height = this._original_canvas_size[1] + "px";
            }
            Module.dpr = this._dpr;
            Module.dpr_per_canvas[this.canvas.id] = this._dpr;
        }
    }
    register(eventType, callback) {
        if (eventType > 3) {
            console.error("gr.register: unknown event type:", eventType);
            return;
        }
        this.callbacks[eventType] = callback;
    }
    unregister(eventType) {
        Module.removeFunction(this.callbacks[eventType]);
        delete this.callbacks[eventType];
        return grm_unregister_c(eventType);
    }
    dump_json_str() {
        const str_p = grm_dump_json_str_c();
        const str = Module.UTF8ToString(str_p);
        freearray(str_p);
        return str;
    }
    load_from_str(jsonStr) {
        const cstr = uint8arrayfromstring(jsonStr);
        const result = grm_load_from_str_c(cstr);
        freearray(cstr);
        return result;
    }
    get_tooltip = function (x, y) {
        const info = grm_get_tooltip_c(x, y);
        const data = {
            x: Module.HEAPF64.subarray(info / 8, info / 8 + 1)[0],
            y: Module.HEAPF64.subarray(info / 8 + 1, info / 8 + 2)[0],
            xpx: Module.HEAP32.subarray(info / 4 + 4, info / 4 + 5)[0],
            ypx: Module.HEAP32.subarray(info / 4 + 5, info / 4 + 6)[0],
            xlabel: Module.UTF8ToString(Module.HEAP32.subarray(info / 4 + 6, info / 4 + 7)[0]),
            ylabel: Module.UTF8ToString(Module.HEAP32.subarray(info / 4 + 7, info / 4 + 8)[0]),
            label: Module.UTF8ToString(Module.HEAP32.subarray(info / 4 + 8, info / 4 + 9)[0]),
        };
        freearray(info);
        return data;
    };
    grm_is3d(x, y) {
        const result = grm_is3d_c(x, y);
        return Boolean(result);
    }
    get_box(top, right, bottom, left, keepAspectRatio) {
        const _x = Module._malloc(4);
        const _y = Module._malloc(4);
        const _w = Module._malloc(4);
        const _h = Module._malloc(4);
        grm_get_box_c(top, right, bottom, left, +keepAspectRatio, _x, _y, _w, _h);
        const result = [
            Module.HEAP32.subarray(_x / 4, _x / 4 + 1)[0],
            Module.HEAP32.subarray(_y / 4, _y / 4 + 1)[0],
            Module.HEAP32.subarray(_w / 4, _w / 4 + 1)[0],
            Module.HEAP32.subarray(_h / 4, _h / 4 + 1)[0],
        ];
        freearray(_x);
        freearray(_y);
        freearray(_w);
        freearray(_h);
        return result;
    }
    args_new() {
        return grm_args_new_c();
    }
    args_push(args, key, format, ...vals) {
        function strip_format(format) {
            return format.replaceAll("n", "");
        }
        function is_non_empty_string(str) {
            return Boolean(str);
        }
        function is_homogeneous_format(format) {
            const type = format[0];
            return RegExp("^" + type + "+$").test(format);
        }
        function stringarray(vals) {
            const arr = [];
            for (let i = 0; i < vals.length; ++i) {
                arr.push(uint8arrayfromstring(vals[i]));
            }
            return intarray(arr);
        }
        function argsarray(vals) {
            return intarray(vals);
        }
        format = strip_format(format);
        if (!is_non_empty_string(format)) {
            throw new Error('The "format" parameter must not be an empty value!');
        }
        if (!is_homogeneous_format(format)) {
            throw new Error('The "format" parameter must be an homogeneous string (e.g "iii", "DD")!');
        }
        const type_to_conversion_function = {
            d: floatarray,
            i: intarray,
            s: stringarray,
            a: argsarray,
        };
        const type = format[0];
        let arr = [];
        let int_arr;
        if (type == type.toLowerCase()) {
            arr = type_to_conversion_function[type](vals);
            format = type.repeat(vals.length);
        }
        else {
            for (let i = 0; i < vals.length; ++i) {
                arr.push(vals[i].length, type_to_conversion_function[type.toLowerCase()](vals[i]));
            }
            int_arr = intarray(arr);
            format = ("n" + type).repeat(vals.length);
        }
        return grm_args_push_c(args, key, format, arr);
    }
    merge(args) {
        return grm_merge_c(args);
    }
    merge_named(args, identificator) {
        const bufferSize = Module.lengthBytesUTF8(identificator);
        const bufferPtr = Module._malloc(bufferSize + 1);
        Module.stringToUTF8(identificator, bufferPtr, bufferSize + 1);
        const result = grm_merge_named_c(args, bufferPtr);
        freearray(bufferPtr);
        return result;
    }
    input(input_args) {
        return grm_input_c(input_args);
    }
    args_delete(args) {
        grm_args_delete_c(args);
    }
    read(args, string) {
        const bufferSize = Module.lengthBytesUTF8(string);
        const bufferPtr = Module._malloc(bufferSize + 1);
        Module.stringToUTF8(string, bufferPtr, bufferSize + 1);
        const result = grm_read_c(args, bufferPtr);
        freearray(bufferPtr);
        return result;
    }
    plot(args) {
        if (typeof args === "undefined") {
            grm_plot_c(0);
            return;
        }
        grm_plot_c(args);
    }
    dump_json = function (args, file) {
        if (typeof file === "undefined") {
            file = this.get_stdout();
        }
        return grm_dump_json_c(args, file);
    };
    dump = function (args, file) {
        if (typeof file === "undefined") {
            file = this.get_stdout();
        }
        return grm_dump_c(args, file);
    };
    switch(id) {
        return grm_switch_c(id);
    }
    get_stdout() {
        return grm_get_stdout_c();
    }
}
function vertexarray(a) {
    const ptr = Module._malloc(a.length * 4);
    const data = Module.HEAPF64.subarray(ptr / 4, ptr / 4 + a.length);
    for (let i = 0; i < a.length; i++) {
        data[i] = Module._malloc(8 * 2);
        const vertex_data = Module.HEAPF64.subarray(data[i] / 8, data[i] / 8 + 2);
        vertex_data[0] = a[i][0];
        vertex_data[1] = a[i][1];
    }
    return ptr;
}
function free_vertexarray(ptr, n) {
    const data = Module.HEAPF64.subarray(ptr / 4, ptr / 4 + n);
    for (let i = 0; i < n; i++) {
        freearray(data[i]);
    }
}
function floatarray(a, poolIndex) {
    F64_MEM_POOLS[poolIndex].copyFrom(a);
    return F64_MEM_POOLS[poolIndex].ptr;
}
function intarray(a) {
    const ptr = Module._malloc(getLength(a) * 4);
    const data = Module.HEAP32.subarray(ptr / 4, ptr / 4 + getLength(a));
    for (let i = 0; i < getLength(a); i++) {
        data[i] = a[i];
    }
    return ptr;
}
function uint8array(a) {
    const ptr = Module._malloc(a.length);
    const data = Module.HEAPU8.subarray(ptr, ptr + a.length);
    for (let i = 0; i < a.length; i++) {
        data[i] = a[i];
    }
    data[a.length] = 0x00;
    return ptr;
}
function uint8arrayfromstring(a) {
    const ptr = Module._malloc(a.length + 1);
    const arr = Module.intArrayFromString(a, true);
    const data = Module.HEAPU8.subarray(ptr, ptr + arr.length + 1);
    for (let i = 0; i < arr.length; i++) {
        data[i] = arr[i];
    }
    data[arr.length] = 0x00;
    return ptr;
}
function freearray(ptr) {
    Module._free(ptr);
}
let gr_opengks_c = Module.cwrap("gr_opengks", "", []);
let gr_closegks_c = Module.cwrap("gr_closegks", "", []);
let gr_inqdspsize_c = Module.cwrap("gr_inqdspsize", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_openws_c = Module.cwrap("gr_openws", "", ["number", "number", "number"]);
let gr_closews_c = Module.cwrap("gr_closews", "", ["number"]);
let gr_activatews_c = Module.cwrap("gr_activatews", "", ["number"]);
let gr_deactivatews_c = Module.cwrap("gr_deactivatews", "", ["number"]);
let gr_clearws_c = Module.cwrap("gr_clearws", "", []);
let gr_updatews_c = Module.cwrap("gr_updatews", "", []);
let gr_polyline_c = Module.cwrap("gr_polyline", "", [
    "number",
    "number",
    "number",
]);
let gr_polymarker_c = Module.cwrap("gr_polymarker", "", [
    "number",
    "number",
    "number",
]);
let gr_text_c = Module.cwrap("gr_text", "", ["number", "number", "number"]);
let gr_inqtext_c = Module.cwrap("gr_inqtext", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_fillarea_c = Module.cwrap("gr_fillarea", "", [
    "number",
    "number",
    "number",
]);
let gr_cellarray_c = Module.cwrap("gr_cellarray", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_spline_c = Module.cwrap("gr_spline", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_gridit_c = Module.cwrap("gr_gridit", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_setlinetype_c = Module.cwrap("gr_setlinetype", "", ["number"]);
let gr_inqlinetype_c = Module.cwrap("gr_inqlinetype", "", ["number"]);
let gr_setlinewidth_c = Module.cwrap("gr_setlinewidth", "", ["number"]);
let gr_inqlinewidth_c = Module.cwrap("gr_inqlinewidth", "", ["number"]);
let gr_setlinecolorind_c = Module.cwrap("gr_setlinecolorind", "", ["number"]);
let gr_inqlinecolorind_c = Module.cwrap("gr_inqlinecolorind", "", ["number"]);
let gr_setmarkertype_c = Module.cwrap("gr_setmarkertype", "", ["number"]);
let gr_inqmarkertype_c = Module.cwrap("gr_inqmarkertype", "", ["number"]);
let gr_setmarkersize_c = Module.cwrap("gr_setmarkersize", "", ["number"]);
let gr_setmarkercolorind_c = Module.cwrap("gr_setmarkercolorind", "", [
    "number",
]);
let gr_inqmarkercolorind_c = Module.cwrap("gr_inqmarkercolorind", "", [
    "number",
]);
let gr_settextfontprec_c = Module.cwrap("gr_settextfontprec", "", [
    "number",
    "number",
]);
let gr_setcharexpan_c = Module.cwrap("gr_setcharexpan", "", ["number"]);
let gr_setcharspace_c = Module.cwrap("gr_setcharspace", "", ["number"]);
let gr_settextcolorind_c = Module.cwrap("gr_settextcolorind", "", ["number"]);
let gr_setcharheight_c = Module.cwrap("gr_setcharheight", "", ["number"]);
let gr_setcharup_c = Module.cwrap("gr_setcharup", "", ["number", "number"]);
let gr_settextpath_c = Module.cwrap("gr_settextpath", "", ["number"]);
let gr_settextalign_c = Module.cwrap("gr_settextalign", "", [
    "number",
    "number",
]);
let gr_setfillintstyle_c = Module.cwrap("gr_setfillintstyle", "", ["number"]);
let gr_setfillstyle_c = Module.cwrap("gr_setfillstyle", "", ["number"]);
let gr_setfillcolorind_c = Module.cwrap("gr_setfillcolorind", "", ["number"]);
let gr_setcolorrep_c = Module.cwrap("gr_setcolorrep", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_setscale_c = Module.cwrap("gr_setscale", "number", ["number"]);
let gr_inqscale_c = Module.cwrap("gr_inqscale", "", ["number"]);
let gr_setwindow_c = Module.cwrap("gr_setwindow", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_inqwindow_c = Module.cwrap("gr_inqwindow", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_setviewport_c = Module.cwrap("gr_setviewport", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_inqviewport_c = Module.cwrap("gr_inqviewport", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_selntran_c = Module.cwrap("gr_selntran", "", ["number"]);
let gr_setclip_c = Module.cwrap("gr_setclip", "", ["number"]);
let gr_setwswindow_c = Module.cwrap("gr_setwswindow", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_setwsviewport_c = Module.cwrap("gr_setwsviewport", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_createseg_c = Module.cwrap("gr_createseg", "", ["number"]);
let gr_copysegws_c = Module.cwrap("gr_copysegws", "", ["number"]);
let gr_redrawsegws_c = Module.cwrap("gr_redrawsegws", "", []);
let gr_setsegtran_c = Module.cwrap("gr_setsegtran", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_closeseg_c = Module.cwrap("gr_closeseg", "", []);
let gr_emergencyclosegks_c = Module.cwrap("gr_emergencyclosegks", "", []);
let gr_updategks_c = Module.cwrap("gr_updategks", "", []);
let gr_setspace_c = Module.cwrap("gr_setspace", "number", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_inqspace_c = Module.cwrap("gr_inqspace", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_textext_c = Module.cwrap("gr_textext", "number", [
    "number",
    "number",
    "number",
]);
let gr_inqtextext_c = Module.cwrap("gr_inqtextext", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_setscientificformat_c = Module.cwrap("gr_setscientificformat", "", [
    "number",
]);
let gr_axes_c = Module.cwrap("gr_axes", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_grid_c = Module.cwrap("gr_grid", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_verrorbars_c = Module.cwrap("gr_verrorbars", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_herrorbars_c = Module.cwrap("gr_herrorbars", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_polyline3d_c = Module.cwrap("gr_polyline3d", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_grid3d_c = Module.cwrap("gr_grid3d", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_axes3d_c = Module.cwrap("gr_axes3d", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_titles3d_c = Module.cwrap("gr_titles3d", "", [
    "number",
    "number",
    "number",
]);
let gr_surface_c = Module.cwrap("gr_surface", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_contour_c = Module.cwrap("gr_contour", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_hexbin_c = Module.cwrap("gr_hexbin", "number", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_setcolormap_c = Module.cwrap("gr_setcolormap", "", ["number"]);
let gr_inqcolormap_c = Module.cwrap("gr_inqcolormap", "", ["number"]);
let gr_colorbar_c = Module.cwrap("gr_colorbar", "", []);
let gr_inqcolor_c = Module.cwrap("gr_inqcolor", "", ["number", "number"]);
let gr_inqcolorfromrgb_c = Module.cwrap("gr_inqcolorfromrgb", "number", [
    "number",
    "number",
    "number",
]);
let gr_hsvtorgb_c = Module.cwrap("gr_hsvtorgb", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_tick_c = Module.cwrap("gr_tick", "number", ["number", "number"]);
let gr_validaterange_c = Module.cwrap("gr_validaterange", "number", [
    "number",
    "number",
]);
let gr_adjustrange_c = Module.cwrap("gr_adjustrange", "", ["number", "number"]);
let gr_beginprint_c = Module.cwrap("gr_beginprint", "", ["number"]);
let gr_beginprintext_c = Module.cwrap("gr_beginprintext", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_endprint_c = Module.cwrap("gr_endprint", "", []);
let gr_ndctowc_c = Module.cwrap("gr_ndctowc", "", ["number", "number"]);
let gr_wctondc_c = Module.cwrap("gr_wctondc", "", ["number", "number"]);
let gr_drawrect_c = Module.cwrap("gr_drawrect", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_fillrect_c = Module.cwrap("gr_fillrect", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_drawarc_c = Module.cwrap("gr_drawarc", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_fillarc_c = Module.cwrap("gr_fillarc", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_drawpath_c = Module.cwrap("gr_drawpath", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_setarrowstyle_c = Module.cwrap("gr_setarrowstyle", "", ["number"]);
let gr_setarrowsize_c = Module.cwrap("gr_setarrowsize", "", ["number"]);
let gr_drawarrow_c = Module.cwrap("gr_drawarrow", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_readimage_c = Module.cwrap("gr_readimage", "number", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_drawimage_c = Module.cwrap("gr_drawimage", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_importgraphics_c = Module.cwrap("gr_importgraphics", "number", [
    "number",
]);
let gr_setshadow_c = Module.cwrap("gr_setshadow", "", [
    "number",
    "number",
    "number",
]);
let gr_settransparency_c = Module.cwrap("gr_settransparency", "", ["number"]);
let gr_setcoordxform = Module.cwrap("gr_setcoordxform", "", ["number"]);
let gr_begingraphics_c = Module.cwrap("gr_begingraphics", "", ["number"]);
let gr_endgraphics = Module.cwrap("gr_endgraphics", "", []);
let gr_drawgraphics_c = Module.cwrap("gr_drawgraphics", "number", ["number"]);
let gr_mathtex_c = Module.cwrap("gr_mathtex", "", [
    "number",
    "number",
    "number",
]);
let gr_beginselection_c = Module.cwrap("gr_beginselection", "", [
    "number",
    "number",
]);
let gr_endselection_c = Module.cwrap("gr_endselection", "", []);
let gr_moveselection_c = Module.cwrap("gr_moveselection", "", [
    "number",
    "number",
]);
let gr_resizeselection_c = Module.cwrap("gr_resizeselection", "", [
    "number",
    "number",
    "number",
]);
let gr_inqbbox_c = Module.cwrap("gr_inqbbox", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_precision_c = Module.cwrap("gr_precision", "number", []);
let gr_setregenflags_c = Module.cwrap("gr_setregenflags", "", ["number"]);
let gr_inqregenflags_c = Module.cwrap("gr_inqregenflags", "number", []);
let gr_savestate_c = Module.cwrap("gr_savestate", "", []);
let gr_restorestate_c = Module.cwrap("gr_restorestate", "", []);
let gr_selectcontext_c = Module.cwrap("gr_selectcontext", "", ["number"]);
let gr_destroycontext_c = Module.cwrap("gr_destroycontext", "", ["number"]);
let gr_uselinespec_c = Module.cwrap("gr_uselinespec", "number", ["number"]);
let grm_args_new_c = Module.cwrap("grm_args_new", "number", []);
let grm_args_push_c = Module.cwrap("grm_args_push", "number", [
    "number",
    "string",
    "string",
    "number",
]);
let grm_merge_c = Module.cwrap("grm_merge", "number", ["number"]);
let grm_merge_named_c = Module.cwrap("grm_merge_named", "number", [
    "number",
    "number",
]);
let grm_input_c = Module.cwrap("grm_input", "number", ["number"]);
let grm_args_delete_c = Module.cwrap("grm_args_delete", "", ["number"]);
let grm_read_c = Module.cwrap("grm_read", "number", ["number", "number"]);
let grm_plot_c = Module.cwrap("grm_plot", "", ["number"]);
let grm_dump_json_c = Module.cwrap("grm_dump_json", "number", [
    "number",
    "number",
]);
let grm_dump_c = Module.cwrap("grm_dump", "number", ["number", "number"]);
let grm_switch_c = Module.cwrap("grm_switch", "number", ["number"]);
let grm_get_stdout_c = Module.cwrap("grm_get_stdout", "number", []);
let gr_shade_c = Module.cwrap("gr_shade", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_shadepoints_c = Module.cwrap("gr_shadepoints", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_shadelines_c = Module.cwrap("gr_shadelines", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_panzoom_c = Module.cwrap("gr_panzoom", "", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let gr_path_c = Module.cwrap("gr_path", "", [
    "number",
    "number",
    "number",
    "number",
]);
let gr_setborderwidth_c = Module.cwrap("gr_setborderwidth", "", ["number"]);
let gr_inqborderwidth_c = Module.cwrap("gr_inqborderwidth", "", ["number"]);
let gr_setbordercolorind_c = Module.cwrap("gr_setbordercolorind", "", [
    "number",
]);
let gr_inqbordercolorind_c = Module.cwrap("gr_inqbordercolorind", "", [
    "number",
]);
let gr_selectclipxform_c = Module.cwrap("gr_selectclipxform", "", ["number"]);
let gr_inqclipxform_c = Module.cwrap("gr_inqclipxform", "", ["number"]);
let gr_settextencoding_c = Module.cwrap("gr_settextencoding", "", ["number"]);
let grm_get_box_c = Module.cwrap("grm_get_box", "number", [
    "number",
    "number",
    "number",
    "number",
    "number",
]);
let grm_is3d_c = Module.cwrap("grm_is3d", "number", ["number", "number"]);
let grm_get_tooltip_c = Module.cwrap("grm_get_tooltip", "number", [
    "number",
    "number",
]);
let grm_register_c = Module.cwrap("grm_register", "number", [
    "number",
    "number",
]);
let grm_unregister_c = Module.cwrap("grm_unregister", "number", ["number"]);
let grm_dump_json_str_c = Module.cwrap("grm_dump_json_str", "number", []);
let grm_load_from_str_c = Module.cwrap("grm_load_from_str", "number", [
    "number",
]);
