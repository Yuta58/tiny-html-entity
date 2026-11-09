# tiny-html-entity

A zero-dependency HTML5 character reference codec: decode named and numeric entities, encode unsafe characters.

## Usage

```js
import { encode, decode } from './src/index.js';

decode('Tom &amp; Jerry &lt;3');   // 'Tom & Jerry <3'
decode('&#x1F600;');              // '😀'
encode('Tom & Jerry <3');         // 'Tom &amp; Jerry &lt;3'
```

## Why this exists

Most HTML entity libraries either pull in a large data package or only handle a handful of entities. This one ships the full HTML5 named character reference table as a plain object literal, so it has zero dependencies and works offline. The trade-off is a larger source file in exchange for no runtime cost and no network lookups.

## The awkward edge

Named references without a trailing semicolon are not decoded. The HTML5 spec permits some legacy references without a semicolon, but that behaviour is context-sensitive and surprising. We require the semicolon for predictability: `&amp` stays as `&amp`, while `&amp;` becomes `&`.
