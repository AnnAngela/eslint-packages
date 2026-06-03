---
title: @annangela/prefer-reflect
layout: doc
rule_type: suggestion
fixable: code
related_rules:
- no-useless-call
- prefer-spread
- no-delete-var
---

> [!TIP]
> This document is also available in [中文版本](./prefer-reflect.md)。

A modern take on ESLint's original `prefer-reflect` rule.

The ES6 Reflect API provides a set of methods that can replace their counterparts in older constructors or syntax:

* [`Reflect.apply`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.apply) replaces [`Function.prototype.apply`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.apply)
* [`Reflect.apply`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.apply) can also replace [`Function.prototype.call`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.call)
* [`Reflect.defineProperty`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.defineproperty) replaces [`Object.defineProperty`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.defineproperty)
* [`Reflect.deleteProperty`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.deleteproperty) replaces the [`delete` keyword](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-delete-operator)
* [`Reflect.getOwnPropertyDescriptor`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.getownpropertydescriptor) replaces [`Object.getOwnPropertyDescriptor`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getownpropertydescriptor)
* [`Reflect.getPrototypeOf`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.getprototypeof) replaces [`Object.getPrototypeOf`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getprototypeof)
* [`Reflect.has`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.has) replaces the [`in` keyword](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-relational-operators)
* [`Reflect.setPrototypeOf`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.setprototypeof) replaces [`Object.setPrototypeOf`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.setprototypeof)
* [`Reflect.isExtensible`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.isextensible) replaces [`Object.isExtensible`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.isextensible)
* [`Reflect.ownKeys`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.ownkeys) replaces [`Object.getOwnPropertyNames`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getownpropertynames)
* [`Reflect.preventExtensions`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.preventextensions) replaces [`Object.preventExtensions`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.preventextensions)

The `prefer-reflect` rule flags these older patterns and suggests using the Reflect versions instead.

In most cases the rule can auto-fix. Run `eslint --fix` to replace old patterns with the corresponding Reflect API calls. For edge cases that cannot be safely auto-fixed (e.g., `delete` on non-member expressions, or `func.call(...all)` with spread in the thisArg position), the rule provides suggestions for manual selection.

## Options

### `exceptions`

```js
"prefer-reflect": [<enabled>, { "exceptions": [<...exceptions>] }]
```

`exceptions` lets you pass an array of Reflect method names to declare which Reflect methods should not be enforced.

For example, to keep using `Function.prototype.apply` while enabling most Reflect patterns:

`prefer-reflect: [2, { "exceptions": ["apply"] }]`

To keep using the `delete` keyword (whose corresponding method name is `deleteProperty`):

`prefer-reflect: [2, { "exceptions": ["deleteProperty"] }]`

These exceptions can be combined freely. To list all methods as exceptions (effectively turning off the rule):

`prefer-reflect: [2, { "exceptions": [ "apply", "defineProperty", "deleteProperty", "getOwnPropertyDescriptor", "getPrototypeOf", "has", "isExtensible", "ownKeys", "preventExtensions", "setPrototypeOf" ] }]`

### Reflect.apply

Replaces `Function.prototype.apply()` and `Function.prototype.call()`.

With no exceptions configured, the following is considered **incorrect**:

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

myFunction.apply(undefined, args);
myFunction.apply(null, args);
obj.myMethod.apply(obj, args);
obj.myMethod.apply(other, args);

myFunction.call(undefined, arg);
myFunction.call(null, arg);
obj.myMethod.call(obj, arg);
obj.myMethod.call(other, arg);
```

:::

With no exceptions configured, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.apply(myFunction, undefined, args);
Reflect.apply(myFunction, null, args);
Reflect.apply(obj.myMethod, obj, args);
Reflect.apply(obj.myMethod, other, args);
Reflect.apply(myFunction, undefined, [arg]);
Reflect.apply(myFunction, null, [arg]);
Reflect.apply(obj.myMethod, obj, [arg]);
Reflect.apply(obj.myMethod, other, [arg]);
```

:::

With `{ "exceptions": ["apply"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["apply"] }]*/

// In addition to Reflect.apply(...), these are also allowed:
myFunction.apply(undefined, args);
myFunction.apply(null, args);
obj.myMethod.apply(obj, args);
obj.myMethod.apply(other, args);
```

:::

With `{ "exceptions": ["apply"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["apply"] }]*/

// In addition to Reflect.apply(...), these are also allowed:
myFunction.call(undefined, arg);
myFunction.call(null, arg);
obj.myMethod.call(obj, arg);
obj.myMethod.call(other, arg);
```

:::

The following example shows `Reflect.apply` in a real-world scenario — invoking a callback dynamically where `thisArg` is determined at runtime:

```js
function invokeCallback(callback, context, args) {
    return Reflect.apply(callback, context, args);
}

// Dynamic context-based invocation
invokeCallback(user.onSave, user, [formData]);
```

### Reflect.defineProperty

Replaces `Object.defineProperty()`.

With no exceptions configured, the following is considered **incorrect**:

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.defineProperty({}, 'foo', {value: 1})
```

:::

With no exceptions configured, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.defineProperty({}, 'foo', {value: 1})
```

:::

With `{ "exceptions": ["defineProperty"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["defineProperty"] }]*/

Object.defineProperty({}, 'foo', {value: 1})
Reflect.defineProperty({}, 'foo', {value: 1})
```

:::

The following example shows `Reflect.defineProperty` in a real-world scenario — conditionally defining a property descriptor:

```js
function defineIfWritable(obj, key, value) {
    if (Reflect.defineProperty(obj, key, { value, writable: true, configurable: true })) {
        return obj[key];
    }
    return undefined;
}
```

### Reflect.deleteProperty

Replaces the `delete` keyword.

With no exceptions configured, the following is considered **incorrect**:

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

delete foo.bar; // deleting an object property
```

:::

With no exceptions configured, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

delete bar; // deleting a variable
Reflect.deleteProperty(foo, 'bar');
```

:::

> [!TIP]
> If you want to prevent deleting variables, use [no-delete-var](https://eslint.org/docs/latest/rules/no-delete-var) instead.

With `{ "exceptions": ["deleteProperty"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["deleteProperty"] }]*/

delete bar
delete foo.bar
Reflect.deleteProperty(foo, 'bar');
```

:::

The following example shows `Reflect.deleteProperty` in a real-world scenario — cleaning up temporary cache entries:

```js
function clearCacheEntry(cache, key) {
    if (Reflect.has(cache, key)) {
        Reflect.deleteProperty(cache, key);
    }
}
```

### Reflect.getOwnPropertyDescriptor

Replaces `Object.getOwnPropertyDescriptor()`.

With no exceptions configured, the following is considered **incorrect**:

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.getOwnPropertyDescriptor({}, 'foo')
```

:::

With no exceptions configured, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.getOwnPropertyDescriptor({}, 'foo')
```

:::

With `{ "exceptions": ["getOwnPropertyDescriptor"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["getOwnPropertyDescriptor"] }]*/

Object.getOwnPropertyDescriptor({}, 'foo')
Reflect.getOwnPropertyDescriptor({}, 'foo')
```

:::

The following example shows `Reflect.getOwnPropertyDescriptor` in a real-world scenario — checking whether a property is read-only:

```js
function isReadOnly(obj, key) {
    const desc = Reflect.getOwnPropertyDescriptor(obj, key);
    return desc ? desc.writable === false : false;
}
```

### Reflect.getPrototypeOf

Replaces `Object.getPrototypeOf()`.

With no exceptions configured, the following is considered **incorrect**:

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.getPrototypeOf({})
```

:::

With no exceptions configured, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.getPrototypeOf({})
```

:::

With `{ "exceptions": ["getPrototypeOf"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["getPrototypeOf"] }]*/

Object.getPrototypeOf({})
Reflect.getPrototypeOf({})
```

:::

The following example shows `Reflect.getPrototypeOf` in a real-world scenario — checking whether an object inherits from a specific prototype:

```js
function isInstanceOf(obj, constructor) {
    return Reflect.getPrototypeOf(obj) === constructor.prototype;
}
```

### Reflect.has

Replaces the `in` keyword.

With no exceptions configured, the following is considered **incorrect**:

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

'foo' in {}; // checking whether a property exists on an object
```

:::

With no exceptions configured, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.has({}, 'foo');
```

:::

With `{ "exceptions": ["has"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["has"] }]*/

'foo' in {};
Reflect.has({}, 'foo');
```

:::

The following example shows `Reflect.has` in a real-world scenario — safely checking whether an object has a property:

```js
function getOption(options, key, defaultValue) {
    return Reflect.has(options, key) ? options[key] : defaultValue;
}
```

### Reflect.isExtensible

Replaces `Object.isExtensible()`.

With no exceptions configured, the following is considered **incorrect**:

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.isExtensible({})
```

:::

With no exceptions configured, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.isExtensible({})
```

:::

With `{ "exceptions": ["isExtensible"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["isExtensible"] }]*/

Object.isExtensible({})
Reflect.isExtensible({})
```

:::

The following example shows `Reflect.isExtensible` in a real-world scenario — checking whether an object is extensible before adding a property:

```js
function safeAddProperty(obj, key, value) {
    if (Reflect.isExtensible(obj)) {
        obj[key] = value;
        return true;
    }
    return false;
}
```

### Reflect.ownKeys

Replaces `Object.getOwnPropertyNames()`.

With no exceptions configured, the following is considered **incorrect**:

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.getOwnPropertyNames({})
```

:::

With no exceptions configured, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.ownKeys({})
```

:::

With `{ "exceptions": ["ownKeys"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["ownKeys"] }]*/

Object.getOwnPropertyNames({})
Reflect.ownKeys({})
```

:::

The following example shows `Reflect.ownKeys` in a real-world scenario — retrieving all keys of an object (including Symbol keys):

```js
function cloneAllKeys(source) {
    const target = {};
    for (const key of Reflect.ownKeys(source)) {
        target[key] = source[key];
    }
    return target;
}
```

### Reflect.preventExtensions

Replaces `Object.preventExtensions()`.

With no exceptions configured, the following is considered **incorrect**:

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.preventExtensions({})
```

:::

With no exceptions configured, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.preventExtensions({})
```

:::

With `{ "exceptions": ["preventExtensions"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["preventExtensions"] }]*/

Object.preventExtensions({})
Reflect.preventExtensions({})
```

:::

The following example shows `Reflect.preventExtensions` in a real-world scenario — sealing a configuration object to prevent accidental modification:

```js
function sealConfig(config) {
    // Prevent extensions first, then freeze individual properties
    Reflect.preventExtensions(config);
    for (const key of Reflect.ownKeys(config)) {
        const desc = Reflect.getOwnPropertyDescriptor(config, key);
        if (desc && desc.configurable) {
            Reflect.defineProperty(config, key, { ...desc, writable: false, configurable: false });
        }
    }
    return config;
}
```

### Reflect.setPrototypeOf

Replaces `Object.setPrototypeOf()`.

With no exceptions configured, the following is considered **incorrect**:

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.setPrototypeOf({}, Object.prototype)
```

:::

With no exceptions configured, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.setPrototypeOf({}, Object.prototype)
```

:::

With `{ "exceptions": ["setPrototypeOf"] }`, the following is considered **correct**:

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["setPrototypeOf"] }]*/

Object.setPrototypeOf({}, Object.prototype)
Reflect.setPrototypeOf({}, Object.prototype)
```

:::

The following example shows `Reflect.setPrototypeOf` in a real-world scenario — setting an object's prototype chain for inheritance:

```js
function createErrorLike(message, code) {
    const err = { message, code };
    Reflect.setPrototypeOf(err, Error.prototype);
    return err;
}
```

## When Not to Use It

> [!WARNING]
> If your code runs in an ES3 / ES5 environment, do not enable this rule.

If your runtime environment is ES2015 (ES6) or later but you do not wish to receive suggestions to use Reflect, you can safely disable this rule.
