"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpcaseMap = exports.TransformKeyMap = void 0;
var TransformKeyMap = /** @class */ (function () {
    function TransformKeyMap(transform, map) {
        if (map === void 0) { map = new Map(); }
        this.transform = transform;
        this.map = map;
    }
    TransformKeyMap.prototype.get = function (k1) {
        return this.map.get(this.transform(k1));
    };
    TransformKeyMap.prototype.set = function (k1, value) {
        this.map.set(this.transform(k1), value);
    };
    TransformKeyMap.prototype.has = function (key) {
        return this.map.has(this.transform(key));
    };
    return TransformKeyMap;
}());
exports.TransformKeyMap = TransformKeyMap;
var UpcaseMap = /** @class */ (function (_super) {
    __extends(UpcaseMap, _super);
    function UpcaseMap(map) {
        if (map === void 0) { map = new Map(); }
        return _super.call(this, function (s) { return s.toUpperCase(); }, map) || this;
    }
    return UpcaseMap;
}(TransformKeyMap));
exports.UpcaseMap = UpcaseMap;
