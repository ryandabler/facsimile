"use strict";

////////////////////
// Initialize
////////////////////
const { types, typeOf } = require("tupos");

////////////////////
// Main
////////////////////
/**
 * Returns the same item passed as its parameter.
 * 
 * @param {*} item 
 * @returns {*}
 */
const identity = item => item

/**
 * Returns a new copy of a function.
 * 
 * @param {function} func
 * @returns {function}
 */
const duplicateFunction = func => Function("return " + func)()

/**
 * Returns a new copy of an error.
 * 
 * @param {Object} err
 * @returns {Object}
 */
const duplicateError = err => {
    const newErr = new Error(err.message);
    newErr.name = err.name;
    return newErr;
}

/**
 * Returns a copy of a regular expression.
 * 
 * @param {Object} regex 
 * @returns {Object}
 */
const duplicateRegExp = regex => new RegExp(regex.source, regex.flags)

/**
 * Returns a copy of a date.
 * 
 * @param {Object} dt 
 * @returns {Object}
 */
const duplicateDate = dt => new Date(dt)

/**
 * Returns a copy of an object.
 * 
 * Recursively traverses all the keys in an object, making a copy of each
 * value based on its type.
 * 
 * @param {Object} obj 
 * @returns {Object}
 */
const duplicateObject = obj => {
    const retObj = {};

    for (const key in obj) {
        retObj[key] = _duplicate[typeOf(obj[key])](obj[key]);
    }

    return retObj;
}

/**
 * Returns a copy of an array.
 * 
 * Traverses the whole array and deep copies each property (both indexed and
 * non-indexed) based on its type.
 * 
 * @param {Array} arr 
 * @returns {Array}
 */
const duplicateArray = arr => {
    const retArr = [];
    for (const key in arr) {
        retArr[key] = _duplicate[typeOf(arr[key])](arr[key]);
    }

    return retArr;
}

/**
 * Returns a copy of a (Weak)Map.
 * 
 * This is a higher order function that takes a (Weak)Map construcutor and
 * returns a function which will actually make the copy.
 * 
 * @param {Object} constructor 
 * @returns {function}
 */
const duplicateMapType = constructor => map => new constructor(map)

/**
 * Returns a copy of a (Weak)Set.
 * 
 * This is a higher order function that takes a (Weak)Set construcutor and
 * returns a function which will actually make the copy.
 * 
 * @param {Object} constructor 
 * @returns {function}
 */
const duplicateSetType = constructor => set => new constructor(set)

/**
 * Returns a copy of a promise.
 * 
 * Because of how promises are constructed, this function will return
 * a different object that resolves at the same time as the original promise.
 * It does not re-initiate the original promise's logic.
 * 
 * @param {Object} promise 
 * @returns {Object}
 */
const duplicatePromise = promise => promise.then()

/**
 * Returns a copy of a typed array.
 * 
 * This is a higher order function that takes a typed array construcutor and
 * returns a function which will actually make the copy.
 * 
 * @param {Object} constructor 
 * @returns {function}
 */
const duplicateTypedArray = constructor => typedArr => {
    const newTypedArr = new constructor(typedArr.length);

    for (const key in typedArr) {
        newTypedArr[key] =
            _duplicate[typeOf(typedArr[key])](typedArr[key]);
    }

    return newTypedArr;
}

/**
 * Returns a copy of an array buffer.
 * 
 * @param {Object} arrBuff 
 * @returns {Object}
 */
const duplicateArrayBuffer = arrBuff => new ArrayBuffer(arrBuff.length)

/**
 * Returns a copy of a data view.
 * 
 * @param {Object} dv 
 * @returns {Object}
 */
const duplicateDataView = dv =>
    new DataView(dv.buffer, dv.byteOffset, dv.byteLength)

const duplicate = elem => _duplicate[typeOf(elem)](elem)

const _duplicate = {
    [types.STRING]: identity,
    [types.NUMBER]: identity,
    [types.BOOLEAN]: identity,
    [types.NULL]: identity,
    [types.UNDEFINED]: identity,
    [types.SYMBOL]: identity,
    [types.FUNCTION]: duplicateFunction,
    [types.ERROR]: duplicateError,
    [types.REGEXP]: duplicateRegExp,
    [types.DATE]: duplicateDate,
    [types.OBJECT]: duplicateObject,
    [types.ARRAY]: duplicateArray,
    [types.MAP]: duplicateMapType(Map),
    [types.WEAKMAP]: duplicateMapType(WeakMap),
    [types.SET]: duplicateSetType(Set),
    [types.WEAKSET]: duplicateSetType(WeakSet),
    [types.MATH]: identity,
    [types.PROMISE]: duplicatePromise,
    [types.INT8ARRAY]: duplicateTypedArray(Int8Array),
    [types.UINT8ARRAY]: duplicateTypedArray(Uint8Array),
    [types.UINT8CLAMPEDARRAY]: duplicateTypedArray(Uint8ClampedArray),
    [types.INT16ARRAY]: duplicateTypedArray(Int16Array),
    [types.UINT16ARRAY]: duplicateTypedArray(Uint16Array),
    [types.INT32ARRAY]: duplicateTypedArray(Int32Array),
    [types.UINT32ARRAY]: duplicateTypedArray(Uint32Array),
    [types.FLOAT32ARRAY]: duplicateTypedArray(Float32Array),
    [types.FLOAT64ARRAY]: duplicateTypedArray(Float64Array),
    [types.ARRAYBUFFER]: duplicateArrayBuffer,
    [types.DATAVIEW]: duplicateDataView,
    [types.JSON]: identity,
    [types.GENERATOR]: identity,
    [types.GENERATORFUNC]: duplicateFunction,
    [types.WASM]: identity,
    [types.ASYNCFUNC]: duplicateFunction
}

module.exports = { duplicate };