export declare const NOCLIP = 0;
export declare const CLIP = 1;
export declare enum COORDINATES {
    WC = 0,
    NDC = 1
}
export declare enum FILL_INTSTYLE {
    HOLLOW = 0,
    SOLID = 1,
    PATTERN = 2,
    HATCH = 3
}
export declare enum TEXT_HALIGN {
    NORMAL = 0,
    LEFT = 1,
    CENTER = 2,
    RIGHT = 3
}
export declare enum TEXT_VALIGN {
    NORMAL = 0,
    TOP = 1,
    CAP = 2,
    HALF = 3,
    BASE = 4,
    BOTTOM = 5
}
export declare enum TEXT_PATH {
    RIGHT = 0,
    LEFT = 1,
    UP = 2,
    DOWN = 3
}
/**
 * The appearance of a font depends on the text precision value specified.
  * STRING, CHARACTER or STROKE precision allows for a greater or lesser
  * realization of the text primitives, for efficiency. STRING is the
  * default precision for GR and produces the high quality output using either
  * native font rendering or FreeType. OUTLINE uses the GR path rendering
  * functions to draw individual glyphs and produces the highest quality
  * output.
 */
export declare enum TEXT_PRECISION {
    STRING = 0,
    CHAR = 1,
    STROKE = 2,
    OUTLINE = 3
}
export declare enum LINETYPE {
    SOLID = 1,
    DASHED = 2,
    DOTTED = 3,
    DASHED_DOTTED = 4,
    DASH_2_DOT = -1,
    DASH_3_DOT = -2,
    LONG_DASH = -3,
    LONG_SHORT_DASH = -4,
    SPACED_DASH = -5,
    SPACED_DOT = -6,
    DOUBLE_DOT = -7,
    TRIPLE_DOT = -8
}
export declare enum MARKERTYPE {
    DOT = 1,
    PLUS = 2,
    ASTERISK = 3,
    CIRCLE = 4,
    DIAGONAL_CROSS = 5,
    SOLID_CIRCLE = -1,
    TRIANGLE_UP = -2,
    SOLID_TRI_UP = -3,
    TRIANGLE_DOWN = -4,
    SOLID_TRI_DOWN = -5,
    SQUARE = -6,
    SOLID_SQUARE = -7,
    BOWTIE = -8,
    SOLID_BOWTIE = -9,
    HOURGLASS = -10,
    SOLID_HGLASS = -11,
    DIAMOND = -12,
    SOLID_DIAMOND = -13,
    STAR = -14,
    SOLID_STAR = -15,
    TRI_UP_DOWN = -16,
    SOLID_TRI_RIGHT = -17,
    SOLID_TRI_LEFT = -18,
    HOLLOW_PLUS = -19,
    SOLID_PLUS = -20,
    PENTAGON = -21,
    HEXAGON = -22,
    HEPTAGON = -23,
    OCTAGON = -24,
    STAR_4 = -25,
    STAR_5 = -26,
    STAR_6 = -27,
    STAR_7 = -28,
    STAR_8 = -29,
    VLINE = -30,
    HLINE = -31,
    OMARK = -32
}
export declare enum ARROWSTYLE {
    SINGLE_ENDED_SIMPLE = 1,
    SINGLE_ENDED_SIMPLE_ACUTE_HEAD = 2,
    SINGLE_ENDED_HOLLOW = 3,
    SINGLE_ENDED_FILLEd = 4,
    SINGLE_ENDED_TRIANGLE = 5,
    SINGLE_ENDED_FILLED_TRIANGLE = 6,
    SINGLE_ENDED_KITE = 7,
    SINGLE_ENDED_FILLED_KITE = 8,
    DOUBLE_ENDED_SIMPLE = 9,
    DOUBLE_ENDED_SIMPLE_ACUTE_HEAD = 10,
    DOUBLE_ENDED_HOLLOW = 11,
    DOUBLE_ENDED_FILLEd = 12,
    DOUBLE_ENDED_TRIANGLE = 13,
    DOUBLE_ENDED_FILLED_TRIANGLE = 14,
    DOUBLE_ENDED_KITE = 15,
    DOUBLE_ENDED_FILLED_KITE = 16,
    SINGLE_ENDED_DOUBLE_LINE = 17,
    DOUBLE_ENDED_DOUBLE_LINE = 18
}
export declare enum INTERP2_METHOD {
    NEAREST = 0,
    LINEAR = 1,
    SPLINE = 2,
    CUBIC = 3
}
export declare enum SPLINE_SMOOTHING {
    CROSS_VALIDATED = 1,
    NATURAL_CUBIC = 0,
    B_SPLINE = -1
}
export declare enum SCALE_OPTION {
    X_LOG = 1,
    Y_LOG = 2,
    Z_LOG = 4,
    FLIP_X = 8,
    FLIP_Y = 16,
    FLIP_Z = 32,
    X_LOG2 = 64,
    Y_LOG2 = 128,
    Z_LOG2 = 256,
    X_LN = 512,
    Y_LN = 1024,
    Z_LN = 2048
}
export declare enum LINESPEC {
    LINE = 1,
    MARKER = 2,
    COLOR = 4
}
export declare enum SURFACE_OPTION {
    LINES = 0,
    MESH = 1,
    FILLED_MESH = 2,
    Z_SHADED_MESH = 3,
    COLORED_MESH = 4,
    CELL_ARRAY = 5,
    SHADED_MESH = 6,
    MESH_3D = 7
}
export declare enum PATH_CODE {
    STOP = 0,
    MOVETO = 1,
    LINETO = 2,
    CURVE3 = 3,
    CURVE4 = 4,
    CLOSEPOLY = 79
}
export declare enum COLOR_MODEL {
    RGB = 0,
    HSV = 1
}
export declare enum COLORMAP {
    UNIFORM = 0,
    TEMPERATURE = 1,
    GRAYSCALE = 2,
    GLOWING = 3,
    RAINBOWLIKE = 4,
    GEOLOGIC = 5,
    GREENSCALE = 6,
    CYANSCALE = 7,
    BLUESCALE = 8,
    MAGENTASCALE = 9,
    REDSCALE = 10,
    FLAME = 11,
    BROWNSCALE = 12,
    PILATUS = 13,
    AUTUMN = 14,
    BONE = 15,
    COOL = 16,
    COPPER = 17,
    GRAY = 18,
    HOT = 19,
    HSV = 20,
    JET = 21,
    PINK = 22,
    SPECTRAL = 23,
    SPRING = 24,
    SUMMER = 25,
    WINTER = 26,
    GIST_EARTH = 27,
    GIST_HEAT = 28,
    GIST_NCAR = 29,
    GIST_RAINBOW = 30,
    GIST_STERN = 31,
    AFMHOT = 32,
    BRG = 33,
    BWR = 34,
    COOLWARM = 35,
    CMRMAP = 36,
    CUBEHELIX = 37,
    GNUPLOT = 38,
    GNUPLOT2 = 39,
    OCEAN = 40,
    RAINBOW = 41,
    SEISMIC = 42,
    TERRAIN = 43,
    VIRIDIS = 44,
    INFERNO = 45,
    PLASMA = 46,
    MAGMA = 47,
    TEMPERATURE_REVERSED = -1,
    GRAYSCALE_REVERSED = -2,
    GLOWING_REVERSED = -3,
    RAINBOWLIKE_REVERSED = -4,
    GEOLOGIC_REVERSED = -5,
    GREENSCALE_REVERSED = -6,
    CYANSCALE_REVERSED = -7,
    BLUESCALE_REVERSED = -8,
    MAGENTASCALE_REVERSED = -9,
    REDSCALE_REVERSED = -10,
    FLAME_REVERSED = -11,
    BROWNSCALE_REVERSED = -12,
    PILATUS_REVERSED = -13,
    AUTUMN_REVERSED = -14,
    BONE_REVERSED = -15,
    COOL_REVERSED = -16,
    COPPER_REVERSED = -17,
    GRAY_REVERSED = -18,
    HOT_REVERSED = -19,
    HSV_REVERSED = -20,
    JET_REVERSED = -21,
    PINK_REVERSED = -22,
    SPECTRAL_REVERSED = -23,
    SPRING_REVERSED = -24,
    SUMMER_REVERSED = -25,
    WINTER_REVERSED = -26,
    GIST_EARTH_REVERSED = -27,
    GIST_HEAT_REVERSED = -28,
    GIST_NCAR_REVERSED = -29,
    GIST_RAINBOW_REVERSED = -30,
    GIST_STERN_REVERSED = -31,
    AFMHOT_REVERSED = -32,
    BRG_REVERSED = -33,
    BWR_REVERSED = -34,
    COOLWARM_REVERSED = -35,
    CMRMAP_REVERSED = -36,
    CUBEHELIX_REVERSED = -37,
    GNUPLOT_REVERSED = -38,
    GNUPLOT2_REVERSED = -39,
    OCEAN_REVERSED = -40,
    RAINBOW_REVERSED = -41,
    SEISMIC_REVERSED = -42,
    TERRAIN_REVERSED = -43,
    VIRIDIS_REVERSED = -44,
    INFERNO_REVERSED = -45,
    PLASMA_REVERSED = -46,
    MAGMA_REVERSED = -47
}
export declare enum FONT {
    TIMES_ROMAN = 101,
    TIMES_ITALIC = 102,
    TIMES_BOLD = 103,
    TIMES_BOLDITALIC = 104,
    HELVETICA = 105,
    HELVETICA_OBLIQUE = 106,
    HELVETICA_BOLD = 107,
    HELVETICA_BOLDOBLIQUE = 108,
    COURIER = 109,
    COURIER_OBLIQUE = 110,
    COURIER_BOLD = 111,
    COURIER_BOLDOBLIQUE = 112,
    SYMBOL = 113,
    BOOKMAN_LIGHT = 114,
    BOOKMAN_LIGHTITALIC = 115,
    BOOKMAN_DEMI = 116,
    BOOKMAN_DEMIITALIC = 117,
    NEWCENTURYSCHLBK_ROMAN = 118,
    NEWCENTURYSCHLBK_ITALIC = 119,
    NEWCENTURYSCHLBK_BOLD = 120,
    NEWCENTURYSCHLBK_BOLDITALIC = 121,
    AVANTGARDE_BOOK = 122,
    AVANTGARDE_BOOKOBLIQUE = 123,
    AVANTGARDE_DEMI = 124,
    AVANTGARDE_DEMIOBLIQUE = 125,
    PALATINO_ROMAN = 126,
    PALATINO_ITALIC = 127,
    PALATINO_BOLD = 128,
    PALATINO_BOLDITALIC = 129,
    ZAPFCHANCERY_MEDIUMITALIC = 130,
    ZAPFDINGBATS = 131
}
export declare enum SCIENTIFIC_FORMAT_OPTION {
    E = 1,
    TEXTEX = 2,
    MATHTEX = 3
}
export declare enum PRINT_TYPE {
    PS = "ps",
    EPS = "eps",
    PDF = "pdf",
    PGF = "pgf",
    BMP = "bmp",
    JPEG = "jpeg",
    JPG = "jpg",
    PNG = "png",
    TIFF = "tiff",
    TIF = "tif",
    FIG = "fig",
    SVG = "svg",
    WMF = "wmf"
}
export declare enum PRINT_FORMAT {
    A4 = "A4",
    B5 = "B5",
    LETTER = "Letter",
    EXECUTIVE = "Executive",
    A0 = "A0",
    A1 = "A1",
    A2 = "A2",
    A3 = "A3",
    A5 = "A5",
    A6 = "A6",
    A7 = "A7",
    A8 = "A8",
    A9 = "A9",
    B0 = "B0",
    B1 = "B1",
    B2 = "B2",
    B3 = "B3",
    B4 = "B4",
    B6 = "B6",
    B7 = "B7",
    B8 = "B8",
    B9 = "B9",
    B10 = "B10",
    C5E = "C5E",
    COMM10E = "Comm10E",
    DLE = "DLE",
    FOLIO = "Folio",
    LEDGER = "Ledger",
    TABLOID = "Tabloid"
}
export declare enum PRINT_MODE {
    COLOR = "Color",
    GRAYSCALE = "Grayscale"
}
export declare enum PRINT_ORIENTATION {
    PORTRAIT = "Portrait",
    LANDSCAPE = "Landscape"
}
export declare enum XFORM {
    BOOLEAN = 0,
    LINEAR = 1,
    LOG = 2,
    LOGLOG = 3,
    CUBIC = 4,
    EQUALIZED = 5
}
export declare enum GRM_EVENT {
    NEW_PLOT = 0,
    UPDATE_PLOT = 1,
    SIZE = 2,
    MERGE_END = 3
}
export declare let isReady: boolean;
export declare let readyCallbacks: (() => void)[];
export declare function onGRReady(callback: () => void): any;
export declare class GRCanvas {
    private _original_canvas_size;
    private _dpr;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(canvasID: string);
    private _set_dpr;
    select_canvas(): void;
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
    inqdspsize(): [number, number, number, number];
    open_gks(): void;
    close_gks(): void;
    /**
     * Open a graphical workstation
     *
     * @param{number} workstation_id - A workstation identifier.
     * @param{string} connection - A connection identifier
     * @param{number} type - The desired workstation type.
     */
    openws(workstation_id: number, connection: string, type: number): void;
    /**
     * Close the specified graphical workstation
     *
     * @param{number} workstation_id - A workstation identifier.
     */
    closews(workstation_id: number): void;
    /**
     * Activate the specified graphical workstation
     *
     * @param{number} workstation_id - A workstation identifier.
     */
    activatews(workstation_id: number): void;
    /**
     * Deactivate the specified graphical workstation
     *
     * @param{number} workstation_id - A workstation identifier.
     */
    deactivatews(workstation_id: number): void;
    clearws(): void;
    updatews(): void;
    /**
     * Draw a polyline using the current line attributes, starting from the
     * first data point and ending at the last data point.
     * @param {number[]} x - An array of the x coordinates.
     * @param {number[]} y - An array of the y coordinates.
     */
    polyline(x: number[] | Float64Array, y: number[] | Float64Array): void;
    /**
     * Draw marker symbols centered at the given data points.
     * @param {number[]} x - An array of the x coordinates.
     * @param {number[]} y - An array of the y coordinates.
     */
    polymarker(x: number[] | Float64Array, y: number[] | Float64Array): void;
    text: (x: number, y: number, str: string) => void;
    inqtext(x: number, y: number, str: string): [number, number];
    /**
     * Allows you to specify a polygonal shape of an area to be filled.
     *
     * The attributes that control the appearance of fill areas are fill area interior
     * style, fill area style index and fill area color index.
     *
     * @param {number[] | Float64Array} x - A list containing the X coordinates.
     * @param {number[] | Float64Array} y - A list containing the Y coordinates.
     */
    fillarea(x: number[] | Float64Array, y: number[] | Float64Array): void;
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
     * @param{number[] | Int32Array} color - Color index array.
     */
    cellarray(xmin: number, xmax: number, ymin: number, ymax: number, dimx: number, dimy: number, color: number[] | Int32Array): void;
    /**
     * Generate a cubic spline-fit, starting from the first data point and
     * ending at the last data point.
     * @param{number[] | Float64Array} px - A list containing the x coordinates.
     * @param{number[] | Float64Array} py - A list containing the y coordinates.
     * @param{number} m - The number of points to be drawn (`m` > `px.length`).
     * @param{SPLINE_SMOOTHING} method - The smoothing method.
     *
     * The values for `x` and `y` are in world coordinates. The attributes that
     * control the appearance of a spline-fit are linetype, linewidth and color
     * index.
     */
    spline(px: number[] | Float64Array, py: number[] | Float64Array, m: number, method: SPLINE_SMOOTHING): void;
    /**
     * Interpolate data from arbitrary points at points on a rectangular grid.
     *
     * @param{number[] | Float64Array} xd -
     *  A list containing the X coordinates of the input points.
     * @param{number[] | Float64Array} yd -
     *  A list containing the Y coordinates of the input points.
     * @param{number[] | Float64Array} zd -
     *  A list containing the Z coordinates of the input points.
     * @param{number} nx - The number of points in the X direction for the output grid.
     * @param{number} ny - The number of points in the Y direction for the output grid.
     *
     * @return `[x, y, z]` where `x` and `y` are lists containing the points
     * in the X and Y direction in the output grid and `z` a list containing the
     * interpolated values on the `nx` x `ny` grid points.
     */
    gridit(xd: number[] | Float64Array, yd: number[] | Float64Array, zd: number[] | Float64Array, nx: number, ny: number): [Float64Array, Float64Array, Float64Array];
    /**
     * Set the line style for polylines.
     * @param{LINETYPE} linetype - The polyline type to apply.
     */
    setlinetype(linetype: LINETYPE): void;
    /**
     * Get the line style for polylines.
     */
    inqlinetype(): number;
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
    setlinewidth(width: number): void;
    inqlinewidth(): number;
    /**
     * Set the color of subsequent line output primitives.
     *
     * @param{number} colorind - The line color index (`colorind` < 1256).
     */
    setlinecolorind(colorind: number): void;
    /**
      * Get the current line color.
     */
    inqlinecolorind(): number;
    /**
     * Set the marker type for polymarkers.
     * @param{MARKERTYPE} markertype - The polymarker type to use.
     */
    setmarkertype(markertype: MARKERTYPE): void;
    /**
     * Get the marker type for polymarkers.
     */
    inqmarkertype(): number;
    /**
     * Set the size of the markersize for polymarkers.
     *
     * The polymarker size is calculated as the nominal size generated
     * on the graphics device multiplied by the marker size scale factor.
     *
     * @param{number} markersize -
     *  The scale factor to apply to the nominal marker size.
     */
    setmarkersize(markersize: number): void;
    /**
     * Set the color of subsequent polymarker output primitives.
     *
     * @param{number} colorind - The polymarker color index (`colorind` < 1256).
     */
    setmarkercolorind(colorind: number): void;
    /**
     * Specify the text font and precision for subsequent text output primitives.
     * @param{FONT} font - Text font.
     * @param{precision} font - Text precision.
     */
    settextfontprec(font: FONT, precision: TEXT_PRECISION): void;
    /**
     * Get the color of polymarker output primitives.
     */
    inqmarkercolorind(): number;
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
    setcharexpan(factor: number): void;
    setcharspace(factor: number): void;
    /**
     * Set the color of subsequent text output primitives.
     *
     * @param{number} colorind - The text color index (`colorind` < 1256).
     */
    settextcolorind(colorind: number): void;
    /**
     * Set the current character height.
     *
     * `setcharheight` defines the height of subsequent text output primitives.
     * Text height is defined as a percentage of the default window. GR uses the
     * default text height of 0.027 (2.7% of the height of the default window).
     *
     * @param{number} height - Text height value.
     */
    setcharheight(height: number): void;
    /**
     * Set the current character text angle up vector.
     * `setcharup` defines the vertical rotation of subsequent text output primitives.
     * The text up vector is initially set to (0, 1), horizontal to the baseline.
     *
     * @param{number} ux - Text up vector x component.
     * @param{number} uy - Text up vector y component.
     */
    setcharup(ux: number, uy: number): void;
    /**
     * Set the direction in which subsequent text will be draw.
     *
     * @param{TEXT_PATH} textPath - The text path.
     */
    settextpath(textPath: TEXT_PATH): void;
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
    settextalign(halign: TEXT_HALIGN, valign: TEXT_VALIGN): void;
    /**
     * Set the fill area interior style to be used for fill areas.
     * The default interior style is HOLLOW.
     *
     * @param{FILL_INTSTYLE} style - The style of fill to use.
     */
    setfillintstyle(style: FILL_INTSTYLE): void;
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
    setfillstyle(index: number): void;
    /**
     * Set the color of subsequent fill area output primitives.
     *
     * @param{number} colorind - The fill area color index (`colorind` < 1256).
     */
    setfillcolorind(colorind: number): void;
    setcolorrep(colorind: number, red: number, green: number, blue: number): void;
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
    setscale(scale: SCALE_OPTION): number;
    /**
     * Get the current type of transformation used for GR output primitives.
     */
    inqscale(): number;
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
    setwindow(xmin: number, xmax: number, ymin: number, ymax: number): void;
    /**
     * Get the window, or rectangular subspace, of world coordinates being
     * plotted.
     */
    inqwindow(): [number, number, number, number];
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
    setviewport(xmin: number, xmax: number, ymin: number, ymax: number): void;
    /**
     * Get the rectangular subspace of normalized device coordinates.
     */
    inqviewport(): [number, number, number, number];
    selntran(transform: number): void;
    /**
     * Set the clipping indicator.
     *
     * Clipping is defined as the removal of those portions of the graph that lie
     * outside of the defined viewport. If clipping is on, GR does not draw generated
     * output primitives past the viewport boundaries. If clipping is off, primitives
     * may exceed the viewport boundaries, and they will be drawn to the edge of the
     * workstation window. By default, clipping is on.
     */
    setclip(enableClipping: boolean): void;
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
    setwswindow(xmin: number, xmax: number, ymin: number, ymax: number): void;
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
    setwsviewport(xmin: number, xmax: number, ymin: number, ymax: number): void;
    createseg(segment: number): void;
    copysegws(segment: number): void;
    redrawsegws(): void;
    setsegtran(segment: number, fx: number, fy: number, transx: number, transy: number, phi: number, scalex: number, scaley: number): void;
    closeseg(): void;
    emergencyclosegks(): void;
    updategks(): void;
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
    setspace(zmin: number, zmax: number, rotation: number, tilt: number): void;
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
    inqspace(): [number, number, number, number];
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
    textext(x: number, y: number, str: string): void;
    inqtextext(x: number, y: number, str: string): [[number, number, number, number], [number, number, number, number]];
    /**
     * Specify the format to be used when scientific notation is used.
     * @param{SCIENTIFIC_FORMAT_OPTION} format - The format option to use.
     */
    setscientificformat(format: SCIENTIFIC_FORMAT_OPTION): void;
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
    axes(x_tick: number, y_tick: number, x_org: number, y_org: number, major_x: number, major_y: number, tick_size: number): void;
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
    grid(x_tick: number, y_tick: number, x_org: number, y_org: number, major_x: number, major_y: number): void;
    /**
     * Draw a standard vertical error bar graph.
     * @param{number[] | Float64Array} px - A list containing the x coordinates.
     * @param{number[] | Float64Array} py - A list containing the y coordinates.
     * @param{number[] | Float64Array} e1 -
     *  The absolute values of the lower error bar data.
     * @param{number[] | Float64Array} e2 -
     *  The absolute values of the upper error bar data.
     */
    verrorbars(px: number[] | Float64Array, py: number[] | Float64Array, e1: number[] | Float64Array, e2: number[] | Float64Array): void;
    /**
     * Draw a standard horizontal error bar graph.
     * @param{number[] | Float64Array} px - A list containing the x coordinates.
     * @param{number[] | Float64Array} py - A list containing the y coordinates.
     * @param{number[] | Float64Array} e1 -
     *  The absolute values of the lower error bar data.
     * @param{number[] | Float64Array} e2 -
     *  The absolute values of the upper error bar data.
     */
    herrorbars(px: number[] | Float64Array, py: number[] | Float64Array, e1: number[] | Float64Array, e2: number[] | Float64Array): void;
    /**
     * Draw a 3D curve using the current line attributes, starting from the
     * first data point and ending at the last data point.
     * @param {number[] | Float64Array} px - An array of the x coordinates.
     * @param {number[] | Float64Array} py - An array of the y coordinates.
     * @param {number[] | Float64Array} pz - An array of the y coordinates.
     *
     * The values for `x`, `y` and `z` are in world coordinates. The attributes that
     * control the appearance of a polyline are linetype, linewidth and color
     * index.
     */
    polyline3d(px: number[] | Float64Array, py: number[] | Float64Array, pz: number[] | Float64Array): void;
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
    axes3d(x_tick: number, y_tick: number, z_tick: number, x_org: number, y_org: number, z_org: number, major_x: number, major_y: number, major_z: number, tick_size: number): void;
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
    grid3d(x_tick: number, y_tick: number, z_tick: number, x_org: number, y_org: number, z_org: number, major_x: number, major_y: number, major_z: number): void;
    titles3d(x_title: string, y_title: string, z_title: string): void;
    /**
     * Draw a three-dimensional surface plot for the given data points.
     * @param{number[] | Float64Array} px - A list containing the x coordinates.
     * @param{number[] | Float64Array} py - A list containing the y coordinates.
     * @param{number[] | Float64Array} pz -
     *  A list of length `px.length` * `py.length` or an appropriately
     *  dimensioned array containing the z coordinates.
     * @param{SURFACE_OPTION} option - Surface display option.
     */
    surface(px: number[] | Float64Array, py: number[] | Float64Array, pz: number[] | Float64Array, option: SURFACE_OPTION): void;
    /**
     * Draw contours of a three-dimensional data set whose values are specified
     * over a rectangular mesh. Contour lines may optionally be labeled.
     * @param{number[] | Float64Array} px - A list containing the x coordinates.
     * @param{number[] | Float64Array} py - A list containing the y coordinates.
     * @param{number[] | Float64Array} h -
     *  A list containing the z coordinates for the height.
     * @param{number[] | Float64Array} pz -
     *  A list of length `x.length` * `y.length` containing the z coordinates.
     * @param{number} major_h -
     *  Directs GR to label contour lines. For example, a value of 3 would label
     *  every third line. A value of 1 will label every line. A value of 0
     *  produces no labels. To produce colored contour lines, add an offset
     *  of 1000 to `major_h`.
     */
    contour(px: number[] | Float64Array, py: number[] | Float64Array, h: number[] | Float64Array, pz: number[] | Float64Array, major_h: number): void;
    hexbin(n: number, x: number[], y: number[], nbins: number): number;
    /**
     * Set the current GR colormap.
     * For a list of built-in colormaps, see https://gr-framework.org/colormaps.html.
     * @param{COLORMAP} colormap - The colormap to use.
     */
    setcolormap(colormap: COLORMAP): void;
    /**
     * Get the current GR colormap.
     */
    inqcolormap(): COLORMAP;
    colorbar(): void;
    inqcolor(color: number): [number, number, number];
    inqcolorfromrgb(red: number, green: number, blue: number): number;
    hsvtorgb(h: number, s: number, v: number): [number, number, number];
    tick(amin: number, amax: number): number;
    validaterange(amin: number, amax: number): number;
    adjustrange(amin: number, amax: number): number[];
    beginprint(pathname: string): void;
    beginprintext(pathname: string, mode: PRINT_MODE, format: PRINT_FORMAT, orientation: PRINT_ORIENTATION): void;
    endprint(): void;
    ndctowc(x: number, y: number): [number, number];
    wctondc(x: number, y: number): [number, number];
    /**
     * Draw a rectangle using the current line attributes.
     * @param{number} xmin - Lower left edge of the rectangle.
     * @param{number} xmax - Lower right edge of the rectangle.
     * @param{number} ymin - Upper left edge of the rectangle.
     * @param{number} ymax - Upper right edge of the rectangle.
     */
    drawrect(xmin: number, xmax: number, ymin: number, ymax: number): void;
    /**
     * Draw a filled rectangle using the current fill attributes.
     * @param{number} xmin - Lower left edge of the rectangle.
     * @param{number} xmax - Lower right edge of the rectangle.
     * @param{number} ymin - Upper left edge of the rectangle.
     * @param{number} ymax - Upper right edge of the rectangle.
     */
    fillrect(xmin: number, xmax: number, ymin: number, ymax: number): void;
    /**
     * Draw a circular or ellipitical arc using the current line attributes.
     * @param{number} xmin - Lower left edge of the rectangle.
     * @param{number} xmax - Lower right edge of the rectangle.
     * @param{number} ymin - Upper left edge of the rectangle.
     * @param{number} ymax - Upper right edge of the rectangle.
     * @param{number} a1 - The start angle.
     * @param{number} a2 - The end angle.
     */
    drawarc(xmin: number, xmax: number, ymin: number, ymax: number, a1: number, a2: number): void;
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
    fillarc(xmin: number, xmax: number, ymin: number, ymax: number, a1: number, a2: number): void;
    drawpath(n: number, vertices: [number, number][], codes: PATH_CODE[], fill: boolean): void;
    /**
     * Set the arrow style to be used for subsequent arrow commands.
     * @param{ARROWSTYLE} style - The arrow style to use.
     */
    setarrowstyle(style: ARROWSTYLE): void;
    /**
     * Set the arrow size to be used for subsequent arrow commands.
     * The default arrow size is 1.
     * @param{number} size - The arrow size to be used.
     */
    setarrowsize(size: number): void;
    /**
     * Draw an arrow between two points.
     * @param{number} x1 - Starting x coordinate of the arrow (tail).
     * @param{number} y1 - Starting y coordinate of the arrow (tail).
     * @param{number} x2 - Ending x coordinate of the arrow (head).
     * @param{number} y2 - Ending y coordinate of the arrow (head).
     */
    drawarrow(x1: number, y1: number, x2: number, y2: number): void;
    readimage(path: string): [number, number, number];
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
    drawimage(xmin: number, xmax: number, ymin: number, ymax: number, width: number, height: number, data: number[] | Int32Array, model?: COLOR_MODEL): void;
    importgraphics(path: string): void;
    setshadow(offsetx: number, offsety: number, blur: number): void;
    settransparency(alpha: number): void;
    setcoordxform(mat: any): void;
    begingraphics(path: string): void;
    endgraphics(): void;
    drawgraphics(str: string): void;
    /**
     * Generate a character string starting at the given location.
     * Strings can be  defined to create mathematical symbols and
     * Greek letters using LaTeX syntax.
     * @param{number} x - The x coordinate of the text string in world coordinates.
     * @param{number} y - The y coordinate of the text string in world coordinates.
     * @param{string} str - The text to be drawn.
     */
    mathtex(x: number, y: number, str: string): void;
    beginselection(index: number, type: number): void;
    endselection(): void;
    moveselection(x: number, y: number): void;
    resizeselection(type: number, x: number, y: number): void;
    inqbbox(): [number, number, number, number];
    precision(): number;
    setregenflags(flags: number): void;
    inqregenflags(): number;
    savestate(): void;
    restorestate(): void;
    selectcontext(context: number): void;
    destroycontext(context: number): void;
    uselinespec(str: string): number;
    shade(x: number[] | Float64Array, y: number[] | Float64Array, lines: number, xform: XFORM, roi: number[] | Float64Array, w: number, h: number): any;
    /**
     * Display a point set as an aggregated and rasterized image. The values
     * for `x` and `y` are in world coordinates.
     *
     * @param{number[] | Float64Array} x - A list containing the x coordinates.
     * @param{number[] | Float64Array} y - A list containing the y coordinates.
     * @param{XFORM} xform - The transformation type to use for color mapping.
     * @param{[number, number]} dims - The size of the grid used for rasterization
     *  (default: `[1200, 1200]`)
     */
    shadepoints(x: number[] | Float64Array, y: number[] | Float64Array, xform: XFORM, dims?: [number, number]): void;
    /**
     * Display a line set as an aggregated and rasterized image. The values
     * for `x` and `y` are in world coordinates.
     *
     * @param{number[] | Float64Array} x - A list containing the x coordinates.
     * @param{number[] | Float64Array} y - A list containing the y coordinates.
     * @param{XFORM} xform - The transformation type to use for color mapping.
     * @param{[number, number]} dims - The size of the grid used for rasterization
     *  (default: `[1200, 1200]`)
     */
    shadelines(x: number[] | Float64Array, y: number[] | Float64Array, xform: XFORM, dims?: [number, number]): void;
    /**
     * Set the pan and zoom attributes for the current window.
     * @param{number} x - The X coordinate of the pan/zoom point.
     * @param{number} y - The Y coordinate of the pan/zoom point.
     * @param{number} zoom - The zoom factor to be apply to the current window's scale.
     * @return An array of `[xmin, xmax, ymin, ymax]` specifying the new window
     *   after the requested zoom operation.
     */
    panzoom(x: number, y: number, zoom: number): [number, number, number, number];
    path(n: number, x: number[] | Float64Array, y: number[] | Float64Array, codes: string): void;
    setborderwidth(width: number): void;
    inqborderwidth(): any;
    setbordercolorind(colorind: number): void;
    inqbordercolorind(): any;
    selectclipxform(tnr: number): void;
    inqclipxform(): any;
    settextencoding(encoding: number): void;
}
interface GrmTooltip {
    x: number;
    y: number;
    xpx: number;
    ypx: number;
    xlabel: string;
    ylabel: string;
    label: string;
}
export declare class GRM {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    callbacks: Function[];
    private _dpr;
    private _original_canvas_size;
    select_canvas(): void;
    constructor(canvasID: string);
    private _set_dpr;
    register(eventType: GRM_EVENT, callback: () => void): void;
    unregister(eventType: GRM_EVENT): number;
    dump_json_str(): string;
    load_from_str(jsonStr: string): number;
    get_tooltip: (x: number, y: number) => GrmTooltip;
    grm_is3d(x: number, y: number): boolean;
    get_box(top: number, right: number, bottom: number, left: number, keepAspectRatio: boolean): [number, number, number, number];
    args_new(): number;
    args_push(args: any, key: string, format: string, ...vals: string[]): number;
    merge(args: number): number;
    merge_named(args: number, identificator: string): number;
    input(input_args: number): number;
    args_delete(args: number): void;
    read(args: any, string: any): number;
    plot(args: any): void;
    dump_json: (args: any, file?: number) => any;
    dump: (args: any, file?: number) => any;
    switch(id: number): any;
    get_stdout(): any;
}
export {};
