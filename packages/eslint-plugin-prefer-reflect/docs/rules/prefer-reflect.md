---
title: @annangela/prefer-reflect
layout: doc
rule_type: suggestion
related_rules:
- no-useless-call
- prefer-spread
- no-delete-var
---

这是 ESLint 原始 `prefer-reflect` 思路的现代化版本。

ES6 的 Reflect API 提供了一组方法，可用于替代旧构造器或旧语法中的对应写法：

* [`Reflect.apply`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.apply) 可替代 [`Function.prototype.apply`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-function.prototype.apply)
* [`Reflect.apply`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.apply) 也可用于替代 [`Function.prototype.call`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-function.prototype.call)
* [`Reflect.defineProperty`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.defineproperty) 可替代 [`Object.defineProperty`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.defineproperty)
* [`Reflect.deleteProperty`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.deleteproperty) 可替代 [`delete` 关键字](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-delete-operator-runtime-semantics-evaluation)
* [`Reflect.getOwnPropertyDescriptor`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.getownpropertydescriptor) 可替代 [`Object.getOwnPropertyDescriptor`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.getownpropertydescriptor)
* [`Reflect.getPrototypeOf`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.getprototypeof) 可替代 [`Object.getPrototypeOf`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.getprototypeof)
* [`Reflect.has`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.has) 可替代 [`in` 关键字](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-relational-operators)
* [`Reflect.setPrototypeOf`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.setprototypeof) 可替代 [`Object.setPrototypeOf`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.setprototypeof)
* [`Reflect.isExtensible`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.isextensible) 可替代 [`Object.isExtensible`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.isextensible)
* [`Reflect.ownKeys`](https://tc39.es/ecma262/multipage/reflection.html#sec-reflect.ownkeys) 可替代 [`Object.getOwnPropertyNames`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.getownpropertynames)
* [`Reflect.preventExtensions`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-reflect.preventextensions) 可替代 [`Object.preventExtensions`](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-object.preventextensions)

`prefer-reflect` 规则会标记这些旧写法，并提示改用 Reflect 版本。

## 规则细节

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

提示：如果你想阻止删除变量，请改用 [no-delete-var](no-delete-var)。

启用 `{ "exceptions": ["delete"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["delete"] }]*/

delete bar
delete foo.bar
Reflect.deleteProperty(foo, 'bar');
```

:::

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

### Reflect.getPrototypeOf

用于替代 `Object.getPrototypeOf()`。

未配置例外时，以下代码会被视为 **错误**：

::: incorrect

```js
/*eslint @annangela/prefer-reflect: "error"*/

Object.getPrototypeOf({}, 'foo')
```

:::

未配置例外时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: "error"*/

Reflect.getPrototypeOf({}, 'foo')
```

:::

启用 `{ "exceptions": ["getPrototypeOf"] }` 时，以下代码会被视为 **正确**：

::: correct

```js
/*eslint @annangela/prefer-reflect: ["error", { "exceptions": ["getPrototypeOf"] }]*/

Object.getPrototypeOf({}, 'foo')
Reflect.getPrototypeOf({}, 'foo')
```

:::

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

### Reflect.ownKeys

用于替代 `Object.getOwnPropertyNames()`。

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

## 何时不应使用

如果你的代码运行在 ES3 / ES5 环境中，不应启用这条规则。

如果你的运行环境是 ES2015（ES6）及以上，但你并不希望收到“这里可以改用 Reflect”的提示，也可以安全地关闭这条规则。
