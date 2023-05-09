"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maps_1 = require("../src/generic/maps");
test('UpcaseMap with default map', function () {
    var map = new maps_1.UpcaseMap();
    expect(map.get('x')).toBeUndefined();
    map.set('A', 'alpha');
    expect(map.get('a')).toBe('alpha');
    expect(map.get('A')).toBe('alpha');
    expect(map.has('a')).toBeTruthy();
    expect(map.has('A')).toBeTruthy();
    map.set('a', 'beta');
    expect(map.get('a')).toBe('beta');
    expect(map.get('A')).toBe('beta');
});
test('Upcase map with provided map', function () {
    var exMap = new Map();
    var upMap = new maps_1.UpcaseMap(exMap);
    upMap.set('a', 'gamma');
    expect(Array.from(exMap.keys())).toEqual(['A']);
});
test('Generic constructor with provided map', function () {
    var exMap = new Map();
    var transform = function (s) { return s.toString(); };
    var map = new maps_1.TransformKeyMap(transform, exMap);
    map.set(10, 'ten');
    map.set(BigInt(2000), 'two thousand');
    expect(Array.from(exMap.keys())).toEqual(['10', '2000']);
    expect(exMap.get('10')).toBe('ten');
    expect(exMap.get('2000')).toBe('two thousand');
});
test('Generic constructor with internal map', function () {
    var transform = function (s) { return s.toString(); };
    var map = new maps_1.TransformKeyMap(transform);
    map.set(10, 'ten');
    map.set(BigInt(2000), 'two thousand');
    expect(map.get(BigInt(10))).toBe('ten');
    expect(map.get(2000)).toBe('two thousand');
});
