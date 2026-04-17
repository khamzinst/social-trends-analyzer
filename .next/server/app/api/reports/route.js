"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/reports/route";
exports.ids = ["app/api/reports/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:buffer");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freports%2Froute&page=%2Fapi%2Freports%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Froute.ts&appDir=C%3A%5CUsers%5C%D0%A1%D0%B0%D1%8F%D1%82%5Csocial-trends-analyzer%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5C%D0%A1%D0%B0%D1%8F%D1%82%5Csocial-trends-analyzer&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freports%2Froute&page=%2Fapi%2Freports%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Froute.ts&appDir=C%3A%5CUsers%5C%D0%A1%D0%B0%D1%8F%D1%82%5Csocial-trends-analyzer%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5C%D0%A1%D0%B0%D1%8F%D1%82%5Csocial-trends-analyzer&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_social_trends_analyzer_src_app_api_reports_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/reports/route.ts */ \"(rsc)/./src/app/api/reports/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/reports/route\",\n        pathname: \"/api/reports\",\n        filename: \"route\",\n        bundlePath: \"app/api/reports/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Саят\\\\social-trends-analyzer\\\\src\\\\app\\\\api\\\\reports\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_social_trends_analyzer_src_app_api_reports_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/reports/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZyZXBvcnRzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZyZXBvcnRzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcmVwb3J0cyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUMlRDAlQTElRDAlQjAlRDElOEYlRDElODIlNUNzb2NpYWwtdHJlbmRzLWFuYWx5emVyJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUMlRDAlQTElRDAlQjAlRDElOEYlRDElODIlNUNzb2NpYWwtdHJlbmRzLWFuYWx5emVyJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUN5QjtBQUN0RztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3NvY2lhbC10cmVuZHMtYW5hbHl6ZXIvP2QyNWEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxc0KHQsNGP0YJcXFxcc29jaWFsLXRyZW5kcy1hbmFseXplclxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxyZXBvcnRzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9yZXBvcnRzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcmVwb3J0c1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcmVwb3J0cy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXNCh0LDRj9GCXFxcXHNvY2lhbC10cmVuZHMtYW5hbHl6ZXJcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxccmVwb3J0c1xcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvcmVwb3J0cy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freports%2Froute&page=%2Fapi%2Freports%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Froute.ts&appDir=C%3A%5CUsers%5C%D0%A1%D0%B0%D1%8F%D1%82%5Csocial-trends-analyzer%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5C%D0%A1%D0%B0%D1%8F%D1%82%5Csocial-trends-analyzer&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/reports/route.ts":
/*!**************************************!*\
  !*** ./src/app/api/reports/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\n\nasync function GET(request) {\n    const auth = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.getAuthUser)();\n    if (!auth) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Не авторизован\"\n    }, {\n        status: 401\n    });\n    const reports = await _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.analysisReport.findMany({\n        where: {\n            userId: auth.userId\n        },\n        orderBy: {\n            createdAt: \"desc\"\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        reports\n    });\n}\nasync function POST(request) {\n    const auth = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.getAuthUser)();\n    if (!auth) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Не авторизован\"\n    }, {\n        status: 401\n    });\n    const { title, platform, period, recordsCount, trendsFound } = await request.json();\n    if (!title?.trim()) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Укажите название\"\n    }, {\n        status: 400\n    });\n    const report = await _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.analysisReport.create({\n        data: {\n            title,\n            platform: platform || null,\n            recordsCount: recordsCount ?? 0,\n            trendsFound: trendsFound ?? 0,\n            status: \"COMPLETED\",\n            userId: auth.userId\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        report\n    }, {\n        status: 201\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9yZXBvcnRzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXVEO0FBQ2Y7QUFDSDtBQUU5QixlQUFlRyxJQUFJQyxPQUFvQjtJQUM1QyxNQUFNQyxPQUFPLE1BQU1KLHNEQUFXQTtJQUM5QixJQUFJLENBQUNJLE1BQU0sT0FBT0wscURBQVlBLENBQUNNLElBQUksQ0FBQztRQUFFQyxPQUFPO0lBQWlCLEdBQUc7UUFBRUMsUUFBUTtJQUFJO0lBRS9FLE1BQU1DLFVBQVUsTUFBTVAsK0NBQU1BLENBQUNRLGNBQWMsQ0FBQ0MsUUFBUSxDQUFDO1FBQ25EQyxPQUFPO1lBQUVDLFFBQVFSLEtBQUtRLE1BQU07UUFBQztRQUM3QkMsU0FBUztZQUFFQyxXQUFXO1FBQU87SUFDL0I7SUFFQSxPQUFPZixxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1FBQUVHO0lBQVE7QUFDckM7QUFFTyxlQUFlTyxLQUFLWixPQUFvQjtJQUM3QyxNQUFNQyxPQUFPLE1BQU1KLHNEQUFXQTtJQUM5QixJQUFJLENBQUNJLE1BQU0sT0FBT0wscURBQVlBLENBQUNNLElBQUksQ0FBQztRQUFFQyxPQUFPO0lBQWlCLEdBQUc7UUFBRUMsUUFBUTtJQUFJO0lBRS9FLE1BQU0sRUFBRVMsS0FBSyxFQUFFQyxRQUFRLEVBQUVDLE1BQU0sRUFBRUMsWUFBWSxFQUFFQyxXQUFXLEVBQUUsR0FBRyxNQUFNakIsUUFBUUUsSUFBSTtJQUNqRixJQUFJLENBQUNXLE9BQU9LLFFBQVEsT0FBT3RCLHFEQUFZQSxDQUFDTSxJQUFJLENBQUM7UUFBRUMsT0FBTztJQUFtQixHQUFHO1FBQUVDLFFBQVE7SUFBSTtJQUUxRixNQUFNZSxTQUFTLE1BQU1yQiwrQ0FBTUEsQ0FBQ1EsY0FBYyxDQUFDYyxNQUFNLENBQUM7UUFDaERDLE1BQU07WUFDSlI7WUFDQUMsVUFBVUEsWUFBWTtZQUN0QkUsY0FBY0EsZ0JBQWdCO1lBQzlCQyxhQUFhQSxlQUFlO1lBQzVCYixRQUFRO1lBQ1JLLFFBQVFSLEtBQUtRLE1BQU07UUFDckI7SUFDRjtJQUVBLE9BQU9iLHFEQUFZQSxDQUFDTSxJQUFJLENBQUM7UUFBRWlCO0lBQU8sR0FBRztRQUFFZixRQUFRO0lBQUk7QUFDckQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zb2NpYWwtdHJlbmRzLWFuYWx5emVyLy4vc3JjL2FwcC9hcGkvcmVwb3J0cy9yb3V0ZS50cz9iZjA4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcbmltcG9ydCB7IGdldEF1dGhVc2VyIH0gZnJvbSAnQC9saWIvYXV0aCdcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0AvbGliL3ByaXNtYSdcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCBhdXRoID0gYXdhaXQgZ2V0QXV0aFVzZXIoKVxuICBpZiAoIWF1dGgpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAn0J3QtSDQsNCy0YLQvtGA0LjQt9C+0LLQsNC9JyB9LCB7IHN0YXR1czogNDAxIH0pXG5cbiAgY29uc3QgcmVwb3J0cyA9IGF3YWl0IHByaXNtYS5hbmFseXNpc1JlcG9ydC5maW5kTWFueSh7XG4gICAgd2hlcmU6IHsgdXNlcklkOiBhdXRoLnVzZXJJZCB9LFxuICAgIG9yZGVyQnk6IHsgY3JlYXRlZEF0OiAnZGVzYycgfSxcbiAgfSlcblxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyByZXBvcnRzIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIGNvbnN0IGF1dGggPSBhd2FpdCBnZXRBdXRoVXNlcigpXG4gIGlmICghYXV0aCkgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICfQndC1INCw0LLRgtC+0YDQuNC30L7QstCw0L0nIH0sIHsgc3RhdHVzOiA0MDEgfSlcblxuICBjb25zdCB7IHRpdGxlLCBwbGF0Zm9ybSwgcGVyaW9kLCByZWNvcmRzQ291bnQsIHRyZW5kc0ZvdW5kIH0gPSBhd2FpdCByZXF1ZXN0Lmpzb24oKVxuICBpZiAoIXRpdGxlPy50cmltKCkpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAn0KPQutCw0LbQuNGC0LUg0L3QsNC30LLQsNC90LjQtScgfSwgeyBzdGF0dXM6IDQwMCB9KVxuXG4gIGNvbnN0IHJlcG9ydCA9IGF3YWl0IHByaXNtYS5hbmFseXNpc1JlcG9ydC5jcmVhdGUoe1xuICAgIGRhdGE6IHtcbiAgICAgIHRpdGxlLFxuICAgICAgcGxhdGZvcm06IHBsYXRmb3JtIHx8IG51bGwsXG4gICAgICByZWNvcmRzQ291bnQ6IHJlY29yZHNDb3VudCA/PyAwLFxuICAgICAgdHJlbmRzRm91bmQ6IHRyZW5kc0ZvdW5kID8/IDAsXG4gICAgICBzdGF0dXM6ICdDT01QTEVURUQnLFxuICAgICAgdXNlcklkOiBhdXRoLnVzZXJJZCxcbiAgICB9LFxuICB9KVxuXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHJlcG9ydCB9LCB7IHN0YXR1czogMjAxIH0pXG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0QXV0aFVzZXIiLCJwcmlzbWEiLCJHRVQiLCJyZXF1ZXN0IiwiYXV0aCIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsInJlcG9ydHMiLCJhbmFseXNpc1JlcG9ydCIsImZpbmRNYW55Iiwid2hlcmUiLCJ1c2VySWQiLCJvcmRlckJ5IiwiY3JlYXRlZEF0IiwiUE9TVCIsInRpdGxlIiwicGxhdGZvcm0iLCJwZXJpb2QiLCJyZWNvcmRzQ291bnQiLCJ0cmVuZHNGb3VuZCIsInRyaW0iLCJyZXBvcnQiLCJjcmVhdGUiLCJkYXRhIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/reports/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createToken: () => (/* binding */ createToken),\n/* harmony export */   getAuthUser: () => (/* binding */ getAuthUser),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/sign.js\");\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/verify.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\n\nconst getSecret = ()=>new TextEncoder().encode(process.env.JWT_SECRET || \"fallback-secret-change-in-production-minimum-32-chars\");\nasync function hashPassword(password) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().hash(password, 12);\n}\nasync function verifyPassword(password, hash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().compare(password, hash);\n}\nasync function createToken(payload) {\n    return new jose__WEBPACK_IMPORTED_MODULE_2__.SignJWT(payload).setProtectedHeader({\n        alg: \"HS256\"\n    }).setIssuedAt().setExpirationTime(\"7d\").sign(getSecret());\n}\nasync function verifyToken(token) {\n    try {\n        const { payload } = await (0,jose__WEBPACK_IMPORTED_MODULE_3__.jwtVerify)(token, getSecret());\n        return payload;\n    } catch  {\n        return null;\n    }\n}\nasync function getAuthUser() {\n    const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    const token = cookieStore.get(\"token\")?.value;\n    if (!token) return null;\n    return verifyToken(token);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUF5QztBQUNaO0FBQ1M7QUFFdEMsTUFBTUksWUFBWSxJQUNoQixJQUFJQyxjQUFjQyxNQUFNLENBQ3RCQyxRQUFRQyxHQUFHLENBQUNDLFVBQVUsSUFBSTtBQVN2QixlQUFlQyxhQUFhQyxRQUFnQjtJQUNqRCxPQUFPVCxvREFBVyxDQUFDUyxVQUFVO0FBQy9CO0FBRU8sZUFBZUUsZUFBZUYsUUFBZ0IsRUFBRUMsSUFBWTtJQUNqRSxPQUFPVix1REFBYyxDQUFDUyxVQUFVQztBQUNsQztBQUVPLGVBQWVHLFlBQVlDLE9BQW1CO0lBQ25ELE9BQU8sSUFBSWhCLHlDQUFPQSxDQUFDZ0IsU0FDaEJDLGtCQUFrQixDQUFDO1FBQUVDLEtBQUs7SUFBUSxHQUNsQ0MsV0FBVyxHQUNYQyxpQkFBaUIsQ0FBQyxNQUNsQkMsSUFBSSxDQUFDakI7QUFDVjtBQUVPLGVBQWVrQixZQUFZQyxLQUFhO0lBQzdDLElBQUk7UUFDRixNQUFNLEVBQUVQLE9BQU8sRUFBRSxHQUFHLE1BQU1mLCtDQUFTQSxDQUFDc0IsT0FBT25CO1FBQzNDLE9BQU9ZO0lBQ1QsRUFBRSxPQUFNO1FBQ04sT0FBTztJQUNUO0FBQ0Y7QUFFTyxlQUFlUTtJQUNwQixNQUFNQyxjQUFjdEIscURBQU9BO0lBQzNCLE1BQU1vQixRQUFRRSxZQUFZQyxHQUFHLENBQUMsVUFBVUM7SUFDeEMsSUFBSSxDQUFDSixPQUFPLE9BQU87SUFDbkIsT0FBT0QsWUFBWUM7QUFDckIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zb2NpYWwtdHJlbmRzLWFuYWx5emVyLy4vc3JjL2xpYi9hdXRoLnRzPzY2OTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2lnbkpXVCwgand0VmVyaWZ5IH0gZnJvbSAnam9zZSdcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnXG5pbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJ1xuXG5jb25zdCBnZXRTZWNyZXQgPSAoKSA9PlxuICBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoXG4gICAgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCB8fCAnZmFsbGJhY2stc2VjcmV0LWNoYW5nZS1pbi1wcm9kdWN0aW9uLW1pbmltdW0tMzItY2hhcnMnXG4gIClcblxuZXhwb3J0IGludGVyZmFjZSBKd3RQYXlsb2FkIHtcbiAgdXNlcklkOiBzdHJpbmdcbiAgZW1haWw6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhc2hQYXNzd29yZChwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMilcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeVBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcsIGhhc2g6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2gpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVUb2tlbihwYXlsb2FkOiBKd3RQYXlsb2FkKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIG5ldyBTaWduSldUKHBheWxvYWQgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pXG4gICAgLnNldFByb3RlY3RlZEhlYWRlcih7IGFsZzogJ0hTMjU2JyB9KVxuICAgIC5zZXRJc3N1ZWRBdCgpXG4gICAgLnNldEV4cGlyYXRpb25UaW1lKCc3ZCcpXG4gICAgLnNpZ24oZ2V0U2VjcmV0KCkpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2ZXJpZnlUb2tlbih0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxKd3RQYXlsb2FkIHwgbnVsbD4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gYXdhaXQgand0VmVyaWZ5KHRva2VuLCBnZXRTZWNyZXQoKSlcbiAgICByZXR1cm4gcGF5bG9hZCBhcyB1bmtub3duIGFzIEp3dFBheWxvYWRcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXV0aFVzZXIoKTogUHJvbWlzZTxKd3RQYXlsb2FkIHwgbnVsbD4ge1xuICBjb25zdCBjb29raWVTdG9yZSA9IGNvb2tpZXMoKVxuICBjb25zdCB0b2tlbiA9IGNvb2tpZVN0b3JlLmdldCgndG9rZW4nKT8udmFsdWVcbiAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGxcbiAgcmV0dXJuIHZlcmlmeVRva2VuKHRva2VuKVxufVxuIl0sIm5hbWVzIjpbIlNpZ25KV1QiLCJqd3RWZXJpZnkiLCJiY3J5cHQiLCJjb29raWVzIiwiZ2V0U2VjcmV0IiwiVGV4dEVuY29kZXIiLCJlbmNvZGUiLCJwcm9jZXNzIiwiZW52IiwiSldUX1NFQ1JFVCIsImhhc2hQYXNzd29yZCIsInBhc3N3b3JkIiwiaGFzaCIsInZlcmlmeVBhc3N3b3JkIiwiY29tcGFyZSIsImNyZWF0ZVRva2VuIiwicGF5bG9hZCIsInNldFByb3RlY3RlZEhlYWRlciIsImFsZyIsInNldElzc3VlZEF0Iiwic2V0RXhwaXJhdGlvblRpbWUiLCJzaWduIiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsImdldEF1dGhVc2VyIiwiY29va2llU3RvcmUiLCJnZXQiLCJ2YWx1ZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBNkM7QUFFN0MsTUFBTUMsa0JBQWtCQztBQUlqQixNQUFNQyxTQUNYRixnQkFBZ0JFLE1BQU0sSUFDdEIsSUFBSUgsd0RBQVlBLENBQUM7SUFDZkksS0FBS0MsS0FBeUIsR0FBZ0I7UUFBQztRQUFTO0tBQU8sR0FBRyxDQUFTO0FBQzdFLEdBQUU7QUFFSixJQUFJQSxJQUF5QixFQUFjSixnQkFBZ0JFLE1BQU0sR0FBR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zb2NpYWwtdHJlbmRzLWFuYWx5emVyLy4vc3JjL2xpYi9wcmlzbWEudHM/MDFkNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcblxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsVGhpcyBhcyB1bmtub3duIGFzIHtcbiAgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGNvbnN0IHByaXNtYSA9XG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPz9cbiAgbmV3IFByaXNtYUNsaWVudCh7XG4gICAgbG9nOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IFsnZXJyb3InLCAnd2FybiddIDogWydlcnJvciddLFxuICB9KVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJsb2ciLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/jose"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freports%2Froute&page=%2Fapi%2Freports%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freports%2Froute.ts&appDir=C%3A%5CUsers%5C%D0%A1%D0%B0%D1%8F%D1%82%5Csocial-trends-analyzer%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5C%D0%A1%D0%B0%D1%8F%D1%82%5Csocial-trends-analyzer&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();