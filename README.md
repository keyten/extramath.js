# extramath.js

## Classes
The next classes are available:
 - BigNumber
 - Fraction
 - Complex
 - IntMod
 - Matrix
 - Set
 - Function

```js
// code is here
```

## Expressions
```js
em.exec('sin(0)'); // 0
```

Using context:
```js
var context = {};
em.exec('a = [1, 2, 3]', context);
context.a; // em.Matrix([1, 2, 3])
em.exec('exp(a)', context); // em.Matrix([...])
```
