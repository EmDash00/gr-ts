var Module = (() => {
    var _scriptName = import.meta.url;
    return (async function (moduleArg = {}) {
        var moduleRtn;
        var Module = moduleArg;
        var readyPromiseResolve, readyPromiseReject;
        var readyPromise = new Promise((resolve, reject) => { readyPromiseResolve = resolve; readyPromiseReject = reject; });
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
        if (ENVIRONMENT_IS_NODE) {
            const { createRequire } = await import("module");
            let dirname = import.meta.url;
            if (dirname.startsWith("data:")) {
                dirname = "/";
            }
            var require = createRequire(dirname);
        }
        var moduleOverrides = Object.assign({}, Module);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => { throw toThrow; };
        var scriptDirectory = "";
        function locateFile(path) { if (Module["locateFile"]) {
            return Module["locateFile"](path, scriptDirectory);
        } return scriptDirectory + path; }
        var readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
            var fs = require("fs");
            var nodePath = require("path");
            if (!import.meta.url.startsWith("data:")) {
                scriptDirectory = nodePath.dirname(require("url").fileURLToPath(import.meta.url)) + "/";
            }
            readBinary = filename => { filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename); var ret = fs.readFileSync(filename); return ret; };
            readAsync = (filename, binary = true) => { filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename); return new Promise((resolve, reject) => { fs.readFile(filename, binary ? undefined : "utf8", (err, data) => { if (err)
                reject(err);
            else
                resolve(binary ? data.buffer : data); }); }); };
            if (!Module["thisProgram"] && process.argv.length > 1) {
                thisProgram = process.argv[1].replace(/\\/g, "/");
            }
            arguments_ = process.argv.slice(2);
            quit_ = (status, toThrow) => { process.exitCode = status; throw toThrow; };
        }
        else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            if (ENVIRONMENT_IS_WORKER) {
                scriptDirectory = self.location.href;
            }
            else if (typeof document != "undefined" && document.currentScript) {
                scriptDirectory = document.currentScript.src;
            }
            if (_scriptName) {
                scriptDirectory = _scriptName;
            }
            if (scriptDirectory.startsWith("blob:")) {
                scriptDirectory = "";
            }
            else {
                scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
            }
            {
                if (ENVIRONMENT_IS_WORKER) {
                    readBinary = url => { var xhr = new XMLHttpRequest; xhr.open("GET", url, false); xhr.responseType = "arraybuffer"; xhr.send(null); return new Uint8Array(xhr.response); };
                }
                readAsync = url => { if (isFileURI(url)) {
                    return new Promise((resolve, reject) => { var xhr = new XMLHttpRequest; xhr.open("GET", url, true); xhr.responseType = "arraybuffer"; xhr.onload = () => { if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                        resolve(xhr.response);
                        return;
                    } reject(xhr.status); }; xhr.onerror = reject; xhr.send(null); });
                } return fetch(url, { credentials: "same-origin" }).then(response => { if (response.ok) {
                    return response.arrayBuffer();
                } return Promise.reject(new Error(response.status + " : " + response.url)); }); };
            }
        }
        else { }
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.error.bind(console);
        Object.assign(Module, moduleOverrides);
        moduleOverrides = null;
        if (Module["arguments"])
            arguments_ = Module["arguments"];
        if (Module["thisProgram"])
            thisProgram = Module["thisProgram"];
        var wasmBinary = Module["wasmBinary"];
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        function assert(condition, text) { if (!condition) {
            abort(text);
        } }
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateMemoryViews() { var b = wasmMemory.buffer; Module["HEAP8"] = HEAP8 = new Int8Array(b); Module["HEAP16"] = HEAP16 = new Int16Array(b); Module["HEAPU8"] = HEAPU8 = new Uint8Array(b); Module["HEAPU16"] = HEAPU16 = new Uint16Array(b); Module["HEAP32"] = HEAP32 = new Int32Array(b); Module["HEAPU32"] = HEAPU32 = new Uint32Array(b); Module["HEAPF32"] = HEAPF32 = new Float32Array(b); Module["HEAPF64"] = HEAPF64 = new Float64Array(b); }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        var runtimeExited = false;
        function preRun() { var preRuns = Module["preRun"]; if (preRuns) {
            if (typeof preRuns == "function")
                preRuns = [preRuns];
            preRuns.forEach(addOnPreRun);
        } callRuntimeCallbacks(__ATPRERUN__); }
        function initRuntime() { runtimeInitialized = true; SOCKFS.root = FS.mount(SOCKFS, {}, null); if (!Module["noFSInit"] && !FS.initialized)
            FS.init(); FS.ignorePermissions = false; TTY.init(); callRuntimeCallbacks(__ATINIT__); }
        function exitRuntime() { ___funcs_on_exit(); callRuntimeCallbacks(__ATEXIT__); FS.quit(); TTY.shutdown(); runtimeExited = true; }
        function postRun() { var postRuns = Module["postRun"]; if (postRuns) {
            if (typeof postRuns == "function")
                postRuns = [postRuns];
            postRuns.forEach(addOnPostRun);
        } callRuntimeCallbacks(__ATPOSTRUN__); }
        function addOnPreRun(cb) { __ATPRERUN__.unshift(cb); }
        function addOnInit(cb) { __ATINIT__.unshift(cb); }
        function addOnPostRun(cb) { __ATPOSTRUN__.unshift(cb); }
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function getUniqueRunDependency(id) { return id; }
        function addRunDependency(id) { runDependencies++; Module["monitorRunDependencies"]?.(runDependencies); }
        function removeRunDependency(id) { runDependencies--; Module["monitorRunDependencies"]?.(runDependencies); if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
                clearInterval(runDependencyWatcher);
                runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
                var callback = dependenciesFulfilled;
                dependenciesFulfilled = null;
                callback();
            }
        } }
        function abort(what) { Module["onAbort"]?.(what); what = "Aborted(" + what + ")"; err(what); ABORT = true; what += ". Build with -sASSERTIONS for more info."; var e = new WebAssembly.RuntimeError(what); readyPromiseReject(e); throw e; }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        var isDataURI = filename => filename.startsWith(dataURIPrefix);
        var isFileURI = filename => filename.startsWith("file://");
        function findWasmBinary() { if (Module["locateFile"]) {
            var f = "libgr.wasm";
            if (!isDataURI(f)) {
                return locateFile(f);
            }
            return f;
        } return new URL("libgr.wasm", import.meta.url).href; }
        var wasmBinaryFile;
        function getBinarySync(file) { if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
        } if (readBinary) {
            return readBinary(file);
        } throw "both async and sync fetching of the wasm failed"; }
        function getBinaryPromise(binaryFile) { if (!wasmBinary) {
            return readAsync(binaryFile).then(response => new Uint8Array(response), () => getBinarySync(binaryFile));
        } return Promise.resolve().then(() => getBinarySync(binaryFile)); }
        function instantiateArrayBuffer(binaryFile, imports, receiver) { return getBinaryPromise(binaryFile).then(binary => WebAssembly.instantiate(binary, imports)).then(receiver, reason => { err(`failed to asynchronously prepare wasm: ${reason}`); abort(reason); }); }
        function instantiateAsync(binary, binaryFile, imports, callback) { if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
            return fetch(binaryFile, { credentials: "same-origin" }).then(response => { var result = WebAssembly.instantiateStreaming(response, imports); return result.then(callback, function (reason) { err(`wasm streaming compile failed: ${reason}`); err("falling back to ArrayBuffer instantiation"); return instantiateArrayBuffer(binaryFile, imports, callback); }); });
        } return instantiateArrayBuffer(binaryFile, imports, callback); }
        function getWasmImports() { return { a: wasmImports }; }
        function createWasm() { var info = getWasmImports(); function receiveInstance(instance, module) { wasmExports = instance.exports; wasmMemory = wasmExports["Aa"]; updateMemoryViews(); wasmTable = wasmExports["Fa"]; addOnInit(wasmExports["Ba"]); removeRunDependency("wasm-instantiate"); return wasmExports; } addRunDependency("wasm-instantiate"); function receiveInstantiationResult(result) { receiveInstance(result["instance"]); } if (Module["instantiateWasm"]) {
            try {
                return Module["instantiateWasm"](info, receiveInstance);
            }
            catch (e) {
                err(`Module.instantiateWasm callback failed with error: ${e}`);
                readyPromiseReject(e);
            }
        } wasmBinaryFile ??= findWasmBinary(); instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject); return {}; }
        var tempDouble;
        var tempI64;
        function ExitStatus(status) { this.name = "ExitStatus"; this.message = `Program terminated with exit(${status})`; this.status = status; }
        var callRuntimeCallbacks = callbacks => { callbacks.forEach(f => f(Module)); };
        function getValue(ptr, type = "i8") { if (type.endsWith("*"))
            type = "*"; switch (type) {
            case "i1": return HEAP8[ptr];
            case "i8": return HEAP8[ptr];
            case "i16": return HEAP16[ptr >> 1];
            case "i32": return HEAP32[ptr >> 2];
            case "i64": abort("to do getValue(i64) use WASM_BIGINT");
            case "float": return HEAPF32[ptr >> 2];
            case "double": return HEAPF64[ptr >> 3];
            case "*": return HEAPU32[ptr >> 2];
            default: abort(`invalid type for getValue: ${type}`);
        } }
        var noExitRuntime = Module["noExitRuntime"] || false;
        function setValue(ptr, value, type = "i8") { if (type.endsWith("*"))
            type = "*"; switch (type) {
            case "i1":
                HEAP8[ptr] = value;
                break;
            case "i8":
                HEAP8[ptr] = value;
                break;
            case "i16":
                HEAP16[ptr >> 1] = value;
                break;
            case "i32":
                HEAP32[ptr >> 2] = value;
                break;
            case "i64": abort("to do setValue(i64) use WASM_BIGINT");
            case "float":
                HEAPF32[ptr >> 2] = value;
                break;
            case "double":
                HEAPF64[ptr >> 3] = value;
                break;
            case "*":
                HEAPU32[ptr >> 2] = value;
                break;
            default: abort(`invalid type for setValue: ${type}`);
        } }
        var stackRestore = val => __emscripten_stack_restore(val);
        var stackSave = () => _emscripten_stack_get_current();
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder : undefined;
        var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => { var endIdx = idx + maxBytesToRead; var endPtr = idx; while (heapOrArray[endPtr] && !(endPtr >= endIdx))
            ++endPtr; if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
        } var str = ""; while (idx < endPtr) {
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            }
            else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0);
            }
            else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
        } return str; };
        var UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        var ___assert_fail = (condition, filename, line, func) => { abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]); };
        var wasmTableMirror = [];
        var wasmTable;
        var getWasmTableEntry = funcPtr => { var func = wasmTableMirror[funcPtr]; if (!func) {
            if (funcPtr >= wasmTableMirror.length)
                wasmTableMirror.length = funcPtr + 1;
            wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
        } return func; };
        var ___call_sighandler = (fp, sig) => getWasmTableEntry(fp)(sig);
        class ExceptionInfo {
            constructor(excPtr) { this.excPtr = excPtr; this.ptr = excPtr - 24; }
            set_type(type) { HEAPU32[this.ptr + 4 >> 2] = type; }
            get_type() { return HEAPU32[this.ptr + 4 >> 2]; }
            set_destructor(destructor) { HEAPU32[this.ptr + 8 >> 2] = destructor; }
            get_destructor() { return HEAPU32[this.ptr + 8 >> 2]; }
            set_caught(caught) { caught = caught ? 1 : 0; HEAP8[this.ptr + 12] = caught; }
            get_caught() { return HEAP8[this.ptr + 12] != 0; }
            set_rethrown(rethrown) { rethrown = rethrown ? 1 : 0; HEAP8[this.ptr + 13] = rethrown; }
            get_rethrown() { return HEAP8[this.ptr + 13] != 0; }
            init(type, destructor) { this.set_adjusted_ptr(0); this.set_type(type); this.set_destructor(destructor); }
            set_adjusted_ptr(adjustedPtr) { HEAPU32[this.ptr + 16 >> 2] = adjustedPtr; }
            get_adjusted_ptr() { return HEAPU32[this.ptr + 16 >> 2]; }
        }
        var exceptionLast = 0;
        var uncaughtExceptionCount = 0;
        var ___cxa_throw = (ptr, type, destructor) => { var info = new ExceptionInfo(ptr); info.init(type, destructor); exceptionLast = ptr; uncaughtExceptionCount++; throw exceptionLast; };
        var initRandomFill = () => { if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
            return view => crypto.getRandomValues(view);
        }
        else if (ENVIRONMENT_IS_NODE) {
            try {
                var crypto_module = require("crypto");
                var randomFillSync = crypto_module["randomFillSync"];
                if (randomFillSync) {
                    return view => crypto_module["randomFillSync"](view);
                }
                var randomBytes = crypto_module["randomBytes"];
                return view => (view.set(randomBytes(view.byteLength)), view);
            }
            catch (e) { }
        } abort("initRandomDevice"); };
        var randomFill = view => (randomFill = initRandomFill())(view);
        var PATH = { isAbs: path => path.charAt(0) === "/", splitPath: filename => { var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/; return splitPathRe.exec(filename).slice(1); }, normalizeArray: (parts, allowAboveRoot) => { var up = 0; for (var i = parts.length - 1; i >= 0; i--) {
                var last = parts[i];
                if (last === ".") {
                    parts.splice(i, 1);
                }
                else if (last === "..") {
                    parts.splice(i, 1);
                    up++;
                }
                else if (up) {
                    parts.splice(i, 1);
                    up--;
                }
            } if (allowAboveRoot) {
                for (; up; up--) {
                    parts.unshift("..");
                }
            } return parts; }, normalize: path => { var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/"; path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/"); if (!path && !isAbsolute) {
                path = ".";
            } if (path && trailingSlash) {
                path += "/";
            } return (isAbsolute ? "/" : "") + path; }, dirname: path => { var result = PATH.splitPath(path), root = result[0], dir = result[1]; if (!root && !dir) {
                return ".";
            } if (dir) {
                dir = dir.substr(0, dir.length - 1);
            } return root + dir; }, basename: path => { if (path === "/")
                return "/"; path = PATH.normalize(path); path = path.replace(/\/$/, ""); var lastSlash = path.lastIndexOf("/"); if (lastSlash === -1)
                return path; return path.substr(lastSlash + 1); }, join: (...paths) => PATH.normalize(paths.join("/")), join2: (l, r) => PATH.normalize(l + "/" + r) };
        var PATH_FS = { resolve: (...args) => { var resolvedPath = "", resolvedAbsolute = false; for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                var path = i >= 0 ? args[i] : FS.cwd();
                if (typeof path != "string") {
                    throw new TypeError("Arguments to path.resolve must be strings");
                }
                else if (!path) {
                    return "";
                }
                resolvedPath = path + "/" + resolvedPath;
                resolvedAbsolute = PATH.isAbs(path);
            } resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/"); return (resolvedAbsolute ? "/" : "") + resolvedPath || "."; }, relative: (from, to) => { from = PATH_FS.resolve(from).substr(1); to = PATH_FS.resolve(to).substr(1); function trim(arr) { var start = 0; for (; start < arr.length; start++) {
                if (arr[start] !== "")
                    break;
            } var end = arr.length - 1; for (; end >= 0; end--) {
                if (arr[end] !== "")
                    break;
            } if (start > end)
                return []; return arr.slice(start, end - start + 1); } var fromParts = trim(from.split("/")); var toParts = trim(to.split("/")); var length = Math.min(fromParts.length, toParts.length); var samePartsLength = length; for (var i = 0; i < length; i++) {
                if (fromParts[i] !== toParts[i]) {
                    samePartsLength = i;
                    break;
                }
            } var outputParts = []; for (var i = samePartsLength; i < fromParts.length; i++) {
                outputParts.push("..");
            } outputParts = outputParts.concat(toParts.slice(samePartsLength)); return outputParts.join("/"); } };
        var FS_stdin_getChar_buffer = [];
        var lengthBytesUTF8 = str => { var len = 0; for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (c <= 127) {
                len++;
            }
            else if (c <= 2047) {
                len += 2;
            }
            else if (c >= 55296 && c <= 57343) {
                len += 4;
                ++i;
            }
            else {
                len += 3;
            }
        } return len; };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => { if (!(maxBytesToWrite > 0))
            return 0; var startIdx = outIdx; var endIdx = outIdx + maxBytesToWrite - 1; for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
                var u1 = str.charCodeAt(++i);
                u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
                if (outIdx >= endIdx)
                    break;
                heap[outIdx++] = u;
            }
            else if (u <= 2047) {
                if (outIdx + 1 >= endIdx)
                    break;
                heap[outIdx++] = 192 | u >> 6;
                heap[outIdx++] = 128 | u & 63;
            }
            else if (u <= 65535) {
                if (outIdx + 2 >= endIdx)
                    break;
                heap[outIdx++] = 224 | u >> 12;
                heap[outIdx++] = 128 | u >> 6 & 63;
                heap[outIdx++] = 128 | u & 63;
            }
            else {
                if (outIdx + 3 >= endIdx)
                    break;
                heap[outIdx++] = 240 | u >> 18;
                heap[outIdx++] = 128 | u >> 12 & 63;
                heap[outIdx++] = 128 | u >> 6 & 63;
                heap[outIdx++] = 128 | u & 63;
            }
        } heap[outIdx] = 0; return outIdx - startIdx; };
        function intArrayFromString(stringy, dontAddNull, length) { var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1; var u8array = new Array(len); var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length); if (dontAddNull)
            u8array.length = numBytesWritten; return u8array; }
        var FS_stdin_getChar = () => { if (!FS_stdin_getChar_buffer.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
                var BUFSIZE = 256;
                var buf = Buffer.alloc(BUFSIZE);
                var bytesRead = 0;
                var fd = process.stdin.fd;
                try {
                    bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
                }
                catch (e) {
                    if (e.toString().includes("EOF"))
                        bytesRead = 0;
                    else
                        throw e;
                }
                if (bytesRead > 0) {
                    result = buf.slice(0, bytesRead).toString("utf-8");
                }
            }
            else if (typeof window != "undefined" && typeof window.prompt == "function") {
                result = window.prompt("Input: ");
                if (result !== null) {
                    result += "\n";
                }
            }
            else { }
            if (!result) {
                return null;
            }
            FS_stdin_getChar_buffer = intArrayFromString(result, true);
        } return FS_stdin_getChar_buffer.shift(); };
        var TTY = { ttys: [], init() { }, shutdown() { }, register(dev, ops) { TTY.ttys[dev] = { input: [], output: [], ops }; FS.registerDevice(dev, TTY.stream_ops); }, stream_ops: { open(stream) { var tty = TTY.ttys[stream.node.rdev]; if (!tty) {
                    throw new FS.ErrnoError(43);
                } stream.tty = tty; stream.seekable = false; }, close(stream) { stream.tty.ops.fsync(stream.tty); }, fsync(stream) { stream.tty.ops.fsync(stream.tty); }, read(stream, buffer, offset, length, pos) { if (!stream.tty || !stream.tty.ops.get_char) {
                    throw new FS.ErrnoError(60);
                } var bytesRead = 0; for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = stream.tty.ops.get_char(stream.tty);
                    }
                    catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6);
                    }
                    if (result === null || result === undefined)
                        break;
                    bytesRead++;
                    buffer[offset + i] = result;
                } if (bytesRead) {
                    stream.node.timestamp = Date.now();
                } return bytesRead; }, write(stream, buffer, offset, length, pos) { if (!stream.tty || !stream.tty.ops.put_char) {
                    throw new FS.ErrnoError(60);
                } try {
                    for (var i = 0; i < length; i++) {
                        stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                    }
                }
                catch (e) {
                    throw new FS.ErrnoError(29);
                } if (length) {
                    stream.node.timestamp = Date.now();
                } return i; } }, default_tty_ops: { get_char(tty) { return FS_stdin_getChar(); }, put_char(tty, val) { if (val === null || val === 10) {
                    out(UTF8ArrayToString(tty.output));
                    tty.output = [];
                }
                else {
                    if (val != 0)
                        tty.output.push(val);
                } }, fsync(tty) { if (tty.output && tty.output.length > 0) {
                    out(UTF8ArrayToString(tty.output));
                    tty.output = [];
                } }, ioctl_tcgets(tty) { return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }; }, ioctl_tcsets(tty, optional_actions, data) { return 0; }, ioctl_tiocgwinsz(tty) { return [24, 80]; } }, default_tty1_ops: { put_char(tty, val) { if (val === null || val === 10) {
                    err(UTF8ArrayToString(tty.output));
                    tty.output = [];
                }
                else {
                    if (val != 0)
                        tty.output.push(val);
                } }, fsync(tty) { if (tty.output && tty.output.length > 0) {
                    err(UTF8ArrayToString(tty.output));
                    tty.output = [];
                } } } };
        var zeroMemory = (address, size) => { HEAPU8.fill(0, address, address + size); };
        var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;
        var mmapAlloc = size => { size = alignMemory(size, 65536); var ptr = _emscripten_builtin_memalign(65536, size); if (ptr)
            zeroMemory(ptr, size); return ptr; };
        var MEMFS = { ops_table: null, mount(mount) { return MEMFS.createNode(null, "/", 16384 | 511, 0); }, createNode(parent, name, mode, dev) { if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                throw new FS.ErrnoError(63);
            } MEMFS.ops_table ||= { dir: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, lookup: MEMFS.node_ops.lookup, mknod: MEMFS.node_ops.mknod, rename: MEMFS.node_ops.rename, unlink: MEMFS.node_ops.unlink, rmdir: MEMFS.node_ops.rmdir, readdir: MEMFS.node_ops.readdir, symlink: MEMFS.node_ops.symlink }, stream: { llseek: MEMFS.stream_ops.llseek } }, file: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: { llseek: MEMFS.stream_ops.llseek, read: MEMFS.stream_ops.read, write: MEMFS.stream_ops.write, allocate: MEMFS.stream_ops.allocate, mmap: MEMFS.stream_ops.mmap, msync: MEMFS.stream_ops.msync } }, link: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, readlink: MEMFS.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: FS.chrdev_stream_ops } }; var node = FS.createNode(parent, name, mode, dev); if (FS.isDir(node.mode)) {
                node.node_ops = MEMFS.ops_table.dir.node;
                node.stream_ops = MEMFS.ops_table.dir.stream;
                node.contents = {};
            }
            else if (FS.isFile(node.mode)) {
                node.node_ops = MEMFS.ops_table.file.node;
                node.stream_ops = MEMFS.ops_table.file.stream;
                node.usedBytes = 0;
                node.contents = null;
            }
            else if (FS.isLink(node.mode)) {
                node.node_ops = MEMFS.ops_table.link.node;
                node.stream_ops = MEMFS.ops_table.link.stream;
            }
            else if (FS.isChrdev(node.mode)) {
                node.node_ops = MEMFS.ops_table.chrdev.node;
                node.stream_ops = MEMFS.ops_table.chrdev.stream;
            } node.timestamp = Date.now(); if (parent) {
                parent.contents[name] = node;
                parent.timestamp = node.timestamp;
            } return node; }, getFileDataAsTypedArray(node) { if (!node.contents)
                return new Uint8Array(0); if (node.contents.subarray)
                return node.contents.subarray(0, node.usedBytes); return new Uint8Array(node.contents); }, expandFileStorage(node, newCapacity) { var prevCapacity = node.contents ? node.contents.length : 0; if (prevCapacity >= newCapacity)
                return; var CAPACITY_DOUBLING_MAX = 1024 * 1024; newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0); if (prevCapacity != 0)
                newCapacity = Math.max(newCapacity, 256); var oldContents = node.contents; node.contents = new Uint8Array(newCapacity); if (node.usedBytes > 0)
                node.contents.set(oldContents.subarray(0, node.usedBytes), 0); }, resizeFileStorage(node, newSize) { if (node.usedBytes == newSize)
                return; if (newSize == 0) {
                node.contents = null;
                node.usedBytes = 0;
            }
            else {
                var oldContents = node.contents;
                node.contents = new Uint8Array(newSize);
                if (oldContents) {
                    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
                }
                node.usedBytes = newSize;
            } }, node_ops: { getattr(node) { var attr = {}; attr.dev = FS.isChrdev(node.mode) ? node.id : 1; attr.ino = node.id; attr.mode = node.mode; attr.nlink = 1; attr.uid = 0; attr.gid = 0; attr.rdev = node.rdev; if (FS.isDir(node.mode)) {
                    attr.size = 4096;
                }
                else if (FS.isFile(node.mode)) {
                    attr.size = node.usedBytes;
                }
                else if (FS.isLink(node.mode)) {
                    attr.size = node.link.length;
                }
                else {
                    attr.size = 0;
                } attr.atime = new Date(node.timestamp); attr.mtime = new Date(node.timestamp); attr.ctime = new Date(node.timestamp); attr.blksize = 4096; attr.blocks = Math.ceil(attr.size / attr.blksize); return attr; }, setattr(node, attr) { if (attr.mode !== undefined) {
                    node.mode = attr.mode;
                } if (attr.timestamp !== undefined) {
                    node.timestamp = attr.timestamp;
                } if (attr.size !== undefined) {
                    MEMFS.resizeFileStorage(node, attr.size);
                } }, lookup(parent, name) { throw FS.genericErrors[44]; }, mknod(parent, name, mode, dev) { return MEMFS.createNode(parent, name, mode, dev); }, rename(old_node, new_dir, new_name) { if (FS.isDir(old_node.mode)) {
                    var new_node;
                    try {
                        new_node = FS.lookupNode(new_dir, new_name);
                    }
                    catch (e) { }
                    if (new_node) {
                        for (var i in new_node.contents) {
                            throw new FS.ErrnoError(55);
                        }
                    }
                } delete old_node.parent.contents[old_node.name]; old_node.parent.timestamp = Date.now(); old_node.name = new_name; new_dir.contents[new_name] = old_node; new_dir.timestamp = old_node.parent.timestamp; }, unlink(parent, name) { delete parent.contents[name]; parent.timestamp = Date.now(); }, rmdir(parent, name) { var node = FS.lookupNode(parent, name); for (var i in node.contents) {
                    throw new FS.ErrnoError(55);
                } delete parent.contents[name]; parent.timestamp = Date.now(); }, readdir(node) { var entries = [".", ".."]; for (var key of Object.keys(node.contents)) {
                    entries.push(key);
                } return entries; }, symlink(parent, newname, oldpath) { var node = MEMFS.createNode(parent, newname, 511 | 40960, 0); node.link = oldpath; return node; }, readlink(node) { if (!FS.isLink(node.mode)) {
                    throw new FS.ErrnoError(28);
                } return node.link; } }, stream_ops: { read(stream, buffer, offset, length, position) { var contents = stream.node.contents; if (position >= stream.node.usedBytes)
                    return 0; var size = Math.min(stream.node.usedBytes - position, length); if (size > 8 && contents.subarray) {
                    buffer.set(contents.subarray(position, position + size), offset);
                }
                else {
                    for (var i = 0; i < size; i++)
                        buffer[offset + i] = contents[position + i];
                } return size; }, write(stream, buffer, offset, length, position, canOwn) { if (buffer.buffer === HEAP8.buffer) {
                    canOwn = false;
                } if (!length)
                    return 0; var node = stream.node; node.timestamp = Date.now(); if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                    if (canOwn) {
                        node.contents = buffer.subarray(offset, offset + length);
                        node.usedBytes = length;
                        return length;
                    }
                    else if (node.usedBytes === 0 && position === 0) {
                        node.contents = buffer.slice(offset, offset + length);
                        node.usedBytes = length;
                        return length;
                    }
                    else if (position + length <= node.usedBytes) {
                        node.contents.set(buffer.subarray(offset, offset + length), position);
                        return length;
                    }
                } MEMFS.expandFileStorage(node, position + length); if (node.contents.subarray && buffer.subarray) {
                    node.contents.set(buffer.subarray(offset, offset + length), position);
                }
                else {
                    for (var i = 0; i < length; i++) {
                        node.contents[position + i] = buffer[offset + i];
                    }
                } node.usedBytes = Math.max(node.usedBytes, position + length); return length; }, llseek(stream, offset, whence) { var position = offset; if (whence === 1) {
                    position += stream.position;
                }
                else if (whence === 2) {
                    if (FS.isFile(stream.node.mode)) {
                        position += stream.node.usedBytes;
                    }
                } if (position < 0) {
                    throw new FS.ErrnoError(28);
                } return position; }, allocate(stream, offset, length) { MEMFS.expandFileStorage(stream.node, offset + length); stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length); }, mmap(stream, length, position, prot, flags) { if (!FS.isFile(stream.node.mode)) {
                    throw new FS.ErrnoError(43);
                } var ptr; var allocated; var contents = stream.node.contents; if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
                    allocated = false;
                    ptr = contents.byteOffset;
                }
                else {
                    allocated = true;
                    ptr = mmapAlloc(length);
                    if (!ptr) {
                        throw new FS.ErrnoError(48);
                    }
                    if (contents) {
                        if (position > 0 || position + length < contents.length) {
                            if (contents.subarray) {
                                contents = contents.subarray(position, position + length);
                            }
                            else {
                                contents = Array.prototype.slice.call(contents, position, position + length);
                            }
                        }
                        HEAP8.set(contents, ptr);
                    }
                } return { ptr, allocated }; }, msync(stream, buffer, offset, length, mmapFlags) { MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false); return 0; } } };
        var asyncLoad = (url, onload, onerror, noRunDep) => { var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : ""; readAsync(url).then(arrayBuffer => { onload(new Uint8Array(arrayBuffer)); if (dep)
            removeRunDependency(dep); }, err => { if (onerror) {
            onerror();
        }
        else {
            throw `Loading data file "${url}" failed.`;
        } }); if (dep)
            addRunDependency(dep); };
        var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => { FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn); };
        var preloadPlugins = Module["preloadPlugins"] || [];
        var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => { if (typeof Browser != "undefined")
            Browser.init(); var handled = false; preloadPlugins.forEach(plugin => { if (handled)
            return; if (plugin["canHandle"](fullname)) {
            plugin["handle"](byteArray, fullname, finish, onerror);
            handled = true;
        } }); return handled; };
        var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => { var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent; var dep = getUniqueRunDependency(`cp ${fullname}`); function processData(byteArray) { function finish(byteArray) { preFinish?.(); if (!dontCreateFile) {
            FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
        } onload?.(); removeRunDependency(dep); } if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => { onerror?.(); removeRunDependency(dep); })) {
            return;
        } finish(byteArray); } addRunDependency(dep); if (typeof url == "string") {
            asyncLoad(url, processData, onerror);
        }
        else {
            processData(url);
        } };
        var FS_modeStringToFlags = str => { var flagModes = { r: 0, "r+": 2, w: 512 | 64 | 1, "w+": 512 | 64 | 2, a: 1024 | 64 | 1, "a+": 1024 | 64 | 2 }; var flags = flagModes[str]; if (typeof flags == "undefined") {
            throw new Error(`Unknown file open mode: ${str}`);
        } return flags; };
        var FS_getMode = (canRead, canWrite) => { var mode = 0; if (canRead)
            mode |= 292 | 73; if (canWrite)
            mode |= 146; return mode; };
        var FS = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, ErrnoError: class {
                constructor(errno) { this.name = "ErrnoError"; this.errno = errno; }
            }, genericErrors: {}, filesystems: null, syncFSRequests: 0, readFiles: {}, FSStream: class {
                constructor() { this.shared = {}; }
                get object() { return this.node; }
                set object(val) { this.node = val; }
                get isRead() { return (this.flags & 2097155) !== 1; }
                get isWrite() { return (this.flags & 2097155) !== 0; }
                get isAppend() { return this.flags & 1024; }
                get flags() { return this.shared.flags; }
                set flags(val) { this.shared.flags = val; }
                get position() { return this.shared.position; }
                set position(val) { this.shared.position = val; }
            }, FSNode: class {
                constructor(parent, name, mode, rdev) { if (!parent) {
                    parent = this;
                } this.parent = parent; this.mount = parent.mount; this.mounted = null; this.id = FS.nextInode++; this.name = name; this.mode = mode; this.node_ops = {}; this.stream_ops = {}; this.rdev = rdev; this.readMode = 292 | 73; this.writeMode = 146; }
                get read() { return (this.mode & this.readMode) === this.readMode; }
                set read(val) { val ? this.mode |= this.readMode : this.mode &= ~this.readMode; }
                get write() { return (this.mode & this.writeMode) === this.writeMode; }
                set write(val) { val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode; }
                get isFolder() { return FS.isDir(this.mode); }
                get isDevice() { return FS.isChrdev(this.mode); }
            }, lookupPath(path, opts = {}) { path = PATH_FS.resolve(path); if (!path)
                return { path: "", node: null }; var defaults = { follow_mount: true, recurse_count: 0 }; opts = Object.assign(defaults, opts); if (opts.recurse_count > 8) {
                throw new FS.ErrnoError(32);
            } var parts = path.split("/").filter(p => !!p); var current = FS.root; var current_path = "/"; for (var i = 0; i < parts.length; i++) {
                var islast = i === parts.length - 1;
                if (islast && opts.parent) {
                    break;
                }
                current = FS.lookupNode(current, parts[i]);
                current_path = PATH.join2(current_path, parts[i]);
                if (FS.isMountpoint(current)) {
                    if (!islast || islast && opts.follow_mount) {
                        current = current.mounted.root;
                    }
                }
                if (!islast || opts.follow) {
                    var count = 0;
                    while (FS.isLink(current.mode)) {
                        var link = FS.readlink(current_path);
                        current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                        var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
                        current = lookup.node;
                        if (count++ > 40) {
                            throw new FS.ErrnoError(32);
                        }
                    }
                }
            } return { path: current_path, node: current }; }, getPath(node) { var path; while (true) {
                if (FS.isRoot(node)) {
                    var mount = node.mount.mountpoint;
                    if (!path)
                        return mount;
                    return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
                }
                path = path ? `${node.name}/${path}` : node.name;
                node = node.parent;
            } }, hashName(parentid, name) { var hash = 0; for (var i = 0; i < name.length; i++) {
                hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
            } return (parentid + hash >>> 0) % FS.nameTable.length; }, hashAddNode(node) { var hash = FS.hashName(node.parent.id, node.name); node.name_next = FS.nameTable[hash]; FS.nameTable[hash] = node; }, hashRemoveNode(node) { var hash = FS.hashName(node.parent.id, node.name); if (FS.nameTable[hash] === node) {
                FS.nameTable[hash] = node.name_next;
            }
            else {
                var current = FS.nameTable[hash];
                while (current) {
                    if (current.name_next === node) {
                        current.name_next = node.name_next;
                        break;
                    }
                    current = current.name_next;
                }
            } }, lookupNode(parent, name) { var errCode = FS.mayLookup(parent); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } var hash = FS.hashName(parent.id, name); for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                var nodeName = node.name;
                if (node.parent.id === parent.id && nodeName === name) {
                    return node;
                }
            } return FS.lookup(parent, name); }, createNode(parent, name, mode, rdev) { var node = new FS.FSNode(parent, name, mode, rdev); FS.hashAddNode(node); return node; }, destroyNode(node) { FS.hashRemoveNode(node); }, isRoot(node) { return node === node.parent; }, isMountpoint(node) { return !!node.mounted; }, isFile(mode) { return (mode & 61440) === 32768; }, isDir(mode) { return (mode & 61440) === 16384; }, isLink(mode) { return (mode & 61440) === 40960; }, isChrdev(mode) { return (mode & 61440) === 8192; }, isBlkdev(mode) { return (mode & 61440) === 24576; }, isFIFO(mode) { return (mode & 61440) === 4096; }, isSocket(mode) { return (mode & 49152) === 49152; }, flagsToPermissionString(flag) { var perms = ["r", "w", "rw"][flag & 3]; if (flag & 512) {
                perms += "w";
            } return perms; }, nodePermissions(node, perms) { if (FS.ignorePermissions) {
                return 0;
            } if (perms.includes("r") && !(node.mode & 292)) {
                return 2;
            }
            else if (perms.includes("w") && !(node.mode & 146)) {
                return 2;
            }
            else if (perms.includes("x") && !(node.mode & 73)) {
                return 2;
            } return 0; }, mayLookup(dir) { if (!FS.isDir(dir.mode))
                return 54; var errCode = FS.nodePermissions(dir, "x"); if (errCode)
                return errCode; if (!dir.node_ops.lookup)
                return 2; return 0; }, mayCreate(dir, name) { try {
                var node = FS.lookupNode(dir, name);
                return 20;
            }
            catch (e) { } return FS.nodePermissions(dir, "wx"); }, mayDelete(dir, name, isdir) { var node; try {
                node = FS.lookupNode(dir, name);
            }
            catch (e) {
                return e.errno;
            } var errCode = FS.nodePermissions(dir, "wx"); if (errCode) {
                return errCode;
            } if (isdir) {
                if (!FS.isDir(node.mode)) {
                    return 54;
                }
                if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                    return 10;
                }
            }
            else {
                if (FS.isDir(node.mode)) {
                    return 31;
                }
            } return 0; }, mayOpen(node, flags) { if (!node) {
                return 44;
            } if (FS.isLink(node.mode)) {
                return 32;
            }
            else if (FS.isDir(node.mode)) {
                if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                    return 31;
                }
            } return FS.nodePermissions(node, FS.flagsToPermissionString(flags)); }, MAX_OPEN_FDS: 4096, nextfd() { for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
                if (!FS.streams[fd]) {
                    return fd;
                }
            } throw new FS.ErrnoError(33); }, getStreamChecked(fd) { var stream = FS.getStream(fd); if (!stream) {
                throw new FS.ErrnoError(8);
            } return stream; }, getStream: fd => FS.streams[fd], createStream(stream, fd = -1) { stream = Object.assign(new FS.FSStream, stream); if (fd == -1) {
                fd = FS.nextfd();
            } stream.fd = fd; FS.streams[fd] = stream; return stream; }, closeStream(fd) { FS.streams[fd] = null; }, dupStream(origStream, fd = -1) { var stream = FS.createStream(origStream, fd); stream.stream_ops?.dup?.(stream); return stream; }, chrdev_stream_ops: { open(stream) { var device = FS.getDevice(stream.node.rdev); stream.stream_ops = device.stream_ops; stream.stream_ops.open?.(stream); }, llseek() { throw new FS.ErrnoError(70); } }, major: dev => dev >> 8, minor: dev => dev & 255, makedev: (ma, mi) => ma << 8 | mi, registerDevice(dev, ops) { FS.devices[dev] = { stream_ops: ops }; }, getDevice: dev => FS.devices[dev], getMounts(mount) { var mounts = []; var check = [mount]; while (check.length) {
                var m = check.pop();
                mounts.push(m);
                check.push(...m.mounts);
            } return mounts; }, syncfs(populate, callback) { if (typeof populate == "function") {
                callback = populate;
                populate = false;
            } FS.syncFSRequests++; if (FS.syncFSRequests > 1) {
                err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
            } var mounts = FS.getMounts(FS.root.mount); var completed = 0; function doCallback(errCode) { FS.syncFSRequests--; return callback(errCode); } function done(errCode) { if (errCode) {
                if (!done.errored) {
                    done.errored = true;
                    return doCallback(errCode);
                }
                return;
            } if (++completed >= mounts.length) {
                doCallback(null);
            } } mounts.forEach(mount => { if (!mount.type.syncfs) {
                return done(null);
            } mount.type.syncfs(mount, populate, done); }); }, mount(type, opts, mountpoint) { var root = mountpoint === "/"; var pseudo = !mountpoint; var node; if (root && FS.root) {
                throw new FS.ErrnoError(10);
            }
            else if (!root && !pseudo) {
                var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
                mountpoint = lookup.path;
                node = lookup.node;
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(10);
                }
                if (!FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(54);
                }
            } var mount = { type, opts, mountpoint, mounts: [] }; var mountRoot = type.mount(mount); mountRoot.mount = mount; mount.root = mountRoot; if (root) {
                FS.root = mountRoot;
            }
            else if (node) {
                node.mounted = mount;
                if (node.mount) {
                    node.mount.mounts.push(mount);
                }
            } return mountRoot; }, unmount(mountpoint) { var lookup = FS.lookupPath(mountpoint, { follow_mount: false }); if (!FS.isMountpoint(lookup.node)) {
                throw new FS.ErrnoError(28);
            } var node = lookup.node; var mount = node.mounted; var mounts = FS.getMounts(mount); Object.keys(FS.nameTable).forEach(hash => { var current = FS.nameTable[hash]; while (current) {
                var next = current.name_next;
                if (mounts.includes(current.mount)) {
                    FS.destroyNode(current);
                }
                current = next;
            } }); node.mounted = null; var idx = node.mount.mounts.indexOf(mount); node.mount.mounts.splice(idx, 1); }, lookup(parent, name) { return parent.node_ops.lookup(parent, name); }, mknod(path, mode, dev) { var lookup = FS.lookupPath(path, { parent: true }); var parent = lookup.node; var name = PATH.basename(path); if (!name || name === "." || name === "..") {
                throw new FS.ErrnoError(28);
            } var errCode = FS.mayCreate(parent, name); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } if (!parent.node_ops.mknod) {
                throw new FS.ErrnoError(63);
            } return parent.node_ops.mknod(parent, name, mode, dev); }, create(path, mode) { mode = mode !== undefined ? mode : 438; mode &= 4095; mode |= 32768; return FS.mknod(path, mode, 0); }, mkdir(path, mode) { mode = mode !== undefined ? mode : 511; mode &= 511 | 512; mode |= 16384; return FS.mknod(path, mode, 0); }, mkdirTree(path, mode) { var dirs = path.split("/"); var d = ""; for (var i = 0; i < dirs.length; ++i) {
                if (!dirs[i])
                    continue;
                d += "/" + dirs[i];
                try {
                    FS.mkdir(d, mode);
                }
                catch (e) {
                    if (e.errno != 20)
                        throw e;
                }
            } }, mkdev(path, mode, dev) { if (typeof dev == "undefined") {
                dev = mode;
                mode = 438;
            } mode |= 8192; return FS.mknod(path, mode, dev); }, symlink(oldpath, newpath) { if (!PATH_FS.resolve(oldpath)) {
                throw new FS.ErrnoError(44);
            } var lookup = FS.lookupPath(newpath, { parent: true }); var parent = lookup.node; if (!parent) {
                throw new FS.ErrnoError(44);
            } var newname = PATH.basename(newpath); var errCode = FS.mayCreate(parent, newname); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } if (!parent.node_ops.symlink) {
                throw new FS.ErrnoError(63);
            } return parent.node_ops.symlink(parent, newname, oldpath); }, rename(old_path, new_path) { var old_dirname = PATH.dirname(old_path); var new_dirname = PATH.dirname(new_path); var old_name = PATH.basename(old_path); var new_name = PATH.basename(new_path); var lookup, old_dir, new_dir; lookup = FS.lookupPath(old_path, { parent: true }); old_dir = lookup.node; lookup = FS.lookupPath(new_path, { parent: true }); new_dir = lookup.node; if (!old_dir || !new_dir)
                throw new FS.ErrnoError(44); if (old_dir.mount !== new_dir.mount) {
                throw new FS.ErrnoError(75);
            } var old_node = FS.lookupNode(old_dir, old_name); var relative = PATH_FS.relative(old_path, new_dirname); if (relative.charAt(0) !== ".") {
                throw new FS.ErrnoError(28);
            } relative = PATH_FS.relative(new_path, old_dirname); if (relative.charAt(0) !== ".") {
                throw new FS.ErrnoError(55);
            } var new_node; try {
                new_node = FS.lookupNode(new_dir, new_name);
            }
            catch (e) { } if (old_node === new_node) {
                return;
            } var isdir = FS.isDir(old_node.mode); var errCode = FS.mayDelete(old_dir, old_name, isdir); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } if (!old_dir.node_ops.rename) {
                throw new FS.ErrnoError(63);
            } if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
                throw new FS.ErrnoError(10);
            } if (new_dir !== old_dir) {
                errCode = FS.nodePermissions(old_dir, "w");
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
            } FS.hashRemoveNode(old_node); try {
                old_dir.node_ops.rename(old_node, new_dir, new_name);
                old_node.parent = new_dir;
            }
            catch (e) {
                throw e;
            }
            finally {
                FS.hashAddNode(old_node);
            } }, rmdir(path) { var lookup = FS.lookupPath(path, { parent: true }); var parent = lookup.node; var name = PATH.basename(path); var node = FS.lookupNode(parent, name); var errCode = FS.mayDelete(parent, name, true); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } if (!parent.node_ops.rmdir) {
                throw new FS.ErrnoError(63);
            } if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
            } parent.node_ops.rmdir(parent, name); FS.destroyNode(node); }, readdir(path) { var lookup = FS.lookupPath(path, { follow: true }); var node = lookup.node; if (!node.node_ops.readdir) {
                throw new FS.ErrnoError(54);
            } return node.node_ops.readdir(node); }, unlink(path) { var lookup = FS.lookupPath(path, { parent: true }); var parent = lookup.node; if (!parent) {
                throw new FS.ErrnoError(44);
            } var name = PATH.basename(path); var node = FS.lookupNode(parent, name); var errCode = FS.mayDelete(parent, name, false); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } if (!parent.node_ops.unlink) {
                throw new FS.ErrnoError(63);
            } if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
            } parent.node_ops.unlink(parent, name); FS.destroyNode(node); }, readlink(path) { var lookup = FS.lookupPath(path); var link = lookup.node; if (!link) {
                throw new FS.ErrnoError(44);
            } if (!link.node_ops.readlink) {
                throw new FS.ErrnoError(28);
            } return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link)); }, stat(path, dontFollow) { var lookup = FS.lookupPath(path, { follow: !dontFollow }); var node = lookup.node; if (!node) {
                throw new FS.ErrnoError(44);
            } if (!node.node_ops.getattr) {
                throw new FS.ErrnoError(63);
            } return node.node_ops.getattr(node); }, lstat(path) { return FS.stat(path, true); }, chmod(path, mode, dontFollow) { var node; if (typeof path == "string") {
                var lookup = FS.lookupPath(path, { follow: !dontFollow });
                node = lookup.node;
            }
            else {
                node = path;
            } if (!node.node_ops.setattr) {
                throw new FS.ErrnoError(63);
            } node.node_ops.setattr(node, { mode: mode & 4095 | node.mode & ~4095, timestamp: Date.now() }); }, lchmod(path, mode) { FS.chmod(path, mode, true); }, fchmod(fd, mode) { var stream = FS.getStreamChecked(fd); FS.chmod(stream.node, mode); }, chown(path, uid, gid, dontFollow) { var node; if (typeof path == "string") {
                var lookup = FS.lookupPath(path, { follow: !dontFollow });
                node = lookup.node;
            }
            else {
                node = path;
            } if (!node.node_ops.setattr) {
                throw new FS.ErrnoError(63);
            } node.node_ops.setattr(node, { timestamp: Date.now() }); }, lchown(path, uid, gid) { FS.chown(path, uid, gid, true); }, fchown(fd, uid, gid) { var stream = FS.getStreamChecked(fd); FS.chown(stream.node, uid, gid); }, truncate(path, len) { if (len < 0) {
                throw new FS.ErrnoError(28);
            } var node; if (typeof path == "string") {
                var lookup = FS.lookupPath(path, { follow: true });
                node = lookup.node;
            }
            else {
                node = path;
            } if (!node.node_ops.setattr) {
                throw new FS.ErrnoError(63);
            } if (FS.isDir(node.mode)) {
                throw new FS.ErrnoError(31);
            } if (!FS.isFile(node.mode)) {
                throw new FS.ErrnoError(28);
            } var errCode = FS.nodePermissions(node, "w"); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } node.node_ops.setattr(node, { size: len, timestamp: Date.now() }); }, ftruncate(fd, len) { var stream = FS.getStreamChecked(fd); if ((stream.flags & 2097155) === 0) {
                throw new FS.ErrnoError(28);
            } FS.truncate(stream.node, len); }, utime(path, atime, mtime) { var lookup = FS.lookupPath(path, { follow: true }); var node = lookup.node; node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) }); }, open(path, flags, mode) { if (path === "") {
                throw new FS.ErrnoError(44);
            } flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags; if (flags & 64) {
                mode = typeof mode == "undefined" ? 438 : mode;
                mode = mode & 4095 | 32768;
            }
            else {
                mode = 0;
            } var node; if (typeof path == "object") {
                node = path;
            }
            else {
                path = PATH.normalize(path);
                try {
                    var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
                    node = lookup.node;
                }
                catch (e) { }
            } var created = false; if (flags & 64) {
                if (node) {
                    if (flags & 128) {
                        throw new FS.ErrnoError(20);
                    }
                }
                else {
                    node = FS.mknod(path, mode, 0);
                    created = true;
                }
            } if (!node) {
                throw new FS.ErrnoError(44);
            } if (FS.isChrdev(node.mode)) {
                flags &= ~512;
            } if (flags & 65536 && !FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
            } if (!created) {
                var errCode = FS.mayOpen(node, flags);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
            } if (flags & 512 && !created) {
                FS.truncate(node, 0);
            } flags &= ~(128 | 512 | 131072); var stream = FS.createStream({ node, path: FS.getPath(node), flags, seekable: true, position: 0, stream_ops: node.stream_ops, ungotten: [], error: false }); if (stream.stream_ops.open) {
                stream.stream_ops.open(stream);
            } if (Module["logReadFiles"] && !(flags & 1)) {
                if (!(path in FS.readFiles)) {
                    FS.readFiles[path] = 1;
                }
            } return stream; }, close(stream) { if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
            } if (stream.getdents)
                stream.getdents = null; try {
                if (stream.stream_ops.close) {
                    stream.stream_ops.close(stream);
                }
            }
            catch (e) {
                throw e;
            }
            finally {
                FS.closeStream(stream.fd);
            } stream.fd = null; }, isClosed(stream) { return stream.fd === null; }, llseek(stream, offset, whence) { if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
            } if (!stream.seekable || !stream.stream_ops.llseek) {
                throw new FS.ErrnoError(70);
            } if (whence != 0 && whence != 1 && whence != 2) {
                throw new FS.ErrnoError(28);
            } stream.position = stream.stream_ops.llseek(stream, offset, whence); stream.ungotten = []; return stream.position; }, read(stream, buffer, offset, length, position) { if (length < 0 || position < 0) {
                throw new FS.ErrnoError(28);
            } if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
            } if ((stream.flags & 2097155) === 1) {
                throw new FS.ErrnoError(8);
            } if (FS.isDir(stream.node.mode)) {
                throw new FS.ErrnoError(31);
            } if (!stream.stream_ops.read) {
                throw new FS.ErrnoError(28);
            } var seeking = typeof position != "undefined"; if (!seeking) {
                position = stream.position;
            }
            else if (!stream.seekable) {
                throw new FS.ErrnoError(70);
            } var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position); if (!seeking)
                stream.position += bytesRead; return bytesRead; }, write(stream, buffer, offset, length, position, canOwn) { if (length < 0 || position < 0) {
                throw new FS.ErrnoError(28);
            } if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
            } if ((stream.flags & 2097155) === 0) {
                throw new FS.ErrnoError(8);
            } if (FS.isDir(stream.node.mode)) {
                throw new FS.ErrnoError(31);
            } if (!stream.stream_ops.write) {
                throw new FS.ErrnoError(28);
            } if (stream.seekable && stream.flags & 1024) {
                FS.llseek(stream, 0, 2);
            } var seeking = typeof position != "undefined"; if (!seeking) {
                position = stream.position;
            }
            else if (!stream.seekable) {
                throw new FS.ErrnoError(70);
            } var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn); if (!seeking)
                stream.position += bytesWritten; return bytesWritten; }, allocate(stream, offset, length) { if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
            } if (offset < 0 || length <= 0) {
                throw new FS.ErrnoError(28);
            } if ((stream.flags & 2097155) === 0) {
                throw new FS.ErrnoError(8);
            } if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
                throw new FS.ErrnoError(43);
            } if (!stream.stream_ops.allocate) {
                throw new FS.ErrnoError(138);
            } stream.stream_ops.allocate(stream, offset, length); }, mmap(stream, length, position, prot, flags) { if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
                throw new FS.ErrnoError(2);
            } if ((stream.flags & 2097155) === 1) {
                throw new FS.ErrnoError(2);
            } if (!stream.stream_ops.mmap) {
                throw new FS.ErrnoError(43);
            } if (!length) {
                throw new FS.ErrnoError(28);
            } return stream.stream_ops.mmap(stream, length, position, prot, flags); }, msync(stream, buffer, offset, length, mmapFlags) { if (!stream.stream_ops.msync) {
                return 0;
            } return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags); }, ioctl(stream, cmd, arg) { if (!stream.stream_ops.ioctl) {
                throw new FS.ErrnoError(59);
            } return stream.stream_ops.ioctl(stream, cmd, arg); }, readFile(path, opts = {}) { opts.flags = opts.flags || 0; opts.encoding = opts.encoding || "binary"; if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                throw new Error(`Invalid encoding type "${opts.encoding}"`);
            } var ret; var stream = FS.open(path, opts.flags); var stat = FS.stat(path); var length = stat.size; var buf = new Uint8Array(length); FS.read(stream, buf, 0, length, 0); if (opts.encoding === "utf8") {
                ret = UTF8ArrayToString(buf);
            }
            else if (opts.encoding === "binary") {
                ret = buf;
            } FS.close(stream); return ret; }, writeFile(path, data, opts = {}) { opts.flags = opts.flags || 577; var stream = FS.open(path, opts.flags, opts.mode); if (typeof data == "string") {
                var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
                var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
                FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
            }
            else if (ArrayBuffer.isView(data)) {
                FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
            }
            else {
                throw new Error("Unsupported data type");
            } FS.close(stream); }, cwd: () => FS.currentPath, chdir(path) { var lookup = FS.lookupPath(path, { follow: true }); if (lookup.node === null) {
                throw new FS.ErrnoError(44);
            } if (!FS.isDir(lookup.node.mode)) {
                throw new FS.ErrnoError(54);
            } var errCode = FS.nodePermissions(lookup.node, "x"); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } FS.currentPath = lookup.path; }, createDefaultDirectories() { FS.mkdir("/tmp"); FS.mkdir("/home"); FS.mkdir("/home/web_user"); }, createDefaultDevices() { FS.mkdir("/dev"); FS.registerDevice(FS.makedev(1, 3), { read: () => 0, write: (stream, buffer, offset, length, pos) => length }); FS.mkdev("/dev/null", FS.makedev(1, 3)); TTY.register(FS.makedev(5, 0), TTY.default_tty_ops); TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops); FS.mkdev("/dev/tty", FS.makedev(5, 0)); FS.mkdev("/dev/tty1", FS.makedev(6, 0)); var randomBuffer = new Uint8Array(1024), randomLeft = 0; var randomByte = () => { if (randomLeft === 0) {
                randomLeft = randomFill(randomBuffer).byteLength;
            } return randomBuffer[--randomLeft]; }; FS.createDevice("/dev", "random", randomByte); FS.createDevice("/dev", "urandom", randomByte); FS.mkdir("/dev/shm"); FS.mkdir("/dev/shm/tmp"); }, createSpecialDirectories() { FS.mkdir("/proc"); var proc_self = FS.mkdir("/proc/self"); FS.mkdir("/proc/self/fd"); FS.mount({ mount() { var node = FS.createNode(proc_self, "fd", 16384 | 511, 73); node.node_ops = { lookup(parent, name) { var fd = +name; var stream = FS.getStreamChecked(fd); var ret = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => stream.path } }; ret.parent = ret; return ret; } }; return node; } }, {}, "/proc/self/fd"); }, createStandardStreams(input, output, error) { if (input) {
                FS.createDevice("/dev", "stdin", input);
            }
            else {
                FS.symlink("/dev/tty", "/dev/stdin");
            } if (output) {
                FS.createDevice("/dev", "stdout", null, output);
            }
            else {
                FS.symlink("/dev/tty", "/dev/stdout");
            } if (error) {
                FS.createDevice("/dev", "stderr", null, error);
            }
            else {
                FS.symlink("/dev/tty1", "/dev/stderr");
            } var stdin = FS.open("/dev/stdin", 0); var stdout = FS.open("/dev/stdout", 1); var stderr = FS.open("/dev/stderr", 1); }, staticInit() { [44].forEach(code => { FS.genericErrors[code] = new FS.ErrnoError(code); FS.genericErrors[code].stack = "<generic error, no stack>"; }); FS.nameTable = new Array(4096); FS.mount(MEMFS, {}, "/"); FS.createDefaultDirectories(); FS.createDefaultDevices(); FS.createSpecialDirectories(); FS.filesystems = { MEMFS }; }, init(input, output, error) { FS.initialized = true; input ??= Module["stdin"]; output ??= Module["stdout"]; error ??= Module["stderr"]; FS.createStandardStreams(input, output, error); }, quit() { FS.initialized = false; _fflush(0); for (var i = 0; i < FS.streams.length; i++) {
                var stream = FS.streams[i];
                if (!stream) {
                    continue;
                }
                FS.close(stream);
            } }, findObject(path, dontResolveLastLink) { var ret = FS.analyzePath(path, dontResolveLastLink); if (!ret.exists) {
                return null;
            } return ret.object; }, analyzePath(path, dontResolveLastLink) { try {
                var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
                path = lookup.path;
            }
            catch (e) { } var ret = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null }; try {
                var lookup = FS.lookupPath(path, { parent: true });
                ret.parentExists = true;
                ret.parentPath = lookup.path;
                ret.parentObject = lookup.node;
                ret.name = PATH.basename(path);
                lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
                ret.exists = true;
                ret.path = lookup.path;
                ret.object = lookup.node;
                ret.name = lookup.node.name;
                ret.isRoot = lookup.path === "/";
            }
            catch (e) {
                ret.error = e.errno;
            } return ret; }, createPath(parent, path, canRead, canWrite) { parent = typeof parent == "string" ? parent : FS.getPath(parent); var parts = path.split("/").reverse(); while (parts.length) {
                var part = parts.pop();
                if (!part)
                    continue;
                var current = PATH.join2(parent, part);
                try {
                    FS.mkdir(current);
                }
                catch (e) { }
                parent = current;
            } return current; }, createFile(parent, name, properties, canRead, canWrite) { var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name); var mode = FS_getMode(canRead, canWrite); return FS.create(path, mode); }, createDataFile(parent, name, data, canRead, canWrite, canOwn) { var path = name; if (parent) {
                parent = typeof parent == "string" ? parent : FS.getPath(parent);
                path = name ? PATH.join2(parent, name) : parent;
            } var mode = FS_getMode(canRead, canWrite); var node = FS.create(path, mode); if (data) {
                if (typeof data == "string") {
                    var arr = new Array(data.length);
                    for (var i = 0, len = data.length; i < len; ++i)
                        arr[i] = data.charCodeAt(i);
                    data = arr;
                }
                FS.chmod(node, mode | 146);
                var stream = FS.open(node, 577);
                FS.write(stream, data, 0, data.length, 0, canOwn);
                FS.close(stream);
                FS.chmod(node, mode);
            } }, createDevice(parent, name, input, output) { var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name); var mode = FS_getMode(!!input, !!output); FS.createDevice.major ??= 64; var dev = FS.makedev(FS.createDevice.major++, 0); FS.registerDevice(dev, { open(stream) { stream.seekable = false; }, close(stream) { if (output?.buffer?.length) {
                    output(10);
                } }, read(stream, buffer, offset, length, pos) { var bytesRead = 0; for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = input();
                    }
                    catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6);
                    }
                    if (result === null || result === undefined)
                        break;
                    bytesRead++;
                    buffer[offset + i] = result;
                } if (bytesRead) {
                    stream.node.timestamp = Date.now();
                } return bytesRead; }, write(stream, buffer, offset, length, pos) { for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i]);
                    }
                    catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                } if (length) {
                    stream.node.timestamp = Date.now();
                } return i; } }); return FS.mkdev(path, mode, dev); }, forceLoadFile(obj) { if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
                return true; if (typeof XMLHttpRequest != "undefined") {
                throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
            }
            else {
                try {
                    obj.contents = readBinary(obj.url);
                    obj.usedBytes = obj.contents.length;
                }
                catch (e) {
                    throw new FS.ErrnoError(29);
                }
            } }, createLazyFile(parent, name, url, canRead, canWrite) { class LazyUint8Array {
                constructor() { this.lengthKnown = false; this.chunks = []; }
                get(idx) { if (idx > this.length - 1 || idx < 0) {
                    return undefined;
                } var chunkOffset = idx % this.chunkSize; var chunkNum = idx / this.chunkSize | 0; return this.getter(chunkNum)[chunkOffset]; }
                setDataGetter(getter) { this.getter = getter; }
                cacheLength() { var xhr = new XMLHttpRequest; xhr.open("HEAD", url, false); xhr.send(null); if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                    throw new Error("Couldn't load " + url + ". Status: " + xhr.status); var datalength = Number(xhr.getResponseHeader("Content-length")); var header; var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes"; var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip"; var chunkSize = 1024 * 1024; if (!hasByteServing)
                    chunkSize = datalength; var doXHR = (from, to) => { if (from > to)
                    throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!"); if (to > datalength - 1)
                    throw new Error("only " + datalength + " bytes available! programmer error!"); var xhr = new XMLHttpRequest; xhr.open("GET", url, false); if (datalength !== chunkSize)
                    xhr.setRequestHeader("Range", "bytes=" + from + "-" + to); xhr.responseType = "arraybuffer"; if (xhr.overrideMimeType) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                } xhr.send(null); if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                    throw new Error("Couldn't load " + url + ". Status: " + xhr.status); if (xhr.response !== undefined) {
                    return new Uint8Array(xhr.response || []);
                } return intArrayFromString(xhr.responseText || "", true); }; var lazyArray = this; lazyArray.setDataGetter(chunkNum => { var start = chunkNum * chunkSize; var end = (chunkNum + 1) * chunkSize - 1; end = Math.min(end, datalength - 1); if (typeof lazyArray.chunks[chunkNum] == "undefined") {
                    lazyArray.chunks[chunkNum] = doXHR(start, end);
                } if (typeof lazyArray.chunks[chunkNum] == "undefined")
                    throw new Error("doXHR failed!"); return lazyArray.chunks[chunkNum]; }); if (usesGzip || !datalength) {
                    chunkSize = datalength = 1;
                    datalength = this.getter(0).length;
                    chunkSize = datalength;
                    out("LazyFiles on gzip forces download of the whole file when length is accessed");
                } this._length = datalength; this._chunkSize = chunkSize; this.lengthKnown = true; }
                get length() { if (!this.lengthKnown) {
                    this.cacheLength();
                } return this._length; }
                get chunkSize() { if (!this.lengthKnown) {
                    this.cacheLength();
                } return this._chunkSize; }
            } if (typeof XMLHttpRequest != "undefined") {
                if (!ENVIRONMENT_IS_WORKER)
                    throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                var lazyArray = new LazyUint8Array;
                var properties = { isDevice: false, contents: lazyArray };
            }
            else {
                var properties = { isDevice: false, url };
            } var node = FS.createFile(parent, name, properties, canRead, canWrite); if (properties.contents) {
                node.contents = properties.contents;
            }
            else if (properties.url) {
                node.contents = null;
                node.url = properties.url;
            } Object.defineProperties(node, { usedBytes: { get: function () { return this.contents.length; } } }); var stream_ops = {}; var keys = Object.keys(node.stream_ops); keys.forEach(key => { var fn = node.stream_ops[key]; stream_ops[key] = (...args) => { FS.forceLoadFile(node); return fn(...args); }; }); function writeChunks(stream, buffer, offset, length, position) { var contents = stream.node.contents; if (position >= contents.length)
                return 0; var size = Math.min(contents.length - position, length); if (contents.slice) {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i];
                }
            }
            else {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i);
                }
            } return size; } stream_ops.read = (stream, buffer, offset, length, position) => { FS.forceLoadFile(node); return writeChunks(stream, buffer, offset, length, position); }; stream_ops.mmap = (stream, length, position, prot, flags) => { FS.forceLoadFile(node); var ptr = mmapAlloc(length); if (!ptr) {
                throw new FS.ErrnoError(48);
            } writeChunks(stream, HEAP8, ptr, length, position); return { ptr, allocated: true }; }; node.stream_ops = stream_ops; return node; } };
        var SOCKFS = { mount(mount) { Module["websocket"] = Module["websocket"] && "object" === typeof Module["websocket"] ? Module["websocket"] : {}; Module["websocket"]._callbacks = {}; Module["websocket"]["on"] = function (event, callback) { if ("function" === typeof callback) {
                this._callbacks[event] = callback;
            } return this; }; Module["websocket"].emit = function (event, param) { if ("function" === typeof this._callbacks[event]) {
                this._callbacks[event].call(this, param);
            } }; return FS.createNode(null, "/", 16384 | 511, 0); }, createSocket(family, type, protocol) { type &= ~526336; var streaming = type == 1; if (streaming && protocol && protocol != 6) {
                throw new FS.ErrnoError(66);
            } var sock = { family, type, protocol, server: null, error: null, peers: {}, pending: [], recv_queue: [], sock_ops: SOCKFS.websocket_sock_ops }; var name = SOCKFS.nextname(); var node = FS.createNode(SOCKFS.root, name, 49152, 0); node.sock = sock; var stream = FS.createStream({ path: name, node, flags: 2, seekable: false, stream_ops: SOCKFS.stream_ops }); sock.stream = stream; return sock; }, getSocket(fd) { var stream = FS.getStream(fd); if (!stream || !FS.isSocket(stream.node.mode)) {
                return null;
            } return stream.node.sock; }, stream_ops: { poll(stream) { var sock = stream.node.sock; return sock.sock_ops.poll(sock); }, ioctl(stream, request, varargs) { var sock = stream.node.sock; return sock.sock_ops.ioctl(sock, request, varargs); }, read(stream, buffer, offset, length, position) { var sock = stream.node.sock; var msg = sock.sock_ops.recvmsg(sock, length); if (!msg) {
                    return 0;
                } buffer.set(msg.buffer, offset); return msg.buffer.length; }, write(stream, buffer, offset, length, position) { var sock = stream.node.sock; return sock.sock_ops.sendmsg(sock, buffer, offset, length); }, close(stream) { var sock = stream.node.sock; sock.sock_ops.close(sock); } }, nextname() { if (!SOCKFS.nextname.current) {
                SOCKFS.nextname.current = 0;
            } return "socket[" + SOCKFS.nextname.current++ + "]"; }, websocket_sock_ops: { createPeer(sock, addr, port) { var ws; if (typeof addr == "object") {
                    ws = addr;
                    addr = null;
                    port = null;
                } if (ws) {
                    if (ws._socket) {
                        addr = ws._socket.remoteAddress;
                        port = ws._socket.remotePort;
                    }
                    else {
                        var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
                        if (!result) {
                            throw new Error("WebSocket URL must be in the format ws(s)://address:port");
                        }
                        addr = result[1];
                        port = parseInt(result[2], 10);
                    }
                }
                else {
                    try {
                        var runtimeConfig = Module["websocket"] && "object" === typeof Module["websocket"];
                        var url = "ws:#".replace("#", "//");
                        if (runtimeConfig) {
                            if ("string" === typeof Module["websocket"]["url"]) {
                                url = Module["websocket"]["url"];
                            }
                        }
                        if (url === "ws://" || url === "wss://") {
                            var parts = addr.split("/");
                            url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/");
                        }
                        var subProtocols = "binary";
                        if (runtimeConfig) {
                            if ("string" === typeof Module["websocket"]["subprotocol"]) {
                                subProtocols = Module["websocket"]["subprotocol"];
                            }
                        }
                        var opts = undefined;
                        if (subProtocols !== "null") {
                            subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
                            opts = subProtocols;
                        }
                        if (runtimeConfig && null === Module["websocket"]["subprotocol"]) {
                            subProtocols = "null";
                            opts = undefined;
                        }
                        var WebSocketConstructor;
                        if (ENVIRONMENT_IS_NODE) {
                            WebSocketConstructor = require("ws");
                        }
                        else {
                            WebSocketConstructor = WebSocket;
                        }
                        ws = new WebSocketConstructor(url, opts);
                        ws.binaryType = "arraybuffer";
                    }
                    catch (e) {
                        throw new FS.ErrnoError(23);
                    }
                } var peer = { addr, port, socket: ws, msg_send_queue: [] }; SOCKFS.websocket_sock_ops.addPeer(sock, peer); SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer); if (sock.type === 2 && typeof sock.sport != "undefined") {
                    peer.msg_send_queue.push(new Uint8Array([255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), (sock.sport & 65280) >> 8, sock.sport & 255]));
                } return peer; }, getPeer(sock, addr, port) { return sock.peers[addr + ":" + port]; }, addPeer(sock, peer) { sock.peers[peer.addr + ":" + peer.port] = peer; }, removePeer(sock, peer) { delete sock.peers[peer.addr + ":" + peer.port]; }, handlePeerEvents(sock, peer) { var first = true; var handleOpen = function () { Module["websocket"].emit("open", sock.stream.fd); try {
                    var queued = peer.msg_send_queue.shift();
                    while (queued) {
                        peer.socket.send(queued);
                        queued = peer.msg_send_queue.shift();
                    }
                }
                catch (e) {
                    peer.socket.close();
                } }; function handleMessage(data) { if (typeof data == "string") {
                    var encoder = new TextEncoder;
                    data = encoder.encode(data);
                }
                else {
                    assert(data.byteLength !== undefined);
                    if (data.byteLength == 0) {
                        return;
                    }
                    data = new Uint8Array(data);
                } var wasfirst = first; first = false; if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
                    var newport = data[8] << 8 | data[9];
                    SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                    peer.port = newport;
                    SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                    return;
                } sock.recv_queue.push({ addr: peer.addr, port: peer.port, data }); Module["websocket"].emit("message", sock.stream.fd); } if (ENVIRONMENT_IS_NODE) {
                    peer.socket.on("open", handleOpen);
                    peer.socket.on("message", function (data, isBinary) { if (!isBinary) {
                        return;
                    } handleMessage(new Uint8Array(data).buffer); });
                    peer.socket.on("close", function () { Module["websocket"].emit("close", sock.stream.fd); });
                    peer.socket.on("error", function (error) { sock.error = 14; Module["websocket"].emit("error", [sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused"]); });
                }
                else {
                    peer.socket.onopen = handleOpen;
                    peer.socket.onclose = function () { Module["websocket"].emit("close", sock.stream.fd); };
                    peer.socket.onmessage = function peer_socket_onmessage(event) { handleMessage(event.data); };
                    peer.socket.onerror = function (error) { sock.error = 14; Module["websocket"].emit("error", [sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused"]); };
                } }, poll(sock) { if (sock.type === 1 && sock.server) {
                    return sock.pending.length ? 64 | 1 : 0;
                } var mask = 0; var dest = sock.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null; if (sock.recv_queue.length || !dest || dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
                    mask |= 64 | 1;
                } if (!dest || dest && dest.socket.readyState === dest.socket.OPEN) {
                    mask |= 4;
                } if (dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
                    mask |= 16;
                } return mask; }, ioctl(sock, request, arg) { switch (request) {
                    case 21531:
                        var bytes = 0;
                        if (sock.recv_queue.length) {
                            bytes = sock.recv_queue[0].data.length;
                        }
                        HEAP32[arg >> 2] = bytes;
                        return 0;
                    default: return 28;
                } }, close(sock) { if (sock.server) {
                    try {
                        sock.server.close();
                    }
                    catch (e) { }
                    sock.server = null;
                } var peers = Object.keys(sock.peers); for (var i = 0; i < peers.length; i++) {
                    var peer = sock.peers[peers[i]];
                    try {
                        peer.socket.close();
                    }
                    catch (e) { }
                    SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                } return 0; }, bind(sock, addr, port) { if (typeof sock.saddr != "undefined" || typeof sock.sport != "undefined") {
                    throw new FS.ErrnoError(28);
                } sock.saddr = addr; sock.sport = port; if (sock.type === 2) {
                    if (sock.server) {
                        sock.server.close();
                        sock.server = null;
                    }
                    try {
                        sock.sock_ops.listen(sock, 0);
                    }
                    catch (e) {
                        if (!(e.name === "ErrnoError"))
                            throw e;
                        if (e.errno !== 138)
                            throw e;
                    }
                } }, connect(sock, addr, port) { if (sock.server) {
                    throw new FS.ErrnoError(138);
                } if (typeof sock.daddr != "undefined" && typeof sock.dport != "undefined") {
                    var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                    if (dest) {
                        if (dest.socket.readyState === dest.socket.CONNECTING) {
                            throw new FS.ErrnoError(7);
                        }
                        else {
                            throw new FS.ErrnoError(30);
                        }
                    }
                } var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port); sock.daddr = peer.addr; sock.dport = peer.port; }, listen(sock, backlog) { if (!ENVIRONMENT_IS_NODE) {
                    throw new FS.ErrnoError(138);
                } if (sock.server) {
                    throw new FS.ErrnoError(28);
                } var WebSocketServer = require("ws").Server; var host = sock.saddr; sock.server = new WebSocketServer({ host, port: sock.sport }); Module["websocket"].emit("listen", sock.stream.fd); sock.server.on("connection", function (ws) { if (sock.type === 1) {
                    var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
                    var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
                    newsock.daddr = peer.addr;
                    newsock.dport = peer.port;
                    sock.pending.push(newsock);
                    Module["websocket"].emit("connection", newsock.stream.fd);
                }
                else {
                    SOCKFS.websocket_sock_ops.createPeer(sock, ws);
                    Module["websocket"].emit("connection", sock.stream.fd);
                } }); sock.server.on("close", function () { Module["websocket"].emit("close", sock.stream.fd); sock.server = null; }); sock.server.on("error", function (error) { sock.error = 23; Module["websocket"].emit("error", [sock.stream.fd, sock.error, "EHOSTUNREACH: Host is unreachable"]); }); }, accept(listensock) { if (!listensock.server || !listensock.pending.length) {
                    throw new FS.ErrnoError(28);
                } var newsock = listensock.pending.shift(); newsock.stream.flags = listensock.stream.flags; return newsock; }, getname(sock, peer) { var addr, port; if (peer) {
                    if (sock.daddr === undefined || sock.dport === undefined) {
                        throw new FS.ErrnoError(53);
                    }
                    addr = sock.daddr;
                    port = sock.dport;
                }
                else {
                    addr = sock.saddr || 0;
                    port = sock.sport || 0;
                } return { addr, port }; }, sendmsg(sock, buffer, offset, length, addr, port) { if (sock.type === 2) {
                    if (addr === undefined || port === undefined) {
                        addr = sock.daddr;
                        port = sock.dport;
                    }
                    if (addr === undefined || port === undefined) {
                        throw new FS.ErrnoError(17);
                    }
                }
                else {
                    addr = sock.daddr;
                    port = sock.dport;
                } var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port); if (sock.type === 1) {
                    if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                        throw new FS.ErrnoError(53);
                    }
                } if (ArrayBuffer.isView(buffer)) {
                    offset += buffer.byteOffset;
                    buffer = buffer.buffer;
                } var data; data = buffer.slice(offset, offset + length); if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
                    if (sock.type === 2) {
                        if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                            dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
                        }
                    }
                    dest.msg_send_queue.push(data);
                    return length;
                } try {
                    dest.socket.send(data);
                    return length;
                }
                catch (e) {
                    throw new FS.ErrnoError(28);
                } }, recvmsg(sock, length) { if (sock.type === 1 && sock.server) {
                    throw new FS.ErrnoError(53);
                } var queued = sock.recv_queue.shift(); if (!queued) {
                    if (sock.type === 1) {
                        var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                        if (!dest) {
                            throw new FS.ErrnoError(53);
                        }
                        if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                            return null;
                        }
                        throw new FS.ErrnoError(6);
                    }
                    throw new FS.ErrnoError(6);
                } var queuedLength = queued.data.byteLength || queued.data.length; var queuedOffset = queued.data.byteOffset || 0; var queuedBuffer = queued.data.buffer || queued.data; var bytesRead = Math.min(length, queuedLength); var res = { buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead), addr: queued.addr, port: queued.port }; if (sock.type === 1 && bytesRead < queuedLength) {
                    var bytesRemaining = queuedLength - bytesRead;
                    queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
                    sock.recv_queue.unshift(queued);
                } return res; } } };
        var getSocketFromFD = fd => { var socket = SOCKFS.getSocket(fd); if (!socket)
            throw new FS.ErrnoError(8); return socket; };
        var inetNtop4 = addr => (addr & 255) + "." + (addr >> 8 & 255) + "." + (addr >> 16 & 255) + "." + (addr >> 24 & 255);
        var inetNtop6 = ints => { var str = ""; var word = 0; var longest = 0; var lastzero = 0; var zstart = 0; var len = 0; var i = 0; var parts = [ints[0] & 65535, ints[0] >> 16, ints[1] & 65535, ints[1] >> 16, ints[2] & 65535, ints[2] >> 16, ints[3] & 65535, ints[3] >> 16]; var hasipv4 = true; var v4part = ""; for (i = 0; i < 5; i++) {
            if (parts[i] !== 0) {
                hasipv4 = false;
                break;
            }
        } if (hasipv4) {
            v4part = inetNtop4(parts[6] | parts[7] << 16);
            if (parts[5] === -1) {
                str = "::ffff:";
                str += v4part;
                return str;
            }
            if (parts[5] === 0) {
                str = "::";
                if (v4part === "0.0.0.0")
                    v4part = "";
                if (v4part === "0.0.0.1")
                    v4part = "1";
                str += v4part;
                return str;
            }
        } for (word = 0; word < 8; word++) {
            if (parts[word] === 0) {
                if (word - lastzero > 1) {
                    len = 0;
                }
                lastzero = word;
                len++;
            }
            if (len > longest) {
                longest = len;
                zstart = word - longest + 1;
            }
        } for (word = 0; word < 8; word++) {
            if (longest > 1) {
                if (parts[word] === 0 && word >= zstart && word < zstart + longest) {
                    if (word === zstart) {
                        str += ":";
                        if (zstart === 0)
                            str += ":";
                    }
                    continue;
                }
            }
            str += Number(_ntohs(parts[word] & 65535)).toString(16);
            str += word < 7 ? ":" : "";
        } return str; };
        var readSockaddr = (sa, salen) => { var family = HEAP16[sa >> 1]; var port = _ntohs(HEAPU16[sa + 2 >> 1]); var addr; switch (family) {
            case 2:
                if (salen !== 16) {
                    return { errno: 28 };
                }
                addr = HEAP32[sa + 4 >> 2];
                addr = inetNtop4(addr);
                break;
            case 10:
                if (salen !== 28) {
                    return { errno: 28 };
                }
                addr = [HEAP32[sa + 8 >> 2], HEAP32[sa + 12 >> 2], HEAP32[sa + 16 >> 2], HEAP32[sa + 20 >> 2]];
                addr = inetNtop6(addr);
                break;
            default: return { errno: 5 };
        } return { family, addr, port }; };
        var inetPton4 = str => { var b = str.split("."); for (var i = 0; i < 4; i++) {
            var tmp = Number(b[i]);
            if (isNaN(tmp))
                return null;
            b[i] = tmp;
        } return (b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24) >>> 0; };
        var jstoi_q = str => parseInt(str);
        var inetPton6 = str => { var words; var w, offset, z; var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i; var parts = []; if (!valid6regx.test(str)) {
            return null;
        } if (str === "::") {
            return [0, 0, 0, 0, 0, 0, 0, 0];
        } if (str.startsWith("::")) {
            str = str.replace("::", "Z:");
        }
        else {
            str = str.replace("::", ":Z:");
        } if (str.indexOf(".") > 0) {
            str = str.replace(new RegExp("[.]", "g"), ":");
            words = str.split(":");
            words[words.length - 4] = jstoi_q(words[words.length - 4]) + jstoi_q(words[words.length - 3]) * 256;
            words[words.length - 3] = jstoi_q(words[words.length - 2]) + jstoi_q(words[words.length - 1]) * 256;
            words = words.slice(0, words.length - 2);
        }
        else {
            words = str.split(":");
        } offset = 0; z = 0; for (w = 0; w < words.length; w++) {
            if (typeof words[w] == "string") {
                if (words[w] === "Z") {
                    for (z = 0; z < 8 - words.length + 1; z++) {
                        parts[w + z] = 0;
                    }
                    offset = z - 1;
                }
                else {
                    parts[w + offset] = _htons(parseInt(words[w], 16));
                }
            }
            else {
                parts[w + offset] = words[w];
            }
        } return [parts[1] << 16 | parts[0], parts[3] << 16 | parts[2], parts[5] << 16 | parts[4], parts[7] << 16 | parts[6]]; };
        var DNS = { address_map: { id: 1, addrs: {}, names: {} }, lookup_name(name) { var res = inetPton4(name); if (res !== null) {
                return name;
            } res = inetPton6(name); if (res !== null) {
                return name;
            } var addr; if (DNS.address_map.addrs[name]) {
                addr = DNS.address_map.addrs[name];
            }
            else {
                var id = DNS.address_map.id++;
                assert(id < 65535, "exceeded max address mappings of 65535");
                addr = "172.29." + (id & 255) + "." + (id & 65280);
                DNS.address_map.names[addr] = name;
                DNS.address_map.addrs[name] = addr;
            } return addr; }, lookup_addr(addr) { if (DNS.address_map.names[addr]) {
                return DNS.address_map.names[addr];
            } return null; } };
        var getSocketAddress = (addrp, addrlen) => { var info = readSockaddr(addrp, addrlen); if (info.errno)
            throw new FS.ErrnoError(info.errno); info.addr = DNS.lookup_addr(info.addr) || info.addr; return info; };
        function ___syscall_connect(fd, addr, addrlen, d1, d2, d3) { try {
            var sock = getSocketFromFD(fd);
            var info = getSocketAddress(addr, addrlen);
            sock.sock_ops.connect(sock, info.addr, info.port);
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        var SYSCALLS = { DEFAULT_POLLMASK: 5, calculateAt(dirfd, path, allowEmpty) { if (PATH.isAbs(path)) {
                return path;
            } var dir; if (dirfd === -100) {
                dir = FS.cwd();
            }
            else {
                var dirstream = SYSCALLS.getStreamFromFD(dirfd);
                dir = dirstream.path;
            } if (path.length == 0) {
                if (!allowEmpty) {
                    throw new FS.ErrnoError(44);
                }
                return dir;
            } return PATH.join2(dir, path); }, doStat(func, path, buf) { var stat = func(path); HEAP32[buf >> 2] = stat.dev; HEAP32[buf + 4 >> 2] = stat.mode; HEAPU32[buf + 8 >> 2] = stat.nlink; HEAP32[buf + 12 >> 2] = stat.uid; HEAP32[buf + 16 >> 2] = stat.gid; HEAP32[buf + 20 >> 2] = stat.rdev; tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 24 >> 2] = tempI64[0], HEAP32[buf + 28 >> 2] = tempI64[1]; HEAP32[buf + 32 >> 2] = 4096; HEAP32[buf + 36 >> 2] = stat.blocks; var atime = stat.atime.getTime(); var mtime = stat.mtime.getTime(); var ctime = stat.ctime.getTime(); tempI64 = [Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1]; HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3 * 1e3; tempI64 = [Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 56 >> 2] = tempI64[0], HEAP32[buf + 60 >> 2] = tempI64[1]; HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3 * 1e3; tempI64 = [Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 72 >> 2] = tempI64[0], HEAP32[buf + 76 >> 2] = tempI64[1]; HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3 * 1e3; tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 88 >> 2] = tempI64[0], HEAP32[buf + 92 >> 2] = tempI64[1]; return 0; }, doMsync(addr, stream, len, flags, offset) { if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
            } if (flags & 2) {
                return 0;
            } var buffer = HEAPU8.slice(addr, addr + len); FS.msync(stream, buffer, offset, len, flags); }, getStreamFromFD(fd) { var stream = FS.getStreamChecked(fd); return stream; }, varargs: undefined, getStr(ptr) { var ret = UTF8ToString(ptr); return ret; } };
        function ___syscall_dup(fd) { try {
            var old = SYSCALLS.getStreamFromFD(fd);
            return FS.dupStream(old).fd;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_dup3(fd, newfd, flags) { try {
            var old = SYSCALLS.getStreamFromFD(fd);
            if (old.fd === newfd)
                return -28;
            if (newfd < 0 || newfd >= FS.MAX_OPEN_FDS)
                return -8;
            var existing = FS.getStream(newfd);
            if (existing)
                FS.close(existing);
            return FS.dupStream(old, newfd).fd;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_faccessat(dirfd, path, amode, flags) { try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (amode & ~7) {
                return -28;
            }
            var lookup = FS.lookupPath(path, { follow: true });
            var node = lookup.node;
            if (!node) {
                return -44;
            }
            var perms = "";
            if (amode & 4)
                perms += "r";
            if (amode & 2)
                perms += "w";
            if (amode & 1)
                perms += "x";
            if (perms && FS.nodePermissions(node, perms)) {
                return -2;
            }
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function syscallGetVarargI() { var ret = HEAP32[+SYSCALLS.varargs >> 2]; SYSCALLS.varargs += 4; return ret; }
        var syscallGetVarargP = syscallGetVarargI;
        function ___syscall_fcntl64(fd, cmd, varargs) { SYSCALLS.varargs = varargs; try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
                case 0: {
                    var arg = syscallGetVarargI();
                    if (arg < 0) {
                        return -28;
                    }
                    while (FS.streams[arg]) {
                        arg++;
                    }
                    var newStream;
                    newStream = FS.dupStream(stream, arg);
                    return newStream.fd;
                }
                case 1:
                case 2: return 0;
                case 3: return stream.flags;
                case 4: {
                    var arg = syscallGetVarargI();
                    stream.flags |= arg;
                    return 0;
                }
                case 12: {
                    var arg = syscallGetVarargP();
                    var offset = 0;
                    HEAP16[arg + offset >> 1] = 2;
                    return 0;
                }
                case 13:
                case 14: return 0;
            }
            return -28;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        function ___syscall_getcwd(buf, size) { try {
            if (size === 0)
                return -28;
            var cwd = FS.cwd();
            var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
            if (size < cwdLengthInBytes)
                return -68;
            stringToUTF8(cwd, buf, size);
            return cwdLengthInBytes;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_getdents64(fd, dirp, count) { try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            stream.getdents ||= FS.readdir(stream.path);
            var struct_size = 280;
            var pos = 0;
            var off = FS.llseek(stream, 0, 1);
            var idx = Math.floor(off / struct_size);
            while (idx < stream.getdents.length && pos + struct_size <= count) {
                var id;
                var type;
                var name = stream.getdents[idx];
                if (name === ".") {
                    id = stream.node.id;
                    type = 4;
                }
                else if (name === "..") {
                    var lookup = FS.lookupPath(stream.path, { parent: true });
                    id = lookup.node.id;
                    type = 4;
                }
                else {
                    var child = FS.lookupNode(stream.node, name);
                    id = child.id;
                    type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8;
                }
                tempI64 = [id >>> 0, (tempDouble = id, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos >> 2] = tempI64[0], HEAP32[dirp + pos + 4 >> 2] = tempI64[1];
                tempI64 = [(idx + 1) * struct_size >>> 0, (tempDouble = (idx + 1) * struct_size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos + 8 >> 2] = tempI64[0], HEAP32[dirp + pos + 12 >> 2] = tempI64[1];
                HEAP16[dirp + pos + 16 >> 1] = 280;
                HEAP8[dirp + pos + 18] = type;
                stringToUTF8(name, dirp + pos + 19, 256);
                pos += struct_size;
                idx += 1;
            }
            FS.llseek(stream, idx * struct_size, 0);
            return pos;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_ioctl(fd, op, varargs) { SYSCALLS.varargs = varargs; try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (op) {
                case 21509: {
                    if (!stream.tty)
                        return -59;
                    return 0;
                }
                case 21505: {
                    if (!stream.tty)
                        return -59;
                    if (stream.tty.ops.ioctl_tcgets) {
                        var termios = stream.tty.ops.ioctl_tcgets(stream);
                        var argp = syscallGetVarargP();
                        HEAP32[argp >> 2] = termios.c_iflag || 0;
                        HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
                        HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
                        HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
                        for (var i = 0; i < 32; i++) {
                            HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
                        }
                        return 0;
                    }
                    return 0;
                }
                case 21510:
                case 21511:
                case 21512: {
                    if (!stream.tty)
                        return -59;
                    return 0;
                }
                case 21506:
                case 21507:
                case 21508: {
                    if (!stream.tty)
                        return -59;
                    if (stream.tty.ops.ioctl_tcsets) {
                        var argp = syscallGetVarargP();
                        var c_iflag = HEAP32[argp >> 2];
                        var c_oflag = HEAP32[argp + 4 >> 2];
                        var c_cflag = HEAP32[argp + 8 >> 2];
                        var c_lflag = HEAP32[argp + 12 >> 2];
                        var c_cc = [];
                        for (var i = 0; i < 32; i++) {
                            c_cc.push(HEAP8[argp + i + 17]);
                        }
                        return stream.tty.ops.ioctl_tcsets(stream.tty, op, { c_iflag, c_oflag, c_cflag, c_lflag, c_cc });
                    }
                    return 0;
                }
                case 21519: {
                    if (!stream.tty)
                        return -59;
                    var argp = syscallGetVarargP();
                    HEAP32[argp >> 2] = 0;
                    return 0;
                }
                case 21520: {
                    if (!stream.tty)
                        return -59;
                    return -28;
                }
                case 21531: {
                    var argp = syscallGetVarargP();
                    return FS.ioctl(stream, op, argp);
                }
                case 21523: {
                    if (!stream.tty)
                        return -59;
                    if (stream.tty.ops.ioctl_tiocgwinsz) {
                        var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                        var argp = syscallGetVarargP();
                        HEAP16[argp >> 1] = winsize[0];
                        HEAP16[argp + 2 >> 1] = winsize[1];
                    }
                    return 0;
                }
                case 21524: {
                    if (!stream.tty)
                        return -59;
                    return 0;
                }
                case 21515: {
                    if (!stream.tty)
                        return -59;
                    return 0;
                }
                default: return -28;
            }
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_mkdirat(dirfd, path, mode) { try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            path = PATH.normalize(path);
            if (path[path.length - 1] === "/")
                path = path.substr(0, path.length - 1);
            FS.mkdir(path, mode, 0);
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_openat(dirfd, path, flags, varargs) { SYSCALLS.varargs = varargs; try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            var mode = varargs ? syscallGetVarargI() : 0;
            return FS.open(path, flags, mode).fd;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_readlinkat(dirfd, path, buf, bufsize) { try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (bufsize <= 0)
                return -28;
            var ret = FS.readlink(path);
            var len = Math.min(bufsize, lengthBytesUTF8(ret));
            var endChar = HEAP8[buf + len];
            stringToUTF8(ret, buf, bufsize + 1);
            HEAP8[buf + len] = endChar;
            return len;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        var writeSockaddr = (sa, family, addr, port, addrlen) => { switch (family) {
            case 2:
                addr = inetPton4(addr);
                zeroMemory(sa, 16);
                if (addrlen) {
                    HEAP32[addrlen >> 2] = 16;
                }
                HEAP16[sa >> 1] = family;
                HEAP32[sa + 4 >> 2] = addr;
                HEAP16[sa + 2 >> 1] = _htons(port);
                break;
            case 10:
                addr = inetPton6(addr);
                zeroMemory(sa, 28);
                if (addrlen) {
                    HEAP32[addrlen >> 2] = 28;
                }
                HEAP32[sa >> 2] = family;
                HEAP32[sa + 8 >> 2] = addr[0];
                HEAP32[sa + 12 >> 2] = addr[1];
                HEAP32[sa + 16 >> 2] = addr[2];
                HEAP32[sa + 20 >> 2] = addr[3];
                HEAP16[sa + 2 >> 1] = _htons(port);
                break;
            default: return 5;
        } return 0; };
        function ___syscall_recvfrom(fd, buf, len, flags, addr, addrlen) { try {
            var sock = getSocketFromFD(fd);
            var msg = sock.sock_ops.recvmsg(sock, len);
            if (!msg)
                return 0;
            if (addr) {
                var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port, addrlen);
            }
            HEAPU8.set(msg.buffer, buf);
            return msg.buffer.byteLength;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) { try {
            oldpath = SYSCALLS.getStr(oldpath);
            newpath = SYSCALLS.getStr(newpath);
            oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
            newpath = SYSCALLS.calculateAt(newdirfd, newpath);
            FS.rename(oldpath, newpath);
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_rmdir(path) { try {
            path = SYSCALLS.getStr(path);
            FS.rmdir(path);
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_sendto(fd, message, length, flags, addr, addr_len) { try {
            var sock = getSocketFromFD(fd);
            if (!addr) {
                return FS.write(sock.stream, HEAP8, message, length);
            }
            var dest = getSocketAddress(addr, addr_len);
            return sock.sock_ops.sendmsg(sock, HEAP8, message, length, dest.addr, dest.port);
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_socket(domain, type, protocol) { try {
            var sock = SOCKFS.createSocket(domain, type, protocol);
            return sock.stream.fd;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_stat64(path, buf) { try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.stat, path, buf);
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_unlinkat(dirfd, path, flags) { try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (flags === 0) {
                FS.unlink(path);
            }
            else if (flags === 512) {
                FS.rmdir(path);
            }
            else {
                abort("Invalid flags passed to unlinkat");
            }
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        var __abort_js = () => { abort(""); };
        var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => { };
        var embind_init_charCodes = () => { var codes = new Array(256); for (var i = 0; i < 256; ++i) {
            codes[i] = String.fromCharCode(i);
        } embind_charCodes = codes; };
        var embind_charCodes;
        var readLatin1String = ptr => { var ret = ""; var c = ptr; while (HEAPU8[c]) {
            ret += embind_charCodes[HEAPU8[c++]];
        } return ret; };
        var awaitingDependencies = {};
        var registeredTypes = {};
        var typeDependencies = {};
        var BindingError;
        var throwBindingError = message => { throw new BindingError(message); };
        var InternalError;
        function sharedRegisterType(rawType, registeredInstance, options = {}) { var name = registeredInstance.name; if (!rawType) {
            throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
        } if (registeredTypes.hasOwnProperty(rawType)) {
            if (options.ignoreDuplicateRegistrations) {
                return;
            }
            else {
                throwBindingError(`Cannot register type '${name}' twice`);
            }
        } registeredTypes[rawType] = registeredInstance; delete typeDependencies[rawType]; if (awaitingDependencies.hasOwnProperty(rawType)) {
            var callbacks = awaitingDependencies[rawType];
            delete awaitingDependencies[rawType];
            callbacks.forEach(cb => cb());
        } }
        function registerType(rawType, registeredInstance, options = {}) { return sharedRegisterType(rawType, registeredInstance, options); }
        var GenericWireTypeSize = 8;
        var __embind_register_bool = (rawType, name, trueValue, falseValue) => { name = readLatin1String(name); registerType(rawType, { name, fromWireType: function (wt) { return !!wt; }, toWireType: function (destructors, o) { return o ? trueValue : falseValue; }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: function (pointer) { return this["fromWireType"](HEAPU8[pointer]); }, destructorFunction: null }); };
        var emval_freelist = [];
        var emval_handles = [];
        var __emval_decref = handle => { if (handle > 9 && 0 === --emval_handles[handle + 1]) {
            emval_handles[handle] = undefined;
            emval_freelist.push(handle);
        } };
        var count_emval_handles = () => emval_handles.length / 2 - 5 - emval_freelist.length;
        var init_emval = () => { emval_handles.push(0, 1, undefined, 1, null, 1, true, 1, false, 1); Module["count_emval_handles"] = count_emval_handles; };
        var Emval = { toValue: handle => { if (!handle) {
                throwBindingError("Cannot use deleted val. handle = " + handle);
            } return emval_handles[handle]; }, toHandle: value => { switch (value) {
                case undefined: return 2;
                case null: return 4;
                case true: return 6;
                case false: return 8;
                default: {
                    const handle = emval_freelist.pop() || emval_handles.length;
                    emval_handles[handle] = value;
                    emval_handles[handle + 1] = 1;
                    return handle;
                }
            } } };
        function readPointer(pointer) { return this["fromWireType"](HEAPU32[pointer >> 2]); }
        var EmValType = { name: "emscripten::val", fromWireType: handle => { var rv = Emval.toValue(handle); __emval_decref(handle); return rv; }, toWireType: (destructors, value) => Emval.toHandle(value), argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction: null };
        var __embind_register_emval = rawType => registerType(rawType, EmValType);
        var floatReadValueFromPointer = (name, width) => { switch (width) {
            case 4: return function (pointer) { return this["fromWireType"](HEAPF32[pointer >> 2]); };
            case 8: return function (pointer) { return this["fromWireType"](HEAPF64[pointer >> 3]); };
            default: throw new TypeError(`invalid float width (${width}): ${name}`);
        } };
        var __embind_register_float = (rawType, name, size) => { name = readLatin1String(name); registerType(rawType, { name, fromWireType: value => value, toWireType: (destructors, value) => value, argPackAdvance: GenericWireTypeSize, readValueFromPointer: floatReadValueFromPointer(name, size), destructorFunction: null }); };
        var integerReadValueFromPointer = (name, width, signed) => { switch (width) {
            case 1: return signed ? pointer => HEAP8[pointer] : pointer => HEAPU8[pointer];
            case 2: return signed ? pointer => HEAP16[pointer >> 1] : pointer => HEAPU16[pointer >> 1];
            case 4: return signed ? pointer => HEAP32[pointer >> 2] : pointer => HEAPU32[pointer >> 2];
            default: throw new TypeError(`invalid integer width (${width}): ${name}`);
        } };
        var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => { name = readLatin1String(name); if (maxRange === -1) {
            maxRange = 4294967295;
        } var fromWireType = value => value; if (minRange === 0) {
            var bitshift = 32 - 8 * size;
            fromWireType = value => value << bitshift >>> bitshift;
        } var isUnsignedType = name.includes("unsigned"); var checkAssertions = (value, toTypeName) => { }; var toWireType; if (isUnsignedType) {
            toWireType = function (destructors, value) { checkAssertions(value, this.name); return value >>> 0; };
        }
        else {
            toWireType = function (destructors, value) { checkAssertions(value, this.name); return value; };
        } registerType(primitiveType, { name, fromWireType, toWireType, argPackAdvance: GenericWireTypeSize, readValueFromPointer: integerReadValueFromPointer(name, size, minRange !== 0), destructorFunction: null }); };
        var __embind_register_memory_view = (rawType, dataTypeIndex, name) => { var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array]; var TA = typeMapping[dataTypeIndex]; function decodeMemoryView(handle) { var size = HEAPU32[handle >> 2]; var data = HEAPU32[handle + 4 >> 2]; return new TA(HEAP8.buffer, data, size); } name = readLatin1String(name); registerType(rawType, { name, fromWireType: decodeMemoryView, argPackAdvance: GenericWireTypeSize, readValueFromPointer: decodeMemoryView }, { ignoreDuplicateRegistrations: true }); };
        var __embind_register_std_string = (rawType, name) => { name = readLatin1String(name); var stdStringIsUTF8 = name === "std::string"; registerType(rawType, { name, fromWireType(value) { var length = HEAPU32[value >> 2]; var payload = value + 4; var str; if (stdStringIsUTF8) {
                var decodeStartPtr = payload;
                for (var i = 0; i <= length; ++i) {
                    var currentBytePtr = payload + i;
                    if (i == length || HEAPU8[currentBytePtr] == 0) {
                        var maxRead = currentBytePtr - decodeStartPtr;
                        var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                        if (str === undefined) {
                            str = stringSegment;
                        }
                        else {
                            str += String.fromCharCode(0);
                            str += stringSegment;
                        }
                        decodeStartPtr = currentBytePtr + 1;
                    }
                }
            }
            else {
                var a = new Array(length);
                for (var i = 0; i < length; ++i) {
                    a[i] = String.fromCharCode(HEAPU8[payload + i]);
                }
                str = a.join("");
            } _free(value); return str; }, toWireType(destructors, value) { if (value instanceof ArrayBuffer) {
                value = new Uint8Array(value);
            } var length; var valueIsOfTypeString = typeof value == "string"; if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
                throwBindingError("Cannot pass non-string to std::string");
            } if (stdStringIsUTF8 && valueIsOfTypeString) {
                length = lengthBytesUTF8(value);
            }
            else {
                length = value.length;
            } var base = _malloc(4 + length + 1); var ptr = base + 4; HEAPU32[base >> 2] = length; if (stdStringIsUTF8 && valueIsOfTypeString) {
                stringToUTF8(value, ptr, length + 1);
            }
            else {
                if (valueIsOfTypeString) {
                    for (var i = 0; i < length; ++i) {
                        var charCode = value.charCodeAt(i);
                        if (charCode > 255) {
                            _free(ptr);
                            throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                        }
                        HEAPU8[ptr + i] = charCode;
                    }
                }
                else {
                    for (var i = 0; i < length; ++i) {
                        HEAPU8[ptr + i] = value[i];
                    }
                }
            } if (destructors !== null) {
                destructors.push(_free, base);
            } return base; }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction(ptr) { _free(ptr); } }); };
        var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : undefined;
        var UTF16ToString = (ptr, maxBytesToRead) => { var endPtr = ptr; var idx = endPtr >> 1; var maxIdx = idx + maxBytesToRead / 2; while (!(idx >= maxIdx) && HEAPU16[idx])
            ++idx; endPtr = idx << 1; if (endPtr - ptr > 32 && UTF16Decoder)
            return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr)); var str = ""; for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
            var codeUnit = HEAP16[ptr + i * 2 >> 1];
            if (codeUnit == 0)
                break;
            str += String.fromCharCode(codeUnit);
        } return str; };
        var stringToUTF16 = (str, outPtr, maxBytesToWrite) => { maxBytesToWrite ??= 2147483647; if (maxBytesToWrite < 2)
            return 0; maxBytesToWrite -= 2; var startPtr = outPtr; var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length; for (var i = 0; i < numCharsToWrite; ++i) {
            var codeUnit = str.charCodeAt(i);
            HEAP16[outPtr >> 1] = codeUnit;
            outPtr += 2;
        } HEAP16[outPtr >> 1] = 0; return outPtr - startPtr; };
        var lengthBytesUTF16 = str => str.length * 2;
        var UTF32ToString = (ptr, maxBytesToRead) => { var i = 0; var str = ""; while (!(i >= maxBytesToRead / 4)) {
            var utf32 = HEAP32[ptr + i * 4 >> 2];
            if (utf32 == 0)
                break;
            ++i;
            if (utf32 >= 65536) {
                var ch = utf32 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
            else {
                str += String.fromCharCode(utf32);
            }
        } return str; };
        var stringToUTF32 = (str, outPtr, maxBytesToWrite) => { maxBytesToWrite ??= 2147483647; if (maxBytesToWrite < 4)
            return 0; var startPtr = outPtr; var endPtr = startPtr + maxBytesToWrite - 4; for (var i = 0; i < str.length; ++i) {
            var codeUnit = str.charCodeAt(i);
            if (codeUnit >= 55296 && codeUnit <= 57343) {
                var trailSurrogate = str.charCodeAt(++i);
                codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
            }
            HEAP32[outPtr >> 2] = codeUnit;
            outPtr += 4;
            if (outPtr + 4 > endPtr)
                break;
        } HEAP32[outPtr >> 2] = 0; return outPtr - startPtr; };
        var lengthBytesUTF32 = str => { var len = 0; for (var i = 0; i < str.length; ++i) {
            var codeUnit = str.charCodeAt(i);
            if (codeUnit >= 55296 && codeUnit <= 57343)
                ++i;
            len += 4;
        } return len; };
        var __embind_register_std_wstring = (rawType, charSize, name) => { name = readLatin1String(name); var decodeString, encodeString, readCharAt, lengthBytesUTF; if (charSize === 2) {
            decodeString = UTF16ToString;
            encodeString = stringToUTF16;
            lengthBytesUTF = lengthBytesUTF16;
            readCharAt = pointer => HEAPU16[pointer >> 1];
        }
        else if (charSize === 4) {
            decodeString = UTF32ToString;
            encodeString = stringToUTF32;
            lengthBytesUTF = lengthBytesUTF32;
            readCharAt = pointer => HEAPU32[pointer >> 2];
        } registerType(rawType, { name, fromWireType: value => { var length = HEAPU32[value >> 2]; var str; var decodeStartPtr = value + 4; for (var i = 0; i <= length; ++i) {
                var currentBytePtr = value + 4 + i * charSize;
                if (i == length || readCharAt(currentBytePtr) == 0) {
                    var maxReadBytes = currentBytePtr - decodeStartPtr;
                    var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                    if (str === undefined) {
                        str = stringSegment;
                    }
                    else {
                        str += String.fromCharCode(0);
                        str += stringSegment;
                    }
                    decodeStartPtr = currentBytePtr + charSize;
                }
            } _free(value); return str; }, toWireType: (destructors, value) => { if (!(typeof value == "string")) {
                throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
            } var length = lengthBytesUTF(value); var ptr = _malloc(4 + length + charSize); HEAPU32[ptr >> 2] = length / charSize; encodeString(value, ptr + 4, length + charSize); if (destructors !== null) {
                destructors.push(_free, ptr);
            } return ptr; }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction(ptr) { _free(ptr); } }); };
        var __embind_register_void = (rawType, name) => { name = readLatin1String(name); registerType(rawType, { isVoid: true, name, argPackAdvance: 0, fromWireType: () => undefined, toWireType: (destructors, o) => undefined }); };
        var __emscripten_fs_load_embedded_files = ptr => { do {
            var name_addr = HEAPU32[ptr >> 2];
            ptr += 4;
            var len = HEAPU32[ptr >> 2];
            ptr += 4;
            var content = HEAPU32[ptr >> 2];
            ptr += 4;
            var name = UTF8ToString(name_addr);
            FS.createPath("/", PATH.dirname(name), true, true);
            FS.createDataFile(name, null, HEAP8.subarray(content, content + len), true, true, true);
        } while (HEAPU32[ptr >> 2]); };
        var nowIsMonotonic = 1;
        var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;
        var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);
        var __emscripten_runtime_keepalive_clear = () => { noExitRuntime = false; runtimeKeepaliveCounter = 0; };
        var __emscripten_system = command => { if (ENVIRONMENT_IS_NODE) {
            if (!command)
                return 1;
            var cmdstr = UTF8ToString(command);
            if (!cmdstr.length)
                return 0;
            var cp = require("child_process");
            var ret = cp.spawnSync(cmdstr, [], { shell: true, stdio: "inherit" });
            var _W_EXITCODE = (ret, sig) => ret << 8 | sig;
            if (ret.status === null) {
                var signalToNumber = sig => { switch (sig) {
                    case "SIGHUP": return 1;
                    case "SIGQUIT": return 3;
                    case "SIGFPE": return 8;
                    case "SIGKILL": return 9;
                    case "SIGALRM": return 14;
                    case "SIGTERM": return 15;
                    default: return 2;
                } };
                return _W_EXITCODE(0, signalToNumber(ret.signal));
            }
            return _W_EXITCODE(ret.status, 0);
        } if (!command)
            return 0; return -52; };
        var __emscripten_throw_longjmp = () => { throw Infinity; };
        var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var ydayFromDate = date => { var leap = isLeapYear(date.getFullYear()); var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE; var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1; return yday; };
        var convertI32PairToI53Checked = (lo, hi) => hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
        function __localtime_js(time_low, time_high, tmPtr) { var time = convertI32PairToI53Checked(time_low, time_high); var date = new Date(time * 1e3); HEAP32[tmPtr >> 2] = date.getSeconds(); HEAP32[tmPtr + 4 >> 2] = date.getMinutes(); HEAP32[tmPtr + 8 >> 2] = date.getHours(); HEAP32[tmPtr + 12 >> 2] = date.getDate(); HEAP32[tmPtr + 16 >> 2] = date.getMonth(); HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900; HEAP32[tmPtr + 24 >> 2] = date.getDay(); var yday = ydayFromDate(date) | 0; HEAP32[tmPtr + 28 >> 2] = yday; HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60); var start = new Date(date.getFullYear(), 0, 1); var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset(); var winterOffset = start.getTimezoneOffset(); var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0; HEAP32[tmPtr + 32 >> 2] = dst; }
        function __mmap_js(len, prot, flags, fd, offset_low, offset_high, allocated, addr) { var offset = convertI32PairToI53Checked(offset_low, offset_high); try {
            if (isNaN(offset))
                return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            var res = FS.mmap(stream, len, offset, prot, flags);
            var ptr = res.ptr;
            HEAP32[allocated >> 2] = res.allocated;
            HEAPU32[addr >> 2] = ptr;
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function __munmap_js(addr, len, prot, flags, fd, offset_low, offset_high) { var offset = convertI32PairToI53Checked(offset_low, offset_high); try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            if (prot & 2) {
                SYSCALLS.doMsync(addr, stream, len, flags, offset);
            }
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        var __tzset_js = (timezone, daylight, std_name, dst_name) => { var currentYear = (new Date).getFullYear(); var winter = new Date(currentYear, 0, 1); var summer = new Date(currentYear, 6, 1); var winterOffset = winter.getTimezoneOffset(); var summerOffset = summer.getTimezoneOffset(); var stdTimezoneOffset = Math.max(winterOffset, summerOffset); HEAPU32[timezone >> 2] = stdTimezoneOffset * 60; HEAP32[daylight >> 2] = Number(winterOffset != summerOffset); var extractZone = timezoneOffset => { var sign = timezoneOffset >= 0 ? "-" : "+"; var absOffset = Math.abs(timezoneOffset); var hours = String(Math.floor(absOffset / 60)).padStart(2, "0"); var minutes = String(absOffset % 60).padStart(2, "0"); return `UTC${sign}${hours}${minutes}`; }; var winterName = extractZone(winterOffset); var summerName = extractZone(summerOffset); if (summerOffset < winterOffset) {
            stringToUTF8(winterName, std_name, 17);
            stringToUTF8(summerName, dst_name, 17);
        }
        else {
            stringToUTF8(winterName, dst_name, 17);
            stringToUTF8(summerName, std_name, 17);
        } };
        var _emscripten_date_now = () => Date.now();
        var getHeapMax = () => 2147483648;
        var growMemory = size => { var b = wasmMemory.buffer; var pages = (size - b.byteLength + 65535) / 65536 | 0; try {
            wasmMemory.grow(pages);
            updateMemoryViews();
            return 1;
        }
        catch (e) { } };
        var _emscripten_resize_heap = requestedSize => { var oldSize = HEAPU8.length; requestedSize >>>= 0; var maxHeapSize = getHeapMax(); if (requestedSize > maxHeapSize) {
            return false;
        } for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = growMemory(newSize);
            if (replacement) {
                return true;
            }
        } return false; };
        var ENV = {};
        var getExecutableName = () => thisProgram || "./this.program";
        var getEnvStrings = () => { if (!getEnvStrings.strings) {
            var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
            var env = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: lang, _: getExecutableName() };
            for (var x in ENV) {
                if (ENV[x] === undefined)
                    delete env[x];
                else
                    env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
                strings.push(`${x}=${env[x]}`);
            }
            getEnvStrings.strings = strings;
        } return getEnvStrings.strings; };
        var stringToAscii = (str, buffer) => { for (var i = 0; i < str.length; ++i) {
            HEAP8[buffer++] = str.charCodeAt(i);
        } HEAP8[buffer] = 0; };
        var _environ_get = (__environ, environ_buf) => { var bufSize = 0; getEnvStrings().forEach((string, i) => { var ptr = environ_buf + bufSize; HEAPU32[__environ + i * 4 >> 2] = ptr; stringToAscii(string, ptr); bufSize += string.length + 1; }); return 0; };
        var _environ_sizes_get = (penviron_count, penviron_buf_size) => { var strings = getEnvStrings(); HEAPU32[penviron_count >> 2] = strings.length; var bufSize = 0; strings.forEach(string => bufSize += string.length + 1); HEAPU32[penviron_buf_size >> 2] = bufSize; return 0; };
        var runtimeKeepaliveCounter = 0;
        var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
        var _proc_exit = code => { EXITSTATUS = code; if (!keepRuntimeAlive()) {
            Module["onExit"]?.(code);
            ABORT = true;
        } quit_(code, new ExitStatus(code)); };
        var exitJS = (status, implicit) => { EXITSTATUS = status; if (!keepRuntimeAlive()) {
            exitRuntime();
        } _proc_exit(status); };
        var _exit = exitJS;
        function _fd_close(fd) { try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return e.errno;
        } }
        function _fd_fdstat_get(fd, pbuf) { try {
            var rightsBase = 0;
            var rightsInheriting = 0;
            var flags = 0;
            {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
            }
            HEAP8[pbuf] = type;
            HEAP16[pbuf + 2 >> 1] = flags;
            tempI64 = [rightsBase >>> 0, (tempDouble = rightsBase, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[pbuf + 8 >> 2] = tempI64[0], HEAP32[pbuf + 12 >> 2] = tempI64[1];
            tempI64 = [rightsInheriting >>> 0, (tempDouble = rightsInheriting, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[pbuf + 16 >> 2] = tempI64[0], HEAP32[pbuf + 20 >> 2] = tempI64[1];
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return e.errno;
        } }
        var doReadv = (stream, iov, iovcnt, offset) => { var ret = 0; for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
                return -1;
            ret += curr;
            if (curr < len)
                break;
            if (typeof offset != "undefined") {
                offset += curr;
            }
        } return ret; };
        function _fd_read(fd, iov, iovcnt, pnum) { try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return e.errno;
        } }
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) { var offset = convertI32PairToI53Checked(offset_low, offset_high); try {
            if (isNaN(offset))
                return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.llseek(stream, offset, whence);
            tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
            if (stream.getdents && offset === 0 && whence === 0)
                stream.getdents = null;
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return e.errno;
        } }
        var doWritev = (stream, iov, iovcnt, offset) => { var ret = 0; for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
                return -1;
            ret += curr;
            if (curr < len) {
                break;
            }
            if (typeof offset != "undefined") {
                offset += curr;
            }
        } return ret; };
        function _fd_write(fd, iov, iovcnt, pnum) { try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doWritev(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return e.errno;
        } }
        var _getaddrinfo = (node, service, hint, out) => { var addr = 0; var port = 0; var flags = 0; var family = 0; var type = 0; var proto = 0; var ai; function allocaddrinfo(family, type, proto, canon, addr, port) { var sa, salen, ai; var errno; salen = family === 10 ? 28 : 16; addr = family === 10 ? inetNtop6(addr) : inetNtop4(addr); sa = _malloc(salen); errno = writeSockaddr(sa, family, addr, port); assert(!errno); ai = _malloc(32); HEAP32[ai + 4 >> 2] = family; HEAP32[ai + 8 >> 2] = type; HEAP32[ai + 12 >> 2] = proto; HEAPU32[ai + 24 >> 2] = canon; HEAPU32[ai + 20 >> 2] = sa; if (family === 10) {
            HEAP32[ai + 16 >> 2] = 28;
        }
        else {
            HEAP32[ai + 16 >> 2] = 16;
        } HEAP32[ai + 28 >> 2] = 0; return ai; } if (hint) {
            flags = HEAP32[hint >> 2];
            family = HEAP32[hint + 4 >> 2];
            type = HEAP32[hint + 8 >> 2];
            proto = HEAP32[hint + 12 >> 2];
        } if (type && !proto) {
            proto = type === 2 ? 17 : 6;
        } if (!type && proto) {
            type = proto === 17 ? 2 : 1;
        } if (proto === 0) {
            proto = 6;
        } if (type === 0) {
            type = 1;
        } if (!node && !service) {
            return -2;
        } if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
            return -1;
        } if (hint !== 0 && HEAP32[hint >> 2] & 2 && !node) {
            return -1;
        } if (flags & 32) {
            return -2;
        } if (type !== 0 && type !== 1 && type !== 2) {
            return -7;
        } if (family !== 0 && family !== 2 && family !== 10) {
            return -6;
        } if (service) {
            service = UTF8ToString(service);
            port = parseInt(service, 10);
            if (isNaN(port)) {
                if (flags & 1024) {
                    return -2;
                }
                return -8;
            }
        } if (!node) {
            if (family === 0) {
                family = 2;
            }
            if ((flags & 1) === 0) {
                if (family === 2) {
                    addr = _htonl(2130706433);
                }
                else {
                    addr = [0, 0, 0, _htonl(1)];
                }
            }
            ai = allocaddrinfo(family, type, proto, null, addr, port);
            HEAPU32[out >> 2] = ai;
            return 0;
        } node = UTF8ToString(node); addr = inetPton4(node); if (addr !== null) {
            if (family === 0 || family === 2) {
                family = 2;
            }
            else if (family === 10 && flags & 8) {
                addr = [0, 0, _htonl(65535), addr];
                family = 10;
            }
            else {
                return -2;
            }
        }
        else {
            addr = inetPton6(node);
            if (addr !== null) {
                if (family === 0 || family === 10) {
                    family = 10;
                }
                else {
                    return -2;
                }
            }
        } if (addr != null) {
            ai = allocaddrinfo(family, type, proto, node, addr, port);
            HEAPU32[out >> 2] = ai;
            return 0;
        } if (flags & 4) {
            return -2;
        } node = DNS.lookup_name(node); addr = inetPton4(node); if (family === 0) {
            family = 2;
        }
        else if (family === 10) {
            addr = [0, 0, _htonl(65535), addr];
        } ai = allocaddrinfo(family, type, proto, null, addr, port); HEAPU32[out >> 2] = ai; return 0; };
        function _js_cellarray(x, y, width, height, colia) { var context = Module.context; context.beginPath(); colia = Module.HEAPU8.subarray(colia, colia + width * height * 4); var imageData = context.createImageData(width, height); imageData.data.set(colia); var img = document.createElement("canvas"); img.width = width; img.height = height; img.getContext("2d").putImageData(imageData, 0, 0); context.drawImage(img, x, y); }
        function _js_circle(x, y, r, fill, colia) { var rgb = Module.HEAPU8.subarray(colia, colia + 3); var context = Module.context; context.beginPath(); context.lineWidth = 1; context.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + 255 + ")"; context.arc(x, y, r, 0, 2 * Math.PI); if (fill == 1) {
            context.fill("evenodd");
        }
        else {
            context.stroke();
        } }
        function _js_clear() { var context = Module.context; context.restore(); context.save(); context.clearRect(0, 0, parseInt(Module.canvas.width / Module.dpr, 10), parseInt(Module.canvas.height / Module.dpr, 10)); }
        function _js_clip_path(x, y, width, height) { var context = Module.context; context.restore(); context.save(); context.beginPath(); context.rect(x, y, width, height); context.clip(); }
        function _js_draw_path(n, px, py, nc, codes, bcoli, facoli, linewidth, to_DC_) { px = Module.HEAPF64.subarray(px / 8, px / 8 + n); py = Module.HEAPF64.subarray(py / 8, py / 8 + n); codes = Module.HEAPU32.subarray(codes / 4, codes / 4 + nc); facoli = Module.HEAPU8.subarray(facoli, facoli + 4); bcoli = Module.HEAPU8.subarray(bcoli, bcoli + 4); var i, j; var x = new Array(3), y = new Array(3), w, h, a1, a2; var cur_x = 0, cur_y = 0; var start_x = 0, start_y = 0; var context = Module.context; to_DC = function (n, x, y) { var x_ = _malloc(x.length * 8); var y_ = _malloc(y.length * 8); Module.HEAPF64.set(x, x_ / 8); Module.HEAPF64.set(y, y_ / 8); dynCall("viii", to_DC_, [n, x_, y_]); x__ = Module.HEAPF64.subarray(x_ / 8, x_ / 8 + x.length); y__ = Module.HEAPF64.subarray(y_ / 8, y_ / 8 + y.length); for (var i = 0; i < n; ++i) {
            x[i] = x__[i];
            y[i] = y__[i];
        } _free(x_); _free(y_); }; context.beginPath(); context.strokeStyle = "rgba(" + bcoli[0] + "," + bcoli[1] + "," + bcoli[2] + "," + bcoli[3] + ")"; context.fillStyle = "rgba(" + facoli[0] + "," + facoli[1] + "," + facoli[2] + "," + facoli[3] + ")"; context.lineWidth = linewidth; j = 0; for (i = 0; i < nc; ++i) {
            var code = String.fromCharCode(codes[i]);
            switch (code) {
                case "M":
                case "m":
                    x[0] = px[j];
                    y[0] = py[j];
                    if (code == "m") {
                        x[0] += cur_x;
                        y[0] += cur_y;
                    }
                    cur_x = start_x = x[0];
                    cur_y = start_y = y[0];
                    to_DC(1, x, y);
                    context.moveTo(x[0], y[0]);
                    j += 1;
                    break;
                case "L":
                case "l":
                    x[0] = px[j];
                    y[0] = py[j];
                    if (code == "l") {
                        x[0] += cur_x;
                        y[0] += cur_y;
                    }
                    cur_x = x[0];
                    cur_y = y[0];
                    to_DC(1, x, y);
                    context.lineTo(x[0], y[0]);
                    j += 1;
                    break;
                case "Q":
                case "q":
                    x[0] = px[j];
                    y[0] = py[j];
                    if (code == "q") {
                        x[0] += cur_x;
                        y[0] += cur_y;
                    }
                    x[1] = px[j + 1];
                    y[1] = py[j + 1];
                    if (code == "q") {
                        x[1] += cur_x;
                        y[1] += cur_y;
                    }
                    cur_x = x[1];
                    cur_y = y[1];
                    to_DC(2, x, y);
                    context.quadraticCurveTo(x[0], y[0], x[1], y[1]);
                    j += 2;
                    break;
                case "C":
                case "c":
                    x[0] = px[j];
                    y[0] = py[j];
                    if (code == "c") {
                        x[0] += cur_x;
                        y[0] += cur_y;
                    }
                    x[1] = px[j + 1];
                    y[1] = py[j + 1];
                    if (code == "c") {
                        x[1] += cur_x;
                        y[1] += cur_y;
                    }
                    x[2] = px[j + 2];
                    y[2] = py[j + 2];
                    if (code == "c") {
                        x[2] += cur_x;
                        y[2] += cur_y;
                    }
                    cur_x = x[2];
                    cur_y = y[2];
                    to_DC(3, x, y);
                    context.bezierCurveTo(x[0], y[0], x[1], y[1], x[2], y[2]);
                    j += 3;
                    break;
                case "A":
                case "a":
                    {
                        var rx = Math.abs(px[j]);
                        var ry = Math.abs(py[j]);
                        a1 = px[j + 1];
                        a2 = py[j + 1];
                        var cx = cur_x - rx * Math.cos(a1);
                        var cy = cur_y - ry * Math.sin(a1);
                        x[0] = cx - rx;
                        y[0] = cy - ry;
                        x[1] = cx + rx;
                        y[1] = cy + ry;
                        cur_x = cx + rx * Math.cos(a2);
                        cur_y = cy + ry * Math.sin(a2);
                    }
                    to_DC(2, x, y);
                    w = x[1] - x[0];
                    h = y[1] - y[0];
                    var anticlockwise = a1 < a2;
                    context.ellipse(x[0] + .5 * w, y[0] + .5 * h, Math.abs(w * .5), Math.abs(h * .5), 0, -a1, -a2, anticlockwise);
                    j += 3;
                    break;
                case "s":
                    context.closePath();
                    cur_x = start_x;
                    cur_y = start_y;
                    context.stroke();
                    break;
                case "S":
                    context.stroke();
                    break;
                case "F":
                case "G":
                    context.closePath();
                    cur_x = start_x;
                    cur_y = start_y;
                    context.fill(code === "F" ? "evenodd" : "nonzero");
                    context.stroke();
                    break;
                case "f":
                case "g":
                    context.closePath();
                    cur_x = start_x;
                    cur_y = start_y;
                    context.fill(code === "f" ? "evenodd" : "nonzero");
                    break;
                case "Z":
                    context.closePath();
                    cur_x = start_x;
                    cur_y = start_y;
                    break;
                case "\0": break;
                default:
                    console.log("invalid path code ('" + code + "')");
                    return;
            }
        } }
        function _js_fill_routine(n, px, py, colia) { var rgba = Module.HEAPU8.subarray(colia, colia + 4); px = Module.HEAPF64.subarray(px / 8, px / 8 + n); py = Module.HEAPF64.subarray(py / 8, py / 8 + n); var context = Module.context; context.beginPath(); context.moveTo(px[0], py[0]); for (var i = 1; i < n; i++) {
            context.lineTo(px[i], py[i]);
        } context.lineTo(px[0], py[0]); context.fillStyle = "rgba(" + rgba[0] + "," + rgba[1] + "," + rgba[2] + "," + rgba[3] + ")"; context.fill("evenodd"); }
        function _js_get_ws_height() { return parseInt(Module.canvas.height / Module.dpr, 10); }
        function _js_get_ws_width() { return parseInt(Module.canvas.width / Module.dpr, 10); }
        function _js_line(x1, y1, x2, y2, colia) { var rgb = Module.HEAPU8.subarray(colia, colia + 3); var context = Module.context; context.beginPath(); context.lineWidth = 1; context.strokeStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + 255 + ")"; context.moveTo(x1, y1); context.lineTo(x2, y2); context.stroke(); }
        function _js_line_routine(n, px, py, linetype, fill, width, rgb) { px = Module.HEAPF64.subarray(px / 8, px / 8 + n); py = Module.HEAPF64.subarray(py / 8, py / 8 + n); rgb = Module.HEAPU8.subarray(rgb, rgb + 4); var context = Module.context; context.beginPath(); context.setLineDash(Module.get_dash_list(linetype)); context.strokeStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + rgb[3] + ")"; context.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + rgb[3] + ")"; context.lineWidth = width; context.moveTo(px[0], py[0]); var nan_found = false; for (var i = 1; i < n; i++) {
            if (Number.isNaN(px[i]) && Number.isNaN(py[i])) {
                nan_found = true;
                continue;
            }
            if (nan_found) {
                nan_found = false;
                if (linetype == 0) {
                    context.closePath();
                }
                context.moveTo(px[i], py[i]);
            }
            else {
                context.lineTo(px[i], py[i]);
            }
        } if (linetype == 0) {
            context.closePath();
        } context.stroke(); if (fill != 0) {
            context.fill("evenodd");
        } }
        function _js_pattern_routine(n, px, py, colia) { colia = Module.HEAPU8.subarray(colia, colia + 64 * 4); px = Module.HEAPF64.subarray(px / 8, px / 8 + n); py = Module.HEAPF64.subarray(py / 8, py / 8 + n); var context = Module.context; context.beginPath(); context.moveTo(px[0], py[0]); for (var i = 1; i < n; i++) {
            context.lineTo(px[i], py[i]);
        } context.lineTo(px[0], py[0]); var imageData = context.createImageData(8, 8); imageData.data.set(colia); var img = document.createElement("canvas"); img.width = imageData.width; img.height = imageData.height; img.getContext("2d").putImageData(imageData, 0, 0); var pattern = context.createPattern(img, "repeat"); context.fillStyle = pattern; context.fill("evenodd"); }
        function _js_point(x, y, colia) { var rgb = Module.HEAPU8.subarray(colia, colia + 3); var context = Module.context; context.beginPath(); context.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + 255 + ")"; context.fillRect(x, y, 1, 1); }
        function _js_reset_clipping() { var context = Module.context; context.restore(); context.save(); }
        function _js_stroke(n, points, colia, linewidth) { points = Module.HEAPF64.subarray(points / 8, points / 8 + n * 2); var rgb = Module.HEAPU8.subarray(colia, colia + 4); var context = Module.context; context.beginPath(); context.strokeStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + rgb[3] + ")"; context.lineWidth = linewidth; context.moveTo(points[0], points[1]); for (var i = 1; i < n; i++) {
            context.lineTo(points[i * 2], points[i * 2 + 1]);
        } context.stroke(); }
        function _js_text(x, y, n, chars, height, top, angle, bold, italic, align, valign, font, colia) { var context = Module.context; var rgb = Module.HEAPU8.subarray(colia, colia + 3); context.beginPath(); context.fillStyle = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"; var strboit = ""; if (bold && italic) {
            strboit = "bold italic";
        }
        else if (italic) {
            strboit = "italic";
        }
        else if (bold) {
            strboit = "bold";
        } var fonts = ['"Times New Roman", Times, serif', "Helvetica, Arial, sans-serif", "Courier, monospace", "Symbol", '"Bookman Old Style", serif', '"Century Schoolbook", serif', '"Century Gothic", sans-serif', '"Palatino Linotype", "Book Antiqua", Palatino, serif']; context.font = strboit + " " + height + "px " + fonts[font]; var valg = 0; if (valign == 1) {
            valg = 1.2;
        }
        else if (valign == 2) {
            valg = 1;
        }
        else if (valign == 3) {
            valg = .5;
        }
        else if (valign == 5) {
            valg = -.2;
        } context.translate(x, y); context.rotate(angle * Math.PI / 180); if (align == 1) {
            context.textAlign = "center";
        }
        else if (align == 2) {
            context.textAlign = "right";
        }
        else {
            context.textAlign = "left";
        } var text = UTF8ToString(chars); context.fillText(text, 0, top * context.canvas.height * valg); context.setTransform(Module.dpr, 0, 0, Module.dpr, 0, 0); }
        function _toBsonWrite() { abort("missing function: toBsonWrite"); }
        _toBsonWrite.stub = true;
        var handleException = e => { if (e instanceof ExitStatus || e == "unwind") {
            return EXITSTATUS;
        } quit_(1, e); };
        var maybeExit = () => { if (runtimeExited) {
            return;
        } if (!keepRuntimeAlive()) {
            try {
                _exit(EXITSTATUS);
            }
            catch (e) {
                handleException(e);
            }
        } };
        var callUserCallback = func => { if (runtimeExited || ABORT) {
            return;
        } try {
            func();
            maybeExit();
        }
        catch (e) {
            handleException(e);
        } };
        var runtimeKeepalivePush = () => { runtimeKeepaliveCounter += 1; };
        var runtimeKeepalivePop = () => { runtimeKeepaliveCounter -= 1; };
        var safeSetTimeout = (func, timeout) => { runtimeKeepalivePush(); return setTimeout(() => { runtimeKeepalivePop(); callUserCallback(func); }, timeout); };
        var warnOnce = text => { warnOnce.shown ||= {}; if (!warnOnce.shown[text]) {
            warnOnce.shown[text] = 1;
            if (ENVIRONMENT_IS_NODE)
                text = "warning: " + text;
            err(text);
        } };
        var Browser = { useWebGL: false, isFullscreen: false, pointerLock: false, moduleContextCreatedCallbacks: [], workers: [], init() { if (Browser.initted)
                return; Browser.initted = true; var imagePlugin = {}; imagePlugin["canHandle"] = function imagePlugin_canHandle(name) { return !Module["noImageDecoding"] && /\.(jpg|jpeg|png|bmp|webp)$/i.test(name); }; imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) { var b = new Blob([byteArray], { type: Browser.getMimetype(name) }); if (b.size !== byteArray.length) {
                b = new Blob([new Uint8Array(byteArray).buffer], { type: Browser.getMimetype(name) });
            } var url = URL.createObjectURL(b); var img = new Image; img.onload = () => { var canvas = document.createElement("canvas"); canvas.width = img.width; canvas.height = img.height; var ctx = canvas.getContext("2d"); ctx.drawImage(img, 0, 0); preloadedImages[name] = canvas; URL.revokeObjectURL(url); onload?.(byteArray); }; img.onerror = event => { err(`Image ${url} could not be decoded`); onerror?.(); }; img.src = url; }; preloadPlugins.push(imagePlugin); var audioPlugin = {}; audioPlugin["canHandle"] = function audioPlugin_canHandle(name) { return !Module["noAudioDecoding"] && name.substr(-4) in { ".ogg": 1, ".wav": 1, ".mp3": 1 }; }; audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) { var done = false; function finish(audio) { if (done)
                return; done = true; preloadedAudios[name] = audio; onload?.(byteArray); } var b = new Blob([byteArray], { type: Browser.getMimetype(name) }); var url = URL.createObjectURL(b); var audio = new Audio; audio.addEventListener("canplaythrough", () => finish(audio), false); audio.onerror = function audio_onerror(event) { if (done)
                return; err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`); function encode64(data) { var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; var PAD = "="; var ret = ""; var leftchar = 0; var leftbits = 0; for (var i = 0; i < data.length; i++) {
                leftchar = leftchar << 8 | data[i];
                leftbits += 8;
                while (leftbits >= 6) {
                    var curr = leftchar >> leftbits - 6 & 63;
                    leftbits -= 6;
                    ret += BASE[curr];
                }
            } if (leftbits == 2) {
                ret += BASE[(leftchar & 3) << 4];
                ret += PAD + PAD;
            }
            else if (leftbits == 4) {
                ret += BASE[(leftchar & 15) << 2];
                ret += PAD;
            } return ret; } audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray); finish(audio); }; audio.src = url; safeSetTimeout(() => { finish(audio); }, 1e4); }; preloadPlugins.push(audioPlugin); function pointerLockChange() { Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"]; } var canvas = Module["canvas"]; if (canvas) {
                canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (() => { });
                canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (() => { });
                canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
                document.addEventListener("pointerlockchange", pointerLockChange, false);
                document.addEventListener("mozpointerlockchange", pointerLockChange, false);
                document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
                document.addEventListener("mspointerlockchange", pointerLockChange, false);
                if (Module["elementPointerLock"]) {
                    canvas.addEventListener("click", ev => { if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                        Module["canvas"].requestPointerLock();
                        ev.preventDefault();
                    } }, false);
                }
            } }, createContext(canvas, useWebGL, setInModule, webGLContextAttributes) { if (useWebGL && Module.ctx && canvas == Module.canvas)
                return Module.ctx; var ctx; var contextHandle; if (useWebGL) {
                var contextAttributes = { antialias: false, alpha: false, majorVersion: 1 };
                if (webGLContextAttributes) {
                    for (var attribute in webGLContextAttributes) {
                        contextAttributes[attribute] = webGLContextAttributes[attribute];
                    }
                }
                if (typeof GL != "undefined") {
                    contextHandle = GL.createContext(canvas, contextAttributes);
                    if (contextHandle) {
                        ctx = GL.getContext(contextHandle).GLctx;
                    }
                }
            }
            else {
                ctx = canvas.getContext("2d");
            } if (!ctx)
                return null; if (setInModule) {
                Module.ctx = ctx;
                if (useWebGL)
                    GL.makeContextCurrent(contextHandle);
                Browser.useWebGL = useWebGL;
                Browser.moduleContextCreatedCallbacks.forEach(callback => callback());
                Browser.init();
            } return ctx; }, fullscreenHandlersInstalled: false, lockPointer: undefined, resizeCanvas: undefined, requestFullscreen(lockPointer, resizeCanvas) { Browser.lockPointer = lockPointer; Browser.resizeCanvas = resizeCanvas; if (typeof Browser.lockPointer == "undefined")
                Browser.lockPointer = true; if (typeof Browser.resizeCanvas == "undefined")
                Browser.resizeCanvas = false; var canvas = Module["canvas"]; function fullscreenChange() { Browser.isFullscreen = false; var canvasContainer = canvas.parentNode; if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
                canvas.exitFullscreen = Browser.exitFullscreen;
                if (Browser.lockPointer)
                    canvas.requestPointerLock();
                Browser.isFullscreen = true;
                if (Browser.resizeCanvas) {
                    Browser.setFullscreenCanvasSize();
                }
                else {
                    Browser.updateCanvasDimensions(canvas);
                }
            }
            else {
                canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                canvasContainer.parentNode.removeChild(canvasContainer);
                if (Browser.resizeCanvas) {
                    Browser.setWindowedCanvasSize();
                }
                else {
                    Browser.updateCanvasDimensions(canvas);
                }
            } Module["onFullScreen"]?.(Browser.isFullscreen); Module["onFullscreen"]?.(Browser.isFullscreen); } if (!Browser.fullscreenHandlersInstalled) {
                Browser.fullscreenHandlersInstalled = true;
                document.addEventListener("fullscreenchange", fullscreenChange, false);
                document.addEventListener("mozfullscreenchange", fullscreenChange, false);
                document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
                document.addEventListener("MSFullscreenChange", fullscreenChange, false);
            } var canvasContainer = document.createElement("div"); canvas.parentNode.insertBefore(canvasContainer, canvas); canvasContainer.appendChild(canvas); canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? () => canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null) || (canvasContainer["webkitRequestFullScreen"] ? () => canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null); canvasContainer.requestFullscreen(); }, exitFullscreen() { if (!Browser.isFullscreen) {
                return false;
            } var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (() => { }); CFS.apply(document, []); return true; }, safeSetTimeout(func, timeout) { return safeSetTimeout(func, timeout); }, getMimetype(name) { return { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", bmp: "image/bmp", ogg: "audio/ogg", wav: "audio/wav", mp3: "audio/mpeg" }[name.substr(name.lastIndexOf(".") + 1)]; }, getUserMedia(func) { window.getUserMedia ||= navigator["getUserMedia"] || navigator["mozGetUserMedia"]; window.getUserMedia(func); }, getMovementX(event) { return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0; }, getMovementY(event) { return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0; }, getMouseWheelDelta(event) { var delta = 0; switch (event.type) {
                case "DOMMouseScroll":
                    delta = event.detail / 3;
                    break;
                case "mousewheel":
                    delta = event.wheelDelta / 120;
                    break;
                case "wheel":
                    delta = event.deltaY;
                    switch (event.deltaMode) {
                        case 0:
                            delta /= 100;
                            break;
                        case 1:
                            delta /= 3;
                            break;
                        case 2:
                            delta *= 80;
                            break;
                        default: throw "unrecognized mouse wheel delta mode: " + event.deltaMode;
                    }
                    break;
                default: throw "unrecognized mouse wheel event: " + event.type;
            } return delta; }, mouseX: 0, mouseY: 0, mouseMovementX: 0, mouseMovementY: 0, touches: {}, lastTouches: {}, calculateMouseCoords(pageX, pageY) { var rect = Module["canvas"].getBoundingClientRect(); var cw = Module["canvas"].width; var ch = Module["canvas"].height; var scrollX = typeof window.scrollX != "undefined" ? window.scrollX : window.pageXOffset; var scrollY = typeof window.scrollY != "undefined" ? window.scrollY : window.pageYOffset; var adjustedX = pageX - (scrollX + rect.left); var adjustedY = pageY - (scrollY + rect.top); adjustedX = adjustedX * (cw / rect.width); adjustedY = adjustedY * (ch / rect.height); return { x: adjustedX, y: adjustedY }; }, setMouseCoords(pageX, pageY) { const { x, y } = Browser.calculateMouseCoords(pageX, pageY); Browser.mouseMovementX = x - Browser.mouseX; Browser.mouseMovementY = y - Browser.mouseY; Browser.mouseX = x; Browser.mouseY = y; }, calculateMouseEvent(event) { if (Browser.pointerLock) {
                if (event.type != "mousemove" && "mozMovementX" in event) {
                    Browser.mouseMovementX = Browser.mouseMovementY = 0;
                }
                else {
                    Browser.mouseMovementX = Browser.getMovementX(event);
                    Browser.mouseMovementY = Browser.getMovementY(event);
                }
                Browser.mouseX += Browser.mouseMovementX;
                Browser.mouseY += Browser.mouseMovementY;
            }
            else {
                if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                    var touch = event.touch;
                    if (touch === undefined) {
                        return;
                    }
                    var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
                    if (event.type === "touchstart") {
                        Browser.lastTouches[touch.identifier] = coords;
                        Browser.touches[touch.identifier] = coords;
                    }
                    else if (event.type === "touchend" || event.type === "touchmove") {
                        var last = Browser.touches[touch.identifier];
                        last ||= coords;
                        Browser.lastTouches[touch.identifier] = last;
                        Browser.touches[touch.identifier] = coords;
                    }
                    return;
                }
                Browser.setMouseCoords(event.pageX, event.pageY);
            } }, resizeListeners: [], updateResizeListeners() { var canvas = Module["canvas"]; Browser.resizeListeners.forEach(listener => listener(canvas.width, canvas.height)); }, setCanvasSize(width, height, noUpdates) { var canvas = Module["canvas"]; Browser.updateCanvasDimensions(canvas, width, height); if (!noUpdates)
                Browser.updateResizeListeners(); }, windowedWidth: 0, windowedHeight: 0, setFullscreenCanvasSize() { if (typeof SDL != "undefined") {
                var flags = HEAPU32[SDL.screen >> 2];
                flags = flags | 8388608;
                HEAP32[SDL.screen >> 2] = flags;
            } Browser.updateCanvasDimensions(Module["canvas"]); Browser.updateResizeListeners(); }, setWindowedCanvasSize() { if (typeof SDL != "undefined") {
                var flags = HEAPU32[SDL.screen >> 2];
                flags = flags & ~8388608;
                HEAP32[SDL.screen >> 2] = flags;
            } Browser.updateCanvasDimensions(Module["canvas"]); Browser.updateResizeListeners(); }, updateCanvasDimensions(canvas, wNative, hNative) { if (wNative && hNative) {
                canvas.widthNative = wNative;
                canvas.heightNative = hNative;
            }
            else {
                wNative = canvas.widthNative;
                hNative = canvas.heightNative;
            } var w = wNative; var h = hNative; if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
                if (w / h < Module["forcedAspectRatio"]) {
                    w = Math.round(h * Module["forcedAspectRatio"]);
                }
                else {
                    h = Math.round(w / Module["forcedAspectRatio"]);
                }
            } if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
                var factor = Math.min(screen.width / w, screen.height / h);
                w = Math.round(w * factor);
                h = Math.round(h * factor);
            } if (Browser.resizeCanvas) {
                if (canvas.width != w)
                    canvas.width = w;
                if (canvas.height != h)
                    canvas.height = h;
                if (typeof canvas.style != "undefined") {
                    canvas.style.removeProperty("width");
                    canvas.style.removeProperty("height");
                }
            }
            else {
                if (canvas.width != wNative)
                    canvas.width = wNative;
                if (canvas.height != hNative)
                    canvas.height = hNative;
                if (typeof canvas.style != "undefined") {
                    if (w != wNative || h != hNative) {
                        canvas.style.setProperty("width", w + "px", "important");
                        canvas.style.setProperty("height", h + "px", "important");
                    }
                    else {
                        canvas.style.removeProperty("width");
                        canvas.style.removeProperty("height");
                    }
                }
            } } };
        var GLctx;
        var webgl_enable_ANGLE_instanced_arrays = ctx => { var ext = ctx.getExtension("ANGLE_instanced_arrays"); if (ext) {
            ctx["vertexAttribDivisor"] = (index, divisor) => ext["vertexAttribDivisorANGLE"](index, divisor);
            ctx["drawArraysInstanced"] = (mode, first, count, primcount) => ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
            ctx["drawElementsInstanced"] = (mode, count, type, indices, primcount) => ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
            return 1;
        } };
        var webgl_enable_OES_vertex_array_object = ctx => { var ext = ctx.getExtension("OES_vertex_array_object"); if (ext) {
            ctx["createVertexArray"] = () => ext["createVertexArrayOES"]();
            ctx["deleteVertexArray"] = vao => ext["deleteVertexArrayOES"](vao);
            ctx["bindVertexArray"] = vao => ext["bindVertexArrayOES"](vao);
            ctx["isVertexArray"] = vao => ext["isVertexArrayOES"](vao);
            return 1;
        } };
        var webgl_enable_WEBGL_draw_buffers = ctx => { var ext = ctx.getExtension("WEBGL_draw_buffers"); if (ext) {
            ctx["drawBuffers"] = (n, bufs) => ext["drawBuffersWEBGL"](n, bufs);
            return 1;
        } };
        var webgl_enable_EXT_polygon_offset_clamp = ctx => !!(ctx.extPolygonOffsetClamp = ctx.getExtension("EXT_polygon_offset_clamp"));
        var webgl_enable_EXT_clip_control = ctx => !!(ctx.extClipControl = ctx.getExtension("EXT_clip_control"));
        var webgl_enable_WEBGL_polygon_mode = ctx => !!(ctx.webglPolygonMode = ctx.getExtension("WEBGL_polygon_mode"));
        var webgl_enable_WEBGL_multi_draw = ctx => !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));
        var getEmscriptenSupportedExtensions = ctx => { var supportedExtensions = ["ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_disjoint_timer_query", "EXT_frag_depth", "EXT_shader_texture_lod", "EXT_sRGB", "OES_element_index_uint", "OES_fbo_render_mipmap", "OES_standard_derivatives", "OES_texture_float", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_color_buffer_float", "WEBGL_depth_texture", "WEBGL_draw_buffers", "EXT_clip_control", "EXT_color_buffer_half_float", "EXT_depth_clamp", "EXT_float_blend", "EXT_polygon_offset_clamp", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "KHR_parallel_shader_compile", "OES_texture_float_linear", "WEBGL_blend_func_extended", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_polygon_mode"]; return (ctx.getSupportedExtensions() || []).filter(ext => supportedExtensions.includes(ext)); };
        var registerPreMainLoop = f => { typeof MainLoop != "undefined" && MainLoop.preMainLoop.push(f); };
        var GL = { counter: 1, buffers: [], programs: [], framebuffers: [], renderbuffers: [], textures: [], shaders: [], vaos: [], contexts: [], offscreenCanvases: {}, queries: [], byteSizeByTypeRoot: 5120, byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8], stringCache: {}, unpackAlignment: 4, unpackRowLength: 0, recordError: errorCode => { if (!GL.lastError) {
                GL.lastError = errorCode;
            } }, getNewId: table => { var ret = GL.counter++; for (var i = table.length; i < ret; i++) {
                table[i] = null;
            } return ret; }, genObject: (n, buffers, createFunction, objectTable) => { for (var i = 0; i < n; i++) {
                var buffer = GLctx[createFunction]();
                var id = buffer && GL.getNewId(objectTable);
                if (buffer) {
                    buffer.name = id;
                    objectTable[id] = buffer;
                }
                else {
                    GL.recordError(1282);
                }
                HEAP32[buffers + i * 4 >> 2] = id;
            } }, MAX_TEMP_BUFFER_SIZE: 2097152, numTempVertexBuffersPerSize: 64, log2ceilLookup: i => 32 - Math.clz32(i === 0 ? 0 : i - 1), generateTempBuffers: (quads, context) => { var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE); context.tempVertexBufferCounters1 = []; context.tempVertexBufferCounters2 = []; context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex + 1; context.tempVertexBuffers1 = []; context.tempVertexBuffers2 = []; context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex + 1; context.tempIndexBuffers = []; context.tempIndexBuffers.length = largestIndex + 1; for (var i = 0; i <= largestIndex; ++i) {
                context.tempIndexBuffers[i] = null;
                context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
                var ringbufferLength = GL.numTempVertexBuffersPerSize;
                context.tempVertexBuffers1[i] = [];
                context.tempVertexBuffers2[i] = [];
                var ringbuffer1 = context.tempVertexBuffers1[i];
                var ringbuffer2 = context.tempVertexBuffers2[i];
                ringbuffer1.length = ringbuffer2.length = ringbufferLength;
                for (var j = 0; j < ringbufferLength; ++j) {
                    ringbuffer1[j] = ringbuffer2[j] = null;
                }
            } if (quads) {
                context.tempQuadIndexBuffer = GLctx.createBuffer();
                context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
                var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
                var quadIndexes = new Uint16Array(numIndexes);
                var i = 0, v = 0;
                while (1) {
                    quadIndexes[i++] = v;
                    if (i >= numIndexes)
                        break;
                    quadIndexes[i++] = v + 1;
                    if (i >= numIndexes)
                        break;
                    quadIndexes[i++] = v + 2;
                    if (i >= numIndexes)
                        break;
                    quadIndexes[i++] = v;
                    if (i >= numIndexes)
                        break;
                    quadIndexes[i++] = v + 2;
                    if (i >= numIndexes)
                        break;
                    quadIndexes[i++] = v + 3;
                    if (i >= numIndexes)
                        break;
                    v += 4;
                }
                context.GLctx.bufferData(34963, quadIndexes, 35044);
                context.GLctx.bindBuffer(34963, null);
            } }, getTempVertexBuffer: sizeBytes => { var idx = GL.log2ceilLookup(sizeBytes); var ringbuffer = GL.currentContext.tempVertexBuffers1[idx]; var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx]; GL.currentContext.tempVertexBufferCounters1[idx] = GL.currentContext.tempVertexBufferCounters1[idx] + 1 & GL.numTempVertexBuffersPerSize - 1; var vbo = ringbuffer[nextFreeBufferIndex]; if (vbo) {
                return vbo;
            } var prevVBO = GLctx.getParameter(34964); ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer(); GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]); GLctx.bufferData(34962, 1 << idx, 35048); GLctx.bindBuffer(34962, prevVBO); return ringbuffer[nextFreeBufferIndex]; }, getTempIndexBuffer: sizeBytes => { var idx = GL.log2ceilLookup(sizeBytes); var ibo = GL.currentContext.tempIndexBuffers[idx]; if (ibo) {
                return ibo;
            } var prevIBO = GLctx.getParameter(34965); GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer(); GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]); GLctx.bufferData(34963, 1 << idx, 35048); GLctx.bindBuffer(34963, prevIBO); return GL.currentContext.tempIndexBuffers[idx]; }, newRenderingFrameStarted: () => { if (!GL.currentContext) {
                return;
            } var vb = GL.currentContext.tempVertexBuffers1; GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2; GL.currentContext.tempVertexBuffers2 = vb; vb = GL.currentContext.tempVertexBufferCounters1; GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2; GL.currentContext.tempVertexBufferCounters2 = vb; var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE); for (var i = 0; i <= largestIndex; ++i) {
                GL.currentContext.tempVertexBufferCounters1[i] = 0;
            } }, getSource: (shader, count, string, length) => { var source = ""; for (var i = 0; i < count; ++i) {
                var len = length ? HEAPU32[length + i * 4 >> 2] : undefined;
                source += UTF8ToString(HEAPU32[string + i * 4 >> 2], len);
            } var type = GLctx.getShaderParameter(GL.shaders[shader], 35663); if (type == 35632) {
                if (GLEmulation.findToken(source, "dFdx") || GLEmulation.findToken(source, "dFdy") || GLEmulation.findToken(source, "fwidth")) {
                    source = "#extension GL_OES_standard_derivatives : enable\n" + source;
                    var extension = GLctx.getExtension("OES_standard_derivatives");
                }
            } return source; }, createContext: (canvas, webGLContextAttributes) => { if (!canvas.getContextSafariWebGL2Fixed) {
                canvas.getContextSafariWebGL2Fixed = canvas.getContext;
                function fixedGetContext(ver, attrs) { var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs); return ver == "webgl" == gl instanceof WebGLRenderingContext ? gl : null; }
                canvas.getContext = fixedGetContext;
            } var ctx = canvas.getContext("webgl", webGLContextAttributes); if (!ctx)
                return 0; var handle = GL.registerContext(ctx, webGLContextAttributes); return handle; }, registerContext: (ctx, webGLContextAttributes) => { var handle = GL.getNewId(GL.contexts); var context = { handle, attributes: webGLContextAttributes, version: webGLContextAttributes.majorVersion, GLctx: ctx }; if (ctx.canvas)
                ctx.canvas.GLctxObject = context; GL.contexts[handle] = context; if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
                GL.initExtensions(context);
            } return handle; }, makeContextCurrent: contextHandle => { GL.currentContext = GL.contexts[contextHandle]; Module.ctx = GLctx = GL.currentContext?.GLctx; return !(contextHandle && !GLctx); }, getContext: contextHandle => GL.contexts[contextHandle], deleteContext: contextHandle => { if (GL.currentContext === GL.contexts[contextHandle]) {
                GL.currentContext = null;
            } if (typeof JSEvents == "object") {
                JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
            } if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) {
                GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
            } GL.contexts[contextHandle] = null; }, initExtensions: context => { context ||= GL.currentContext; if (context.initExtensionsDone)
                return; context.initExtensionsDone = true; var GLctx = context.GLctx; context.compressionExt = GLctx.getExtension("WEBGL_compressed_texture_s3tc"); context.anisotropicExt = GLctx.getExtension("EXT_texture_filter_anisotropic"); webgl_enable_WEBGL_multi_draw(GLctx); webgl_enable_EXT_polygon_offset_clamp(GLctx); webgl_enable_EXT_clip_control(GLctx); webgl_enable_WEBGL_polygon_mode(GLctx); webgl_enable_ANGLE_instanced_arrays(GLctx); webgl_enable_OES_vertex_array_object(GLctx); webgl_enable_WEBGL_draw_buffers(GLctx); {
                GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
            } getEmscriptenSupportedExtensions(GLctx).forEach(ext => { if (!ext.includes("lose_context") && !ext.includes("debug")) {
                GLctx.getExtension(ext);
            } }); } };
        var GLImmediate = { MapTreeLib: null, spawnMapTreeLib: () => { function CNaiveListMap() { var list = []; this.insert = function CNaiveListMap_insert(key, val) { if (this.contains(key | 0))
                return false; list.push([key, val]); return true; }; var __contains_i; this.contains = function CNaiveListMap_contains(key) { for (__contains_i = 0; __contains_i < list.length; ++__contains_i) {
                if (list[__contains_i][0] === key)
                    return true;
            } return false; }; var __get_i; this.get = function CNaiveListMap_get(key) { for (__get_i = 0; __get_i < list.length; ++__get_i) {
                if (list[__get_i][0] === key)
                    return list[__get_i][1];
            } return undefined; }; } function CMapTree() { function CNLNode() { var map = new CNaiveListMap; this.child = function CNLNode_child(keyFrag) { if (!map.contains(keyFrag | 0)) {
                map.insert(keyFrag | 0, new CNLNode);
            } return map.get(keyFrag | 0); }; this.value = undefined; this.get = function CNLNode_get() { return this.value; }; this.set = function CNLNode_set(val) { this.value = val; }; } function CKeyView(root) { var cur; this.reset = function CKeyView_reset() { cur = root; return this; }; this.reset(); this.next = function CKeyView_next(keyFrag) { cur = cur.child(keyFrag); return this; }; this.get = function CKeyView_get() { return cur.get(); }; this.set = function CKeyView_set(val) { cur.set(val); }; } var root; var staticKeyView; this.createKeyView = function CNLNode_createKeyView() { return new CKeyView(root); }; this.clear = function CNLNode_clear() { root = new CNLNode; staticKeyView = this.createKeyView(); }; this.clear(); this.getStaticKeyView = function CNLNode_getStaticKeyView() { staticKeyView.reset(); return staticKeyView; }; } return { create: () => new CMapTree }; }, TexEnvJIT: null, spawnTexEnvJIT: () => { var GL_TEXTURE0 = 33984; var GL_TEXTURE_1D = 3552; var GL_TEXTURE_2D = 3553; var GL_TEXTURE_3D = 32879; var GL_TEXTURE_CUBE_MAP = 34067; var GL_TEXTURE_ENV = 8960; var GL_TEXTURE_ENV_MODE = 8704; var GL_TEXTURE_ENV_COLOR = 8705; var GL_SRC0_RGB = 34176; var GL_SRC1_RGB = 34177; var GL_SRC2_RGB = 34178; var GL_SRC0_ALPHA = 34184; var GL_SRC1_ALPHA = 34185; var GL_SRC2_ALPHA = 34186; var GL_OPERAND0_RGB = 34192; var GL_OPERAND1_RGB = 34193; var GL_OPERAND2_RGB = 34194; var GL_OPERAND0_ALPHA = 34200; var GL_OPERAND1_ALPHA = 34201; var GL_OPERAND2_ALPHA = 34202; var GL_COMBINE_RGB = 34161; var GL_COMBINE_ALPHA = 34162; var GL_RGB_SCALE = 34163; var GL_ALPHA_SCALE = 3356; var GL_ADD = 260; var GL_BLEND = 3042; var GL_REPLACE = 7681; var GL_MODULATE = 8448; var GL_DECAL = 8449; var GL_COMBINE = 34160; var GL_SUBTRACT = 34023; var GL_INTERPOLATE = 34165; var GL_TEXTURE = 5890; var GL_CONSTANT = 34166; var GL_PRIMARY_COLOR = 34167; var GL_PREVIOUS = 34168; var GL_SRC_COLOR = 768; var GL_ONE_MINUS_SRC_COLOR = 769; var GL_SRC_ALPHA = 770; var GL_ONE_MINUS_SRC_ALPHA = 771; var TEXENVJIT_NAMESPACE_PREFIX = "tej_"; var TEX_UNIT_UNIFORM_PREFIX = "uTexUnit"; var TEX_COORD_VARYING_PREFIX = "vTexCoord"; var PRIM_COLOR_VARYING = "vPrimColor"; var TEX_MATRIX_UNIFORM_PREFIX = "uTexMatrix"; var s_texUnits = null; var s_activeTexture = 0; var s_requiredTexUnitsForPass = []; function abort(info) { assert(false, "[TexEnvJIT] ABORT: " + info); } function abort_noSupport(info) { abort("No support: " + info); } function abort_sanity(info) { abort("Sanity failure: " + info); } function genTexUnitSampleExpr(texUnitID) { var texUnit = s_texUnits[texUnitID]; var texType = texUnit.getTexType(); var func = null; switch (texType) {
                case GL_TEXTURE_1D:
                    func = "texture2D";
                    break;
                case GL_TEXTURE_2D:
                    func = "texture2D";
                    break;
                case GL_TEXTURE_3D: return abort_noSupport("No support for 3D textures.");
                case GL_TEXTURE_CUBE_MAP:
                    func = "textureCube";
                    break;
                default: return abort_sanity(`Unknown texType: ${ptrToString(texType)}`);
            } var texCoordExpr = TEX_COORD_VARYING_PREFIX + texUnitID; if (TEX_MATRIX_UNIFORM_PREFIX != null) {
                texCoordExpr = `(${TEX_MATRIX_UNIFORM_PREFIX}${texUnitID} * ${texCoordExpr})`;
            } return `${func}(${TEX_UNIT_UNIFORM_PREFIX}${texUnitID}, ${texCoordExpr}.xy)`; } function getTypeFromCombineOp(op) { switch (op) {
                case GL_SRC_COLOR:
                case GL_ONE_MINUS_SRC_COLOR: return "vec3";
                case GL_SRC_ALPHA:
                case GL_ONE_MINUS_SRC_ALPHA: return "float";
            } return abort_noSupport("Unsupported combiner op: " + ptrToString(op)); } function getCurTexUnit() { return s_texUnits[s_activeTexture]; } function genCombinerSourceExpr(texUnitID, constantExpr, previousVar, src, op) { var srcExpr = null; switch (src) {
                case GL_TEXTURE:
                    srcExpr = genTexUnitSampleExpr(texUnitID);
                    break;
                case GL_CONSTANT:
                    srcExpr = constantExpr;
                    break;
                case GL_PRIMARY_COLOR:
                    srcExpr = PRIM_COLOR_VARYING;
                    break;
                case GL_PREVIOUS:
                    srcExpr = previousVar;
                    break;
                default: return abort_noSupport("Unsupported combiner src: " + ptrToString(src));
            } var expr = null; switch (op) {
                case GL_SRC_COLOR:
                    expr = srcExpr + ".rgb";
                    break;
                case GL_ONE_MINUS_SRC_COLOR:
                    expr = "(vec3(1.0) - " + srcExpr + ".rgb)";
                    break;
                case GL_SRC_ALPHA:
                    expr = srcExpr + ".a";
                    break;
                case GL_ONE_MINUS_SRC_ALPHA:
                    expr = "(1.0 - " + srcExpr + ".a)";
                    break;
                default: return abort_noSupport("Unsupported combiner op: " + ptrToString(op));
            } return expr; } function valToFloatLiteral(val) { if (val == Math.round(val))
                return val + ".0"; return val; } function CTexEnv() { this.mode = GL_MODULATE; this.colorCombiner = GL_MODULATE; this.alphaCombiner = GL_MODULATE; this.colorScale = 1; this.alphaScale = 1; this.envColor = [0, 0, 0, 0]; this.colorSrc = [GL_TEXTURE, GL_PREVIOUS, GL_CONSTANT]; this.alphaSrc = [GL_TEXTURE, GL_PREVIOUS, GL_CONSTANT]; this.colorOp = [GL_SRC_COLOR, GL_SRC_COLOR, GL_SRC_ALPHA]; this.alphaOp = [GL_SRC_ALPHA, GL_SRC_ALPHA, GL_SRC_ALPHA]; this.traverseKey = { 7681: 0, 8448: 1, 260: 2, 3042: 3, 8449: 4, 34160: 5, 34023: 3, 34165: 4, 5890: 0, 34166: 1, 34167: 2, 34168: 3, 768: 0, 769: 1, 770: 2, 771: 3 }; this.key0 = -1; this.key1 = 0; this.key2 = 0; this.computeKey0 = function () { var k = this.traverseKey; var key = k[this.mode] * 1638400; key += k[this.colorCombiner] * 327680; key += k[this.alphaCombiner] * 65536; key += (this.colorScale - 1) * 16384; key += (this.alphaScale - 1) * 4096; key += k[this.colorSrc[0]] * 1024; key += k[this.colorSrc[1]] * 256; key += k[this.colorSrc[2]] * 64; key += k[this.alphaSrc[0]] * 16; key += k[this.alphaSrc[1]] * 4; key += k[this.alphaSrc[2]]; return key; }; this.computeKey1 = function () { var k = this.traverseKey; var key = k[this.colorOp[0]] * 4096; key += k[this.colorOp[1]] * 1024; key += k[this.colorOp[2]] * 256; key += k[this.alphaOp[0]] * 16; key += k[this.alphaOp[1]] * 4; key += k[this.alphaOp[2]]; return key; }; this.computeKey2 = function () { return this.envColor[0] * 16777216 + this.envColor[1] * 65536 + this.envColor[2] * 256 + 1 + this.envColor[3]; }; this.recomputeKey = function () { this.key0 = this.computeKey0(); this.key1 = this.computeKey1(); this.key2 = this.computeKey2(); }; this.invalidateKey = function () { this.key0 = -1; GLImmediate.currentRenderer = null; }; } function CTexUnit() { this.env = new CTexEnv; this.enabled_tex1D = false; this.enabled_tex2D = false; this.enabled_tex3D = false; this.enabled_texCube = false; this.texTypesEnabled = 0; this.traverseState = function CTexUnit_traverseState(keyView) { if (this.texTypesEnabled) {
                if (this.env.key0 == -1) {
                    this.env.recomputeKey();
                }
                keyView.next(this.texTypesEnabled | this.env.key0 << 4);
                keyView.next(this.env.key1);
                keyView.next(this.env.key2);
            }
            else {
                keyView.next(0);
            } }; } CTexUnit.prototype.enabled = function CTexUnit_enabled() { return this.texTypesEnabled; }; CTexUnit.prototype.genPassLines = function CTexUnit_genPassLines(passOutputVar, passInputVar, texUnitID) { if (!this.enabled()) {
                return ["vec4 " + passOutputVar + " = " + passInputVar + ";"];
            } var lines = this.env.genPassLines(passOutputVar, passInputVar, texUnitID).join("\n"); var texLoadLines = ""; var texLoadRegex = /(texture.*?\(.*?\))/g; var loadCounter = 0; var load; while (load = texLoadRegex.exec(lines)) {
                var texLoadExpr = load[1];
                var secondOccurrence = lines.slice(load.index + 1).indexOf(texLoadExpr);
                if (secondOccurrence != -1) {
                    var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
                    var texLoadVar = prefix + "texload" + loadCounter++;
                    var texLoadLine = "vec4 " + texLoadVar + " = " + texLoadExpr + ";\n";
                    texLoadLines += texLoadLine + "\n";
                    lines = lines.split(texLoadExpr).join(texLoadVar);
                    texLoadRegex = /(texture.*\(.*\))/g;
                }
            } return [texLoadLines + lines]; }; CTexUnit.prototype.getTexType = function CTexUnit_getTexType() { if (this.enabled_texCube) {
                return GL_TEXTURE_CUBE_MAP;
            }
            else if (this.enabled_tex3D) {
                return GL_TEXTURE_3D;
            }
            else if (this.enabled_tex2D) {
                return GL_TEXTURE_2D;
            }
            else if (this.enabled_tex1D) {
                return GL_TEXTURE_1D;
            } return 0; }; CTexEnv.prototype.genPassLines = function CTexEnv_genPassLines(passOutputVar, passInputVar, texUnitID) { switch (this.mode) {
                case GL_REPLACE: {
                    return ["vec4 " + passOutputVar + " = " + genTexUnitSampleExpr(texUnitID) + ";"];
                }
                case GL_ADD: {
                    var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
                    var texVar = prefix + "tex";
                    var colorVar = prefix + "color";
                    var alphaVar = prefix + "alpha";
                    return ["vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";", "vec3 " + colorVar + " = " + passInputVar + ".rgb + " + texVar + ".rgb;", "float " + alphaVar + " = " + passInputVar + ".a * " + texVar + ".a;", "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");"];
                }
                case GL_MODULATE: {
                    var line = ["vec4 " + passOutputVar, " = ", passInputVar, " * ", genTexUnitSampleExpr(texUnitID), ";"];
                    return [line.join("")];
                }
                case GL_DECAL: {
                    var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
                    var texVar = prefix + "tex";
                    var colorVar = prefix + "color";
                    var alphaVar = prefix + "alpha";
                    return ["vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";", ["vec3 " + colorVar + " = ", passInputVar + ".rgb * (1.0 - " + texVar + ".a)", " + ", texVar + ".rgb * " + texVar + ".a", ";"].join(""), "float " + alphaVar + " = " + passInputVar + ".a;", "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");"];
                }
                case GL_BLEND: {
                    var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
                    var texVar = prefix + "tex";
                    var colorVar = prefix + "color";
                    var alphaVar = prefix + "alpha";
                    return ["vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";", ["vec3 " + colorVar + " = ", passInputVar + ".rgb * (1.0 - " + texVar + ".rgb)", " + ", PRIM_COLOR_VARYING + ".rgb * " + texVar + ".rgb", ";"].join(""), "float " + alphaVar + " = " + texVar + ".a;", "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");"];
                }
                case GL_COMBINE: {
                    var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
                    var colorVar = prefix + "color";
                    var alphaVar = prefix + "alpha";
                    var colorLines = this.genCombinerLines(true, colorVar, passInputVar, texUnitID, this.colorCombiner, this.colorSrc, this.colorOp);
                    var alphaLines = this.genCombinerLines(false, alphaVar, passInputVar, texUnitID, this.alphaCombiner, this.alphaSrc, this.alphaOp);
                    var scaledColor = this.colorScale == 1 ? colorVar : colorVar + " * " + valToFloatLiteral(this.colorScale);
                    var scaledAlpha = this.alphaScale == 1 ? alphaVar : alphaVar + " * " + valToFloatLiteral(this.alphaScale);
                    var line = ["vec4 " + passOutputVar, " = ", "vec4(", scaledColor, ", ", scaledAlpha, ")", ";"].join("");
                    return [].concat(colorLines, alphaLines, [line]);
                }
            } return abort_noSupport("Unsupported TexEnv mode: " + ptrToString(this.mode)); }; CTexEnv.prototype.genCombinerLines = function CTexEnv_getCombinerLines(isColor, outputVar, passInputVar, texUnitID, combiner, srcArr, opArr) { var argsNeeded = null; switch (combiner) {
                case GL_REPLACE:
                    argsNeeded = 1;
                    break;
                case GL_MODULATE:
                case GL_ADD:
                case GL_SUBTRACT:
                    argsNeeded = 2;
                    break;
                case GL_INTERPOLATE:
                    argsNeeded = 3;
                    break;
                default: return abort_noSupport("Unsupported combiner: " + ptrToString(combiner));
            } var constantExpr = ["vec4(", valToFloatLiteral(this.envColor[0]), ", ", valToFloatLiteral(this.envColor[1]), ", ", valToFloatLiteral(this.envColor[2]), ", ", valToFloatLiteral(this.envColor[3]), ")"].join(""); var src0Expr = argsNeeded >= 1 ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[0], opArr[0]) : null; var src1Expr = argsNeeded >= 2 ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[1], opArr[1]) : null; var src2Expr = argsNeeded >= 3 ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[2], opArr[2]) : null; var outputType = isColor ? "vec3" : "float"; var lines = null; switch (combiner) {
                case GL_REPLACE: {
                    lines = [`${outputType} ${outputVar} = ${src0Expr};`];
                    break;
                }
                case GL_MODULATE: {
                    lines = [`${outputType} ${outputVar} = ${src0Expr} * ${src1Expr};`];
                    break;
                }
                case GL_ADD: {
                    lines = [`${outputType} ${outputVar} = ${src0Expr} + ${src1Expr};`];
                    break;
                }
                case GL_SUBTRACT: {
                    lines = [`${outputType} ${outputVar} = ${src0Expr} - ${src1Expr};`];
                    break;
                }
                case GL_INTERPOLATE: {
                    var prefix = `${TEXENVJIT_NAMESPACE_PREFIX}env${texUnitID}_`;
                    var arg2Var = `${prefix}colorSrc2`;
                    var arg2Type = getTypeFromCombineOp(this.colorOp[2]);
                    lines = [`${arg2Type} ${arg2Var} = ${src2Expr};`, `${outputType} ${outputVar} = ${src0Expr} * ${arg2Var} + ${src1Expr} * (1.0 - ${arg2Var});`];
                    break;
                }
                default: return abort_sanity("Unmatched TexEnv.colorCombiner?");
            } return lines; }; return { init: (gl, specifiedMaxTextureImageUnits) => { var maxTexUnits = 0; if (specifiedMaxTextureImageUnits) {
                    maxTexUnits = specifiedMaxTextureImageUnits;
                }
                else if (gl) {
                    maxTexUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
                } s_texUnits = []; for (var i = 0; i < maxTexUnits; i++) {
                    s_texUnits.push(new CTexUnit);
                } }, setGLSLVars: (uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix) => { TEX_UNIT_UNIFORM_PREFIX = uTexUnitPrefix; TEX_COORD_VARYING_PREFIX = vTexCoordPrefix; PRIM_COLOR_VARYING = vPrimColor; TEX_MATRIX_UNIFORM_PREFIX = uTexMatrixPrefix; }, genAllPassLines: (resultDest, indentSize = 0) => { s_requiredTexUnitsForPass.length = 0; var lines = []; var lastPassVar = PRIM_COLOR_VARYING; for (var i = 0; i < s_texUnits.length; i++) {
                    if (!s_texUnits[i].enabled())
                        continue;
                    s_requiredTexUnitsForPass.push(i);
                    var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + i + "_";
                    var passOutputVar = prefix + "result";
                    var newLines = s_texUnits[i].genPassLines(passOutputVar, lastPassVar, i);
                    lines = lines.concat(newLines, [""]);
                    lastPassVar = passOutputVar;
                } lines.push(resultDest + " = " + lastPassVar + ";"); var indent = ""; for (var i = 0; i < indentSize; i++)
                    indent += " "; var output = indent + lines.join("\n" + indent); return output; }, getUsedTexUnitList: () => s_requiredTexUnitsForPass, getActiveTexture: () => s_activeTexture, traverseState: keyView => { for (var i = 0; i < s_texUnits.length; i++) {
                    s_texUnits[i].traverseState(keyView);
                } }, getTexUnitType: texUnitID => s_texUnits[texUnitID].getTexType(), hook_activeTexture: texture => { s_activeTexture = texture - GL_TEXTURE0; if (GLImmediate.currentMatrix >= 2) {
                    GLImmediate.currentMatrix = 2 + s_activeTexture;
                } }, hook_enable: cap => { var cur = getCurTexUnit(); switch (cap) {
                    case GL_TEXTURE_1D:
                        if (!cur.enabled_tex1D) {
                            GLImmediate.currentRenderer = null;
                            cur.enabled_tex1D = true;
                            cur.texTypesEnabled |= 1;
                        }
                        break;
                    case GL_TEXTURE_2D:
                        if (!cur.enabled_tex2D) {
                            GLImmediate.currentRenderer = null;
                            cur.enabled_tex2D = true;
                            cur.texTypesEnabled |= 2;
                        }
                        break;
                    case GL_TEXTURE_3D:
                        if (!cur.enabled_tex3D) {
                            GLImmediate.currentRenderer = null;
                            cur.enabled_tex3D = true;
                            cur.texTypesEnabled |= 4;
                        }
                        break;
                    case GL_TEXTURE_CUBE_MAP:
                        if (!cur.enabled_texCube) {
                            GLImmediate.currentRenderer = null;
                            cur.enabled_texCube = true;
                            cur.texTypesEnabled |= 8;
                        }
                        break;
                } }, hook_disable: cap => { var cur = getCurTexUnit(); switch (cap) {
                    case GL_TEXTURE_1D:
                        if (cur.enabled_tex1D) {
                            GLImmediate.currentRenderer = null;
                            cur.enabled_tex1D = false;
                            cur.texTypesEnabled &= ~1;
                        }
                        break;
                    case GL_TEXTURE_2D:
                        if (cur.enabled_tex2D) {
                            GLImmediate.currentRenderer = null;
                            cur.enabled_tex2D = false;
                            cur.texTypesEnabled &= ~2;
                        }
                        break;
                    case GL_TEXTURE_3D:
                        if (cur.enabled_tex3D) {
                            GLImmediate.currentRenderer = null;
                            cur.enabled_tex3D = false;
                            cur.texTypesEnabled &= ~4;
                        }
                        break;
                    case GL_TEXTURE_CUBE_MAP:
                        if (cur.enabled_texCube) {
                            GLImmediate.currentRenderer = null;
                            cur.enabled_texCube = false;
                            cur.texTypesEnabled &= ~8;
                        }
                        break;
                } }, hook_texEnvf(target, pname, param) { if (target != GL_TEXTURE_ENV)
                    return; var env = getCurTexUnit().env; switch (pname) {
                    case GL_RGB_SCALE:
                        if (env.colorScale != param) {
                            env.invalidateKey();
                            env.colorScale = param;
                        }
                        break;
                    case GL_ALPHA_SCALE:
                        if (env.alphaScale != param) {
                            env.invalidateKey();
                            env.alphaScale = param;
                        }
                        break;
                    default: err("WARNING: Unhandled `pname` in call to `glTexEnvf`.");
                } }, hook_texEnvi(target, pname, param) { if (target != GL_TEXTURE_ENV)
                    return; var env = getCurTexUnit().env; switch (pname) {
                    case GL_TEXTURE_ENV_MODE:
                        if (env.mode != param) {
                            env.invalidateKey();
                            env.mode = param;
                        }
                        break;
                    case GL_COMBINE_RGB:
                        if (env.colorCombiner != param) {
                            env.invalidateKey();
                            env.colorCombiner = param;
                        }
                        break;
                    case GL_COMBINE_ALPHA:
                        if (env.alphaCombiner != param) {
                            env.invalidateKey();
                            env.alphaCombiner = param;
                        }
                        break;
                    case GL_SRC0_RGB:
                        if (env.colorSrc[0] != param) {
                            env.invalidateKey();
                            env.colorSrc[0] = param;
                        }
                        break;
                    case GL_SRC1_RGB:
                        if (env.colorSrc[1] != param) {
                            env.invalidateKey();
                            env.colorSrc[1] = param;
                        }
                        break;
                    case GL_SRC2_RGB:
                        if (env.colorSrc[2] != param) {
                            env.invalidateKey();
                            env.colorSrc[2] = param;
                        }
                        break;
                    case GL_SRC0_ALPHA:
                        if (env.alphaSrc[0] != param) {
                            env.invalidateKey();
                            env.alphaSrc[0] = param;
                        }
                        break;
                    case GL_SRC1_ALPHA:
                        if (env.alphaSrc[1] != param) {
                            env.invalidateKey();
                            env.alphaSrc[1] = param;
                        }
                        break;
                    case GL_SRC2_ALPHA:
                        if (env.alphaSrc[2] != param) {
                            env.invalidateKey();
                            env.alphaSrc[2] = param;
                        }
                        break;
                    case GL_OPERAND0_RGB:
                        if (env.colorOp[0] != param) {
                            env.invalidateKey();
                            env.colorOp[0] = param;
                        }
                        break;
                    case GL_OPERAND1_RGB:
                        if (env.colorOp[1] != param) {
                            env.invalidateKey();
                            env.colorOp[1] = param;
                        }
                        break;
                    case GL_OPERAND2_RGB:
                        if (env.colorOp[2] != param) {
                            env.invalidateKey();
                            env.colorOp[2] = param;
                        }
                        break;
                    case GL_OPERAND0_ALPHA:
                        if (env.alphaOp[0] != param) {
                            env.invalidateKey();
                            env.alphaOp[0] = param;
                        }
                        break;
                    case GL_OPERAND1_ALPHA:
                        if (env.alphaOp[1] != param) {
                            env.invalidateKey();
                            env.alphaOp[1] = param;
                        }
                        break;
                    case GL_OPERAND2_ALPHA:
                        if (env.alphaOp[2] != param) {
                            env.invalidateKey();
                            env.alphaOp[2] = param;
                        }
                        break;
                    case GL_RGB_SCALE:
                        if (env.colorScale != param) {
                            env.invalidateKey();
                            env.colorScale = param;
                        }
                        break;
                    case GL_ALPHA_SCALE:
                        if (env.alphaScale != param) {
                            env.invalidateKey();
                            env.alphaScale = param;
                        }
                        break;
                    default: err("WARNING: Unhandled `pname` in call to `glTexEnvi`.");
                } }, hook_texEnvfv(target, pname, params) { if (target != GL_TEXTURE_ENV)
                    return; var env = getCurTexUnit().env; switch (pname) {
                    case GL_TEXTURE_ENV_COLOR: {
                        for (var i = 0; i < 4; i++) {
                            var param = HEAPF32[params + i * 4 >> 2];
                            if (env.envColor[i] != param) {
                                env.invalidateKey();
                                env.envColor[i] = param;
                            }
                        }
                        break;
                    }
                    default: err("WARNING: Unhandled `pname` in call to `glTexEnvfv`.");
                } }, hook_getTexEnviv(target, pname, param) { if (target != GL_TEXTURE_ENV)
                    return; var env = getCurTexUnit().env; switch (pname) {
                    case GL_TEXTURE_ENV_MODE:
                        HEAP32[param >> 2] = env.mode;
                        return;
                    case GL_TEXTURE_ENV_COLOR:
                        HEAP32[param >> 2] = Math.max(Math.min(env.envColor[0] * 255, 255, -255));
                        HEAP32[param + 1 >> 2] = Math.max(Math.min(env.envColor[1] * 255, 255, -255));
                        HEAP32[param + 2 >> 2] = Math.max(Math.min(env.envColor[2] * 255, 255, -255));
                        HEAP32[param + 3 >> 2] = Math.max(Math.min(env.envColor[3] * 255, 255, -255));
                        return;
                    case GL_COMBINE_RGB:
                        HEAP32[param >> 2] = env.colorCombiner;
                        return;
                    case GL_COMBINE_ALPHA:
                        HEAP32[param >> 2] = env.alphaCombiner;
                        return;
                    case GL_SRC0_RGB:
                        HEAP32[param >> 2] = env.colorSrc[0];
                        return;
                    case GL_SRC1_RGB:
                        HEAP32[param >> 2] = env.colorSrc[1];
                        return;
                    case GL_SRC2_RGB:
                        HEAP32[param >> 2] = env.colorSrc[2];
                        return;
                    case GL_SRC0_ALPHA:
                        HEAP32[param >> 2] = env.alphaSrc[0];
                        return;
                    case GL_SRC1_ALPHA:
                        HEAP32[param >> 2] = env.alphaSrc[1];
                        return;
                    case GL_SRC2_ALPHA:
                        HEAP32[param >> 2] = env.alphaSrc[2];
                        return;
                    case GL_OPERAND0_RGB:
                        HEAP32[param >> 2] = env.colorOp[0];
                        return;
                    case GL_OPERAND1_RGB:
                        HEAP32[param >> 2] = env.colorOp[1];
                        return;
                    case GL_OPERAND2_RGB:
                        HEAP32[param >> 2] = env.colorOp[2];
                        return;
                    case GL_OPERAND0_ALPHA:
                        HEAP32[param >> 2] = env.alphaOp[0];
                        return;
                    case GL_OPERAND1_ALPHA:
                        HEAP32[param >> 2] = env.alphaOp[1];
                        return;
                    case GL_OPERAND2_ALPHA:
                        HEAP32[param >> 2] = env.alphaOp[2];
                        return;
                    case GL_RGB_SCALE:
                        HEAP32[param >> 2] = env.colorScale;
                        return;
                    case GL_ALPHA_SCALE:
                        HEAP32[param >> 2] = env.alphaScale;
                        return;
                    default: err("WARNING: Unhandled `pname` in call to `glGetTexEnvi`.");
                } }, hook_getTexEnvfv: (target, pname, param) => { if (target != GL_TEXTURE_ENV)
                    return; var env = getCurTexUnit().env; switch (pname) {
                    case GL_TEXTURE_ENV_COLOR:
                        HEAPF32[param >> 2] = env.envColor[0];
                        HEAPF32[param + 4 >> 2] = env.envColor[1];
                        HEAPF32[param + 8 >> 2] = env.envColor[2];
                        HEAPF32[param + 12 >> 2] = env.envColor[3];
                        return;
                } } }; }, vertexData: null, vertexDataU8: null, tempData: null, indexData: null, vertexCounter: 0, mode: -1, rendererCache: null, rendererComponents: [], rendererComponentPointer: 0, lastRenderer: null, lastArrayBuffer: null, lastProgram: null, lastStride: -1, matrix: [], matrixStack: [], currentMatrix: 0, tempMatrix: null, matricesModified: false, useTextureMatrix: false, VERTEX: 0, NORMAL: 1, COLOR: 2, TEXTURE0: 3, NUM_ATTRIBUTES: -1, MAX_TEXTURES: -1, totalEnabledClientAttributes: 0, enabledClientAttributes: [0, 0], clientAttributes: [], liveClientAttributes: [], currentRenderer: null, modifiedClientAttributes: false, clientActiveTexture: 0, clientColor: null, usedTexUnitList: [], fixedFunctionProgram: null, setClientAttribute(name, size, type, stride, pointer) { var attrib = GLImmediate.clientAttributes[name]; if (!attrib) {
                for (var i = 0; i <= name; i++) {
                    GLImmediate.clientAttributes[i] ||= { name, size, type, stride, pointer, offset: 0 };
                }
            }
            else {
                attrib.name = name;
                attrib.size = size;
                attrib.type = type;
                attrib.stride = stride;
                attrib.pointer = pointer;
                attrib.offset = 0;
            } GLImmediate.modifiedClientAttributes = true; }, addRendererComponent(name, size, type) { if (!GLImmediate.rendererComponents[name]) {
                GLImmediate.rendererComponents[name] = 1;
                GLImmediate.enabledClientAttributes[name] = true;
                GLImmediate.setClientAttribute(name, size, type, 0, GLImmediate.rendererComponentPointer);
                GLImmediate.rendererComponentPointer += size * GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
            }
            else {
                GLImmediate.rendererComponents[name]++;
            } }, disableBeginEndClientAttributes() { for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
                if (GLImmediate.rendererComponents[i])
                    GLImmediate.enabledClientAttributes[i] = false;
            } }, getRenderer() { if (GLImmediate.currentRenderer) {
                return GLImmediate.currentRenderer;
            } var attributes = GLImmediate.liveClientAttributes; var cacheMap = GLImmediate.rendererCache; var keyView = cacheMap.getStaticKeyView().reset(); var enabledAttributesKey = 0; for (var i = 0; i < attributes.length; i++) {
                enabledAttributesKey |= 1 << attributes[i].name;
            } keyView.next(enabledAttributesKey); enabledAttributesKey = 0; var fogParam = 0; if (GLEmulation.fogEnabled) {
                switch (GLEmulation.fogMode) {
                    case 2049:
                        fogParam = 1;
                        break;
                    case 9729:
                        fogParam = 2;
                        break;
                    default:
                        fogParam = 3;
                        break;
                }
            } enabledAttributesKey = enabledAttributesKey << 2 | fogParam; for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
                enabledAttributesKey = enabledAttributesKey << 1 | GLEmulation.clipPlaneEnabled[clipPlaneId];
            } enabledAttributesKey = enabledAttributesKey << 1 | GLEmulation.lightingEnabled; for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
                enabledAttributesKey = enabledAttributesKey << 1 | (GLEmulation.lightingEnabled ? GLEmulation.lightEnabled[lightId] : 0);
            } enabledAttributesKey = enabledAttributesKey << 3 | (GLEmulation.alphaTestEnabled ? GLEmulation.alphaTestFunc - 512 : 7); enabledAttributesKey = enabledAttributesKey << 1 | (GLImmediate.mode == GLctx.POINTS ? 1 : 0); keyView.next(enabledAttributesKey); keyView.next(GL.currProgram); if (!GL.currProgram) {
                GLImmediate.TexEnvJIT.traverseState(keyView);
            } var renderer = keyView.get(); if (!renderer) {
                renderer = GLImmediate.createRenderer();
                GLImmediate.currentRenderer = renderer;
                keyView.set(renderer);
                return renderer;
            } GLImmediate.currentRenderer = renderer; return renderer; }, createRenderer(renderer) { var useCurrProgram = !!GL.currProgram; var hasTextures = false; for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                var texAttribName = GLImmediate.TEXTURE0 + i;
                if (!GLImmediate.enabledClientAttributes[texAttribName])
                    continue;
                hasTextures = true;
            } function Renderer() { this.init = function () { var uTexUnitPrefix = "u_texUnit"; var aTexCoordPrefix = "a_texCoord"; var vTexCoordPrefix = "v_texCoord"; var vPrimColor = "v_color"; var uTexMatrixPrefix = GLImmediate.useTextureMatrix ? "u_textureMatrix" : null; if (useCurrProgram) {
                if (GL.shaderInfos[GL.programShaders[GL.currProgram][0]].type == GLctx.VERTEX_SHADER) {
                    this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
                    this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
                }
                else {
                    this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
                    this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
                }
                this.program = GL.programs[GL.currProgram];
                this.usedTexUnitList = [];
            }
            else {
                if (GLEmulation.fogEnabled) {
                    switch (GLEmulation.fogMode) {
                        case 2049:
                            var fogFormula = "  float fog = exp(-u_fogDensity * u_fogDensity * ecDistance * ecDistance); \n";
                            break;
                        case 9729:
                            var fogFormula = "  float fog = (u_fogEnd - ecDistance) * u_fogScale; \n";
                            break;
                        default:
                            var fogFormula = "  float fog = exp(-u_fogDensity * ecDistance); \n";
                            break;
                    }
                }
                GLImmediate.TexEnvJIT.setGLSLVars(uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix);
                var fsTexEnvPass = GLImmediate.TexEnvJIT.genAllPassLines("gl_FragColor", 2);
                var texUnitAttribList = "";
                var texUnitVaryingList = "";
                var texUnitUniformList = "";
                var vsTexCoordInits = "";
                this.usedTexUnitList = GLImmediate.TexEnvJIT.getUsedTexUnitList();
                for (var i = 0; i < this.usedTexUnitList.length; i++) {
                    var texUnit = this.usedTexUnitList[i];
                    texUnitAttribList += "attribute vec4 " + aTexCoordPrefix + texUnit + ";\n";
                    texUnitVaryingList += "varying vec4 " + vTexCoordPrefix + texUnit + ";\n";
                    texUnitUniformList += "uniform sampler2D " + uTexUnitPrefix + texUnit + ";\n";
                    vsTexCoordInits += "  " + vTexCoordPrefix + texUnit + " = " + aTexCoordPrefix + texUnit + ";\n";
                    if (GLImmediate.useTextureMatrix) {
                        texUnitUniformList += "uniform mat4 " + uTexMatrixPrefix + texUnit + ";\n";
                    }
                }
                var vsFogVaryingInit = null;
                if (GLEmulation.fogEnabled) {
                    vsFogVaryingInit = "  v_fogFragCoord = abs(ecPosition.z);\n";
                }
                var vsPointSizeDefs = null;
                var vsPointSizeInit = null;
                if (GLImmediate.mode == GLctx.POINTS) {
                    vsPointSizeDefs = "uniform float u_pointSize;\n";
                    vsPointSizeInit = "  gl_PointSize = u_pointSize;\n";
                }
                var vsClipPlaneDefs = "";
                var vsClipPlaneInit = "";
                var fsClipPlaneDefs = "";
                var fsClipPlanePass = "";
                for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
                    if (GLEmulation.clipPlaneEnabled[clipPlaneId]) {
                        vsClipPlaneDefs += "uniform vec4 u_clipPlaneEquation" + clipPlaneId + ";";
                        vsClipPlaneDefs += "varying float v_clipDistance" + clipPlaneId + ";";
                        vsClipPlaneInit += "  v_clipDistance" + clipPlaneId + " = dot(ecPosition, u_clipPlaneEquation" + clipPlaneId + ");";
                        fsClipPlaneDefs += "varying float v_clipDistance" + clipPlaneId + ";";
                        fsClipPlanePass += "  if (v_clipDistance" + clipPlaneId + " < 0.0) discard;";
                    }
                }
                var vsLightingDefs = "";
                var vsLightingPass = "";
                if (GLEmulation.lightingEnabled) {
                    vsLightingDefs += "attribute vec3 a_normal;";
                    vsLightingDefs += "uniform mat3 u_normalMatrix;";
                    vsLightingDefs += "uniform vec4 u_lightModelAmbient;";
                    vsLightingDefs += "uniform vec4 u_materialAmbient;";
                    vsLightingDefs += "uniform vec4 u_materialDiffuse;";
                    vsLightingDefs += "uniform vec4 u_materialSpecular;";
                    vsLightingDefs += "uniform float u_materialShininess;";
                    vsLightingDefs += "uniform vec4 u_materialEmission;";
                    vsLightingPass += "  vec3 ecNormal = normalize(u_normalMatrix * a_normal);";
                    vsLightingPass += "  v_color.w = u_materialDiffuse.w;";
                    vsLightingPass += "  v_color.xyz = u_materialEmission.xyz;";
                    vsLightingPass += "  v_color.xyz += u_lightModelAmbient.xyz * u_materialAmbient.xyz;";
                    for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
                        if (GLEmulation.lightEnabled[lightId]) {
                            vsLightingDefs += "uniform vec4 u_lightAmbient" + lightId + ";";
                            vsLightingDefs += "uniform vec4 u_lightDiffuse" + lightId + ";";
                            vsLightingDefs += "uniform vec4 u_lightSpecular" + lightId + ";";
                            vsLightingDefs += "uniform vec4 u_lightPosition" + lightId + ";";
                            vsLightingPass += "  {";
                            vsLightingPass += "    vec3 lightDirection = normalize(u_lightPosition" + lightId + ").xyz;";
                            vsLightingPass += "    vec3 halfVector = normalize(lightDirection + vec3(0,0,1));";
                            vsLightingPass += "    vec3 ambient = u_lightAmbient" + lightId + ".xyz * u_materialAmbient.xyz;";
                            vsLightingPass += "    float diffuseI = max(dot(ecNormal, lightDirection), 0.0);";
                            vsLightingPass += "    float specularI = max(dot(ecNormal, halfVector), 0.0);";
                            vsLightingPass += "    vec3 diffuse = diffuseI * u_lightDiffuse" + lightId + ".xyz * u_materialDiffuse.xyz;";
                            vsLightingPass += "    specularI = (diffuseI > 0.0 && specularI > 0.0) ? exp(u_materialShininess * log(specularI)) : 0.0;";
                            vsLightingPass += "    vec3 specular = specularI * u_lightSpecular" + lightId + ".xyz * u_materialSpecular.xyz;";
                            vsLightingPass += "    v_color.xyz += ambient + diffuse + specular;";
                            vsLightingPass += "  }";
                        }
                    }
                    vsLightingPass += "  v_color = clamp(v_color, 0.0, 1.0);";
                }
                var vsSource = ["attribute vec4 a_position;", "attribute vec4 a_color;", "varying vec4 v_color;", texUnitAttribList, texUnitVaryingList, GLEmulation.fogEnabled ? "varying float v_fogFragCoord;" : null, "uniform mat4 u_modelView;", "uniform mat4 u_projection;", vsPointSizeDefs, vsClipPlaneDefs, vsLightingDefs, "void main()", "{", "  vec4 ecPosition = u_modelView * a_position;", "  gl_Position = u_projection * ecPosition;", "  v_color = a_color;", vsTexCoordInits, vsFogVaryingInit, vsPointSizeInit, vsClipPlaneInit, vsLightingPass, "}", ""].join("\n").replace(/\n\n+/g, "\n");
                this.vertexShader = GLctx.createShader(GLctx.VERTEX_SHADER);
                GLctx.shaderSource(this.vertexShader, vsSource);
                GLctx.compileShader(this.vertexShader);
                var fogHeaderIfNeeded = null;
                if (GLEmulation.fogEnabled) {
                    fogHeaderIfNeeded = ["", "varying float v_fogFragCoord; ", "uniform vec4 u_fogColor;      ", "uniform float u_fogEnd;       ", "uniform float u_fogScale;     ", "uniform float u_fogDensity;   ", "float ffog(in float ecDistance) { ", fogFormula, "  fog = clamp(fog, 0.0, 1.0); ", "  return fog;                 ", "}", ""].join("\n");
                }
                var fogPass = null;
                if (GLEmulation.fogEnabled) {
                    fogPass = "gl_FragColor = vec4(mix(u_fogColor.rgb, gl_FragColor.rgb, ffog(v_fogFragCoord)), gl_FragColor.a);\n";
                }
                var fsAlphaTestDefs = "";
                var fsAlphaTestPass = "";
                if (GLEmulation.alphaTestEnabled) {
                    fsAlphaTestDefs = "uniform float u_alphaTestRef;";
                    switch (GLEmulation.alphaTestFunc) {
                        case 512:
                            fsAlphaTestPass = "discard;";
                            break;
                        case 513:
                            fsAlphaTestPass = "if (!(gl_FragColor.a < u_alphaTestRef)) { discard; }";
                            break;
                        case 514:
                            fsAlphaTestPass = "if (!(gl_FragColor.a == u_alphaTestRef)) { discard; }";
                            break;
                        case 515:
                            fsAlphaTestPass = "if (!(gl_FragColor.a <= u_alphaTestRef)) { discard; }";
                            break;
                        case 516:
                            fsAlphaTestPass = "if (!(gl_FragColor.a > u_alphaTestRef)) { discard; }";
                            break;
                        case 517:
                            fsAlphaTestPass = "if (!(gl_FragColor.a != u_alphaTestRef)) { discard; }";
                            break;
                        case 518:
                            fsAlphaTestPass = "if (!(gl_FragColor.a >= u_alphaTestRef)) { discard; }";
                            break;
                        case 519:
                            fsAlphaTestPass = "";
                            break;
                    }
                }
                var fsSource = ["precision mediump float;", texUnitVaryingList, texUnitUniformList, "varying vec4 v_color;", fogHeaderIfNeeded, fsClipPlaneDefs, fsAlphaTestDefs, "void main()", "{", fsClipPlanePass, fsTexEnvPass, fogPass, fsAlphaTestPass, "}", ""].join("\n").replace(/\n\n+/g, "\n");
                this.fragmentShader = GLctx.createShader(GLctx.FRAGMENT_SHADER);
                GLctx.shaderSource(this.fragmentShader, fsSource);
                GLctx.compileShader(this.fragmentShader);
                this.program = GLctx.createProgram();
                GLctx.attachShader(this.program, this.vertexShader);
                GLctx.attachShader(this.program, this.fragmentShader);
                GLctx.bindAttribLocation(this.program, GLImmediate.VERTEX, "a_position");
                GLctx.bindAttribLocation(this.program, GLImmediate.COLOR, "a_color");
                GLctx.bindAttribLocation(this.program, GLImmediate.NORMAL, "a_normal");
                var maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
                for (var i = 0; i < GLImmediate.MAX_TEXTURES && GLImmediate.TEXTURE0 + i < maxVertexAttribs; i++) {
                    GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, "a_texCoord" + i);
                    GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, aTexCoordPrefix + i);
                }
                GLctx.linkProgram(this.program);
            } this.textureMatrixVersion = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; this.positionLocation = GLctx.getAttribLocation(this.program, "a_position"); this.texCoordLocations = []; for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                if (!GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0 + i]) {
                    this.texCoordLocations[i] = -1;
                    continue;
                }
                if (useCurrProgram) {
                    this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, `a_texCoord${i}`);
                }
                else {
                    this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, aTexCoordPrefix + i);
                }
            } this.colorLocation = GLctx.getAttribLocation(this.program, "a_color"); if (!useCurrProgram) {
                var prevBoundProg = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
                GLctx.useProgram(this.program);
                {
                    for (var i = 0; i < this.usedTexUnitList.length; i++) {
                        var texUnitID = this.usedTexUnitList[i];
                        var texSamplerLoc = GLctx.getUniformLocation(this.program, uTexUnitPrefix + texUnitID);
                        GLctx.uniform1i(texSamplerLoc, texUnitID);
                    }
                }
                GLctx.vertexAttrib4fv(this.colorLocation, [1, 1, 1, 1]);
                GLctx.useProgram(prevBoundProg);
            } this.textureMatrixLocations = []; for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                this.textureMatrixLocations[i] = GLctx.getUniformLocation(this.program, `u_textureMatrix${i}`);
            } this.normalLocation = GLctx.getAttribLocation(this.program, "a_normal"); this.modelViewLocation = GLctx.getUniformLocation(this.program, "u_modelView"); this.projectionLocation = GLctx.getUniformLocation(this.program, "u_projection"); this.normalMatrixLocation = GLctx.getUniformLocation(this.program, "u_normalMatrix"); this.hasTextures = hasTextures; this.hasNormal = GLImmediate.enabledClientAttributes[GLImmediate.NORMAL] && GLImmediate.clientAttributes[GLImmediate.NORMAL].size > 0 && this.normalLocation >= 0; this.hasColor = this.colorLocation === 0 || this.colorLocation > 0; this.floatType = GLctx.FLOAT; this.fogColorLocation = GLctx.getUniformLocation(this.program, "u_fogColor"); this.fogEndLocation = GLctx.getUniformLocation(this.program, "u_fogEnd"); this.fogScaleLocation = GLctx.getUniformLocation(this.program, "u_fogScale"); this.fogDensityLocation = GLctx.getUniformLocation(this.program, "u_fogDensity"); this.hasFog = !!(this.fogColorLocation || this.fogEndLocation || this.fogScaleLocation || this.fogDensityLocation); this.pointSizeLocation = GLctx.getUniformLocation(this.program, "u_pointSize"); this.hasClipPlane = false; this.clipPlaneEquationLocation = []; for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
                this.clipPlaneEquationLocation[clipPlaneId] = GLctx.getUniformLocation(this.program, `u_clipPlaneEquation${clipPlaneId}`);
                this.hasClipPlane = this.hasClipPlane || this.clipPlaneEquationLocation[clipPlaneId];
            } this.hasLighting = GLEmulation.lightingEnabled; this.lightModelAmbientLocation = GLctx.getUniformLocation(this.program, "u_lightModelAmbient"); this.materialAmbientLocation = GLctx.getUniformLocation(this.program, "u_materialAmbient"); this.materialDiffuseLocation = GLctx.getUniformLocation(this.program, "u_materialDiffuse"); this.materialSpecularLocation = GLctx.getUniformLocation(this.program, "u_materialSpecular"); this.materialShininessLocation = GLctx.getUniformLocation(this.program, "u_materialShininess"); this.materialEmissionLocation = GLctx.getUniformLocation(this.program, "u_materialEmission"); this.lightAmbientLocation = []; this.lightDiffuseLocation = []; this.lightSpecularLocation = []; this.lightPositionLocation = []; for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
                this.lightAmbientLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightAmbient${lightId}`);
                this.lightDiffuseLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightDiffuse${lightId}`);
                this.lightSpecularLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightSpecular${lightId}`);
                this.lightPositionLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightPosition${lightId}`);
            } this.hasAlphaTest = GLEmulation.alphaTestEnabled; this.alphaTestRefLocation = GLctx.getUniformLocation(this.program, "u_alphaTestRef"); }; this.prepare = function () { var arrayBuffer; if (!GLctx.currentArrayBufferBinding) {
                var start = GLImmediate.firstVertex * GLImmediate.stride;
                var end = GLImmediate.lastVertex * GLImmediate.stride;
                arrayBuffer = GL.getTempVertexBuffer(end);
            }
            else {
                arrayBuffer = GLctx.currentArrayBufferBinding;
            } var lastRenderer = GLImmediate.lastRenderer; var canSkip = this == lastRenderer && arrayBuffer == GLImmediate.lastArrayBuffer && (GL.currProgram || this.program) == GLImmediate.lastProgram && GLImmediate.stride == GLImmediate.lastStride && !GLImmediate.matricesModified; if (!canSkip && lastRenderer)
                lastRenderer.cleanup(); if (!GLctx.currentArrayBufferBinding) {
                if (arrayBuffer != GLImmediate.lastArrayBuffer) {
                    GLctx.bindBuffer(GLctx.ARRAY_BUFFER, arrayBuffer);
                    GLImmediate.lastArrayBuffer = arrayBuffer;
                }
                GLctx.bufferSubData(GLctx.ARRAY_BUFFER, start, GLImmediate.vertexData.subarray(start >> 2, end >> 2));
            } if (canSkip)
                return; GLImmediate.lastRenderer = this; GLImmediate.lastProgram = GL.currProgram || this.program; GLImmediate.lastStride = GLImmediate.stride; GLImmediate.matricesModified = false; if (!GL.currProgram) {
                if (GLImmediate.fixedFunctionProgram != this.program) {
                    GLctx.useProgram(this.program);
                    GLImmediate.fixedFunctionProgram = this.program;
                }
            } if (this.modelViewLocation && this.modelViewMatrixVersion != GLImmediate.matrixVersion[0]) {
                this.modelViewMatrixVersion = GLImmediate.matrixVersion[0];
                GLctx.uniformMatrix4fv(this.modelViewLocation, false, GLImmediate.matrix[0]);
                if (GLEmulation.lightEnabled) {
                    var tmpMVinv = GLImmediate.matrixLib.mat4.create(GLImmediate.matrix[0]);
                    GLImmediate.matrixLib.mat4.inverse(tmpMVinv);
                    GLImmediate.matrixLib.mat4.transpose(tmpMVinv);
                    GLctx.uniformMatrix3fv(this.normalMatrixLocation, false, GLImmediate.matrixLib.mat4.toMat3(tmpMVinv));
                }
            } if (this.projectionLocation && this.projectionMatrixVersion != GLImmediate.matrixVersion[1]) {
                this.projectionMatrixVersion = GLImmediate.matrixVersion[1];
                GLctx.uniformMatrix4fv(this.projectionLocation, false, GLImmediate.matrix[1]);
            } var clientAttributes = GLImmediate.clientAttributes; var posAttr = clientAttributes[GLImmediate.VERTEX]; GLctx.vertexAttribPointer(this.positionLocation, posAttr.size, posAttr.type, false, GLImmediate.stride, posAttr.offset); GLctx.enableVertexAttribArray(this.positionLocation); if (this.hasNormal) {
                var normalAttr = clientAttributes[GLImmediate.NORMAL];
                GLctx.vertexAttribPointer(this.normalLocation, normalAttr.size, normalAttr.type, true, GLImmediate.stride, normalAttr.offset);
                GLctx.enableVertexAttribArray(this.normalLocation);
            } if (this.hasTextures) {
                for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                    var attribLoc = this.texCoordLocations[i];
                    if (attribLoc === undefined || attribLoc < 0)
                        continue;
                    var texAttr = clientAttributes[GLImmediate.TEXTURE0 + i];
                    if (texAttr.size) {
                        GLctx.vertexAttribPointer(attribLoc, texAttr.size, texAttr.type, false, GLImmediate.stride, texAttr.offset);
                        GLctx.enableVertexAttribArray(attribLoc);
                    }
                    else {
                        GLctx.vertexAttrib4f(attribLoc, 0, 0, 0, 1);
                        GLctx.disableVertexAttribArray(attribLoc);
                    }
                    var t = 2 + i;
                    if (this.textureMatrixLocations[i] && this.textureMatrixVersion[t] != GLImmediate.matrixVersion[t]) {
                        this.textureMatrixVersion[t] = GLImmediate.matrixVersion[t];
                        GLctx.uniformMatrix4fv(this.textureMatrixLocations[i], false, GLImmediate.matrix[t]);
                    }
                }
            } if (GLImmediate.enabledClientAttributes[GLImmediate.COLOR]) {
                var colorAttr = clientAttributes[GLImmediate.COLOR];
                GLctx.vertexAttribPointer(this.colorLocation, colorAttr.size, colorAttr.type, true, GLImmediate.stride, colorAttr.offset);
                GLctx.enableVertexAttribArray(this.colorLocation);
            }
            else if (this.hasColor) {
                GLctx.disableVertexAttribArray(this.colorLocation);
                GLctx.vertexAttrib4fv(this.colorLocation, GLImmediate.clientColor);
            } if (this.hasFog) {
                if (this.fogColorLocation)
                    GLctx.uniform4fv(this.fogColorLocation, GLEmulation.fogColor);
                if (this.fogEndLocation)
                    GLctx.uniform1f(this.fogEndLocation, GLEmulation.fogEnd);
                if (this.fogScaleLocation)
                    GLctx.uniform1f(this.fogScaleLocation, 1 / (GLEmulation.fogEnd - GLEmulation.fogStart));
                if (this.fogDensityLocation)
                    GLctx.uniform1f(this.fogDensityLocation, GLEmulation.fogDensity);
            } if (this.hasClipPlane) {
                for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
                    if (this.clipPlaneEquationLocation[clipPlaneId])
                        GLctx.uniform4fv(this.clipPlaneEquationLocation[clipPlaneId], GLEmulation.clipPlaneEquation[clipPlaneId]);
                }
            } if (this.hasLighting) {
                if (this.lightModelAmbientLocation)
                    GLctx.uniform4fv(this.lightModelAmbientLocation, GLEmulation.lightModelAmbient);
                if (this.materialAmbientLocation)
                    GLctx.uniform4fv(this.materialAmbientLocation, GLEmulation.materialAmbient);
                if (this.materialDiffuseLocation)
                    GLctx.uniform4fv(this.materialDiffuseLocation, GLEmulation.materialDiffuse);
                if (this.materialSpecularLocation)
                    GLctx.uniform4fv(this.materialSpecularLocation, GLEmulation.materialSpecular);
                if (this.materialShininessLocation)
                    GLctx.uniform1f(this.materialShininessLocation, GLEmulation.materialShininess[0]);
                if (this.materialEmissionLocation)
                    GLctx.uniform4fv(this.materialEmissionLocation, GLEmulation.materialEmission);
                for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
                    if (this.lightAmbientLocation[lightId])
                        GLctx.uniform4fv(this.lightAmbientLocation[lightId], GLEmulation.lightAmbient[lightId]);
                    if (this.lightDiffuseLocation[lightId])
                        GLctx.uniform4fv(this.lightDiffuseLocation[lightId], GLEmulation.lightDiffuse[lightId]);
                    if (this.lightSpecularLocation[lightId])
                        GLctx.uniform4fv(this.lightSpecularLocation[lightId], GLEmulation.lightSpecular[lightId]);
                    if (this.lightPositionLocation[lightId])
                        GLctx.uniform4fv(this.lightPositionLocation[lightId], GLEmulation.lightPosition[lightId]);
                }
            } if (this.hasAlphaTest) {
                if (this.alphaTestRefLocation)
                    GLctx.uniform1f(this.alphaTestRefLocation, GLEmulation.alphaTestRef);
            } if (GLImmediate.mode == GLctx.POINTS) {
                if (this.pointSizeLocation) {
                    GLctx.uniform1f(this.pointSizeLocation, GLEmulation.pointSize);
                }
            } }; this.cleanup = function () { GLctx.disableVertexAttribArray(this.positionLocation); if (this.hasTextures) {
                for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                    if (GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0 + i] && this.texCoordLocations[i] >= 0) {
                        GLctx.disableVertexAttribArray(this.texCoordLocations[i]);
                    }
                }
            } if (this.hasColor) {
                GLctx.disableVertexAttribArray(this.colorLocation);
            } if (this.hasNormal) {
                GLctx.disableVertexAttribArray(this.normalLocation);
            } if (!GL.currProgram) {
                GLctx.useProgram(null);
                GLImmediate.fixedFunctionProgram = 0;
            } if (!GLctx.currentArrayBufferBinding) {
                GLctx.bindBuffer(GLctx.ARRAY_BUFFER, null);
                GLImmediate.lastArrayBuffer = null;
            } GLImmediate.lastRenderer = null; GLImmediate.lastProgram = null; GLImmediate.matricesModified = true; }; this.init(); } return new Renderer; }, setupFuncs() { GLImmediate.MapTreeLib = GLImmediate.spawnMapTreeLib(); GLImmediate.spawnMapTreeLib = null; GLImmediate.TexEnvJIT = GLImmediate.spawnTexEnvJIT(); GLImmediate.spawnTexEnvJIT = null; GLImmediate.setupHooks(); }, setupHooks() { if (!GLEmulation.hasRunInit) {
                GLEmulation.init();
            } var glActiveTexture = _glActiveTexture; _glActiveTexture = _emscripten_glActiveTexture = texture => { GLImmediate.TexEnvJIT.hook_activeTexture(texture); glActiveTexture(texture); }; var glEnable = _glEnable; _glEnable = _emscripten_glEnable = cap => { GLImmediate.TexEnvJIT.hook_enable(cap); glEnable(cap); }; var glDisable = _glDisable; _glDisable = _emscripten_glDisable = cap => { GLImmediate.TexEnvJIT.hook_disable(cap); glDisable(cap); }; _glTexEnvf = _emscripten_glTexEnvf = (target, pname, param) => { GLImmediate.TexEnvJIT.hook_texEnvf(target, pname, param); }; _glTexEnvi = _emscripten_glTexEnvi = (target, pname, param) => { GLImmediate.TexEnvJIT.hook_texEnvi(target, pname, param); }; _glTexEnvfv = _emscripten_glTexEnvfv = (target, pname, param) => { GLImmediate.TexEnvJIT.hook_texEnvfv(target, pname, param); }; _glGetTexEnviv = (target, pname, param) => { GLImmediate.TexEnvJIT.hook_getTexEnviv(target, pname, param); }; _glGetTexEnvfv = (target, pname, param) => { GLImmediate.TexEnvJIT.hook_getTexEnvfv(target, pname, param); }; var glGetIntegerv = _glGetIntegerv; _glGetIntegerv = _emscripten_glGetIntegerv = (pname, params) => { switch (pname) {
                case 35725: {
                    var cur = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
                    if (cur == GLImmediate.fixedFunctionProgram) {
                        HEAP32[params >> 2] = 0;
                        return;
                    }
                    break;
                }
            } glGetIntegerv(pname, params); }; }, initted: false, init() { err("WARNING: using emscripten GL immediate mode emulation. This is very limited in what it supports"); GLImmediate.initted = true; if (!Browser.useWebGL)
                return; GLImmediate.MAX_TEXTURES = Math.min(Module["GL_MAX_TEXTURE_IMAGE_UNITS"] || GLctx.getParameter(GLctx.MAX_TEXTURE_IMAGE_UNITS), 28); GLImmediate.TexEnvJIT.init(GLctx, GLImmediate.MAX_TEXTURES); GLImmediate.NUM_ATTRIBUTES = 3 + GLImmediate.MAX_TEXTURES; GLImmediate.clientAttributes = []; GLEmulation.enabledClientAttribIndices = []; for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
                GLImmediate.clientAttributes.push({});
                GLEmulation.enabledClientAttribIndices.push(false);
            } GLImmediate.matrix = []; GLImmediate.matrixStack = []; GLImmediate.matrixVersion = []; for (var i = 0; i < 2 + GLImmediate.MAX_TEXTURES; i++) {
                GLImmediate.matrixStack.push([]);
                GLImmediate.matrixVersion.push(0);
                GLImmediate.matrix.push(GLImmediate.matrixLib.mat4.create());
                GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[i]);
            } GLImmediate.rendererCache = GLImmediate.MapTreeLib.create(); GLImmediate.tempData = new Float32Array(GL.MAX_TEMP_BUFFER_SIZE >> 2); GLImmediate.indexData = new Uint16Array(GL.MAX_TEMP_BUFFER_SIZE >> 1); GLImmediate.vertexDataU8 = new Uint8Array(GLImmediate.tempData.buffer); GL.generateTempBuffers(true, GL.currentContext); GLImmediate.clientColor = new Float32Array([1, 1, 1, 1]); }, prepareClientAttributes(count, beginEnd) { if (!GLImmediate.modifiedClientAttributes) {
                GLImmediate.vertexCounter = GLImmediate.stride * count / 4;
                return;
            } GLImmediate.modifiedClientAttributes = false; var clientStartPointer = 4294967295; var bytes = 0; var minStride = 4294967295; var maxStride = 0; var attributes = GLImmediate.liveClientAttributes; attributes.length = 0; for (var i = 0; i < 3 + GLImmediate.MAX_TEXTURES; i++) {
                if (GLImmediate.enabledClientAttributes[i]) {
                    var attr = GLImmediate.clientAttributes[i];
                    attributes.push(attr);
                    clientStartPointer = Math.min(clientStartPointer, attr.pointer);
                    attr.sizeBytes = attr.size * GL.byteSizeByType[attr.type - GL.byteSizeByTypeRoot];
                    bytes += attr.sizeBytes;
                    minStride = Math.min(minStride, attr.stride);
                    maxStride = Math.max(maxStride, attr.stride);
                }
            } if ((minStride != maxStride || maxStride < bytes) && !beginEnd) {
                GLImmediate.restrideBuffer ||= _malloc(GL.MAX_TEMP_BUFFER_SIZE);
                var start = GLImmediate.restrideBuffer;
                bytes = 0;
                for (var i = 0; i < attributes.length; i++) {
                    var attr = attributes[i];
                    var size = attr.sizeBytes;
                    if (size % 4 != 0)
                        size += 4 - size % 4;
                    attr.offset = bytes;
                    bytes += size;
                }
                for (var i = 0; i < attributes.length; i++) {
                    var attr = attributes[i];
                    var srcStride = Math.max(attr.sizeBytes, attr.stride);
                    if ((srcStride & 3) == 0 && (attr.sizeBytes & 3) == 0) {
                        var size4 = attr.sizeBytes >> 2;
                        var srcStride4 = Math.max(attr.sizeBytes, attr.stride) >> 2;
                        for (var j = 0; j < count; j++) {
                            for (var k = 0; k < size4; k++) {
                                HEAP32[(start + attr.offset + bytes * j >> 2) + k] = HEAP32[(attr.pointer >> 2) + j * srcStride4 + k];
                            }
                        }
                    }
                    else {
                        for (var j = 0; j < count; j++) {
                            for (var k = 0; k < attr.sizeBytes; k++) {
                                HEAP8[start + attr.offset + bytes * j + k] = HEAP8[attr.pointer + j * srcStride + k];
                            }
                        }
                    }
                    attr.pointer = start + attr.offset;
                }
                GLImmediate.stride = bytes;
                GLImmediate.vertexPointer = start;
            }
            else {
                if (GLctx.currentArrayBufferBinding) {
                    GLImmediate.vertexPointer = 0;
                }
                else {
                    GLImmediate.vertexPointer = clientStartPointer;
                }
                for (var i = 0; i < attributes.length; i++) {
                    var attr = attributes[i];
                    attr.offset = attr.pointer - GLImmediate.vertexPointer;
                }
                GLImmediate.stride = Math.max(maxStride, bytes);
            } if (!beginEnd) {
                GLImmediate.vertexCounter = GLImmediate.stride * count / 4;
            } }, flush(numProvidedIndexes, startIndex = 0, ptr = 0) { var renderer = GLImmediate.getRenderer(); var numVertices = 4 * GLImmediate.vertexCounter / GLImmediate.stride; if (!numVertices)
                return; var emulatedElementArrayBuffer = false; var numIndexes = 0; if (numProvidedIndexes) {
                numIndexes = numProvidedIndexes;
                if (!GLctx.currentArrayBufferBinding && GLImmediate.firstVertex > GLImmediate.lastVertex) {
                    for (var i = 0; i < numProvidedIndexes; i++) {
                        var currIndex = HEAPU16[ptr + i * 2 >> 1];
                        GLImmediate.firstVertex = Math.min(GLImmediate.firstVertex, currIndex);
                        GLImmediate.lastVertex = Math.max(GLImmediate.lastVertex, currIndex + 1);
                    }
                }
                if (!GLctx.currentElementArrayBufferBinding) {
                    var indexBuffer = GL.getTempIndexBuffer(numProvidedIndexes << 1);
                    GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, indexBuffer);
                    GLctx.bufferSubData(GLctx.ELEMENT_ARRAY_BUFFER, 0, HEAPU16.subarray(ptr >> 1, ptr + (numProvidedIndexes << 1) >> 1));
                    ptr = 0;
                    emulatedElementArrayBuffer = true;
                }
            }
            else if (GLImmediate.mode > 6) {
                if (GLImmediate.mode != 7)
                    throw "unsupported immediate mode " + GLImmediate.mode;
                ptr = GLImmediate.firstVertex * 3;
                var numQuads = numVertices / 4;
                numIndexes = numQuads * 6;
                GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.currentContext.tempQuadIndexBuffer);
                emulatedElementArrayBuffer = true;
                GLImmediate.mode = GLctx.TRIANGLES;
            } renderer.prepare(); if (numIndexes) {
                GLctx.drawElements(GLImmediate.mode, numIndexes, GLctx.UNSIGNED_SHORT, ptr);
            }
            else {
                GLctx.drawArrays(GLImmediate.mode, startIndex, numVertices);
            } if (emulatedElementArrayBuffer) {
                GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.buffers[GLctx.currentElementArrayBufferBinding] || null);
            } } };
        GLImmediate.matrixLib = (() => { var vec3 = {}; var mat3 = {}; var mat4 = {}; var quat4 = {}; var MatrixArray = Float32Array; vec3.create = function (vec) { var dest = new MatrixArray(3); if (vec) {
            dest[0] = vec[0];
            dest[1] = vec[1];
            dest[2] = vec[2];
        }
        else {
            dest[0] = dest[1] = dest[2] = 0;
        } return dest; }; vec3.set = function (vec, dest) { dest[0] = vec[0]; dest[1] = vec[1]; dest[2] = vec[2]; return dest; }; vec3.add = function (vec, vec2, dest) { if (!dest || vec === dest) {
            vec[0] += vec2[0];
            vec[1] += vec2[1];
            vec[2] += vec2[2];
            return vec;
        } dest[0] = vec[0] + vec2[0]; dest[1] = vec[1] + vec2[1]; dest[2] = vec[2] + vec2[2]; return dest; }; vec3.subtract = function (vec, vec2, dest) { if (!dest || vec === dest) {
            vec[0] -= vec2[0];
            vec[1] -= vec2[1];
            vec[2] -= vec2[2];
            return vec;
        } dest[0] = vec[0] - vec2[0]; dest[1] = vec[1] - vec2[1]; dest[2] = vec[2] - vec2[2]; return dest; }; vec3.multiply = function (vec, vec2, dest) { if (!dest || vec === dest) {
            vec[0] *= vec2[0];
            vec[1] *= vec2[1];
            vec[2] *= vec2[2];
            return vec;
        } dest[0] = vec[0] * vec2[0]; dest[1] = vec[1] * vec2[1]; dest[2] = vec[2] * vec2[2]; return dest; }; vec3.negate = function (vec, dest) { if (!dest) {
            dest = vec;
        } dest[0] = -vec[0]; dest[1] = -vec[1]; dest[2] = -vec[2]; return dest; }; vec3.scale = function (vec, val, dest) { if (!dest || vec === dest) {
            vec[0] *= val;
            vec[1] *= val;
            vec[2] *= val;
            return vec;
        } dest[0] = vec[0] * val; dest[1] = vec[1] * val; dest[2] = vec[2] * val; return dest; }; vec3.normalize = function (vec, dest) { if (!dest) {
            dest = vec;
        } var x = vec[0], y = vec[1], z = vec[2], len = Math.sqrt(x * x + y * y + z * z); if (!len) {
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            return dest;
        }
        else if (len === 1) {
            dest[0] = x;
            dest[1] = y;
            dest[2] = z;
            return dest;
        } len = 1 / len; dest[0] = x * len; dest[1] = y * len; dest[2] = z * len; return dest; }; vec3.cross = function (vec, vec2, dest) { if (!dest) {
            dest = vec;
        } var x = vec[0], y = vec[1], z = vec[2], x2 = vec2[0], y2 = vec2[1], z2 = vec2[2]; dest[0] = y * z2 - z * y2; dest[1] = z * x2 - x * z2; dest[2] = x * y2 - y * x2; return dest; }; vec3.length = function (vec) { var x = vec[0], y = vec[1], z = vec[2]; return Math.sqrt(x * x + y * y + z * z); }; vec3.dot = function (vec, vec2) { return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2]; }; vec3.direction = function (vec, vec2, dest) { if (!dest) {
            dest = vec;
        } var x = vec[0] - vec2[0], y = vec[1] - vec2[1], z = vec[2] - vec2[2], len = Math.sqrt(x * x + y * y + z * z); if (!len) {
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            return dest;
        } len = 1 / len; dest[0] = x * len; dest[1] = y * len; dest[2] = z * len; return dest; }; vec3.lerp = function (vec, vec2, lerp, dest) { if (!dest) {
            dest = vec;
        } dest[0] = vec[0] + lerp * (vec2[0] - vec[0]); dest[1] = vec[1] + lerp * (vec2[1] - vec[1]); dest[2] = vec[2] + lerp * (vec2[2] - vec[2]); return dest; }; vec3.dist = function (vec, vec2) { var x = vec2[0] - vec[0], y = vec2[1] - vec[1], z = vec2[2] - vec[2]; return Math.sqrt(x * x + y * y + z * z); }; vec3.unproject = function (vec, view, proj, viewport, dest) { if (!dest) {
            dest = vec;
        } var m = mat4.create(); var v = new MatrixArray(4); v[0] = (vec[0] - viewport[0]) * 2 / viewport[2] - 1; v[1] = (vec[1] - viewport[1]) * 2 / viewport[3] - 1; v[2] = 2 * vec[2] - 1; v[3] = 1; mat4.multiply(proj, view, m); if (!mat4.inverse(m)) {
            return null;
        } mat4.multiplyVec4(m, v); if (v[3] === 0) {
            return null;
        } dest[0] = v[0] / v[3]; dest[1] = v[1] / v[3]; dest[2] = v[2] / v[3]; return dest; }; vec3.str = function (vec) { return "[" + vec[0] + ", " + vec[1] + ", " + vec[2] + "]"; }; mat3.create = function (mat) { var dest = new MatrixArray(9); if (mat) {
            dest[0] = mat[0];
            dest[1] = mat[1];
            dest[2] = mat[2];
            dest[3] = mat[3];
            dest[4] = mat[4];
            dest[5] = mat[5];
            dest[6] = mat[6];
            dest[7] = mat[7];
            dest[8] = mat[8];
        } return dest; }; mat3.set = function (mat, dest) { dest[0] = mat[0]; dest[1] = mat[1]; dest[2] = mat[2]; dest[3] = mat[3]; dest[4] = mat[4]; dest[5] = mat[5]; dest[6] = mat[6]; dest[7] = mat[7]; dest[8] = mat[8]; return dest; }; mat3.identity = function (dest) { if (!dest) {
            dest = mat3.create();
        } dest[0] = 1; dest[1] = 0; dest[2] = 0; dest[3] = 0; dest[4] = 1; dest[5] = 0; dest[6] = 0; dest[7] = 0; dest[8] = 1; return dest; }; mat3.transpose = function (mat, dest) { if (!dest || mat === dest) {
            var a01 = mat[1], a02 = mat[2], a12 = mat[5];
            mat[1] = mat[3];
            mat[2] = mat[6];
            mat[3] = a01;
            mat[5] = mat[7];
            mat[6] = a02;
            mat[7] = a12;
            return mat;
        } dest[0] = mat[0]; dest[1] = mat[3]; dest[2] = mat[6]; dest[3] = mat[1]; dest[4] = mat[4]; dest[5] = mat[7]; dest[6] = mat[2]; dest[7] = mat[5]; dest[8] = mat[8]; return dest; }; mat3.toMat4 = function (mat, dest) { if (!dest) {
            dest = mat4.create();
        } dest[15] = 1; dest[14] = 0; dest[13] = 0; dest[12] = 0; dest[11] = 0; dest[10] = mat[8]; dest[9] = mat[7]; dest[8] = mat[6]; dest[7] = 0; dest[6] = mat[5]; dest[5] = mat[4]; dest[4] = mat[3]; dest[3] = 0; dest[2] = mat[2]; dest[1] = mat[1]; dest[0] = mat[0]; return dest; }; mat3.str = function (mat) { return "[" + mat[0] + ", " + mat[1] + ", " + mat[2] + ", " + mat[3] + ", " + mat[4] + ", " + mat[5] + ", " + mat[6] + ", " + mat[7] + ", " + mat[8] + "]"; }; mat4.create = function (mat) { var dest = new MatrixArray(16); if (mat) {
            dest[0] = mat[0];
            dest[1] = mat[1];
            dest[2] = mat[2];
            dest[3] = mat[3];
            dest[4] = mat[4];
            dest[5] = mat[5];
            dest[6] = mat[6];
            dest[7] = mat[7];
            dest[8] = mat[8];
            dest[9] = mat[9];
            dest[10] = mat[10];
            dest[11] = mat[11];
            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        } return dest; }; mat4.set = function (mat, dest) { dest[0] = mat[0]; dest[1] = mat[1]; dest[2] = mat[2]; dest[3] = mat[3]; dest[4] = mat[4]; dest[5] = mat[5]; dest[6] = mat[6]; dest[7] = mat[7]; dest[8] = mat[8]; dest[9] = mat[9]; dest[10] = mat[10]; dest[11] = mat[11]; dest[12] = mat[12]; dest[13] = mat[13]; dest[14] = mat[14]; dest[15] = mat[15]; return dest; }; mat4.identity = function (dest) { if (!dest) {
            dest = mat4.create();
        } dest[0] = 1; dest[1] = 0; dest[2] = 0; dest[3] = 0; dest[4] = 0; dest[5] = 1; dest[6] = 0; dest[7] = 0; dest[8] = 0; dest[9] = 0; dest[10] = 1; dest[11] = 0; dest[12] = 0; dest[13] = 0; dest[14] = 0; dest[15] = 1; return dest; }; mat4.transpose = function (mat, dest) { if (!dest || mat === dest) {
            var a01 = mat[1], a02 = mat[2], a03 = mat[3], a12 = mat[6], a13 = mat[7], a23 = mat[11];
            mat[1] = mat[4];
            mat[2] = mat[8];
            mat[3] = mat[12];
            mat[4] = a01;
            mat[6] = mat[9];
            mat[7] = mat[13];
            mat[8] = a02;
            mat[9] = a12;
            mat[11] = mat[14];
            mat[12] = a03;
            mat[13] = a13;
            mat[14] = a23;
            return mat;
        } dest[0] = mat[0]; dest[1] = mat[4]; dest[2] = mat[8]; dest[3] = mat[12]; dest[4] = mat[1]; dest[5] = mat[5]; dest[6] = mat[9]; dest[7] = mat[13]; dest[8] = mat[2]; dest[9] = mat[6]; dest[10] = mat[10]; dest[11] = mat[14]; dest[12] = mat[3]; dest[13] = mat[7]; dest[14] = mat[11]; dest[15] = mat[15]; return dest; }; mat4.determinant = function (mat) { var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15]; return a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 + a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 + a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 + a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 + a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 + a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33; }; mat4.inverse = function (mat, dest) { if (!dest) {
            dest = mat;
        } var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, d = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06, invDet; if (!d) {
            return null;
        } invDet = 1 / d; dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet; dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet; dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet; dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet; dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet; dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet; dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet; dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet; dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet; dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet; dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet; dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet; dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet; dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet; dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet; dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet; return dest; }; mat4.toRotationMat = function (mat, dest) { if (!dest) {
            dest = mat4.create();
        } dest[0] = mat[0]; dest[1] = mat[1]; dest[2] = mat[2]; dest[3] = mat[3]; dest[4] = mat[4]; dest[5] = mat[5]; dest[6] = mat[6]; dest[7] = mat[7]; dest[8] = mat[8]; dest[9] = mat[9]; dest[10] = mat[10]; dest[11] = mat[11]; dest[12] = 0; dest[13] = 0; dest[14] = 0; dest[15] = 1; return dest; }; mat4.toMat3 = function (mat, dest) { if (!dest) {
            dest = mat3.create();
        } dest[0] = mat[0]; dest[1] = mat[1]; dest[2] = mat[2]; dest[3] = mat[4]; dest[4] = mat[5]; dest[5] = mat[6]; dest[6] = mat[8]; dest[7] = mat[9]; dest[8] = mat[10]; return dest; }; mat4.toInverseMat3 = function (mat, dest) { var a00 = mat[0], a01 = mat[1], a02 = mat[2], a10 = mat[4], a11 = mat[5], a12 = mat[6], a20 = mat[8], a21 = mat[9], a22 = mat[10], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, d = a00 * b01 + a01 * b11 + a02 * b21, id; if (!d) {
            return null;
        } id = 1 / d; if (!dest) {
            dest = mat3.create();
        } dest[0] = b01 * id; dest[1] = (-a22 * a01 + a02 * a21) * id; dest[2] = (a12 * a01 - a02 * a11) * id; dest[3] = b11 * id; dest[4] = (a22 * a00 - a02 * a20) * id; dest[5] = (-a12 * a00 + a02 * a10) * id; dest[6] = b21 * id; dest[7] = (-a21 * a00 + a01 * a20) * id; dest[8] = (a11 * a00 - a01 * a10) * id; return dest; }; mat4.multiply = function (mat, mat2, dest) { if (!dest) {
            dest = mat;
        } var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15], b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3], b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7], b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11], b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15]; dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30; dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31; dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32; dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33; dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30; dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31; dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32; dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33; dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30; dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31; dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32; dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33; dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30; dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31; dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32; dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33; return dest; }; mat4.multiplyVec3 = function (mat, vec, dest) { if (!dest) {
            dest = vec;
        } var x = vec[0], y = vec[1], z = vec[2]; dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12]; dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13]; dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14]; return dest; }; mat4.multiplyVec4 = function (mat, vec, dest) { if (!dest) {
            dest = vec;
        } var x = vec[0], y = vec[1], z = vec[2], w = vec[3]; dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w; dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w; dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w; dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w; return dest; }; mat4.translate = function (mat, vec, dest) { var x = vec[0], y = vec[1], z = vec[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23; if (!dest || mat === dest) {
            mat[12] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
            mat[13] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
            mat[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
            mat[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
            return mat;
        } a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3]; a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7]; a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11]; dest[0] = a00; dest[1] = a01; dest[2] = a02; dest[3] = a03; dest[4] = a10; dest[5] = a11; dest[6] = a12; dest[7] = a13; dest[8] = a20; dest[9] = a21; dest[10] = a22; dest[11] = a23; dest[12] = a00 * x + a10 * y + a20 * z + mat[12]; dest[13] = a01 * x + a11 * y + a21 * z + mat[13]; dest[14] = a02 * x + a12 * y + a22 * z + mat[14]; dest[15] = a03 * x + a13 * y + a23 * z + mat[15]; return dest; }; mat4.scale = function (mat, vec, dest) { var x = vec[0], y = vec[1], z = vec[2]; if (!dest || mat === dest) {
            mat[0] *= x;
            mat[1] *= x;
            mat[2] *= x;
            mat[3] *= x;
            mat[4] *= y;
            mat[5] *= y;
            mat[6] *= y;
            mat[7] *= y;
            mat[8] *= z;
            mat[9] *= z;
            mat[10] *= z;
            mat[11] *= z;
            return mat;
        } dest[0] = mat[0] * x; dest[1] = mat[1] * x; dest[2] = mat[2] * x; dest[3] = mat[3] * x; dest[4] = mat[4] * y; dest[5] = mat[5] * y; dest[6] = mat[6] * y; dest[7] = mat[7] * y; dest[8] = mat[8] * z; dest[9] = mat[9] * z; dest[10] = mat[10] * z; dest[11] = mat[11] * z; dest[12] = mat[12]; dest[13] = mat[13]; dest[14] = mat[14]; dest[15] = mat[15]; return dest; }; mat4.rotate = function (mat, angle, axis, dest) { var x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22; if (!len) {
            return null;
        } if (len !== 1) {
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;
        } s = Math.sin(angle); c = Math.cos(angle); t = 1 - c; a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3]; a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7]; a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11]; b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s; b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s; b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c; if (!dest) {
            dest = mat;
        }
        else if (mat !== dest) {
            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        } dest[0] = a00 * b00 + a10 * b01 + a20 * b02; dest[1] = a01 * b00 + a11 * b01 + a21 * b02; dest[2] = a02 * b00 + a12 * b01 + a22 * b02; dest[3] = a03 * b00 + a13 * b01 + a23 * b02; dest[4] = a00 * b10 + a10 * b11 + a20 * b12; dest[5] = a01 * b10 + a11 * b11 + a21 * b12; dest[6] = a02 * b10 + a12 * b11 + a22 * b12; dest[7] = a03 * b10 + a13 * b11 + a23 * b12; dest[8] = a00 * b20 + a10 * b21 + a20 * b22; dest[9] = a01 * b20 + a11 * b21 + a21 * b22; dest[10] = a02 * b20 + a12 * b21 + a22 * b22; dest[11] = a03 * b20 + a13 * b21 + a23 * b22; return dest; }; mat4.rotateX = function (mat, angle, dest) { var s = Math.sin(angle), c = Math.cos(angle), a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11]; if (!dest) {
            dest = mat;
        }
        else if (mat !== dest) {
            dest[0] = mat[0];
            dest[1] = mat[1];
            dest[2] = mat[2];
            dest[3] = mat[3];
            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        } dest[4] = a10 * c + a20 * s; dest[5] = a11 * c + a21 * s; dest[6] = a12 * c + a22 * s; dest[7] = a13 * c + a23 * s; dest[8] = a10 * -s + a20 * c; dest[9] = a11 * -s + a21 * c; dest[10] = a12 * -s + a22 * c; dest[11] = a13 * -s + a23 * c; return dest; }; mat4.rotateY = function (mat, angle, dest) { var s = Math.sin(angle), c = Math.cos(angle), a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11]; if (!dest) {
            dest = mat;
        }
        else if (mat !== dest) {
            dest[4] = mat[4];
            dest[5] = mat[5];
            dest[6] = mat[6];
            dest[7] = mat[7];
            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        } dest[0] = a00 * c + a20 * -s; dest[1] = a01 * c + a21 * -s; dest[2] = a02 * c + a22 * -s; dest[3] = a03 * c + a23 * -s; dest[8] = a00 * s + a20 * c; dest[9] = a01 * s + a21 * c; dest[10] = a02 * s + a22 * c; dest[11] = a03 * s + a23 * c; return dest; }; mat4.rotateZ = function (mat, angle, dest) { var s = Math.sin(angle), c = Math.cos(angle), a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7]; if (!dest) {
            dest = mat;
        }
        else if (mat !== dest) {
            dest[8] = mat[8];
            dest[9] = mat[9];
            dest[10] = mat[10];
            dest[11] = mat[11];
            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        } dest[0] = a00 * c + a10 * s; dest[1] = a01 * c + a11 * s; dest[2] = a02 * c + a12 * s; dest[3] = a03 * c + a13 * s; dest[4] = a00 * -s + a10 * c; dest[5] = a01 * -s + a11 * c; dest[6] = a02 * -s + a12 * c; dest[7] = a03 * -s + a13 * c; return dest; }; mat4.frustum = function (left, right, bottom, top, near, far, dest) { if (!dest) {
            dest = mat4.create();
        } var rl = right - left, tb = top - bottom, fn = far - near; dest[0] = near * 2 / rl; dest[1] = 0; dest[2] = 0; dest[3] = 0; dest[4] = 0; dest[5] = near * 2 / tb; dest[6] = 0; dest[7] = 0; dest[8] = (right + left) / rl; dest[9] = (top + bottom) / tb; dest[10] = -(far + near) / fn; dest[11] = -1; dest[12] = 0; dest[13] = 0; dest[14] = -(far * near * 2) / fn; dest[15] = 0; return dest; }; mat4.perspective = function (fovy, aspect, near, far, dest) { var top = near * Math.tan(fovy * Math.PI / 360), right = top * aspect; return mat4.frustum(-right, right, -top, top, near, far, dest); }; mat4.ortho = function (left, right, bottom, top, near, far, dest) { if (!dest) {
            dest = mat4.create();
        } var rl = right - left, tb = top - bottom, fn = far - near; dest[0] = 2 / rl; dest[1] = 0; dest[2] = 0; dest[3] = 0; dest[4] = 0; dest[5] = 2 / tb; dest[6] = 0; dest[7] = 0; dest[8] = 0; dest[9] = 0; dest[10] = -2 / fn; dest[11] = 0; dest[12] = -(left + right) / rl; dest[13] = -(top + bottom) / tb; dest[14] = -(far + near) / fn; dest[15] = 1; return dest; }; mat4.lookAt = function (eye, center, up, dest) { if (!dest) {
            dest = mat4.create();
        } var x0, x1, x2, y0, y1, y2, z0, z1, z2, len, eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2], centerx = center[0], centery = center[1], centerz = center[2]; if (eyex === centerx && eyey === centery && eyez === centerz) {
            return mat4.identity(dest);
        } z0 = eyex - centerx; z1 = eyey - centery; z2 = eyez - centerz; len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2); z0 *= len; z1 *= len; z2 *= len; x0 = upy * z2 - upz * z1; x1 = upz * z0 - upx * z2; x2 = upx * z1 - upy * z0; len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2); if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        }
        else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        } y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0; len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2); if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        }
        else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        } dest[0] = x0; dest[1] = y0; dest[2] = z0; dest[3] = 0; dest[4] = x1; dest[5] = y1; dest[6] = z1; dest[7] = 0; dest[8] = x2; dest[9] = y2; dest[10] = z2; dest[11] = 0; dest[12] = -(x0 * eyex + x1 * eyey + x2 * eyez); dest[13] = -(y0 * eyex + y1 * eyey + y2 * eyez); dest[14] = -(z0 * eyex + z1 * eyey + z2 * eyez); dest[15] = 1; return dest; }; mat4.fromRotationTranslation = function (quat, vec, dest) { if (!dest) {
            dest = mat4.create();
        } var x = quat[0], y = quat[1], z = quat[2], w = quat[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2; dest[0] = 1 - (yy + zz); dest[1] = xy + wz; dest[2] = xz - wy; dest[3] = 0; dest[4] = xy - wz; dest[5] = 1 - (xx + zz); dest[6] = yz + wx; dest[7] = 0; dest[8] = xz + wy; dest[9] = yz - wx; dest[10] = 1 - (xx + yy); dest[11] = 0; dest[12] = vec[0]; dest[13] = vec[1]; dest[14] = vec[2]; dest[15] = 1; return dest; }; mat4.str = function (mat) { return "[" + mat[0] + ", " + mat[1] + ", " + mat[2] + ", " + mat[3] + ", " + mat[4] + ", " + mat[5] + ", " + mat[6] + ", " + mat[7] + ", " + mat[8] + ", " + mat[9] + ", " + mat[10] + ", " + mat[11] + ", " + mat[12] + ", " + mat[13] + ", " + mat[14] + ", " + mat[15] + "]"; }; quat4.create = function (quat) { var dest = new MatrixArray(4); if (quat) {
            dest[0] = quat[0];
            dest[1] = quat[1];
            dest[2] = quat[2];
            dest[3] = quat[3];
        } return dest; }; quat4.set = function (quat, dest) { dest[0] = quat[0]; dest[1] = quat[1]; dest[2] = quat[2]; dest[3] = quat[3]; return dest; }; quat4.calculateW = function (quat, dest) { var x = quat[0], y = quat[1], z = quat[2]; if (!dest || quat === dest) {
            quat[3] = -Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
            return quat;
        } dest[0] = x; dest[1] = y; dest[2] = z; dest[3] = -Math.sqrt(Math.abs(1 - x * x - y * y - z * z)); return dest; }; quat4.dot = function (quat, quat2) { return quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3]; }; quat4.inverse = function (quat, dest) { var q0 = quat[0], q1 = quat[1], q2 = quat[2], q3 = quat[3], dot = q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3, invDot = dot ? 1 / dot : 0; if (!dest || quat === dest) {
            quat[0] *= -invDot;
            quat[1] *= -invDot;
            quat[2] *= -invDot;
            quat[3] *= invDot;
            return quat;
        } dest[0] = -quat[0] * invDot; dest[1] = -quat[1] * invDot; dest[2] = -quat[2] * invDot; dest[3] = quat[3] * invDot; return dest; }; quat4.conjugate = function (quat, dest) { if (!dest || quat === dest) {
            quat[0] *= -1;
            quat[1] *= -1;
            quat[2] *= -1;
            return quat;
        } dest[0] = -quat[0]; dest[1] = -quat[1]; dest[2] = -quat[2]; dest[3] = quat[3]; return dest; }; quat4.length = function (quat) { var x = quat[0], y = quat[1], z = quat[2], w = quat[3]; return Math.sqrt(x * x + y * y + z * z + w * w); }; quat4.normalize = function (quat, dest) { if (!dest) {
            dest = quat;
        } var x = quat[0], y = quat[1], z = quat[2], w = quat[3], len = Math.sqrt(x * x + y * y + z * z + w * w); if (len === 0) {
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            return dest;
        } len = 1 / len; dest[0] = x * len; dest[1] = y * len; dest[2] = z * len; dest[3] = w * len; return dest; }; quat4.add = function (quat, quat2, dest) { if (!dest || quat === dest) {
            quat[0] += quat2[0];
            quat[1] += quat2[1];
            quat[2] += quat2[2];
            quat[3] += quat2[3];
            return quat;
        } dest[0] = quat[0] + quat2[0]; dest[1] = quat[1] + quat2[1]; dest[2] = quat[2] + quat2[2]; dest[3] = quat[3] + quat2[3]; return dest; }; quat4.multiply = function (quat, quat2, dest) { if (!dest) {
            dest = quat;
        } var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3], qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3]; dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby; dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz; dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx; dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz; return dest; }; quat4.multiplyVec3 = function (quat, vec, dest) { if (!dest) {
            dest = vec;
        } var x = vec[0], y = vec[1], z = vec[2], qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3], ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z; dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy; dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz; dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx; return dest; }; quat4.scale = function (quat, val, dest) { if (!dest || quat === dest) {
            quat[0] *= val;
            quat[1] *= val;
            quat[2] *= val;
            quat[3] *= val;
            return quat;
        } dest[0] = quat[0] * val; dest[1] = quat[1] * val; dest[2] = quat[2] * val; dest[3] = quat[3] * val; return dest; }; quat4.toMat3 = function (quat, dest) { if (!dest) {
            dest = mat3.create();
        } var x = quat[0], y = quat[1], z = quat[2], w = quat[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2; dest[0] = 1 - (yy + zz); dest[1] = xy + wz; dest[2] = xz - wy; dest[3] = xy - wz; dest[4] = 1 - (xx + zz); dest[5] = yz + wx; dest[6] = xz + wy; dest[7] = yz - wx; dest[8] = 1 - (xx + yy); return dest; }; quat4.toMat4 = function (quat, dest) { if (!dest) {
            dest = mat4.create();
        } var x = quat[0], y = quat[1], z = quat[2], w = quat[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2; dest[0] = 1 - (yy + zz); dest[1] = xy + wz; dest[2] = xz - wy; dest[3] = 0; dest[4] = xy - wz; dest[5] = 1 - (xx + zz); dest[6] = yz + wx; dest[7] = 0; dest[8] = xz + wy; dest[9] = yz - wx; dest[10] = 1 - (xx + yy); dest[11] = 0; dest[12] = 0; dest[13] = 0; dest[14] = 0; dest[15] = 1; return dest; }; quat4.slerp = function (quat, quat2, slerp, dest) { if (!dest) {
            dest = quat;
        } var cosHalfTheta = quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3], halfTheta, sinHalfTheta, ratioA, ratioB; if (Math.abs(cosHalfTheta) >= 1) {
            if (dest !== quat) {
                dest[0] = quat[0];
                dest[1] = quat[1];
                dest[2] = quat[2];
                dest[3] = quat[3];
            }
            return dest;
        } halfTheta = Math.acos(cosHalfTheta); sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta); if (Math.abs(sinHalfTheta) < .001) {
            dest[0] = quat[0] * .5 + quat2[0] * .5;
            dest[1] = quat[1] * .5 + quat2[1] * .5;
            dest[2] = quat[2] * .5 + quat2[2] * .5;
            dest[3] = quat[3] * .5 + quat2[3] * .5;
            return dest;
        } ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta; ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta; dest[0] = quat[0] * ratioA + quat2[0] * ratioB; dest[1] = quat[1] * ratioA + quat2[1] * ratioB; dest[2] = quat[2] * ratioA + quat2[2] * ratioB; dest[3] = quat[3] * ratioA + quat2[3] * ratioB; return dest; }; quat4.str = function (quat) { return "[" + quat[0] + ", " + quat[1] + ", " + quat[2] + ", " + quat[3] + "]"; }; return { vec3, mat3, mat4, quat4 }; })();
        var _glEnable = x0 => GLctx.enable(x0);
        Module["_glEnable"] = _glEnable;
        var _glDisable = x0 => GLctx.disable(x0);
        Module["_glDisable"] = _glDisable;
        var _glIsEnabled = x0 => GLctx.isEnabled(x0);
        Module["_glIsEnabled"] = _glIsEnabled;
        var writeI53ToI64 = (ptr, num) => { HEAPU32[ptr >> 2] = num; var lower = HEAPU32[ptr >> 2]; HEAPU32[ptr + 4 >> 2] = (num - lower) / 4294967296; };
        var emscriptenWebGLGet = (name_, p, type) => { if (!p) {
            GL.recordError(1281);
            return;
        } var ret = undefined; switch (name_) {
            case 36346:
                ret = 1;
                break;
            case 36344:
                if (type != 0 && type != 1) {
                    GL.recordError(1280);
                }
                return;
            case 36345:
                ret = 0;
                break;
            case 34466:
                var formats = GLctx.getParameter(34467);
                ret = formats ? formats.length : 0;
                break;
        } if (ret === undefined) {
            var result = GLctx.getParameter(name_);
            switch (typeof result) {
                case "number":
                    ret = result;
                    break;
                case "boolean":
                    ret = result ? 1 : 0;
                    break;
                case "string":
                    GL.recordError(1280);
                    return;
                case "object":
                    if (result === null) {
                        switch (name_) {
                            case 34964:
                            case 35725:
                            case 34965:
                            case 36006:
                            case 36007:
                            case 32873:
                            case 34229:
                            case 34068: {
                                ret = 0;
                                break;
                            }
                            default: {
                                GL.recordError(1280);
                                return;
                            }
                        }
                    }
                    else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
                        for (var i = 0; i < result.length; ++i) {
                            switch (type) {
                                case 0:
                                    HEAP32[p + i * 4 >> 2] = result[i];
                                    break;
                                case 2:
                                    HEAPF32[p + i * 4 >> 2] = result[i];
                                    break;
                                case 4:
                                    HEAP8[p + i] = result[i] ? 1 : 0;
                                    break;
                            }
                        }
                        return;
                    }
                    else {
                        try {
                            ret = result.name | 0;
                        }
                        catch (e) {
                            GL.recordError(1280);
                            err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
                            return;
                        }
                    }
                    break;
                default:
                    GL.recordError(1280);
                    err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof result}!`);
                    return;
            }
        } switch (type) {
            case 1:
                writeI53ToI64(p, ret);
                break;
            case 0:
                HEAP32[p >> 2] = ret;
                break;
            case 2:
                HEAPF32[p >> 2] = ret;
                break;
            case 4:
                HEAP8[p] = ret ? 1 : 0;
                break;
        } };
        var _glGetBooleanv = (name_, p) => emscriptenWebGLGet(name_, p, 4);
        Module["_glGetBooleanv"] = _glGetBooleanv;
        var _glGetIntegerv = (name_, p) => emscriptenWebGLGet(name_, p, 0);
        Module["_glGetIntegerv"] = _glGetIntegerv;
        var stringToNewUTF8 = str => { var size = lengthBytesUTF8(str) + 1; var ret = _malloc(size); if (ret)
            stringToUTF8(str, ret, size); return ret; };
        var webglGetExtensions = function $webglGetExtensions() { var exts = getEmscriptenSupportedExtensions(GLctx); exts = exts.concat(exts.map(e => "GL_" + e)); return exts; };
        var _glGetString = name_ => { var ret = GL.stringCache[name_]; if (!ret) {
            switch (name_) {
                case 7939:
                    ret = stringToNewUTF8(webglGetExtensions().join(" "));
                    break;
                case 7936:
                case 7937:
                case 37445:
                case 37446:
                    var s = GLctx.getParameter(name_);
                    if (!s) {
                        GL.recordError(1280);
                    }
                    ret = s ? stringToNewUTF8(s) : 0;
                    break;
                case 7938:
                    var webGLVersion = GLctx.getParameter(7938);
                    var glVersion = `OpenGL ES 2.0 (${webGLVersion})`;
                    ret = stringToNewUTF8(glVersion);
                    break;
                case 35724:
                    var glslVersion = GLctx.getParameter(35724);
                    var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
                    var ver_num = glslVersion.match(ver_re);
                    if (ver_num !== null) {
                        if (ver_num[1].length == 3)
                            ver_num[1] = ver_num[1] + "0";
                        glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
                    }
                    ret = stringToNewUTF8(glslVersion);
                    break;
                default: GL.recordError(1280);
            }
            GL.stringCache[name_] = ret;
        } return ret; };
        Module["_glGetString"] = _glGetString;
        var _glCreateShader = shaderType => { var id = GL.getNewId(GL.shaders); GL.shaders[id] = GLctx.createShader(shaderType); return id; };
        Module["_glCreateShader"] = _glCreateShader;
        var _glShaderSource = (shader, count, string, length) => { var source = GL.getSource(shader, count, string, length); GLctx.shaderSource(GL.shaders[shader], source); };
        Module["_glShaderSource"] = _glShaderSource;
        var _glCompileShader = shader => { GLctx.compileShader(GL.shaders[shader]); };
        Module["_glCompileShader"] = _glCompileShader;
        var _glAttachShader = (program, shader) => { GLctx.attachShader(GL.programs[program], GL.shaders[shader]); };
        Module["_glAttachShader"] = _glAttachShader;
        var _glDetachShader = (program, shader) => { GLctx.detachShader(GL.programs[program], GL.shaders[shader]); };
        Module["_glDetachShader"] = _glDetachShader;
        var _glUseProgram = program => { program = GL.programs[program]; GLctx.useProgram(program); GLctx.currentProgram = program; };
        Module["_glUseProgram"] = _glUseProgram;
        var _glDeleteProgram = id => { if (!id)
            return; var program = GL.programs[id]; if (!program) {
            GL.recordError(1281);
            return;
        } GLctx.deleteProgram(program); program.name = 0; GL.programs[id] = null; };
        Module["_glDeleteProgram"] = _glDeleteProgram;
        var _glBindAttribLocation = (program, index, name) => { GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name)); };
        Module["_glBindAttribLocation"] = _glBindAttribLocation;
        var _glLinkProgram = program => { program = GL.programs[program]; GLctx.linkProgram(program); program.uniformLocsById = 0; program.uniformSizeAndIdsByName = {}; };
        Module["_glLinkProgram"] = _glLinkProgram;
        var _glBindBuffer = (target, buffer) => { if (target == 34962) {
            GLctx.currentArrayBufferBinding = buffer;
            GLImmediate.lastArrayBuffer = buffer;
        }
        else if (target == 34963) {
            GLctx.currentElementArrayBufferBinding = buffer;
        } GLctx.bindBuffer(target, GL.buffers[buffer]); };
        Module["_glBindBuffer"] = _glBindBuffer;
        var _glGetFloatv = (name_, p) => emscriptenWebGLGet(name_, p, 2);
        Module["_glGetFloatv"] = _glGetFloatv;
        var _glHint = (x0, x1) => GLctx.hint(x0, x1);
        Module["_glHint"] = _glHint;
        var _glEnableVertexAttribArray = index => { GLctx.enableVertexAttribArray(index); };
        Module["_glEnableVertexAttribArray"] = _glEnableVertexAttribArray;
        var _glDisableVertexAttribArray = index => { GLctx.disableVertexAttribArray(index); };
        Module["_glDisableVertexAttribArray"] = _glDisableVertexAttribArray;
        var _glVertexAttribPointer = (index, size, type, normalized, stride, ptr) => { GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr); };
        Module["_glVertexAttribPointer"] = _glVertexAttribPointer;
        var _glActiveTexture = x0 => GLctx.activeTexture(x0);
        Module["_glActiveTexture"] = _glActiveTexture;
        var ptrToString = ptr => { ptr >>>= 0; return "0x" + ptr.toString(16).padStart(8, "0"); };
        var GLEmulation = { fogStart: 0, fogEnd: 1, fogDensity: 1, fogColor: null, fogMode: 2048, fogEnabled: false, MAX_CLIP_PLANES: 6, clipPlaneEnabled: [false, false, false, false, false, false], clipPlaneEquation: [], lightingEnabled: false, lightModelAmbient: null, lightModelLocalViewer: false, lightModelTwoSide: false, materialAmbient: null, materialDiffuse: null, materialSpecular: null, materialShininess: null, materialEmission: null, MAX_LIGHTS: 8, lightEnabled: [false, false, false, false, false, false, false, false], lightAmbient: [], lightDiffuse: [], lightSpecular: [], lightPosition: [], alphaTestEnabled: false, alphaTestFunc: 519, alphaTestRef: 0, pointSize: 1, vaos: [], currentVao: null, enabledVertexAttribArrays: {}, hasRunInit: false, findToken(source, token) { function isIdentChar(ch) { if (ch >= 48 && ch <= 57)
                return true; if (ch >= 65 && ch <= 90)
                return true; if (ch >= 97 && ch <= 122)
                return true; return false; } var i = -1; do {
                i = source.indexOf(token, i + 1);
                if (i < 0) {
                    break;
                }
                if (i > 0 && isIdentChar(source[i - 1])) {
                    continue;
                }
                i += token.length;
                if (i < source.length - 1 && isIdentChar(source[i + 1])) {
                    continue;
                }
                return true;
            } while (true); return false; }, init() { if (GLEmulation.hasRunInit) {
                return;
            } GLEmulation.hasRunInit = true; GLEmulation.fogColor = new Float32Array(4); for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
                GLEmulation.clipPlaneEquation[clipPlaneId] = new Float32Array(4);
            } GLEmulation.lightModelAmbient = new Float32Array([.2, .2, .2, 1]); GLEmulation.materialAmbient = new Float32Array([.2, .2, .2, 1]); GLEmulation.materialDiffuse = new Float32Array([.8, .8, .8, 1]); GLEmulation.materialSpecular = new Float32Array([0, 0, 0, 1]); GLEmulation.materialShininess = new Float32Array([0]); GLEmulation.materialEmission = new Float32Array([0, 0, 0, 1]); for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
                GLEmulation.lightAmbient[lightId] = new Float32Array([0, 0, 0, 1]);
                GLEmulation.lightDiffuse[lightId] = lightId ? new Float32Array([0, 0, 0, 1]) : new Float32Array([1, 1, 1, 1]);
                GLEmulation.lightSpecular[lightId] = lightId ? new Float32Array([0, 0, 0, 1]) : new Float32Array([1, 1, 1, 1]);
                GLEmulation.lightPosition[lightId] = new Float32Array([0, 0, 1, 0]);
            } err("WARNING: using emscripten GL emulation. This is a collection of limited workarounds, do not expect it to work."); err("WARNING: using emscripten GL emulation unsafe opts. If weirdness happens, try -sGL_UNSAFE_OPTS=0"); var validCapabilities = { 2884: 1, 3042: 1, 3024: 1, 2960: 1, 2929: 1, 3089: 1, 32823: 1, 32926: 1, 32928: 1 }; var orig_glEnable = _glEnable; _glEnable = _emscripten_glEnable = cap => { GLImmediate.lastRenderer?.cleanup(); if (cap == 2912) {
                if (GLEmulation.fogEnabled != true) {
                    GLImmediate.currentRenderer = null;
                    GLEmulation.fogEnabled = true;
                }
                return;
            }
            else if (cap >= 12288 && cap < 12294) {
                var clipPlaneId = cap - 12288;
                if (GLEmulation.clipPlaneEnabled[clipPlaneId] != true) {
                    GLImmediate.currentRenderer = null;
                    GLEmulation.clipPlaneEnabled[clipPlaneId] = true;
                }
                return;
            }
            else if (cap >= 16384 && cap < 16392) {
                var lightId = cap - 16384;
                if (GLEmulation.lightEnabled[lightId] != true) {
                    GLImmediate.currentRenderer = null;
                    GLEmulation.lightEnabled[lightId] = true;
                }
                return;
            }
            else if (cap == 2896) {
                if (GLEmulation.lightingEnabled != true) {
                    GLImmediate.currentRenderer = null;
                    GLEmulation.lightingEnabled = true;
                }
                return;
            }
            else if (cap == 3008) {
                if (GLEmulation.alphaTestEnabled != true) {
                    GLImmediate.currentRenderer = null;
                    GLEmulation.alphaTestEnabled = true;
                }
                return;
            }
            else if (cap == 3553) {
                return;
            }
            else if (!(cap in validCapabilities)) {
                return;
            } orig_glEnable(cap); }; var orig_glDisable = _glDisable; _glDisable = _emscripten_glDisable = cap => { GLImmediate.lastRenderer?.cleanup(); if (cap == 2912) {
                if (GLEmulation.fogEnabled != false) {
                    GLImmediate.currentRenderer = null;
                    GLEmulation.fogEnabled = false;
                }
                return;
            }
            else if (cap >= 12288 && cap < 12294) {
                var clipPlaneId = cap - 12288;
                if (GLEmulation.clipPlaneEnabled[clipPlaneId] != false) {
                    GLImmediate.currentRenderer = null;
                    GLEmulation.clipPlaneEnabled[clipPlaneId] = false;
                }
                return;
            }
            else if (cap >= 16384 && cap < 16392) {
                var lightId = cap - 16384;
                if (GLEmulation.lightEnabled[lightId] != false) {
                    GLImmediate.currentRenderer = null;
                    GLEmulation.lightEnabled[lightId] = false;
                }
                return;
            }
            else if (cap == 2896) {
                if (GLEmulation.lightingEnabled != false) {
                    GLImmediate.currentRenderer = null;
                    GLEmulation.lightingEnabled = false;
                }
                return;
            }
            else if (cap == 3008) {
                if (GLEmulation.alphaTestEnabled != false) {
                    GLImmediate.currentRenderer = null;
                    GLEmulation.alphaTestEnabled = false;
                }
                return;
            }
            else if (cap == 3553) {
                return;
            }
            else if (!(cap in validCapabilities)) {
                return;
            } orig_glDisable(cap); }; _glIsEnabled = _emscripten_glIsEnabled = cap => { if (cap == 2912) {
                return GLEmulation.fogEnabled ? 1 : 0;
            }
            else if (cap >= 12288 && cap < 12294) {
                var clipPlaneId = cap - 12288;
                return GLEmulation.clipPlaneEnabled[clipPlaneId] ? 1 : 0;
            }
            else if (cap >= 16384 && cap < 16392) {
                var lightId = cap - 16384;
                return GLEmulation.lightEnabled[lightId] ? 1 : 0;
            }
            else if (cap == 2896) {
                return GLEmulation.lightingEnabled ? 1 : 0;
            }
            else if (cap == 3008) {
                return GLEmulation.alphaTestEnabled ? 1 : 0;
            }
            else if (!(cap in validCapabilities)) {
                return 0;
            } return GLctx.isEnabled(cap); }; var orig_glGetBooleanv = _glGetBooleanv; _glGetBooleanv = _emscripten_glGetBooleanv = (pname, p) => { var attrib = GLEmulation.getAttributeFromCapability(pname); if (attrib !== null) {
                var result = GLImmediate.enabledClientAttributes[attrib];
                HEAP8[p] = result === true ? 1 : 0;
                return;
            } orig_glGetBooleanv(pname, p); }; var orig_glGetIntegerv = _glGetIntegerv; _glGetIntegerv = _emscripten_glGetIntegerv = (pname, params) => { switch (pname) {
                case 34018:
                    pname = GLctx.MAX_TEXTURE_IMAGE_UNITS;
                    break;
                case 35658: {
                    var result = GLctx.getParameter(GLctx.MAX_VERTEX_UNIFORM_VECTORS);
                    HEAP32[params >> 2] = result * 4;
                    return;
                }
                case 35657: {
                    var result = GLctx.getParameter(GLctx.MAX_FRAGMENT_UNIFORM_VECTORS);
                    HEAP32[params >> 2] = result * 4;
                    return;
                }
                case 35659: {
                    var result = GLctx.getParameter(GLctx.MAX_VARYING_VECTORS);
                    HEAP32[params >> 2] = result * 4;
                    return;
                }
                case 34929:
                    pname = GLctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS;
                    break;
                case 32890: {
                    var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
                    HEAP32[params >> 2] = attribute ? attribute.size : 0;
                    return;
                }
                case 32891: {
                    var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
                    HEAP32[params >> 2] = attribute ? attribute.type : 0;
                    return;
                }
                case 32892: {
                    var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
                    HEAP32[params >> 2] = attribute ? attribute.stride : 0;
                    return;
                }
                case 32897: {
                    var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
                    HEAP32[params >> 2] = attribute ? attribute.size : 0;
                    return;
                }
                case 32898: {
                    var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
                    HEAP32[params >> 2] = attribute ? attribute.type : 0;
                    return;
                }
                case 32899: {
                    var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
                    HEAP32[params >> 2] = attribute ? attribute.stride : 0;
                    return;
                }
                case 32904: {
                    var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
                    HEAP32[params >> 2] = attribute ? attribute.size : 0;
                    return;
                }
                case 32905: {
                    var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
                    HEAP32[params >> 2] = attribute ? attribute.type : 0;
                    return;
                }
                case 32906: {
                    var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
                    HEAP32[params >> 2] = attribute ? attribute.stride : 0;
                    return;
                }
                case 3378: {
                    HEAP32[params >> 2] = GLEmulation.MAX_CLIP_PLANES;
                    return;
                }
                case 2976: {
                    HEAP32[params >> 2] = GLImmediate.currentMatrix + 5888;
                    return;
                }
                case 3009: {
                    HEAP32[params >> 2] = GLEmulation.alphaTestFunc;
                    return;
                }
            } orig_glGetIntegerv(pname, params); }; var orig_glGetString = _glGetString; _glGetString = _emscripten_glGetString = name_ => { if (GL.stringCache[name_])
                return GL.stringCache[name_]; switch (name_) {
                case 7939:
                    var ret = stringToNewUTF8(getEmscriptenSupportedExtensions(GLctx).join(" ") + " GL_EXT_texture_env_combine GL_ARB_texture_env_crossbar GL_ATI_texture_env_combine3 GL_NV_texture_env_combine4 GL_EXT_texture_env_dot3 GL_ARB_multitexture GL_ARB_vertex_buffer_object GL_EXT_framebuffer_object GL_ARB_vertex_program GL_ARB_fragment_program GL_ARB_shading_language_100 GL_ARB_shader_objects GL_ARB_vertex_shader GL_ARB_fragment_shader GL_ARB_texture_cube_map GL_EXT_draw_range_elements" + (GL.currentContext.compressionExt ? " GL_ARB_texture_compression GL_EXT_texture_compression_s3tc" : "") + (GL.currentContext.anisotropicExt ? " GL_EXT_texture_filter_anisotropic" : ""));
                    return GL.stringCache[name_] = ret;
            } return orig_glGetString(name_); }; GL.shaderInfos = {}; var orig_glCreateShader = _glCreateShader; _glCreateShader = _emscripten_glCreateShader = shaderType => { var id = orig_glCreateShader(shaderType); GL.shaderInfos[id] = { type: shaderType, ftransform: false }; return id; }; function ensurePrecision(source) { if (!/precision +(low|medium|high)p +float *;/.test(source)) {
                source = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n" + source;
            } return source; } _glShaderSource = _emscripten_glShaderSource = (shader, count, string, length) => { var source = GL.getSource(shader, count, string, length); if (GL.shaderInfos[shader].type == GLctx.VERTEX_SHADER) {
                var has_pm = source.search(/u_projection/) >= 0;
                var has_mm = source.search(/u_modelView/) >= 0;
                var has_pv = source.search(/a_position/) >= 0;
                var need_pm = 0, need_mm = 0, need_pv = 0;
                var old = source;
                source = source.replace(/ftransform\(\)/g, "(u_projection * u_modelView * a_position)");
                if (old != source)
                    need_pm = need_mm = need_pv = 1;
                old = source;
                source = source.replace(/gl_ProjectionMatrix/g, "u_projection");
                if (old != source)
                    need_pm = 1;
                old = source;
                source = source.replace(/gl_ModelViewMatrixTranspose\[2\]/g, "vec4(u_modelView[0][2], u_modelView[1][2], u_modelView[2][2], u_modelView[3][2])");
                if (old != source)
                    need_mm = 1;
                old = source;
                source = source.replace(/gl_ModelViewMatrix/g, "u_modelView");
                if (old != source)
                    need_mm = 1;
                old = source;
                source = source.replace(/gl_Vertex/g, "a_position");
                if (old != source)
                    need_pv = 1;
                old = source;
                source = source.replace(/gl_ModelViewProjectionMatrix/g, "(u_projection * u_modelView)");
                if (old != source)
                    need_pm = need_mm = 1;
                if (need_pv && !has_pv)
                    source = "attribute vec4 a_position; \n" + source;
                if (need_mm && !has_mm)
                    source = "uniform mat4 u_modelView; \n" + source;
                if (need_pm && !has_pm)
                    source = "uniform mat4 u_projection; \n" + source;
                GL.shaderInfos[shader].ftransform = need_pm || need_mm || need_pv;
                for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                    old = source;
                    var need_vtc = source.search(`v_texCoord${i}`) == -1;
                    source = source.replace(new RegExp(`gl_TexCoord\\[${i}\\]`, "g"), `v_texCoord${i}`).replace(new RegExp(`gl_MultiTexCoord${i}`, "g"), `a_texCoord${i}`);
                    if (source != old) {
                        source = `attribute vec4 a_texCoord${i}; \n${source}`;
                        if (need_vtc) {
                            source = `varying vec4 v_texCoord${i};   \n${source}`;
                        }
                    }
                    old = source;
                    source = source.replace(new RegExp(`gl_TextureMatrix\\[${i}\\]`, "g"), `u_textureMatrix${i}`);
                    if (source != old) {
                        source = `uniform mat4 u_textureMatrix${i}; \n${source}`;
                    }
                }
                if (source.includes("gl_FrontColor")) {
                    source = "varying vec4 v_color; \n" + source.replace(/gl_FrontColor/g, "v_color");
                }
                if (source.includes("gl_Color")) {
                    source = "attribute vec4 a_color; \n" + source.replace(/gl_Color/g, "a_color");
                }
                if (source.includes("gl_Normal")) {
                    source = "attribute vec3 a_normal; \n" + source.replace(/gl_Normal/g, "a_normal");
                }
                if (source.includes("gl_FogFragCoord")) {
                    source = "varying float v_fogFragCoord;   \n" + source.replace(/gl_FogFragCoord/g, "v_fogFragCoord");
                }
            }
            else {
                for (i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                    old = source;
                    source = source.replace(new RegExp(`gl_TexCoord\\[${i}\\]`, "g"), `v_texCoord${i}`);
                    if (source != old) {
                        source = "varying vec4 v_texCoord" + i + ";   \n" + source;
                    }
                }
                if (source.includes("gl_Color")) {
                    source = "varying vec4 v_color; \n" + source.replace(/gl_Color/g, "v_color");
                }
                if (source.includes("gl_Fog.color")) {
                    source = "uniform vec4 u_fogColor;   \n" + source.replace(/gl_Fog.color/g, "u_fogColor");
                }
                if (source.includes("gl_Fog.end")) {
                    source = "uniform float u_fogEnd;   \n" + source.replace(/gl_Fog.end/g, "u_fogEnd");
                }
                if (source.includes("gl_Fog.scale")) {
                    source = "uniform float u_fogScale;   \n" + source.replace(/gl_Fog.scale/g, "u_fogScale");
                }
                if (source.includes("gl_Fog.density")) {
                    source = "uniform float u_fogDensity;   \n" + source.replace(/gl_Fog.density/g, "u_fogDensity");
                }
                if (source.includes("gl_FogFragCoord")) {
                    source = "varying float v_fogFragCoord;   \n" + source.replace(/gl_FogFragCoord/g, "v_fogFragCoord");
                }
                source = ensurePrecision(source);
            } GLctx.shaderSource(GL.shaders[shader], source); }; _glCompileShader = _emscripten_glCompileShader = shader => { GLctx.compileShader(GL.shaders[shader]); }; GL.programShaders = {}; var orig_glAttachShader = _glAttachShader; _glAttachShader = _emscripten_glAttachShader = (program, shader) => { GL.programShaders[program] ||= []; GL.programShaders[program].push(shader); orig_glAttachShader(program, shader); }; var orig_glDetachShader = _glDetachShader; _glDetachShader = _emscripten_glDetachShader = (program, shader) => { var programShader = GL.programShaders[program]; if (!programShader) {
                err(`WARNING: _glDetachShader received invalid program: ${program}`);
                return;
            } var index = programShader.indexOf(shader); programShader.splice(index, 1); orig_glDetachShader(program, shader); }; var orig_glUseProgram = _glUseProgram; _glUseProgram = _emscripten_glUseProgram = program => { if (GL.currProgram != program) {
                GLImmediate.currentRenderer = null;
                GL.currProgram = program;
                GLImmediate.fixedFunctionProgram = 0;
                orig_glUseProgram(program);
            } }; var orig_glDeleteProgram = _glDeleteProgram; _glDeleteProgram = _emscripten_glDeleteProgram = program => { orig_glDeleteProgram(program); if (program == GL.currProgram) {
                GLImmediate.currentRenderer = null;
                GL.currProgram = 0;
            } }; var zeroUsedPrograms = {}; var orig_glBindAttribLocation = _glBindAttribLocation; _glBindAttribLocation = _emscripten_glBindAttribLocation = (program, index, name) => { if (index == 0)
                zeroUsedPrograms[program] = true; orig_glBindAttribLocation(program, index, name); }; var orig_glLinkProgram = _glLinkProgram; _glLinkProgram = _emscripten_glLinkProgram = program => { if (!(program in zeroUsedPrograms)) {
                GLctx.bindAttribLocation(GL.programs[program], 0, "a_position");
            } orig_glLinkProgram(program); }; var orig_glBindBuffer = _glBindBuffer; _glBindBuffer = _emscripten_glBindBuffer = (target, buffer) => { orig_glBindBuffer(target, buffer); if (target == GLctx.ARRAY_BUFFER) {
                if (GLEmulation.currentVao) {
                    GLEmulation.currentVao.arrayBuffer = buffer;
                }
            }
            else if (target == GLctx.ELEMENT_ARRAY_BUFFER) {
                if (GLEmulation.currentVao)
                    GLEmulation.currentVao.elementArrayBuffer = buffer;
            } }; var orig_glGetFloatv = _glGetFloatv; _glGetFloatv = _emscripten_glGetFloatv = (pname, params) => { if (pname == 2982) {
                HEAPF32.set(GLImmediate.matrix[0], params >> 2);
            }
            else if (pname == 2983) {
                HEAPF32.set(GLImmediate.matrix[1], params >> 2);
            }
            else if (pname == 2984) {
                HEAPF32.set(GLImmediate.matrix[2 + GLImmediate.clientActiveTexture], params >> 2);
            }
            else if (pname == 2918) {
                HEAPF32.set(GLEmulation.fogColor, params >> 2);
            }
            else if (pname == 2915) {
                HEAPF32[params >> 2] = GLEmulation.fogStart;
            }
            else if (pname == 2916) {
                HEAPF32[params >> 2] = GLEmulation.fogEnd;
            }
            else if (pname == 2914) {
                HEAPF32[params >> 2] = GLEmulation.fogDensity;
            }
            else if (pname == 2917) {
                HEAPF32[params >> 2] = GLEmulation.fogMode;
            }
            else if (pname == 2899) {
                HEAPF32[params >> 2] = GLEmulation.lightModelAmbient[0];
                HEAPF32[params + 4 >> 2] = GLEmulation.lightModelAmbient[1];
                HEAPF32[params + 8 >> 2] = GLEmulation.lightModelAmbient[2];
                HEAPF32[params + 12 >> 2] = GLEmulation.lightModelAmbient[3];
            }
            else if (pname == 3010) {
                HEAPF32[params >> 2] = GLEmulation.alphaTestRef;
            }
            else {
                orig_glGetFloatv(pname, params);
            } }; var orig_glHint = _glHint; _glHint = _emscripten_glHint = (target, mode) => { if (target == 34031) {
                return;
            } orig_glHint(target, mode); }; var orig_glEnableVertexAttribArray = _glEnableVertexAttribArray; _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray = index => { orig_glEnableVertexAttribArray(index); GLEmulation.enabledVertexAttribArrays[index] = 1; if (GLEmulation.currentVao)
                GLEmulation.currentVao.enabledVertexAttribArrays[index] = 1; }; var orig_glDisableVertexAttribArray = _glDisableVertexAttribArray; _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray = index => { orig_glDisableVertexAttribArray(index); delete GLEmulation.enabledVertexAttribArrays[index]; if (GLEmulation.currentVao)
                delete GLEmulation.currentVao.enabledVertexAttribArrays[index]; }; var orig_glVertexAttribPointer = _glVertexAttribPointer; _glVertexAttribPointer = _emscripten_glVertexAttribPointer = (index, size, type, normalized, stride, pointer) => { orig_glVertexAttribPointer(index, size, type, normalized, stride, pointer); if (GLEmulation.currentVao) {
                GLEmulation.currentVao.vertexAttribPointers[index] = [index, size, type, normalized, stride, pointer];
            } }; }, getAttributeFromCapability(cap) { var attrib = null; switch (cap) {
                case 3553:
                case 32888:
                    attrib = GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture;
                    break;
                case 32884:
                    attrib = GLImmediate.VERTEX;
                    break;
                case 32885:
                    attrib = GLImmediate.NORMAL;
                    break;
                case 32886:
                    attrib = GLImmediate.COLOR;
                    break;
            } return attrib; } };
        var getCFunc = ident => { var func = Module["_" + ident]; return func; };
        var writeArrayToMemory = (array, buffer) => { HEAP8.set(array, buffer); };
        var stackAlloc = sz => __emscripten_stack_alloc(sz);
        var stringToUTF8OnStack = str => { var size = lengthBytesUTF8(str) + 1; var ret = stackAlloc(size); stringToUTF8(str, ret, size); return ret; };
        var ccall = (ident, returnType, argTypes, args, opts) => { var toC = { string: str => { var ret = 0; if (str !== null && str !== undefined && str !== 0) {
                ret = stringToUTF8OnStack(str);
            } return ret; }, array: arr => { var ret = stackAlloc(arr.length); writeArrayToMemory(arr, ret); return ret; } }; function convertReturnValue(ret) { if (returnType === "string") {
            return UTF8ToString(ret);
        } if (returnType === "boolean")
            return Boolean(ret); return ret; } var func = getCFunc(ident); var cArgs = []; var stack = 0; if (args) {
            for (var i = 0; i < args.length; i++) {
                var converter = toC[argTypes[i]];
                if (converter) {
                    if (stack === 0)
                        stack = stackSave();
                    cArgs[i] = converter(args[i]);
                }
                else {
                    cArgs[i] = args[i];
                }
            }
        } var ret = func(...cArgs); function onDone(ret) { if (stack !== 0)
            stackRestore(stack); return convertReturnValue(ret); } ret = onDone(ret); return ret; };
        var cwrap = (ident, returnType, argTypes, opts) => { var numericArgs = !argTypes || argTypes.every(type => type === "number" || type === "boolean"); var numericRet = returnType !== "string"; if (numericRet && numericArgs && !opts) {
            return getCFunc(ident);
        } return (...args) => ccall(ident, returnType, argTypes, args, opts); };
        var uleb128Encode = (n, target) => { if (n < 128) {
            target.push(n);
        }
        else {
            target.push(n % 128 | 128, n >> 7);
        } };
        var sigToWasmTypes = sig => { var typeNames = { i: "i32", j: "i64", f: "f32", d: "f64", e: "externref", p: "i32" }; var type = { parameters: [], results: sig[0] == "v" ? [] : [typeNames[sig[0]]] }; for (var i = 1; i < sig.length; ++i) {
            type.parameters.push(typeNames[sig[i]]);
        } return type; };
        var generateFuncType = (sig, target) => { var sigRet = sig.slice(0, 1); var sigParam = sig.slice(1); var typeCodes = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }; target.push(96); uleb128Encode(sigParam.length, target); for (var i = 0; i < sigParam.length; ++i) {
            target.push(typeCodes[sigParam[i]]);
        } if (sigRet == "v") {
            target.push(0);
        }
        else {
            target.push(1, typeCodes[sigRet]);
        } };
        var convertJsFunctionToWasm = (func, sig) => { if (typeof WebAssembly.Function == "function") {
            return new WebAssembly.Function(sigToWasmTypes(sig), func);
        } var typeSectionBody = [1]; generateFuncType(sig, typeSectionBody); var bytes = [0, 97, 115, 109, 1, 0, 0, 0, 1]; uleb128Encode(typeSectionBody.length, bytes); bytes.push(...typeSectionBody); bytes.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0); var module = new WebAssembly.Module(new Uint8Array(bytes)); var instance = new WebAssembly.Instance(module, { e: { f: func } }); var wrappedFunc = instance.exports["f"]; return wrappedFunc; };
        var updateTableMap = (offset, count) => { if (functionsInTableMap) {
            for (var i = offset; i < offset + count; i++) {
                var item = getWasmTableEntry(i);
                if (item) {
                    functionsInTableMap.set(item, i);
                }
            }
        } };
        var functionsInTableMap;
        var getFunctionAddress = func => { if (!functionsInTableMap) {
            functionsInTableMap = new WeakMap;
            updateTableMap(0, wasmTable.length);
        } return functionsInTableMap.get(func) || 0; };
        var freeTableIndexes = [];
        var getEmptyTableSlot = () => { if (freeTableIndexes.length) {
            return freeTableIndexes.pop();
        } try {
            wasmTable.grow(1);
        }
        catch (err) {
            if (!(err instanceof RangeError)) {
                throw err;
            }
            throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
        } return wasmTable.length - 1; };
        var setWasmTableEntry = (idx, func) => { wasmTable.set(idx, func); wasmTableMirror[idx] = wasmTable.get(idx); };
        var addFunction = (func, sig) => { var rtn = getFunctionAddress(func); if (rtn) {
            return rtn;
        } var ret = getEmptyTableSlot(); try {
            setWasmTableEntry(ret, func);
        }
        catch (err) {
            if (!(err instanceof TypeError)) {
                throw err;
            }
            var wrapped = convertJsFunctionToWasm(func, sig);
            setWasmTableEntry(ret, wrapped);
        } functionsInTableMap.set(func, ret); return ret; };
        var removeFunction = index => { functionsInTableMap.delete(getWasmTableEntry(index)); setWasmTableEntry(index, null); freeTableIndexes.push(index); };
        var FS_createPath = FS.createPath;
        var FS_unlink = path => FS.unlink(path);
        var FS_createLazyFile = FS.createLazyFile;
        var FS_createDevice = FS.createDevice;
        var _emscripten_glGetString = _glGetString;
        Module["_emscripten_glGetString"] = _emscripten_glGetString;
        var _emscripten_glGetIntegerv = _glGetIntegerv;
        Module["_emscripten_glGetIntegerv"] = _emscripten_glGetIntegerv;
        var _emscripten_glGetFloatv = _glGetFloatv;
        Module["_emscripten_glGetFloatv"] = _emscripten_glGetFloatv;
        var _emscripten_glGetBooleanv = _glGetBooleanv;
        Module["_emscripten_glGetBooleanv"] = _emscripten_glGetBooleanv;
        var _emscripten_glBindBuffer = _glBindBuffer;
        Module["_emscripten_glBindBuffer"] = _emscripten_glBindBuffer;
        var _emscripten_glCreateShader = _glCreateShader;
        Module["_emscripten_glCreateShader"] = _emscripten_glCreateShader;
        var _emscripten_glShaderSource = _glShaderSource;
        Module["_emscripten_glShaderSource"] = _emscripten_glShaderSource;
        var _emscripten_glCompileShader = _glCompileShader;
        Module["_emscripten_glCompileShader"] = _emscripten_glCompileShader;
        var _emscripten_glDeleteProgram = _glDeleteProgram;
        Module["_emscripten_glDeleteProgram"] = _emscripten_glDeleteProgram;
        var _emscripten_glAttachShader = _glAttachShader;
        Module["_emscripten_glAttachShader"] = _emscripten_glAttachShader;
        var _emscripten_glDetachShader = _glDetachShader;
        Module["_emscripten_glDetachShader"] = _emscripten_glDetachShader;
        var _emscripten_glLinkProgram = _glLinkProgram;
        Module["_emscripten_glLinkProgram"] = _emscripten_glLinkProgram;
        var _emscripten_glUseProgram = _glUseProgram;
        Module["_emscripten_glUseProgram"] = _emscripten_glUseProgram;
        var _emscripten_glBindAttribLocation = _glBindAttribLocation;
        Module["_emscripten_glBindAttribLocation"] = _emscripten_glBindAttribLocation;
        var _emscripten_glVertexAttribPointer = _glVertexAttribPointer;
        Module["_emscripten_glVertexAttribPointer"] = _emscripten_glVertexAttribPointer;
        var _emscripten_glEnableVertexAttribArray = _glEnableVertexAttribArray;
        Module["_emscripten_glEnableVertexAttribArray"] = _emscripten_glEnableVertexAttribArray;
        var _emscripten_glDisableVertexAttribArray = _glDisableVertexAttribArray;
        Module["_emscripten_glDisableVertexAttribArray"] = _emscripten_glDisableVertexAttribArray;
        var _emscripten_glEnable = _glEnable;
        Module["_emscripten_glEnable"] = _emscripten_glEnable;
        var _emscripten_glDisable = _glDisable;
        Module["_emscripten_glDisable"] = _emscripten_glDisable;
        var _emscripten_glActiveTexture = _glActiveTexture;
        Module["_emscripten_glActiveTexture"] = _emscripten_glActiveTexture;
        var _emscripten_glIsEnabled = _glIsEnabled;
        Module["_emscripten_glIsEnabled"] = _emscripten_glIsEnabled;
        var _emscripten_glHint = _glHint;
        Module["_emscripten_glHint"] = _emscripten_glHint;
        var _glTexEnvi = (target, pname, params) => warnOnce("glTexEnvi: TODO");
        Module["_glTexEnvi"] = _glTexEnvi;
        var _glTexEnvf = (target, pname, params) => warnOnce("glTexEnvf: TODO");
        Module["_glTexEnvf"] = _glTexEnvf;
        var _glTexEnvfv = (target, pname, params) => warnOnce("glTexEnvfv: TODO");
        Module["_glTexEnvfv"] = _glTexEnvfv;
        var _glGetTexEnviv = (target, pname, param) => { throw "GL emulation not initialized!"; };
        Module["_glGetTexEnviv"] = _glGetTexEnviv;
        var _glGetTexEnvfv = (target, pname, param) => { throw "GL emulation not initialized!"; };
        Module["_glGetTexEnvfv"] = _glGetTexEnvfv;
        var _emscripten_glTexEnvi = _glTexEnvi;
        Module["_emscripten_glTexEnvi"] = _emscripten_glTexEnvi;
        var _emscripten_glTexEnvf = _glTexEnvf;
        Module["_emscripten_glTexEnvf"] = _emscripten_glTexEnvf;
        var _emscripten_glTexEnvfv = _glTexEnvfv;
        Module["_emscripten_glTexEnvfv"] = _emscripten_glTexEnvfv;
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        Module["FS_createPath"] = FS.createPath;
        Module["FS_createDataFile"] = FS.createDataFile;
        Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module["FS_unlink"] = FS.unlink;
        Module["FS_createLazyFile"] = FS.createLazyFile;
        Module["FS_createDevice"] = FS.createDevice;
        embind_init_charCodes();
        BindingError = Module["BindingError"] = class BindingError extends Error {
            constructor(message) { super(message); this.name = "BindingError"; }
        };
        InternalError = Module["InternalError"] = class InternalError extends Error {
            constructor(message) { super(message); this.name = "InternalError"; }
        };
        init_emval();
        GLEmulation.init();
        GLImmediate.setupFuncs();
        Browser.moduleContextCreatedCallbacks.push(() => GLImmediate.init());
        Module["requestFullscreen"] = Browser.requestFullscreen;
        Module["setCanvasSize"] = Browser.setCanvasSize;
        Module["getUserMedia"] = Browser.getUserMedia;
        Module["createContext"] = Browser.createContext;
        var preloadedImages = {};
        var preloadedAudios = {};
        registerPreMainLoop(() => GL.newRenderingFrameStarted());
        var wasmImports = { b: ___assert_fail, Z: ___call_sighandler, a: ___cxa_throw, Q: ___syscall_connect, ja: ___syscall_dup, ga: ___syscall_dup3, ka: ___syscall_faccessat, l: ___syscall_fcntl64, fa: ___syscall_getcwd, Y: ___syscall_getdents64, na: ___syscall_ioctl, ba: ___syscall_mkdirat, B: ___syscall_openat, X: ___syscall_readlinkat, P: ___syscall_recvfrom, U: ___syscall_renameat, V: ___syscall_rmdir, O: ___syscall_sendto, A: ___syscall_socket, aa: ___syscall_stat64, W: ___syscall_unlinkat, la: __abort_js, G: __embind_register_bigint, M: __embind_register_bool, L: __embind_register_emval, z: __embind_register_float, f: __embind_register_integer, c: __embind_register_memory_view, y: __embind_register_std_string, v: __embind_register_std_wstring, N: __embind_register_void, oa: __emscripten_fs_load_embedded_files, ha: __emscripten_get_now_is_monotonic, ia: __emscripten_memcpy_js, $: __emscripten_runtime_keepalive_clear, T: __emscripten_system, R: __emscripten_throw_longjmp, J: __localtime_js, H: __mmap_js, I: __munmap_js, ma: __tzset_js, q: _emscripten_date_now, S: _emscripten_resize_heap, da: _environ_get, ea: _environ_sizes_get, i: _exit, r: _fd_close, ca: _fd_fdstat_get, D: _fd_read, K: _fd_seek, C: _fd_write, t: _getaddrinfo, p: invoke_ii, k: invoke_iii, j: invoke_iiii, g: invoke_iiiii, pa: invoke_iiiiii, E: invoke_v, d: invoke_vi, e: invoke_vii, u: invoke_viii, h: invoke_viiii, n: invoke_viiiii, sa: _js_cellarray, x: _js_circle, xa: _js_clear, s: _js_clip_path, ra: _js_draw_path, qa: _js_fill_routine, za: _js_get_ws_height, ya: _js_get_ws_width, ua: _js_line, o: _js_line_routine, ta: _js_pattern_routine, va: _js_point, F: _js_reset_clipping, wa: _js_stroke, w: _js_text, _: _proc_exit, m: _toBsonWrite };
        var wasmExports = createWasm();
        var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["Ba"])();
        var _free = Module["_free"] = a0 => (_free = Module["_free"] = wasmExports["Ca"])(a0);
        var _grm_args_delete = Module["_grm_args_delete"] = a0 => (_grm_args_delete = Module["_grm_args_delete"] = wasmExports["Da"])(a0);
        var _malloc = Module["_malloc"] = a0 => (_malloc = Module["_malloc"] = wasmExports["Ea"])(a0);
        var _realloc = Module["_realloc"] = (a0, a1) => (_realloc = Module["_realloc"] = wasmExports["Ga"])(a0, a1);
        var _grm_args_new = Module["_grm_args_new"] = () => (_grm_args_new = Module["_grm_args_new"] = wasmExports["Ha"])();
        var _grm_args_push = Module["_grm_args_push"] = (a0, a1, a2, a3) => (_grm_args_push = Module["_grm_args_push"] = wasmExports["Ia"])(a0, a1, a2, a3);
        var _grm_dump = Module["_grm_dump"] = (a0, a1) => (_grm_dump = Module["_grm_dump"] = wasmExports["Ja"])(a0, a1);
        var _grm_dump_json = Module["_grm_dump_json"] = (a0, a1) => (_grm_dump_json = Module["_grm_dump_json"] = wasmExports["Ka"])(a0, a1);
        var _grm_dump_json_str = Module["_grm_dump_json_str"] = () => (_grm_dump_json_str = Module["_grm_dump_json_str"] = wasmExports["La"])();
        var _grm_register = Module["_grm_register"] = (a0, a1) => (_grm_register = Module["_grm_register"] = wasmExports["Ma"])(a0, a1);
        var _grm_unregister = Module["_grm_unregister"] = a0 => (_grm_unregister = Module["_grm_unregister"] = wasmExports["Na"])(a0);
        var _gr_savestate = Module["_gr_savestate"] = () => (_gr_savestate = Module["_gr_savestate"] = wasmExports["Oa"])();
        var _gr_setviewport = Module["_gr_setviewport"] = (a0, a1, a2, a3) => (_gr_setviewport = Module["_gr_setviewport"] = wasmExports["Pa"])(a0, a1, a2, a3);
        var _gr_setwindow = Module["_gr_setwindow"] = (a0, a1, a2, a3) => (_gr_setwindow = Module["_gr_setwindow"] = wasmExports["Qa"])(a0, a1, a2, a3);
        var _gr_setscale = Module["_gr_setscale"] = a0 => (_gr_setscale = Module["_gr_setscale"] = wasmExports["Ra"])(a0);
        var _gr_wctondc = Module["_gr_wctondc"] = (a0, a1) => (_gr_wctondc = Module["_gr_wctondc"] = wasmExports["Sa"])(a0, a1);
        var _gr_restorestate = Module["_gr_restorestate"] = () => (_gr_restorestate = Module["_gr_restorestate"] = wasmExports["Ta"])();
        var _gr_ndctowc = Module["_gr_ndctowc"] = (a0, a1) => (_gr_ndctowc = Module["_gr_ndctowc"] = wasmExports["Ua"])(a0, a1);
        var _grm_input = Module["_grm_input"] = a0 => (_grm_input = Module["_grm_input"] = wasmExports["Va"])(a0);
        var _grm_is3d = Module["_grm_is3d"] = (a0, a1) => (_grm_is3d = Module["_grm_is3d"] = wasmExports["Wa"])(a0, a1);
        var _grm_get_box = Module["_grm_get_box"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_grm_get_box = Module["_grm_get_box"] = wasmExports["Xa"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);
        var _grm_get_tooltip = Module["_grm_get_tooltip"] = (a0, a1) => (_grm_get_tooltip = Module["_grm_get_tooltip"] = wasmExports["Ya"])(a0, a1);
        var _grm_read = Module["_grm_read"] = (a0, a1) => (_grm_read = Module["_grm_read"] = wasmExports["Za"])(a0, a1);
        var _grm_load_from_str = Module["_grm_load_from_str"] = a0 => (_grm_load_from_str = Module["_grm_load_from_str"] = wasmExports["_a"])(a0);
        var _grm_merge = Module["_grm_merge"] = a0 => (_grm_merge = Module["_grm_merge"] = wasmExports["$a"])(a0);
        var _grm_merge_named = Module["_grm_merge_named"] = (a0, a1) => (_grm_merge_named = Module["_grm_merge_named"] = wasmExports["ab"])(a0, a1);
        var _grm_plot = Module["_grm_plot"] = a0 => (_grm_plot = Module["_grm_plot"] = wasmExports["bb"])(a0);
        var _gr_beginprint = Module["_gr_beginprint"] = a0 => (_gr_beginprint = Module["_gr_beginprint"] = wasmExports["cb"])(a0);
        var _gr_endprint = Module["_gr_endprint"] = () => (_gr_endprint = Module["_gr_endprint"] = wasmExports["db"])();
        var _grm_switch = Module["_grm_switch"] = a0 => (_grm_switch = Module["_grm_switch"] = wasmExports["eb"])(a0);
        var _grm_get_stdout = Module["_grm_get_stdout"] = () => (_grm_get_stdout = Module["_grm_get_stdout"] = wasmExports["fb"])();
        var _gr_selectcontext = Module["_gr_selectcontext"] = a0 => (_gr_selectcontext = Module["_gr_selectcontext"] = wasmExports["gb"])(a0);
        var _gr_inqcolor = Module["_gr_inqcolor"] = (a0, a1) => (_gr_inqcolor = Module["_gr_inqcolor"] = wasmExports["hb"])(a0, a1);
        var _gr_setcolorrep = Module["_gr_setcolorrep"] = (a0, a1, a2, a3) => (_gr_setcolorrep = Module["_gr_setcolorrep"] = wasmExports["ib"])(a0, a1, a2, a3);
        var _gr_destroycontext = Module["_gr_destroycontext"] = a0 => (_gr_destroycontext = Module["_gr_destroycontext"] = wasmExports["jb"])(a0);
        var _gr_setcolormap = Module["_gr_setcolormap"] = a0 => (_gr_setcolormap = Module["_gr_setcolormap"] = wasmExports["kb"])(a0);
        var _gr_inqscale = Module["_gr_inqscale"] = a0 => (_gr_inqscale = Module["_gr_inqscale"] = wasmExports["lb"])(a0);
        var _gr_panzoom = Module["_gr_panzoom"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_gr_panzoom = Module["_gr_panzoom"] = wasmExports["mb"])(a0, a1, a2, a3, a4, a5, a6, a7);
        var _gr_setscientificformat = Module["_gr_setscientificformat"] = a0 => (_gr_setscientificformat = Module["_gr_setscientificformat"] = wasmExports["nb"])(a0);
        var _gr_setclip = Module["_gr_setclip"] = a0 => (_gr_setclip = Module["_gr_setclip"] = wasmExports["ob"])(a0);
        var _gr_inqtext = Module["_gr_inqtext"] = (a0, a1, a2, a3, a4) => (_gr_inqtext = Module["_gr_inqtext"] = wasmExports["pb"])(a0, a1, a2, a3, a4);
        var _gr_setcharheight = Module["_gr_setcharheight"] = a0 => (_gr_setcharheight = Module["_gr_setcharheight"] = wasmExports["qb"])(a0);
        var _gr_settransparency = Module["_gr_settransparency"] = a0 => (_gr_settransparency = Module["_gr_settransparency"] = wasmExports["rb"])(a0);
        var _gr_selntran = Module["_gr_selntran"] = a0 => (_gr_selntran = Module["_gr_selntran"] = wasmExports["sb"])(a0);
        var _gr_setfillintstyle = Module["_gr_setfillintstyle"] = a0 => (_gr_setfillintstyle = Module["_gr_setfillintstyle"] = wasmExports["tb"])(a0);
        var _gr_setfillcolorind = Module["_gr_setfillcolorind"] = a0 => (_gr_setfillcolorind = Module["_gr_setfillcolorind"] = wasmExports["ub"])(a0);
        var _gr_fillrect = Module["_gr_fillrect"] = (a0, a1, a2, a3) => (_gr_fillrect = Module["_gr_fillrect"] = wasmExports["vb"])(a0, a1, a2, a3);
        var _gr_setbordercolorind = Module["_gr_setbordercolorind"] = a0 => (_gr_setbordercolorind = Module["_gr_setbordercolorind"] = wasmExports["wb"])(a0);
        var _gr_setcharexpan = Module["_gr_setcharexpan"] = a0 => (_gr_setcharexpan = Module["_gr_setcharexpan"] = wasmExports["xb"])(a0);
        var _gr_setcharspace = Module["_gr_setcharspace"] = a0 => (_gr_setcharspace = Module["_gr_setcharspace"] = wasmExports["yb"])(a0);
        var _gr_setcharup = Module["_gr_setcharup"] = (a0, a1) => (_gr_setcharup = Module["_gr_setcharup"] = wasmExports["zb"])(a0, a1);
        var _gr_selectclipxform = Module["_gr_selectclipxform"] = a0 => (_gr_selectclipxform = Module["_gr_selectclipxform"] = wasmExports["Ab"])(a0);
        var _gr_setfillstyle = Module["_gr_setfillstyle"] = a0 => (_gr_setfillstyle = Module["_gr_setfillstyle"] = wasmExports["Bb"])(a0);
        var _gr_settextfontprec = Module["_gr_settextfontprec"] = (a0, a1) => (_gr_settextfontprec = Module["_gr_settextfontprec"] = wasmExports["Cb"])(a0, a1);
        var _gr_setlinecolorind = Module["_gr_setlinecolorind"] = a0 => (_gr_setlinecolorind = Module["_gr_setlinecolorind"] = wasmExports["Db"])(a0);
        var _gr_uselinespec = Module["_gr_uselinespec"] = a0 => (_gr_uselinespec = Module["_gr_uselinespec"] = wasmExports["Eb"])(a0);
        var _gr_setlinetype = Module["_gr_setlinetype"] = a0 => (_gr_setlinetype = Module["_gr_setlinetype"] = wasmExports["Fb"])(a0);
        var _gr_setlinewidth = Module["_gr_setlinewidth"] = a0 => (_gr_setlinewidth = Module["_gr_setlinewidth"] = wasmExports["Gb"])(a0);
        var _gr_setmarkercolorind = Module["_gr_setmarkercolorind"] = a0 => (_gr_setmarkercolorind = Module["_gr_setmarkercolorind"] = wasmExports["Hb"])(a0);
        var _gr_setmarkersize = Module["_gr_setmarkersize"] = a0 => (_gr_setmarkersize = Module["_gr_setmarkersize"] = wasmExports["Ib"])(a0);
        var _gr_setmarkertype = Module["_gr_setmarkertype"] = a0 => (_gr_setmarkertype = Module["_gr_setmarkertype"] = wasmExports["Jb"])(a0);
        var _gr_setspace = Module["_gr_setspace"] = (a0, a1, a2, a3) => (_gr_setspace = Module["_gr_setspace"] = wasmExports["Kb"])(a0, a1, a2, a3);
        var _gr_settextalign = Module["_gr_settextalign"] = (a0, a1) => (_gr_settextalign = Module["_gr_settextalign"] = wasmExports["Lb"])(a0, a1);
        var _gr_settextcolorind = Module["_gr_settextcolorind"] = a0 => (_gr_settextcolorind = Module["_gr_settextcolorind"] = wasmExports["Mb"])(a0);
        var _gr_settextencoding = Module["_gr_settextencoding"] = a0 => (_gr_settextencoding = Module["_gr_settextencoding"] = wasmExports["Nb"])(a0);
        var _gr_setwsviewport = Module["_gr_setwsviewport"] = (a0, a1, a2, a3) => (_gr_setwsviewport = Module["_gr_setwsviewport"] = wasmExports["Ob"])(a0, a1, a2, a3);
        var _gr_setwswindow = Module["_gr_setwswindow"] = (a0, a1, a2, a3) => (_gr_setwswindow = Module["_gr_setwswindow"] = wasmExports["Pb"])(a0, a1, a2, a3);
        var _gr_clearws = Module["_gr_clearws"] = () => (_gr_clearws = Module["_gr_clearws"] = wasmExports["Qb"])();
        var _gr_updatews = Module["_gr_updatews"] = () => (_gr_updatews = Module["_gr_updatews"] = wasmExports["Rb"])();
        var _gr_inqviewport = Module["_gr_inqviewport"] = (a0, a1, a2, a3) => (_gr_inqviewport = Module["_gr_inqviewport"] = wasmExports["Sb"])(a0, a1, a2, a3);
        var _gr_inqwindow = Module["_gr_inqwindow"] = (a0, a1, a2, a3) => (_gr_inqwindow = Module["_gr_inqwindow"] = wasmExports["Tb"])(a0, a1, a2, a3);
        var _gr_cellarray = Module["_gr_cellarray"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) => (_gr_cellarray = Module["_gr_cellarray"] = wasmExports["Ub"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
        var _gr_axes3d = Module["_gr_axes3d"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (_gr_axes3d = Module["_gr_axes3d"] = wasmExports["Vb"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
        var _gr_inqlinecolorind = Module["_gr_inqlinecolorind"] = a0 => (_gr_inqlinecolorind = Module["_gr_inqlinecolorind"] = wasmExports["Wb"])(a0);
        var _gr_drawarc = Module["_gr_drawarc"] = (a0, a1, a2, a3, a4, a5) => (_gr_drawarc = Module["_gr_drawarc"] = wasmExports["Xb"])(a0, a1, a2, a3, a4, a5);
        var _gr_drawgraphics = Module["_gr_drawgraphics"] = a0 => (_gr_drawgraphics = Module["_gr_drawgraphics"] = wasmExports["Yb"])(a0);
        var _gr_drawimage = Module["_gr_drawimage"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_gr_drawimage = Module["_gr_drawimage"] = wasmExports["Zb"])(a0, a1, a2, a3, a4, a5, a6, a7);
        var _gr_drawrect = Module["_gr_drawrect"] = (a0, a1, a2, a3) => (_gr_drawrect = Module["_gr_drawrect"] = wasmExports["_b"])(a0, a1, a2, a3);
        var _gr_fillarc = Module["_gr_fillarc"] = (a0, a1, a2, a3, a4, a5) => (_gr_fillarc = Module["_gr_fillarc"] = wasmExports["$b"])(a0, a1, a2, a3, a4, a5);
        var _gr_fillarea = Module["_gr_fillarea"] = (a0, a1, a2) => (_gr_fillarea = Module["_gr_fillarea"] = wasmExports["ac"])(a0, a1, a2);
        var _gr_polyline = Module["_gr_polyline"] = (a0, a1, a2) => (_gr_polyline = Module["_gr_polyline"] = wasmExports["bc"])(a0, a1, a2);
        var _gr_polyline3d = Module["_gr_polyline3d"] = (a0, a1, a2, a3) => (_gr_polyline3d = Module["_gr_polyline3d"] = wasmExports["cc"])(a0, a1, a2, a3);
        var _gr_polymarker = Module["_gr_polymarker"] = (a0, a1, a2) => (_gr_polymarker = Module["_gr_polymarker"] = wasmExports["dc"])(a0, a1, a2);
        var _gr_textext = Module["_gr_textext"] = (a0, a1, a2) => (_gr_textext = Module["_gr_textext"] = wasmExports["ec"])(a0, a1, a2);
        var _gr_mathtex = Module["_gr_mathtex"] = (a0, a1, a2) => (_gr_mathtex = Module["_gr_mathtex"] = wasmExports["fc"])(a0, a1, a2);
        var _gr_text = Module["_gr_text"] = (a0, a1, a2) => (_gr_text = Module["_gr_text"] = wasmExports["gc"])(a0, a1, a2);
        var _gr_titles3d = Module["_gr_titles3d"] = (a0, a1, a2) => (_gr_titles3d = Module["_gr_titles3d"] = wasmExports["hc"])(a0, a1, a2);
        var _gr_inqmarkercolorind = Module["_gr_inqmarkercolorind"] = a0 => (_gr_inqmarkercolorind = Module["_gr_inqmarkercolorind"] = wasmExports["ic"])(a0);
        var _gr_gridit = Module["_gr_gridit"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_gr_gridit = Module["_gr_gridit"] = wasmExports["jc"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);
        var _gr_contour = Module["_gr_contour"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_gr_contour = Module["_gr_contour"] = wasmExports["kc"])(a0, a1, a2, a3, a4, a5, a6, a7);
        var _gr_shadepoints = Module["_gr_shadepoints"] = (a0, a1, a2, a3, a4, a5) => (_gr_shadepoints = Module["_gr_shadepoints"] = wasmExports["lc"])(a0, a1, a2, a3, a4, a5);
        var _gr_surface = Module["_gr_surface"] = (a0, a1, a2, a3, a4, a5) => (_gr_surface = Module["_gr_surface"] = wasmExports["mc"])(a0, a1, a2, a3, a4, a5);
        var _gr_hexbin = Module["_gr_hexbin"] = (a0, a1, a2, a3) => (_gr_hexbin = Module["_gr_hexbin"] = wasmExports["nc"])(a0, a1, a2, a3);
        var _gr_inqspace = Module["_gr_inqspace"] = (a0, a1, a2, a3) => (_gr_inqspace = Module["_gr_inqspace"] = wasmExports["oc"])(a0, a1, a2, a3);
        var _gr_adjustrange = Module["_gr_adjustrange"] = (a0, a1) => (_gr_adjustrange = Module["_gr_adjustrange"] = wasmExports["pc"])(a0, a1);
        var _gr_tick = Module["_gr_tick"] = (a0, a1) => (_gr_tick = Module["_gr_tick"] = wasmExports["qc"])(a0, a1);
        var _gr_opengks = Module["_gr_opengks"] = () => (_gr_opengks = Module["_gr_opengks"] = wasmExports["rc"])();
        var _gr_closegks = Module["_gr_closegks"] = () => (_gr_closegks = Module["_gr_closegks"] = wasmExports["sc"])();
        var _gr_inqdspsize = Module["_gr_inqdspsize"] = (a0, a1, a2, a3) => (_gr_inqdspsize = Module["_gr_inqdspsize"] = wasmExports["tc"])(a0, a1, a2, a3);
        var _gr_openws = Module["_gr_openws"] = (a0, a1, a2) => (_gr_openws = Module["_gr_openws"] = wasmExports["uc"])(a0, a1, a2);
        var _gr_closews = Module["_gr_closews"] = a0 => (_gr_closews = Module["_gr_closews"] = wasmExports["vc"])(a0);
        var _gr_activatews = Module["_gr_activatews"] = a0 => (_gr_activatews = Module["_gr_activatews"] = wasmExports["wc"])(a0);
        var _gr_deactivatews = Module["_gr_deactivatews"] = a0 => (_gr_deactivatews = Module["_gr_deactivatews"] = wasmExports["xc"])(a0);
        var _gr_spline = Module["_gr_spline"] = (a0, a1, a2, a3, a4) => (_gr_spline = Module["_gr_spline"] = wasmExports["yc"])(a0, a1, a2, a3, a4);
        var _gr_inqlinetype = Module["_gr_inqlinetype"] = a0 => (_gr_inqlinetype = Module["_gr_inqlinetype"] = wasmExports["zc"])(a0);
        var _gr_inqlinewidth = Module["_gr_inqlinewidth"] = a0 => (_gr_inqlinewidth = Module["_gr_inqlinewidth"] = wasmExports["Ac"])(a0);
        var _gr_inqmarkertype = Module["_gr_inqmarkertype"] = a0 => (_gr_inqmarkertype = Module["_gr_inqmarkertype"] = wasmExports["Bc"])(a0);
        var _gr_settextpath = Module["_gr_settextpath"] = a0 => (_gr_settextpath = Module["_gr_settextpath"] = wasmExports["Cc"])(a0);
        var _gr_createseg = Module["_gr_createseg"] = a0 => (_gr_createseg = Module["_gr_createseg"] = wasmExports["Dc"])(a0);
        var _gr_copysegws = Module["_gr_copysegws"] = a0 => (_gr_copysegws = Module["_gr_copysegws"] = wasmExports["Ec"])(a0);
        var _gr_redrawsegws = Module["_gr_redrawsegws"] = () => (_gr_redrawsegws = Module["_gr_redrawsegws"] = wasmExports["Fc"])();
        var _gr_setsegtran = Module["_gr_setsegtran"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_gr_setsegtran = Module["_gr_setsegtran"] = wasmExports["Gc"])(a0, a1, a2, a3, a4, a5, a6, a7);
        var _gr_closeseg = Module["_gr_closeseg"] = () => (_gr_closeseg = Module["_gr_closeseg"] = wasmExports["Hc"])();
        var _gr_emergencyclosegks = Module["_gr_emergencyclosegks"] = () => (_gr_emergencyclosegks = Module["_gr_emergencyclosegks"] = wasmExports["Ic"])();
        var _gr_updategks = Module["_gr_updategks"] = () => (_gr_updategks = Module["_gr_updategks"] = wasmExports["Jc"])();
        var _gr_inqtextext = Module["_gr_inqtextext"] = (a0, a1, a2, a3, a4) => (_gr_inqtextext = Module["_gr_inqtextext"] = wasmExports["Kc"])(a0, a1, a2, a3, a4);
        var _gr_axes = Module["_gr_axes"] = (a0, a1, a2, a3, a4, a5, a6) => (_gr_axes = Module["_gr_axes"] = wasmExports["Lc"])(a0, a1, a2, a3, a4, a5, a6);
        var _gr_grid = Module["_gr_grid"] = (a0, a1, a2, a3, a4, a5) => (_gr_grid = Module["_gr_grid"] = wasmExports["Mc"])(a0, a1, a2, a3, a4, a5);
        var _gr_verrorbars = Module["_gr_verrorbars"] = (a0, a1, a2, a3, a4) => (_gr_verrorbars = Module["_gr_verrorbars"] = wasmExports["Nc"])(a0, a1, a2, a3, a4);
        var _gr_herrorbars = Module["_gr_herrorbars"] = (a0, a1, a2, a3, a4) => (_gr_herrorbars = Module["_gr_herrorbars"] = wasmExports["Oc"])(a0, a1, a2, a3, a4);
        var _gr_drawarrow = Module["_gr_drawarrow"] = (a0, a1, a2, a3) => (_gr_drawarrow = Module["_gr_drawarrow"] = wasmExports["Pc"])(a0, a1, a2, a3);
        var _gr_inqcolormap = Module["_gr_inqcolormap"] = a0 => (_gr_inqcolormap = Module["_gr_inqcolormap"] = wasmExports["Qc"])(a0);
        var _gr_colorbar = Module["_gr_colorbar"] = () => (_gr_colorbar = Module["_gr_colorbar"] = wasmExports["Rc"])();
        var _gr_inqcolorfromrgb = Module["_gr_inqcolorfromrgb"] = (a0, a1, a2) => (_gr_inqcolorfromrgb = Module["_gr_inqcolorfromrgb"] = wasmExports["Sc"])(a0, a1, a2);
        var _gr_hsvtorgb = Module["_gr_hsvtorgb"] = (a0, a1, a2, a3, a4, a5) => (_gr_hsvtorgb = Module["_gr_hsvtorgb"] = wasmExports["Tc"])(a0, a1, a2, a3, a4, a5);
        var _gr_validaterange = Module["_gr_validaterange"] = (a0, a1) => (_gr_validaterange = Module["_gr_validaterange"] = wasmExports["Uc"])(a0, a1);
        var _gr_beginprintext = Module["_gr_beginprintext"] = (a0, a1, a2, a3) => (_gr_beginprintext = Module["_gr_beginprintext"] = wasmExports["Vc"])(a0, a1, a2, a3);
        var _gr_inqborderwidth = Module["_gr_inqborderwidth"] = a0 => (_gr_inqborderwidth = Module["_gr_inqborderwidth"] = wasmExports["Wc"])(a0);
        var _gr_drawpath = Module["_gr_drawpath"] = (a0, a1, a2, a3) => (_gr_drawpath = Module["_gr_drawpath"] = wasmExports["Xc"])(a0, a1, a2, a3);
        var _gr_setarrowstyle = Module["_gr_setarrowstyle"] = a0 => (_gr_setarrowstyle = Module["_gr_setarrowstyle"] = wasmExports["Yc"])(a0);
        var _gr_setshadow = Module["_gr_setshadow"] = (a0, a1, a2) => (_gr_setshadow = Module["_gr_setshadow"] = wasmExports["Zc"])(a0, a1, a2);
        var _gr_setcoordxform = Module["_gr_setcoordxform"] = a0 => (_gr_setcoordxform = Module["_gr_setcoordxform"] = wasmExports["_c"])(a0);
        var _gr_begingraphics = Module["_gr_begingraphics"] = a0 => (_gr_begingraphics = Module["_gr_begingraphics"] = wasmExports["$c"])(a0);
        var _gr_endgraphics = Module["_gr_endgraphics"] = () => (_gr_endgraphics = Module["_gr_endgraphics"] = wasmExports["ad"])();
        var _gr_readimage = Module["_gr_readimage"] = (a0, a1, a2, a3) => (_gr_readimage = Module["_gr_readimage"] = wasmExports["bd"])(a0, a1, a2, a3);
        var _gr_beginselection = Module["_gr_beginselection"] = (a0, a1) => (_gr_beginselection = Module["_gr_beginselection"] = wasmExports["cd"])(a0, a1);
        var _gr_endselection = Module["_gr_endselection"] = () => (_gr_endselection = Module["_gr_endselection"] = wasmExports["dd"])();
        var _gr_moveselection = Module["_gr_moveselection"] = (a0, a1) => (_gr_moveselection = Module["_gr_moveselection"] = wasmExports["ed"])(a0, a1);
        var _gr_resizeselection = Module["_gr_resizeselection"] = (a0, a1, a2) => (_gr_resizeselection = Module["_gr_resizeselection"] = wasmExports["fd"])(a0, a1, a2);
        var _gr_inqbbox = Module["_gr_inqbbox"] = (a0, a1, a2, a3) => (_gr_inqbbox = Module["_gr_inqbbox"] = wasmExports["gd"])(a0, a1, a2, a3);
        var _gr_precision = Module["_gr_precision"] = () => (_gr_precision = Module["_gr_precision"] = wasmExports["hd"])();
        var _gr_setregenflags = Module["_gr_setregenflags"] = a0 => (_gr_setregenflags = Module["_gr_setregenflags"] = wasmExports["id"])(a0);
        var _gr_inqregenflags = Module["_gr_inqregenflags"] = () => (_gr_inqregenflags = Module["_gr_inqregenflags"] = wasmExports["jd"])();
        var _gr_shade = Module["_gr_shade"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_gr_shade = Module["_gr_shade"] = wasmExports["kd"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);
        var _gr_shadelines = Module["_gr_shadelines"] = (a0, a1, a2, a3, a4, a5) => (_gr_shadelines = Module["_gr_shadelines"] = wasmExports["ld"])(a0, a1, a2, a3, a4, a5);
        var _gr_path = Module["_gr_path"] = (a0, a1, a2, a3) => (_gr_path = Module["_gr_path"] = wasmExports["md"])(a0, a1, a2, a3);
        var _gr_setborderwidth = Module["_gr_setborderwidth"] = a0 => (_gr_setborderwidth = Module["_gr_setborderwidth"] = wasmExports["nd"])(a0);
        var _gr_inqbordercolorind = Module["_gr_inqbordercolorind"] = a0 => (_gr_inqbordercolorind = Module["_gr_inqbordercolorind"] = wasmExports["od"])(a0);
        var _gr_inqclipxform = Module["_gr_inqclipxform"] = a0 => (_gr_inqclipxform = Module["_gr_inqclipxform"] = wasmExports["pd"])(a0);
        var _gr_importgraphics = Module["_gr_importgraphics"] = a0 => (_gr_importgraphics = Module["_gr_importgraphics"] = wasmExports["qd"])(a0);
        var _gks_get_dash_list = Module["_gks_get_dash_list"] = (a0, a1, a2) => (_gks_get_dash_list = Module["_gks_get_dash_list"] = wasmExports["rd"])(a0, a1, a2);
        var _fflush = a0 => (_fflush = wasmExports["sd"])(a0);
        var ___funcs_on_exit = () => (___funcs_on_exit = wasmExports["td"])();
        var _htonl = a0 => (_htonl = wasmExports["ud"])(a0);
        var _htons = a0 => (_htons = wasmExports["vd"])(a0);
        var _emscripten_builtin_memalign = (a0, a1) => (_emscripten_builtin_memalign = wasmExports["wd"])(a0, a1);
        var _ntohs = a0 => (_ntohs = wasmExports["xd"])(a0);
        var _setThrew = (a0, a1) => (_setThrew = wasmExports["yd"])(a0, a1);
        var __emscripten_stack_restore = a0 => (__emscripten_stack_restore = wasmExports["zd"])(a0);
        var __emscripten_stack_alloc = a0 => (__emscripten_stack_alloc = wasmExports["Ad"])(a0);
        var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["Bd"])();
        var ___emscripten_embedded_file_data = Module["___emscripten_embedded_file_data"] = 4944116;
        function invoke_iii(index, a1, a2) { var sp = stackSave(); try {
            return getWasmTableEntry(index)(a1, a2);
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        function invoke_iiiii(index, a1, a2, a3, a4) { var sp = stackSave(); try {
            return getWasmTableEntry(index)(a1, a2, a3, a4);
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        function invoke_iiii(index, a1, a2, a3) { var sp = stackSave(); try {
            return getWasmTableEntry(index)(a1, a2, a3);
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        function invoke_ii(index, a1) { var sp = stackSave(); try {
            return getWasmTableEntry(index)(a1);
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        function invoke_viii(index, a1, a2, a3) { var sp = stackSave(); try {
            getWasmTableEntry(index)(a1, a2, a3);
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        function invoke_vii(index, a1, a2) { var sp = stackSave(); try {
            getWasmTableEntry(index)(a1, a2);
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        function invoke_vi(index, a1) { var sp = stackSave(); try {
            getWasmTableEntry(index)(a1);
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        function invoke_viiii(index, a1, a2, a3, a4) { var sp = stackSave(); try {
            getWasmTableEntry(index)(a1, a2, a3, a4);
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        function invoke_viiiii(index, a1, a2, a3, a4, a5) { var sp = stackSave(); try {
            getWasmTableEntry(index)(a1, a2, a3, a4, a5);
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        function invoke_iiiiii(index, a1, a2, a3, a4, a5) { var sp = stackSave(); try {
            return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        function invoke_v(index) { var sp = stackSave(); try {
            getWasmTableEntry(index)();
        }
        catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
                throw e;
            _setThrew(1, 0);
        } }
        Module["addRunDependency"] = addRunDependency;
        Module["removeRunDependency"] = removeRunDependency;
        Module["ccall"] = ccall;
        Module["cwrap"] = cwrap;
        Module["addFunction"] = addFunction;
        Module["removeFunction"] = removeFunction;
        Module["setValue"] = setValue;
        Module["getValue"] = getValue;
        Module["UTF8ToString"] = UTF8ToString;
        Module["stringToUTF8"] = stringToUTF8;
        Module["lengthBytesUTF8"] = lengthBytesUTF8;
        Module["intArrayFromString"] = intArrayFromString;
        Module["FS_createPreloadedFile"] = FS_createPreloadedFile;
        Module["FS_unlink"] = FS_unlink;
        Module["FS_createPath"] = FS_createPath;
        Module["FS_createDevice"] = FS_createDevice;
        Module["FS_createDataFile"] = FS_createDataFile;
        Module["FS_createLazyFile"] = FS_createLazyFile;
        var calledRun;
        var calledPrerun;
        dependenciesFulfilled = function runCaller() { if (!calledRun)
            run(); if (!calledRun)
            dependenciesFulfilled = runCaller; };
        function run() { if (runDependencies > 0) {
            return;
        } if (!calledPrerun) {
            calledPrerun = 1;
            preRun();
            if (runDependencies > 0) {
                return;
            }
        } function doRun() { if (calledRun)
            return; calledRun = 1; Module["calledRun"] = 1; if (ABORT)
            return; initRuntime(); readyPromiseResolve(Module); Module["onRuntimeInitialized"]?.(); postRun(); } if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout(() => { setTimeout(() => Module["setStatus"](""), 1); doRun(); }, 1);
        }
        else {
            doRun();
        } }
        if (Module["preInit"]) {
            if (typeof Module["preInit"] == "function")
                Module["preInit"] = [Module["preInit"]];
            while (Module["preInit"].length > 0) {
                Module["preInit"].pop()();
            }
        }
        run();
        moduleRtn = readyPromise;
        return moduleRtn;
    });
})();
export default Module;
