import test from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode } from '../src/index.js';

test('decode named references', () => {
  assert.equal(decode('&amp;'), '&');
  assert.equal(decode('&lt;'), '<');
  assert.equal(decode('&gt;'), '>');
  assert.equal(decode('&quot;'), '"');
  assert.equal(decode('&apos;'), "'");
  assert.equal(decode('&copy;'), '\u00A9');
  assert.equal(decode('&nbsp;'), '\u00A0');
});

test('decode decimal numeric references', () => {
  assert.equal(decode('&#65;'), 'A');
  assert.equal(decode('&#0038;'), '&');
  assert.equal(decode('&#8364;'), '\u20AC');
});

test('decode hexadecimal numeric references', () => {
  assert.equal(decode('&#x41;'), 'A');
  assert.equal(decode('&#X41;'), 'A');
  assert.equal(decode('&#x0026;'), '&');
  assert.equal(decode('&#x1F600;'), '\u{1F600}');
});

test('leave unknown named references untouched', () => {
  assert.equal(decode('&notarealentity;'), '&notarealentity;');
  assert.equal(decode('&amp'), '&amp');
});

test('handle mixed content', () => {
  assert.equal(decode('a &amp; b &lt; c'), 'a & b < c');
  assert.equal(decode('x&#65;y'), 'xAy');
});

test('replace invalid numeric code points with U+FFFD', () => {
  assert.equal(decode('&#0;'), '\uFFFD');
  assert.equal(decode('&#xD800;'), '\uFFFD');
  assert.equal(decode('&#x110000;'), '\uFFFD');
  assert.equal(decode('&#-1;'), '&#-1;'); // not a valid numeric reference, left alone
});

test('encode the five unsafe characters', () => {
  assert.equal(encode('&'), '&amp;');
  assert.equal(encode('<'), '&lt;');
  assert.equal(encode('>'), '&gt;');
  assert.equal(encode('"'), '&quot;');
  assert.equal(encode("'"), '&apos;');
});

test('encode leaves safe characters alone', () => {
  assert.equal(encode('hello world'), 'hello world');
  assert.equal(encode('caf\u00E9'), 'caf\u00E9');
  assert.equal(encode('\u{1F600}'), '\u{1F600}');
});

test('encode and decode round-trip', () => {
  const original = 'Tom & Jerry <3 "quotes" and \'apostrophes\'';
  const encoded = encode(original);
  assert.equal(encoded, 'Tom &amp; Jerry &lt;3 &quot;quotes&quot; and &apos;apostrophes&apos;');
  assert.equal(decode(encoded), original);
});

test('encode throws on non-string input', () => {
  assert.throws(() => encode(42), TypeError);
});

test('decode throws on non-string input', () => {
  assert.throws(() => decode(null), TypeError);
});
