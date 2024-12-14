import { ARROWSTYLE, COLOR_MODEL, COLORMAP, FILL_INTSTYLE, FONT, GRM_EVENT, LINETYPE, MARKERTYPE, PATH_CODE, PRINT_FORMAT, PRINT_MODE, PRINT_ORIENTATION, SCALE_OPTION, SCIENTIFIC_FORMAT_OPTION, SPLINE_SMOOTHING, SURFACE_OPTION, TEXT_HALIGN, TEXT_PATH, TEXT_PRECISION, TEXT_VALIGN, XFORM } from "./constants.js";
import { NdArray } from "numjs";
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
    polyline(x: ArrayLike<number> | NdArray, y: ArrayLike<number> | NdArray): void;
    /**
     * Draw marker symbols centered at the given data points.
     * @param {number[]} x - An array of the x coordinates.
     * @param {number[]} y - An array of the y coordinates.
     */
    polymarker(x: ArrayLike<number> | NdArray, y: ArrayLike<number> | NdArray): void;
    text: (x: number, y: number, str: string) => void;
    inqtext(x: number, y: number, str: string): [number, number];
    /**
     * Allows you to specify a polygonal shape of an area to be filled.
     *
     * The attributes that control the appearance of fill areas are fill area interior
     * style, fill area style index and fill area color index.
     *
     * @param {ArrayLike<number> | NdArray} x - A list containing the X coordinates.
     * @param {ArrayLike<number> | NdArray} y - A list containing the Y coordinates.
     */
    fillarea(x: ArrayLike<number> | NdArray, y: ArrayLike<number> | NdArray): void;
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
     * @param{ArrayLike<number> | NdArray} px - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} py - A list containing the y coordinates.
     * @param{number} m - The number of points to be drawn (`m` > `px.length`).
     * @param{SPLINE_SMOOTHING} method - The smoothing method.
     *
     * The values for `x` and `y` are in world coordinates. The attributes that
     * control the appearance of a spline-fit are linetype, linewidth and color
     * index.
     */
    spline(px: ArrayLike<number> | NdArray, py: ArrayLike<number> | NdArray, m: number, method: SPLINE_SMOOTHING): void;
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
    gridit(xd: ArrayLike<number> | NdArray, yd: ArrayLike<number> | NdArray, zd: ArrayLike<number> | NdArray, nx: number, ny: number): [Float64Array, Float64Array, Float64Array];
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
     * @param{ArrayLike<number> | NdArray} px - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} py - A list containing the y coordinates.
     * @param{ArrayLike<number> | NdArray} e1 -
     *  The absolute values of the lower error bar data.
     * @param{ArrayLike<number> | NdArray} e2 -
     *  The absolute values of the upper error bar data.
     */
    verrorbars(px: ArrayLike<number> | NdArray, py: ArrayLike<number> | NdArray, e1: ArrayLike<number> | NdArray, e2: ArrayLike<number> | NdArray): void;
    /**
     * Draw a standard horizontal error bar graph.
     * @param{ArrayLike<number> | NdArray} px - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} py - A list containing the y coordinates.
     * @param{ArrayLike<number> | NdArray} e1 -
     *  The absolute values of the lower error bar data.
     * @param{ArrayLike<number> | NdArray} e2 -
     *  The absolute values of the upper error bar data.
     */
    herrorbars(px: ArrayLike<number> | NdArray, py: ArrayLike<number> | NdArray, e1: ArrayLike<number> | NdArray, e2: ArrayLike<number> | NdArray): void;
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
    polyline3d(px: ArrayLike<number> | NdArray, py: ArrayLike<number> | NdArray, pz: ArrayLike<number> | NdArray): void;
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
     * @param{ArrayLike<number> | NdArray} px - A list containing the x coordinates.
     * @param{ArrayLike<number> | NdArray} py - A list containing the y coordinates.
     * @param{ArrayLike<number> | NdArray} pz -
     *  A list of length `px.length` * `py.length` or an appropriately
     *  dimensioned array containing the z coordinates.
     * @param{SURFACE_OPTION} option - Surface display option.
     */
    surface(px: ArrayLike<number> | NdArray, py: ArrayLike<number> | NdArray, pz: ArrayLike<number> | NdArray, option: SURFACE_OPTION): void;
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
    contour(px: ArrayLike<number> | NdArray, py: ArrayLike<number> | NdArray, h: ArrayLike<number> | NdArray, pz: ArrayLike<number> | NdArray, major_h: number): void;
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
    shade(x: ArrayLike<number> | NdArray, y: ArrayLike<number> | NdArray, lines: number, xform: XFORM, roi: ArrayLike<number> | NdArray, w: number, h: number): any;
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
    shadepoints(x: ArrayLike<number> | NdArray, y: ArrayLike<number> | NdArray, xform: XFORM, dims?: [number, number]): void;
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
    shadelines(x: ArrayLike<number> | NdArray, y: ArrayLike<number> | NdArray, xform: XFORM, dims?: [number, number]): void;
    /**
     * Set the pan and zoom attributes for the current window.
     * @param{number} x - The X coordinate of the pan/zoom point.
     * @param{number} y - The Y coordinate of the pan/zoom point.
     * @param{number} zoom - The zoom factor to be apply to the current window's scale.
     * @return An array of `[xmin, xmax, ymin, ymax]` specifying the new window
     *   after the requested zoom operation.
     */
    panzoom(x: number, y: number, zoom: number): [number, number, number, number];
    path(n: number, x: ArrayLike<number> | NdArray, y: ArrayLike<number> | NdArray, codes: string): void;
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
