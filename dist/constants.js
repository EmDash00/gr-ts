// constants
export const NOCLIP = 0;
export const CLIP = 1;
export var COORDINATES;
(function (COORDINATES) {
    COORDINATES[COORDINATES["WC"] = 0] = "WC";
    COORDINATES[COORDINATES["NDC"] = 1] = "NDC";
})(COORDINATES || (COORDINATES = {}));
export var FILL_INTSTYLE;
(function (FILL_INTSTYLE) {
    FILL_INTSTYLE[FILL_INTSTYLE["HOLLOW"] = 0] = "HOLLOW";
    FILL_INTSTYLE[FILL_INTSTYLE["SOLID"] = 1] = "SOLID";
    FILL_INTSTYLE[FILL_INTSTYLE["PATTERN"] = 2] = "PATTERN";
    FILL_INTSTYLE[FILL_INTSTYLE["HATCH"] = 3] = "HATCH";
})(FILL_INTSTYLE || (FILL_INTSTYLE = {}));
export var TEXT_HALIGN;
(function (TEXT_HALIGN) {
    TEXT_HALIGN[TEXT_HALIGN["NORMAL"] = 0] = "NORMAL";
    TEXT_HALIGN[TEXT_HALIGN["LEFT"] = 1] = "LEFT";
    TEXT_HALIGN[TEXT_HALIGN["CENTER"] = 2] = "CENTER";
    TEXT_HALIGN[TEXT_HALIGN["RIGHT"] = 3] = "RIGHT";
})(TEXT_HALIGN || (TEXT_HALIGN = {}));
export var TEXT_VALIGN;
(function (TEXT_VALIGN) {
    TEXT_VALIGN[TEXT_VALIGN["NORMAL"] = 0] = "NORMAL";
    TEXT_VALIGN[TEXT_VALIGN["TOP"] = 1] = "TOP";
    TEXT_VALIGN[TEXT_VALIGN["CAP"] = 2] = "CAP";
    TEXT_VALIGN[TEXT_VALIGN["HALF"] = 3] = "HALF";
    TEXT_VALIGN[TEXT_VALIGN["BASE"] = 4] = "BASE";
    TEXT_VALIGN[TEXT_VALIGN["BOTTOM"] = 5] = "BOTTOM";
})(TEXT_VALIGN || (TEXT_VALIGN = {}));
export var TEXT_PATH;
(function (TEXT_PATH) {
    TEXT_PATH[TEXT_PATH["RIGHT"] = 0] = "RIGHT";
    TEXT_PATH[TEXT_PATH["LEFT"] = 1] = "LEFT";
    TEXT_PATH[TEXT_PATH["UP"] = 2] = "UP";
    TEXT_PATH[TEXT_PATH["DOWN"] = 3] = "DOWN";
})(TEXT_PATH || (TEXT_PATH = {}));
/**
 * The appearance of a font depends on the text precision value specified.
  * STRING, CHARACTER or STROKE precision allows for a greater or lesser
  * realization of the text primitives, for efficiency. STRING is the
  * default precision for GR and produces the high quality output using either
  * native font rendering or FreeType. OUTLINE uses the GR path rendering
  * functions to draw individual glyphs and produces the highest quality
  * output.
 */
export var TEXT_PRECISION;
(function (TEXT_PRECISION) {
    TEXT_PRECISION[TEXT_PRECISION["STRING"] = 0] = "STRING";
    TEXT_PRECISION[TEXT_PRECISION["CHAR"] = 1] = "CHAR";
    TEXT_PRECISION[TEXT_PRECISION["STROKE"] = 2] = "STROKE";
    TEXT_PRECISION[TEXT_PRECISION["OUTLINE"] = 3] = "OUTLINE";
})(TEXT_PRECISION || (TEXT_PRECISION = {}));
export var LINETYPE;
(function (LINETYPE) {
    LINETYPE[LINETYPE["SOLID"] = 1] = "SOLID";
    LINETYPE[LINETYPE["DASHED"] = 2] = "DASHED";
    LINETYPE[LINETYPE["DOTTED"] = 3] = "DOTTED";
    LINETYPE[LINETYPE["DASHED_DOTTED"] = 4] = "DASHED_DOTTED";
    LINETYPE[LINETYPE["DASH_2_DOT"] = -1] = "DASH_2_DOT";
    LINETYPE[LINETYPE["DASH_3_DOT"] = -2] = "DASH_3_DOT";
    LINETYPE[LINETYPE["LONG_DASH"] = -3] = "LONG_DASH";
    LINETYPE[LINETYPE["LONG_SHORT_DASH"] = -4] = "LONG_SHORT_DASH";
    LINETYPE[LINETYPE["SPACED_DASH"] = -5] = "SPACED_DASH";
    LINETYPE[LINETYPE["SPACED_DOT"] = -6] = "SPACED_DOT";
    LINETYPE[LINETYPE["DOUBLE_DOT"] = -7] = "DOUBLE_DOT";
    LINETYPE[LINETYPE["TRIPLE_DOT"] = -8] = "TRIPLE_DOT";
})(LINETYPE || (LINETYPE = {}));
export var MARKERTYPE;
(function (MARKERTYPE) {
    MARKERTYPE[MARKERTYPE["DOT"] = 1] = "DOT";
    MARKERTYPE[MARKERTYPE["PLUS"] = 2] = "PLUS";
    MARKERTYPE[MARKERTYPE["ASTERISK"] = 3] = "ASTERISK";
    MARKERTYPE[MARKERTYPE["CIRCLE"] = 4] = "CIRCLE";
    MARKERTYPE[MARKERTYPE["DIAGONAL_CROSS"] = 5] = "DIAGONAL_CROSS";
    MARKERTYPE[MARKERTYPE["SOLID_CIRCLE"] = -1] = "SOLID_CIRCLE";
    MARKERTYPE[MARKERTYPE["TRIANGLE_UP"] = -2] = "TRIANGLE_UP";
    MARKERTYPE[MARKERTYPE["SOLID_TRI_UP"] = -3] = "SOLID_TRI_UP";
    MARKERTYPE[MARKERTYPE["TRIANGLE_DOWN"] = -4] = "TRIANGLE_DOWN";
    MARKERTYPE[MARKERTYPE["SOLID_TRI_DOWN"] = -5] = "SOLID_TRI_DOWN";
    MARKERTYPE[MARKERTYPE["SQUARE"] = -6] = "SQUARE";
    MARKERTYPE[MARKERTYPE["SOLID_SQUARE"] = -7] = "SOLID_SQUARE";
    MARKERTYPE[MARKERTYPE["BOWTIE"] = -8] = "BOWTIE";
    MARKERTYPE[MARKERTYPE["SOLID_BOWTIE"] = -9] = "SOLID_BOWTIE";
    MARKERTYPE[MARKERTYPE["HOURGLASS"] = -10] = "HOURGLASS";
    MARKERTYPE[MARKERTYPE["SOLID_HGLASS"] = -11] = "SOLID_HGLASS";
    MARKERTYPE[MARKERTYPE["DIAMOND"] = -12] = "DIAMOND";
    MARKERTYPE[MARKERTYPE["SOLID_DIAMOND"] = -13] = "SOLID_DIAMOND";
    MARKERTYPE[MARKERTYPE["STAR"] = -14] = "STAR";
    MARKERTYPE[MARKERTYPE["SOLID_STAR"] = -15] = "SOLID_STAR";
    MARKERTYPE[MARKERTYPE["TRI_UP_DOWN"] = -16] = "TRI_UP_DOWN";
    MARKERTYPE[MARKERTYPE["SOLID_TRI_RIGHT"] = -17] = "SOLID_TRI_RIGHT";
    MARKERTYPE[MARKERTYPE["SOLID_TRI_LEFT"] = -18] = "SOLID_TRI_LEFT";
    MARKERTYPE[MARKERTYPE["HOLLOW_PLUS"] = -19] = "HOLLOW_PLUS";
    MARKERTYPE[MARKERTYPE["SOLID_PLUS"] = -20] = "SOLID_PLUS";
    MARKERTYPE[MARKERTYPE["PENTAGON"] = -21] = "PENTAGON";
    MARKERTYPE[MARKERTYPE["HEXAGON"] = -22] = "HEXAGON";
    MARKERTYPE[MARKERTYPE["HEPTAGON"] = -23] = "HEPTAGON";
    MARKERTYPE[MARKERTYPE["OCTAGON"] = -24] = "OCTAGON";
    MARKERTYPE[MARKERTYPE["STAR_4"] = -25] = "STAR_4";
    MARKERTYPE[MARKERTYPE["STAR_5"] = -26] = "STAR_5";
    MARKERTYPE[MARKERTYPE["STAR_6"] = -27] = "STAR_6";
    MARKERTYPE[MARKERTYPE["STAR_7"] = -28] = "STAR_7";
    MARKERTYPE[MARKERTYPE["STAR_8"] = -29] = "STAR_8";
    MARKERTYPE[MARKERTYPE["VLINE"] = -30] = "VLINE";
    MARKERTYPE[MARKERTYPE["HLINE"] = -31] = "HLINE";
    MARKERTYPE[MARKERTYPE["OMARK"] = -32] = "OMARK";
})(MARKERTYPE || (MARKERTYPE = {}));
export var ARROWSTYLE;
(function (ARROWSTYLE) {
    ARROWSTYLE[ARROWSTYLE["SINGLE_ENDED_SIMPLE"] = 1] = "SINGLE_ENDED_SIMPLE";
    ARROWSTYLE[ARROWSTYLE["SINGLE_ENDED_SIMPLE_ACUTE_HEAD"] = 2] = "SINGLE_ENDED_SIMPLE_ACUTE_HEAD";
    ARROWSTYLE[ARROWSTYLE["SINGLE_ENDED_HOLLOW"] = 3] = "SINGLE_ENDED_HOLLOW";
    ARROWSTYLE[ARROWSTYLE["SINGLE_ENDED_FILLEd"] = 4] = "SINGLE_ENDED_FILLEd";
    ARROWSTYLE[ARROWSTYLE["SINGLE_ENDED_TRIANGLE"] = 5] = "SINGLE_ENDED_TRIANGLE";
    ARROWSTYLE[ARROWSTYLE["SINGLE_ENDED_FILLED_TRIANGLE"] = 6] = "SINGLE_ENDED_FILLED_TRIANGLE";
    ARROWSTYLE[ARROWSTYLE["SINGLE_ENDED_KITE"] = 7] = "SINGLE_ENDED_KITE";
    ARROWSTYLE[ARROWSTYLE["SINGLE_ENDED_FILLED_KITE"] = 8] = "SINGLE_ENDED_FILLED_KITE";
    ARROWSTYLE[ARROWSTYLE["DOUBLE_ENDED_SIMPLE"] = 9] = "DOUBLE_ENDED_SIMPLE";
    ARROWSTYLE[ARROWSTYLE["DOUBLE_ENDED_SIMPLE_ACUTE_HEAD"] = 10] = "DOUBLE_ENDED_SIMPLE_ACUTE_HEAD";
    ARROWSTYLE[ARROWSTYLE["DOUBLE_ENDED_HOLLOW"] = 11] = "DOUBLE_ENDED_HOLLOW";
    ARROWSTYLE[ARROWSTYLE["DOUBLE_ENDED_FILLEd"] = 12] = "DOUBLE_ENDED_FILLEd";
    ARROWSTYLE[ARROWSTYLE["DOUBLE_ENDED_TRIANGLE"] = 13] = "DOUBLE_ENDED_TRIANGLE";
    ARROWSTYLE[ARROWSTYLE["DOUBLE_ENDED_FILLED_TRIANGLE"] = 14] = "DOUBLE_ENDED_FILLED_TRIANGLE";
    ARROWSTYLE[ARROWSTYLE["DOUBLE_ENDED_KITE"] = 15] = "DOUBLE_ENDED_KITE";
    ARROWSTYLE[ARROWSTYLE["DOUBLE_ENDED_FILLED_KITE"] = 16] = "DOUBLE_ENDED_FILLED_KITE";
    ARROWSTYLE[ARROWSTYLE["SINGLE_ENDED_DOUBLE_LINE"] = 17] = "SINGLE_ENDED_DOUBLE_LINE";
    ARROWSTYLE[ARROWSTYLE["DOUBLE_ENDED_DOUBLE_LINE"] = 18] = "DOUBLE_ENDED_DOUBLE_LINE";
})(ARROWSTYLE || (ARROWSTYLE = {}));
export var INTERP2_METHOD;
(function (INTERP2_METHOD) {
    INTERP2_METHOD[INTERP2_METHOD["NEAREST"] = 0] = "NEAREST";
    INTERP2_METHOD[INTERP2_METHOD["LINEAR"] = 1] = "LINEAR";
    INTERP2_METHOD[INTERP2_METHOD["SPLINE"] = 2] = "SPLINE";
    INTERP2_METHOD[INTERP2_METHOD["CUBIC"] = 3] = "CUBIC";
})(INTERP2_METHOD || (INTERP2_METHOD = {}));
export var SPLINE_SMOOTHING;
(function (SPLINE_SMOOTHING) {
    SPLINE_SMOOTHING[SPLINE_SMOOTHING["CROSS_VALIDATED"] = 1] = "CROSS_VALIDATED";
    SPLINE_SMOOTHING[SPLINE_SMOOTHING["NATURAL_CUBIC"] = 0] = "NATURAL_CUBIC";
    SPLINE_SMOOTHING[SPLINE_SMOOTHING["B_SPLINE"] = -1] = "B_SPLINE";
})(SPLINE_SMOOTHING || (SPLINE_SMOOTHING = {}));
export var SCALE_OPTION;
(function (SCALE_OPTION) {
    SCALE_OPTION[SCALE_OPTION["X_LOG"] = 1] = "X_LOG";
    SCALE_OPTION[SCALE_OPTION["Y_LOG"] = 2] = "Y_LOG";
    SCALE_OPTION[SCALE_OPTION["Z_LOG"] = 4] = "Z_LOG";
    SCALE_OPTION[SCALE_OPTION["FLIP_X"] = 8] = "FLIP_X";
    SCALE_OPTION[SCALE_OPTION["FLIP_Y"] = 16] = "FLIP_Y";
    SCALE_OPTION[SCALE_OPTION["FLIP_Z"] = 32] = "FLIP_Z";
    SCALE_OPTION[SCALE_OPTION["X_LOG2"] = 64] = "X_LOG2";
    SCALE_OPTION[SCALE_OPTION["Y_LOG2"] = 128] = "Y_LOG2";
    SCALE_OPTION[SCALE_OPTION["Z_LOG2"] = 256] = "Z_LOG2";
    SCALE_OPTION[SCALE_OPTION["X_LN"] = 512] = "X_LN";
    SCALE_OPTION[SCALE_OPTION["Y_LN"] = 1024] = "Y_LN";
    SCALE_OPTION[SCALE_OPTION["Z_LN"] = 2048] = "Z_LN";
})(SCALE_OPTION || (SCALE_OPTION = {}));
export var LINESPEC;
(function (LINESPEC) {
    LINESPEC[LINESPEC["LINE"] = 1] = "LINE";
    LINESPEC[LINESPEC["MARKER"] = 2] = "MARKER";
    LINESPEC[LINESPEC["COLOR"] = 4] = "COLOR";
})(LINESPEC || (LINESPEC = {}));
export var SURFACE_OPTION;
(function (SURFACE_OPTION) {
    SURFACE_OPTION[SURFACE_OPTION["LINES"] = 0] = "LINES";
    SURFACE_OPTION[SURFACE_OPTION["MESH"] = 1] = "MESH";
    SURFACE_OPTION[SURFACE_OPTION["FILLED_MESH"] = 2] = "FILLED_MESH";
    SURFACE_OPTION[SURFACE_OPTION["Z_SHADED_MESH"] = 3] = "Z_SHADED_MESH";
    SURFACE_OPTION[SURFACE_OPTION["COLORED_MESH"] = 4] = "COLORED_MESH";
    SURFACE_OPTION[SURFACE_OPTION["CELL_ARRAY"] = 5] = "CELL_ARRAY";
    SURFACE_OPTION[SURFACE_OPTION["SHADED_MESH"] = 6] = "SHADED_MESH";
    SURFACE_OPTION[SURFACE_OPTION["MESH_3D"] = 7] = "MESH_3D";
})(SURFACE_OPTION || (SURFACE_OPTION = {}));
export var PATH_CODE;
(function (PATH_CODE) {
    PATH_CODE[PATH_CODE["STOP"] = 0] = "STOP";
    PATH_CODE[PATH_CODE["MOVETO"] = 1] = "MOVETO";
    PATH_CODE[PATH_CODE["LINETO"] = 2] = "LINETO";
    PATH_CODE[PATH_CODE["CURVE3"] = 3] = "CURVE3";
    PATH_CODE[PATH_CODE["CURVE4"] = 4] = "CURVE4";
    PATH_CODE[PATH_CODE["CLOSEPOLY"] = 79] = "CLOSEPOLY";
})(PATH_CODE || (PATH_CODE = {}));
export var COLOR_MODEL;
(function (COLOR_MODEL) {
    COLOR_MODEL[COLOR_MODEL["RGB"] = 0] = "RGB";
    COLOR_MODEL[COLOR_MODEL["HSV"] = 1] = "HSV";
})(COLOR_MODEL || (COLOR_MODEL = {}));
export var COLORMAP;
(function (COLORMAP) {
    COLORMAP[COLORMAP["UNIFORM"] = 0] = "UNIFORM";
    COLORMAP[COLORMAP["TEMPERATURE"] = 1] = "TEMPERATURE";
    COLORMAP[COLORMAP["GRAYSCALE"] = 2] = "GRAYSCALE";
    COLORMAP[COLORMAP["GLOWING"] = 3] = "GLOWING";
    COLORMAP[COLORMAP["RAINBOWLIKE"] = 4] = "RAINBOWLIKE";
    COLORMAP[COLORMAP["GEOLOGIC"] = 5] = "GEOLOGIC";
    COLORMAP[COLORMAP["GREENSCALE"] = 6] = "GREENSCALE";
    COLORMAP[COLORMAP["CYANSCALE"] = 7] = "CYANSCALE";
    COLORMAP[COLORMAP["BLUESCALE"] = 8] = "BLUESCALE";
    COLORMAP[COLORMAP["MAGENTASCALE"] = 9] = "MAGENTASCALE";
    COLORMAP[COLORMAP["REDSCALE"] = 10] = "REDSCALE";
    COLORMAP[COLORMAP["FLAME"] = 11] = "FLAME";
    COLORMAP[COLORMAP["BROWNSCALE"] = 12] = "BROWNSCALE";
    COLORMAP[COLORMAP["PILATUS"] = 13] = "PILATUS";
    COLORMAP[COLORMAP["AUTUMN"] = 14] = "AUTUMN";
    COLORMAP[COLORMAP["BONE"] = 15] = "BONE";
    COLORMAP[COLORMAP["COOL"] = 16] = "COOL";
    COLORMAP[COLORMAP["COPPER"] = 17] = "COPPER";
    COLORMAP[COLORMAP["GRAY"] = 18] = "GRAY";
    COLORMAP[COLORMAP["HOT"] = 19] = "HOT";
    COLORMAP[COLORMAP["HSV"] = 20] = "HSV";
    COLORMAP[COLORMAP["JET"] = 21] = "JET";
    COLORMAP[COLORMAP["PINK"] = 22] = "PINK";
    COLORMAP[COLORMAP["SPECTRAL"] = 23] = "SPECTRAL";
    COLORMAP[COLORMAP["SPRING"] = 24] = "SPRING";
    COLORMAP[COLORMAP["SUMMER"] = 25] = "SUMMER";
    COLORMAP[COLORMAP["WINTER"] = 26] = "WINTER";
    COLORMAP[COLORMAP["GIST_EARTH"] = 27] = "GIST_EARTH";
    COLORMAP[COLORMAP["GIST_HEAT"] = 28] = "GIST_HEAT";
    COLORMAP[COLORMAP["GIST_NCAR"] = 29] = "GIST_NCAR";
    COLORMAP[COLORMAP["GIST_RAINBOW"] = 30] = "GIST_RAINBOW";
    COLORMAP[COLORMAP["GIST_STERN"] = 31] = "GIST_STERN";
    COLORMAP[COLORMAP["AFMHOT"] = 32] = "AFMHOT";
    COLORMAP[COLORMAP["BRG"] = 33] = "BRG";
    COLORMAP[COLORMAP["BWR"] = 34] = "BWR";
    COLORMAP[COLORMAP["COOLWARM"] = 35] = "COOLWARM";
    COLORMAP[COLORMAP["CMRMAP"] = 36] = "CMRMAP";
    COLORMAP[COLORMAP["CUBEHELIX"] = 37] = "CUBEHELIX";
    COLORMAP[COLORMAP["GNUPLOT"] = 38] = "GNUPLOT";
    COLORMAP[COLORMAP["GNUPLOT2"] = 39] = "GNUPLOT2";
    COLORMAP[COLORMAP["OCEAN"] = 40] = "OCEAN";
    COLORMAP[COLORMAP["RAINBOW"] = 41] = "RAINBOW";
    COLORMAP[COLORMAP["SEISMIC"] = 42] = "SEISMIC";
    COLORMAP[COLORMAP["TERRAIN"] = 43] = "TERRAIN";
    COLORMAP[COLORMAP["VIRIDIS"] = 44] = "VIRIDIS";
    COLORMAP[COLORMAP["INFERNO"] = 45] = "INFERNO";
    COLORMAP[COLORMAP["PLASMA"] = 46] = "PLASMA";
    COLORMAP[COLORMAP["MAGMA"] = 47] = "MAGMA";
    COLORMAP[COLORMAP["TEMPERATURE_REVERSED"] = -1] = "TEMPERATURE_REVERSED";
    COLORMAP[COLORMAP["GRAYSCALE_REVERSED"] = -2] = "GRAYSCALE_REVERSED";
    COLORMAP[COLORMAP["GLOWING_REVERSED"] = -3] = "GLOWING_REVERSED";
    COLORMAP[COLORMAP["RAINBOWLIKE_REVERSED"] = -4] = "RAINBOWLIKE_REVERSED";
    COLORMAP[COLORMAP["GEOLOGIC_REVERSED"] = -5] = "GEOLOGIC_REVERSED";
    COLORMAP[COLORMAP["GREENSCALE_REVERSED"] = -6] = "GREENSCALE_REVERSED";
    COLORMAP[COLORMAP["CYANSCALE_REVERSED"] = -7] = "CYANSCALE_REVERSED";
    COLORMAP[COLORMAP["BLUESCALE_REVERSED"] = -8] = "BLUESCALE_REVERSED";
    COLORMAP[COLORMAP["MAGENTASCALE_REVERSED"] = -9] = "MAGENTASCALE_REVERSED";
    COLORMAP[COLORMAP["REDSCALE_REVERSED"] = -10] = "REDSCALE_REVERSED";
    COLORMAP[COLORMAP["FLAME_REVERSED"] = -11] = "FLAME_REVERSED";
    COLORMAP[COLORMAP["BROWNSCALE_REVERSED"] = -12] = "BROWNSCALE_REVERSED";
    COLORMAP[COLORMAP["PILATUS_REVERSED"] = -13] = "PILATUS_REVERSED";
    COLORMAP[COLORMAP["AUTUMN_REVERSED"] = -14] = "AUTUMN_REVERSED";
    COLORMAP[COLORMAP["BONE_REVERSED"] = -15] = "BONE_REVERSED";
    COLORMAP[COLORMAP["COOL_REVERSED"] = -16] = "COOL_REVERSED";
    COLORMAP[COLORMAP["COPPER_REVERSED"] = -17] = "COPPER_REVERSED";
    COLORMAP[COLORMAP["GRAY_REVERSED"] = -18] = "GRAY_REVERSED";
    COLORMAP[COLORMAP["HOT_REVERSED"] = -19] = "HOT_REVERSED";
    COLORMAP[COLORMAP["HSV_REVERSED"] = -20] = "HSV_REVERSED";
    COLORMAP[COLORMAP["JET_REVERSED"] = -21] = "JET_REVERSED";
    COLORMAP[COLORMAP["PINK_REVERSED"] = -22] = "PINK_REVERSED";
    COLORMAP[COLORMAP["SPECTRAL_REVERSED"] = -23] = "SPECTRAL_REVERSED";
    COLORMAP[COLORMAP["SPRING_REVERSED"] = -24] = "SPRING_REVERSED";
    COLORMAP[COLORMAP["SUMMER_REVERSED"] = -25] = "SUMMER_REVERSED";
    COLORMAP[COLORMAP["WINTER_REVERSED"] = -26] = "WINTER_REVERSED";
    COLORMAP[COLORMAP["GIST_EARTH_REVERSED"] = -27] = "GIST_EARTH_REVERSED";
    COLORMAP[COLORMAP["GIST_HEAT_REVERSED"] = -28] = "GIST_HEAT_REVERSED";
    COLORMAP[COLORMAP["GIST_NCAR_REVERSED"] = -29] = "GIST_NCAR_REVERSED";
    COLORMAP[COLORMAP["GIST_RAINBOW_REVERSED"] = -30] = "GIST_RAINBOW_REVERSED";
    COLORMAP[COLORMAP["GIST_STERN_REVERSED"] = -31] = "GIST_STERN_REVERSED";
    COLORMAP[COLORMAP["AFMHOT_REVERSED"] = -32] = "AFMHOT_REVERSED";
    COLORMAP[COLORMAP["BRG_REVERSED"] = -33] = "BRG_REVERSED";
    COLORMAP[COLORMAP["BWR_REVERSED"] = -34] = "BWR_REVERSED";
    COLORMAP[COLORMAP["COOLWARM_REVERSED"] = -35] = "COOLWARM_REVERSED";
    COLORMAP[COLORMAP["CMRMAP_REVERSED"] = -36] = "CMRMAP_REVERSED";
    COLORMAP[COLORMAP["CUBEHELIX_REVERSED"] = -37] = "CUBEHELIX_REVERSED";
    COLORMAP[COLORMAP["GNUPLOT_REVERSED"] = -38] = "GNUPLOT_REVERSED";
    COLORMAP[COLORMAP["GNUPLOT2_REVERSED"] = -39] = "GNUPLOT2_REVERSED";
    COLORMAP[COLORMAP["OCEAN_REVERSED"] = -40] = "OCEAN_REVERSED";
    COLORMAP[COLORMAP["RAINBOW_REVERSED"] = -41] = "RAINBOW_REVERSED";
    COLORMAP[COLORMAP["SEISMIC_REVERSED"] = -42] = "SEISMIC_REVERSED";
    COLORMAP[COLORMAP["TERRAIN_REVERSED"] = -43] = "TERRAIN_REVERSED";
    COLORMAP[COLORMAP["VIRIDIS_REVERSED"] = -44] = "VIRIDIS_REVERSED";
    COLORMAP[COLORMAP["INFERNO_REVERSED"] = -45] = "INFERNO_REVERSED";
    COLORMAP[COLORMAP["PLASMA_REVERSED"] = -46] = "PLASMA_REVERSED";
    COLORMAP[COLORMAP["MAGMA_REVERSED"] = -47] = "MAGMA_REVERSED";
})(COLORMAP || (COLORMAP = {}));
export var FONT;
(function (FONT) {
    FONT[FONT["TIMES_ROMAN"] = 101] = "TIMES_ROMAN";
    FONT[FONT["TIMES_ITALIC"] = 102] = "TIMES_ITALIC";
    FONT[FONT["TIMES_BOLD"] = 103] = "TIMES_BOLD";
    FONT[FONT["TIMES_BOLDITALIC"] = 104] = "TIMES_BOLDITALIC";
    FONT[FONT["HELVETICA"] = 105] = "HELVETICA";
    FONT[FONT["HELVETICA_OBLIQUE"] = 106] = "HELVETICA_OBLIQUE";
    FONT[FONT["HELVETICA_BOLD"] = 107] = "HELVETICA_BOLD";
    FONT[FONT["HELVETICA_BOLDOBLIQUE"] = 108] = "HELVETICA_BOLDOBLIQUE";
    FONT[FONT["COURIER"] = 109] = "COURIER";
    FONT[FONT["COURIER_OBLIQUE"] = 110] = "COURIER_OBLIQUE";
    FONT[FONT["COURIER_BOLD"] = 111] = "COURIER_BOLD";
    FONT[FONT["COURIER_BOLDOBLIQUE"] = 112] = "COURIER_BOLDOBLIQUE";
    FONT[FONT["SYMBOL"] = 113] = "SYMBOL";
    FONT[FONT["BOOKMAN_LIGHT"] = 114] = "BOOKMAN_LIGHT";
    FONT[FONT["BOOKMAN_LIGHTITALIC"] = 115] = "BOOKMAN_LIGHTITALIC";
    FONT[FONT["BOOKMAN_DEMI"] = 116] = "BOOKMAN_DEMI";
    FONT[FONT["BOOKMAN_DEMIITALIC"] = 117] = "BOOKMAN_DEMIITALIC";
    FONT[FONT["NEWCENTURYSCHLBK_ROMAN"] = 118] = "NEWCENTURYSCHLBK_ROMAN";
    FONT[FONT["NEWCENTURYSCHLBK_ITALIC"] = 119] = "NEWCENTURYSCHLBK_ITALIC";
    FONT[FONT["NEWCENTURYSCHLBK_BOLD"] = 120] = "NEWCENTURYSCHLBK_BOLD";
    FONT[FONT["NEWCENTURYSCHLBK_BOLDITALIC"] = 121] = "NEWCENTURYSCHLBK_BOLDITALIC";
    FONT[FONT["AVANTGARDE_BOOK"] = 122] = "AVANTGARDE_BOOK";
    FONT[FONT["AVANTGARDE_BOOKOBLIQUE"] = 123] = "AVANTGARDE_BOOKOBLIQUE";
    FONT[FONT["AVANTGARDE_DEMI"] = 124] = "AVANTGARDE_DEMI";
    FONT[FONT["AVANTGARDE_DEMIOBLIQUE"] = 125] = "AVANTGARDE_DEMIOBLIQUE";
    FONT[FONT["PALATINO_ROMAN"] = 126] = "PALATINO_ROMAN";
    FONT[FONT["PALATINO_ITALIC"] = 127] = "PALATINO_ITALIC";
    FONT[FONT["PALATINO_BOLD"] = 128] = "PALATINO_BOLD";
    FONT[FONT["PALATINO_BOLDITALIC"] = 129] = "PALATINO_BOLDITALIC";
    FONT[FONT["ZAPFCHANCERY_MEDIUMITALIC"] = 130] = "ZAPFCHANCERY_MEDIUMITALIC";
    FONT[FONT["ZAPFDINGBATS"] = 131] = "ZAPFDINGBATS";
})(FONT || (FONT = {}));
export var SCIENTIFIC_FORMAT_OPTION;
(function (SCIENTIFIC_FORMAT_OPTION) {
    SCIENTIFIC_FORMAT_OPTION[SCIENTIFIC_FORMAT_OPTION["E"] = 1] = "E";
    SCIENTIFIC_FORMAT_OPTION[SCIENTIFIC_FORMAT_OPTION["TEXTEX"] = 2] = "TEXTEX";
    SCIENTIFIC_FORMAT_OPTION[SCIENTIFIC_FORMAT_OPTION["MATHTEX"] = 3] = "MATHTEX";
})(SCIENTIFIC_FORMAT_OPTION || (SCIENTIFIC_FORMAT_OPTION = {}));
// gr.beginprint types;
export var PRINT_TYPE;
(function (PRINT_TYPE) {
    PRINT_TYPE["PS"] = "ps";
    PRINT_TYPE["EPS"] = "eps";
    PRINT_TYPE["PDF"] = "pdf";
    PRINT_TYPE["PGF"] = "pgf";
    PRINT_TYPE["BMP"] = "bmp";
    PRINT_TYPE["JPEG"] = "jpeg";
    PRINT_TYPE["JPG"] = "jpg";
    PRINT_TYPE["PNG"] = "png";
    PRINT_TYPE["TIFF"] = "tiff";
    PRINT_TYPE["TIF"] = "tif";
    PRINT_TYPE["FIG"] = "fig";
    PRINT_TYPE["SVG"] = "svg";
    PRINT_TYPE["WMF"] = "wmf";
})(PRINT_TYPE || (PRINT_TYPE = {}));
export var PRINT_FORMAT;
(function (PRINT_FORMAT) {
    PRINT_FORMAT["A4"] = "A4";
    PRINT_FORMAT["B5"] = "B5";
    PRINT_FORMAT["LETTER"] = "Letter";
    PRINT_FORMAT["EXECUTIVE"] = "Executive";
    PRINT_FORMAT["A0"] = "A0";
    PRINT_FORMAT["A1"] = "A1";
    PRINT_FORMAT["A2"] = "A2";
    PRINT_FORMAT["A3"] = "A3";
    PRINT_FORMAT["A5"] = "A5";
    PRINT_FORMAT["A6"] = "A6";
    PRINT_FORMAT["A7"] = "A7";
    PRINT_FORMAT["A8"] = "A8";
    PRINT_FORMAT["A9"] = "A9";
    PRINT_FORMAT["B0"] = "B0";
    PRINT_FORMAT["B1"] = "B1";
    PRINT_FORMAT["B2"] = "B2";
    PRINT_FORMAT["B3"] = "B3";
    PRINT_FORMAT["B4"] = "B4";
    PRINT_FORMAT["B6"] = "B6";
    PRINT_FORMAT["B7"] = "B7";
    PRINT_FORMAT["B8"] = "B8";
    PRINT_FORMAT["B9"] = "B9";
    PRINT_FORMAT["B10"] = "B10";
    PRINT_FORMAT["C5E"] = "C5E";
    PRINT_FORMAT["COMM10E"] = "Comm10E";
    PRINT_FORMAT["DLE"] = "DLE";
    PRINT_FORMAT["FOLIO"] = "Folio";
    PRINT_FORMAT["LEDGER"] = "Ledger";
    PRINT_FORMAT["TABLOID"] = "Tabloid";
})(PRINT_FORMAT || (PRINT_FORMAT = {}));
export var PRINT_MODE;
(function (PRINT_MODE) {
    PRINT_MODE["COLOR"] = "Color";
    PRINT_MODE["GRAYSCALE"] = "Grayscale";
})(PRINT_MODE || (PRINT_MODE = {}));
export var PRINT_ORIENTATION;
(function (PRINT_ORIENTATION) {
    PRINT_ORIENTATION["PORTRAIT"] = "Portrait";
    PRINT_ORIENTATION["LANDSCAPE"] = "Landscape";
})(PRINT_ORIENTATION || (PRINT_ORIENTATION = {}));
export var XFORM;
(function (XFORM) {
    XFORM[XFORM["BOOLEAN"] = 0] = "BOOLEAN";
    XFORM[XFORM["LINEAR"] = 1] = "LINEAR";
    XFORM[XFORM["LOG"] = 2] = "LOG";
    XFORM[XFORM["LOGLOG"] = 3] = "LOGLOG";
    XFORM[XFORM["CUBIC"] = 4] = "CUBIC";
    XFORM[XFORM["EQUALIZED"] = 5] = "EQUALIZED";
})(XFORM || (XFORM = {}));
export var GRM_EVENT;
(function (GRM_EVENT) {
    GRM_EVENT[GRM_EVENT["NEW_PLOT"] = 0] = "NEW_PLOT";
    GRM_EVENT[GRM_EVENT["UPDATE_PLOT"] = 1] = "UPDATE_PLOT";
    GRM_EVENT[GRM_EVENT["SIZE"] = 2] = "SIZE";
    GRM_EVENT[GRM_EVENT["MERGE_END"] = 3] = "MERGE_END";
})(GRM_EVENT || (GRM_EVENT = {}));