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
> This document is also available in [English](./prefer-reflect.en.md).

这是 ESLint 原始 `prefer-reflect` 思路的现代化版本。

ES6 的 Reflect API 提供了一组方法，可用于替代旧构造器或旧语法中的对应写法：

* [`Reflect.apply`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.apply) 可替代 [`Function.prototype.apply`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.apply)
* [`Reflect.apply`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.apply) 也可用于替代 [`Function.prototype.call`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.call)
* [`Reflect.defineProperty`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.defineproperty) 可替代 [`Object.defineProperty`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.defineproperty)
* [`Reflect.deleteProperty`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.deleteproperty) 可替代 [`delete` 关键字](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-delete-operator)
* [`Reflect.getOwnPropertyDescriptor`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.getownpropertydescriptor) 可替代 [`Object.getOwnPropertyDescriptor`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getownpropertydescriptor)
* [`Reflect.getPrototypeOf`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.getprototypeof) 可替代 [`Object.getPrototypeOf`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getprototypeof)
* [`Reflect.has`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.has) 可替代 [`in` 关键字](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-relational-operators)
* [`Reflect.setPrototypeOf`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.setprototypeof) 可替代 [`Object.setPrototypeOf`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.setprototypeof)
* [`Reflect.isExtensible`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.isextensible) 可替代 [`Object.isExtensible`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.isextensible)
* [`Reflect.ownKeys`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.ownkeys) 可替代 [`Object.getOwnPropertyNames`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getownpropertynames)
* [`Reflect.preventExtensions`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.preventextensions) 可替代 [`Object.preventExtensions`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.preventextensions)

`prefer-reflect` 规则会标记这些旧写法，并提示改用 Reflect 版本。

大部分场景下该规则可自动修复。运行 `eslint --fix` 即可将旧写法替换为对应的 Reflect API 调用。对于无法安全自动修复的边界情况（例如 `delete` 非成员表达式、`func.call(...all)` 中展开在 thisArg 位置的复杂表达式），规则会提供代码建议（suggestion）供手动选择。

## 配置项

### `exceptions`

```js
"prefer-reflect": [<enabled>, { "exceptions": [<...exceptions>] }]
```

`exceptions` 允许你传入一个 Reflect 方法名数组，用来声明哪些 Reflect 方法不强制使用。

例如，如果你想启用大部分 Reflect 写法，但仍允许继续使用 `Function.prototype.apply`，可以这样配置：

`prefer-reflect: [2, { "exceptions": ["apply"] }]`

如果你想继续使用 `delete` 关键字（对应的方法名为 `deleteProperty`），则可以这样配置：

`prefer-reflect: [2, { "exceptions": ["deleteProperty"] }]`

这些例外项可以自由组合。如果你把所有方法都列入例外（这也基本等于关闭这条规则），则可写成：

`prefer-reflect: [2, { "exceptions": [ "apply", "defineProperty", "deleteProperty", "getOwnPropertyDescriptor", "getPrototypeOf", "has", "isExtensible", "ownKeys", "preventExtensions", "setPrototypeOf" ] }]`

### Reflect.apply

用于替代 `Function.prototype.apply()` 和 `Function.prototype.call()`。

未配置例外时，以下代码会被视为 **错误**：

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

未配置例外时，以下代码会被视为 **正确**：

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

启用 `{ "exceptions": ["apply"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["apply"] }]*/

// 除 Reflect.apply(...) 外，也允许以下写法：
myFunction.apply(undefined, args);
myFunction.apply(null, args);
obj.myMethod.apply(obj, args);
obj.myMethod.apply(other, args);
```

:::

启用 `{ "exceptions": ["apply"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["apply"] }]*/

// 除 Reflect.apply(...) 外，也允许以下写法：
myFunction.call(undefined, arg);
myFunction.call(null, arg);
obj.myMethod.call(obj, arg);
obj.myMethod.call(other, arg);
```

:::

以下示例展示了 `Reflect.apply` 在实际场景中的用法 — 动态调用回调函数时，`thisArg` 由运行时决定：

```js
function invokeCallback(callback, context, args) {
    return Reflect.apply(callback, context, args);
}

// 根据上下文动态调用
invokeCallback(user.onSave, user, [formData]);
```

### Reflect.defineProperty

用于替代 `Object.defineProperty()`。

未配置例外时，以下代码会被视为 **错误**：

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.defineProperty({}, 'foo', {value: 1})
```

:::

未配置例外时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.defineProperty({}, 'foo', {value: 1})
```

:::

启用 `{ "exceptions": ["defineProperty"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["defineProperty"] }]*/

Object.defineProperty({}, 'foo', {value: 1})
Reflect.defineProperty({}, 'foo', {value: 1})
```

:::

以下示例展示了 `Reflect.defineProperty` 在实际场景中的用法 — 根据条件动态定义属性的描述符：

```js
function defineIfWritable(obj, key, value) {
    if (Reflect.defineProperty(obj, key, { value, writable: true, configurable: true })) {
        return obj[key];
    }
    return undefined;
}
```

### Reflect.deleteProperty

用于替代 `delete` 关键字。

未配置例外时，以下代码会被视为 **错误**：

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

delete foo.bar; // 删除对象属性
```

:::

未配置例外时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

delete bar; // 删除变量
Reflect.deleteProperty(foo, 'bar');
```

:::

> [!TIP]
> 如果你想阻止删除变量，请改用 [no-delete-var](https://eslint.org/docs/latest/rules/no-delete-var)。

启用 `{ "exceptions": ["deleteProperty"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["deleteProperty"] }]*/

delete bar
delete foo.bar
Reflect.deleteProperty(foo, 'bar');
```

:::

以下示例展示了 `Reflect.deleteProperty` 在实际场景中的用法 — 清理缓存中的临时条目：

```js
function clearCacheEntry(cache, key) {
    if (Reflect.has(cache, key)) {
        Reflect.deleteProperty(cache, key);
    }
}
```

### Reflect.getOwnPropertyDescriptor

用于替代 `Object.getOwnPropertyDescriptor()`。

未配置例外时，以下代码会被视为 **错误**：

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.getOwnPropertyDescriptor({}, 'foo')
```

:::

未配置例外时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.getOwnPropertyDescriptor({}, 'foo')
```

:::

启用 `{ "exceptions": ["getOwnPropertyDescriptor"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["getOwnPropertyDescriptor"] }]*/

Object.getOwnPropertyDescriptor({}, 'foo')
Reflect.getOwnPropertyDescriptor({}, 'foo')
```

:::

以下示例展示了 `Reflect.getOwnPropertyDescriptor` 在实际场景中的用法 — 检查属性是否为只读：

```js
function isReadOnly(obj, key) {
    const desc = Reflect.getOwnPropertyDescriptor(obj, key);
    return desc ? desc.writable === false : false;
}
```

### Reflect.getPrototypeOf

用于替代 `Object.getPrototypeOf()`。

未配置例外时，以下代码会被视为 **错误**：

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.getPrototypeOf({})
```

:::

未配置例外时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.getPrototypeOf({})
```

:::

启用 `{ "exceptions": ["getPrototypeOf"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["getPrototypeOf"] }]*/

Object.getPrototypeOf({})
Reflect.getPrototypeOf({})
```

:::

以下示例展示了 `Reflect.getPrototypeOf` 在实际场景中的用法 — 检查对象是否继承自特定原型：

```js
function isInstanceOf(obj, constructor) {
    return Reflect.getPrototypeOf(obj) === constructor.prototype;
}
```

### Reflect.has

用于替代 `in` 关键字。

未配置例外时，以下代码会被视为 **错误**：

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

'foo' in {}; // 判断对象属性是否存在
```

:::

未配置例外时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.has({}, 'foo');
```

:::

启用 `{ "exceptions": ["has"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["has"] }]*/

'foo' in {};
Reflect.has({}, 'foo');
```

:::

以下示例展示了 `Reflect.has` 在实际场景中的用法 — 安全地检查对象是否拥有某属性：

```js
function getOption(options, key, defaultValue) {
    return Reflect.has(options, key) ? options[key] : defaultValue;
}
```

### Reflect.isExtensible

用于替代 `Object.isExtensible()`。

未配置例外时，以下代码会被视为 **错误**：

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.isExtensible({})
```

:::

未配置例外时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.isExtensible({})
```

:::

启用 `{ "exceptions": ["isExtensible"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["isExtensible"] }]*/

Object.isExtensible({})
Reflect.isExtensible({})
```

:::

以下示例展示了 `Reflect.isExtensible` 在实际场景中的用法 — 在添加属性前检查对象是否可扩展：

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

用于替代 `Object.getOwnPropertyNames()`。

> ⚠️ **语义差异警告**：`Object.getOwnPropertyNames` 只返回字符串键，而 `Reflect.ownKeys` 同时返回字符串键和 Symbol 键。本规则对此替换仅提供 **suggestion**（非 auto-fix），请在接受建议前确认你的代码不依赖仅返回字符串键的行为。

未配置例外时，以下代码会被视为 **错误**：

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.getOwnPropertyNames({})
```

:::

未配置例外时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.ownKeys({})
```

:::

启用 `{ "exceptions": ["ownKeys"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["ownKeys"] }]*/

Object.getOwnPropertyNames({})
Reflect.ownKeys({})
```

:::

以下示例展示了 `Reflect.ownKeys` 在实际场景中的用法 — 获取对象的所有键（包括 Symbol 类型的键）：

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

用于替代 `Object.preventExtensions()`。

未配置例外时，以下代码会被视为 **错误**：

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.preventExtensions({})
```

:::

未配置例外时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.preventExtensions({})
```

:::

启用 `{ "exceptions": ["preventExtensions"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["preventExtensions"] }]*/

Object.preventExtensions({})
Reflect.preventExtensions({})
```

:::

以下示例展示了 `Reflect.preventExtensions` 在实际场景中的用法 — 冻结配置对象以防止意外修改：

```js
function sealConfig(config) {
    // 先阻止扩展，再逐一冻结属性
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

用于替代 `Object.setPrototypeOf()`。

未配置例外时，以下代码会被视为 **错误**：

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.setPrototypeOf({}, Object.prototype)
```

:::

未配置例外时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.setPrototypeOf({}, Object.prototype)
```

:::

启用 `{ "exceptions": ["setPrototypeOf"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["setPrototypeOf"] }]*/

Object.setPrototypeOf({}, Object.prototype)
Reflect.setPrototypeOf({}, Object.prototype)
```

:::

以下示例展示了 `Reflect.setPrototypeOf` 在实际场景中的用法 — 设置对象的原型链以实现继承：

```js
function createErrorLike(message, code) {
    const err = { message, code };
    Reflect.setPrototypeOf(err, Error.prototype);
    return err;
}
```

## 何时不应使用

> [!WARNING]
> 如果你的代码运行在 ES3 / ES5 环境中，不应启用这条规则。

如果你的运行环境是 ES2015（ES6）及以上，但你并不希望收到“这里可以改用 Reflect”的提示，也可以安全地关闭这条规则。
