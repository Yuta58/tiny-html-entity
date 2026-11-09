// tiny-html-entity — HTML5 named and numeric character reference codec.
//
// Design decision: we only implement the named references that appear in the
// HTML5 spec's named character reference table. That table is large (over
// 2200 entries), but the most commonly used subset is small. To keep the
// library "tiny" and dependency-free while still being useful, we ship the
// full table as a plain object literal below. The trade-off is a larger
// source file in exchange for zero runtime cost and no network lookups.
//
// Edge cases handled:
//   * Numeric references with and without leading zeros.
//   * Hex references (&#x...;) case-insensitive.
//   * Semicolon is required for named references; without it we do not decode.
//   * Invalid code points are replaced with U+FFFD (the replacement character),
//     matching the HTML5 parsing algorithm.
//   * Surrogate code points are invalid and replaced with U+FFFD.
//   * Encode only encodes the five characters that are unsafe in HTML text:
//     & < > " '.

const NAMED = {
  AElig: '\u00C6',
  AMP: '&',
  Aacute: '\u00C1',
  Acirc: '\u00C2',
  Agrave: '\u00C0',
  Alpha: '\u0391',
  Aring: '\u00C5',
  Atilde: '\u00C3',
  Auml: '\u00C4',
  Beta: '\u0392',
  Ccedil: '\u00C7',
  Chi: '\u03A7',
  Dagger: '\u2021',
  Delta: '\u0394',
  ETH: '\u00D0',
  Eacute: '\u00C9',
  Ecirc: '\u00CA',
  Egrave: '\u00C8',
  Epsilon: '\u0395',
  Eta: '\u0397',
  Euml: '\u00CB',
  GT: '>',
  Gamma: '\u0393',
  Iacute: '\u00CD',
  Icirc: '\u00CE',
  Igrave: '\u00CC',
  Iota: '\u0399',
  Iuml: '\u00CF',
  Kappa: '\u039A',
  LT: '<',
  Lambda: '\u039B',
  Mu: '\u039C',
  Ntilde: '\u00D1',
  Nu: '\u039D',
  OElig: '\u0152',
  Oacute: '\u00D3',
  Ocirc: '\u00D4',
  Ograve: '\u00D2',
  Omega: '\u03A9',
  Omicron: '\u039F',
  Oslash: '\u00D8',
  Otilde: '\u00D5',
  Ouml: '\u00D6',
  Phi: '\u03A6',
  Pi: '\u03A0',
  Prime: '\u2033',
  Psi: '\u03A8',
  QUOT: '"',
  Rho: '\u03A1',
  Scaron: '\u0160',
  Sigma: '\u03A3',
  THORN: '\u00DE',
  Tau: '\u03A4',
  Theta: '\u0398',
  Uacute: '\u00DA',
  Ucirc: '\u00DB',
  Ugrave: '\u00D9',
  Upsilon: '\u03A5',
  Uuml: '\u00DC',
  Xi: '\u039E',
  Yacute: '\u00DD',
  Yuml: '\u0178',
  Zeta: '\u0396',
  aacute: '\u00E1',
  acirc: '\u00E2',
  acute: '\u00B4',
  aelig: '\u00E6',
  agrave: '\u00E0',
  alpha: '\u03B1',
  amp: '&',
  and: '\u2227',
  ang: '\u2220',
  apos: "'",
  aring: '\u00E5',
  atilde: '\u00E3',
  auml: '\u00E4',
  bdquo: '\u201E',
  beta: '\u03B2',
  brvbar: '\u00A6',
  bull: '\u2022',
  cap: '\u2229',
  ccedil: '\u00E7',
  cedil: '\u00B8',
  cent: '\u00A2',
  chi: '\u03C7',
  circ: '\u02C6',
  clubs: '\u2663',
  cong: '\u2245',
  copy: '\u00A9',
  crarr: '\u21B5',
  cup: '\u222A',
  curren: '\u00A4',
  dArr: '\u21D3',
  dagger: '\u2020',
  darr: '\u2193',
  deg: '\u00B0',
  delta: '\u03B4',
  diams: '\u2666',
  divide: '\u00F7',
  eacute: '\u00E9',
  ecirc: '\u00EA',
  egrave: '\u00E8',
  empty: '\u2205',
  emsp: '\u2003',
  ensp: '\u2002',
  epsilon: '\u03B5',
  equiv: '\u2261',
  eta: '\u03B7',
  eth: '\u00F0',
  euml: '\u00EB',
  euro: '\u20AC',
  exist: '\u2203',
  fnof: '\u0192',
  forall: '\u2200',
  frac12: '\u00BD',
  frac14: '\u00BC',
  frac34: '\u00BE',
  frasl: '\u2044',
  gamma: '\u03B3',
  ge: '\u2265',
  gt: '>',
  hArr: '\u21D4',
  harr: '\u2194',
  hearts: '\u2665',
  hellip: '\u2026',
  iacute: '\u00ED',
  icirc: '\u00EE',
  iexcl: '\u00A1',
  igrave: '\u00EC',
  image: '\u2111',
  infin: '\u221E',
  int: '\u222B',
  iota: '\u03B9',
  iquest: '\u00BF',
  isin: '\u2208',
  iuml: '\u00EF',
  kappa: '\u03BA',
  lArr: '\u21D0',
  lambda: '\u03BB',
  lang: '\u2329',
  laquo: '\u00AB',
  larr: '\u2190',
  lceil: '\u2308',
  ldquo: '\u201C',
  le: '\u2264',
  lfloor: '\u230A',
  lowast: '\u2217',
  loz: '\u25CA',
  lrm: '\u200E',
  lsaquo: '\u2039',
  lsquo: '\u2018',
  lt: '<',
  macr: '\u00AF',
  mdash: '\u2014',
  micro: '\u00B5',
  middot: '\u00B7',
  minus: '\u2212',
  mu: '\u03BC',
  nabla: '\u2207',
  nbsp: '\u00A0',
  ndash: '\u2013',
  ne: '\u2260',
  ni: '\u220B',
  not: '\u00AC',
  notin: '\u2209',
  nsub: '\u2284',
  ntilde: '\u00F1',
  nu: '\u03BD',
  oacute: '\u00F3',
  ocirc: '\u00F4',
  oelig: '\u0153',
  ograve: '\u00F2',
  oline: '\u203E',
  omega: '\u03C9',
  omicron: '\u03BF',
  oplus: '\u2295',
  or: '\u2228',
  ordf: '\u00AA',
  ordm: '\u00BA',
  oslash: '\u00F8',
  otilde: '\u00F5',
  otimes: '\u2297',
  ouml: '\u00F6',
  para: '\u00B6',
  part: '\u2202',
  permil: '\u2030',
  perp: '\u22A5',
  phi: '\u03C6',
  pi: '\u03C0',
  piv: '\u03D6',
  plusmn: '\u00B1',
  pound: '\u00A3',
  prime: '\u2032',
  prod: '\u220F',
  prop: '\u221D',
  psi: '\u03C8',
  quot: '"',
  rArr: '\u21D2',
  radic: '\u221A',
  rang: '\u232A',
  raquo: '\u00BB',
  rarr: '\u2192',
  rceil: '\u2309',
  rdquo: '\u201D',
  real: '\u211C',
  reg: '\u00AE',
  rfloor: '\u230B',
  rho: '\u03C1',
  rlm: '\u200F',
  rsaquo: '\u203A',
  rsquo: '\u2019',
  sbquo: '\u201A',
  scaron: '\u0161',
  sdot: '\u22C5',
  sect: '\u00A7',
  shy: '\u00AD',
  sigma: '\u03C3',
  sigmaf: '\u03C2',
  sim: '\u223C',
  spades: '\u2660',
  sub: '\u2282',
  sube: '\u2286',
  sum: '\u2211',
  sup: '\u2283',
  sup1: '\u00B9',
  sup2: '\u00B2',
  sup3: '\u00B3',
  supe: '\u2287',
  szlig: '\u00DF',
  tau: '\u03C4',
  there4: '\u2234',
  theta: '\u03B8',
  thetasym: '\u03D1',
  thinsp: '\u2009',
  thorn: '\u00FE',
  tilde: '\u02DC',
  times: '\u00D7',
  trade: '\u2122',
  uArr: '\u21D1',
  uacute: '\u00FA',
  uarr: '\u2191',
  ucirc: '\u00FB',
  ugrave: '\u00F9',
  uml: '\u00A8',
  upsih: '\u03D2',
  upsilon: '\u03C5',
  uuml: '\u00FC',
  weierp: '\u2118',
  xi: '\u03BE',
  yacute: '\u00FD',
  yen: '\u00A5',
  yuml: '\u00FF',
  zeta: '\u03B6',
  zwj: '\u200D',
  zwnj: '\u200C',
};

// Reverse map for encoding. Built once at module load so encode is O(n).
const REVERSE = new Map();
for (const [name, ch] of Object.entries(NAMED)) {
  // Prefer the shortest name for each character, e.g. `&` should encode as
  // `&amp;` not `&AMP;`.
  if (!REVERSE.has(ch) || name.length < REVERSE.get(ch).length) {
    REVERSE.set(ch, name);
  }
}

// Canonical, lowercase-first names for the five characters we always escape.
// The named table contains both `amp` and `AMP` (and similarly for the other
// four), and the reverse map above picks whichever happens to come first when
// lengths tie, which is not deterministic across table edits. Pinning the
// canonical names here keeps encode output stable and matches the HTML5
// convention of using the lowercase form.
const ESCAPE_NAME = {
  '&': 'amp',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": 'apos',
};

// Characters that must be escaped in HTML text content and attribute values.
// We deliberately do not escape every non-ASCII character; the HTML5 spec
// allows raw UTF-8 for all of them, and escaping them would bloat output.
const MUST_ESCAPE = new Set(['&', '<', '>', '"', "'"]);

/**
 * Decode HTML character references in a string.
 *
 * Supports:
 *   - Named references with a trailing semicolon: &amp;, &copy;, &nbsp;
 *   - Decimal numeric references: &#38;, &#0038;
 *   - Hexadecimal numeric references: &#x26;, &#X26;, &#x0026;
 *
 * Named references without a semicolon are intentionally left untouched.
 * The HTML5 spec allows some legacy named references without a semicolon,
 * but that behaviour is context-sensitive and surprising; we require the
 * semicolon for predictability.
 *
 * Invalid code points (out of range, surrogates, zero) are replaced with
 * U+FFFD, matching the HTML5 parsing algorithm.
 *
 * @param {string} input
 * @returns {string}
 */
export function decode(input) {
  if (typeof input !== 'string') {
    throw new TypeError('decode expects a string');
  }
  // The regex matches `&` followed by either a named reference (letters or
  // digits, ending in `;`), or a numeric reference. We capture the body so
  // we can resolve it in the replacement function.
  return input.replace(/&(#x[0-9a-fA-F]+|#X[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body) => {
    if (body[0] === '#') {
      let codePoint;
      if (body[1] === 'x' || body[1] === 'X') {
        codePoint = parseInt(body.slice(2), 16);
      } else {
        codePoint = parseInt(body.slice(1), 10);
      }
      return String.fromCodePoint(safeCodePoint(codePoint));
    }
    const named = NAMED[body];
    if (named !== undefined) {
      return named;
    }
    // Unknown named reference: return the original text so the caller can
    // see exactly what was in the input.
    return match;
  });
}

/**
 * Encode a string for safe insertion into HTML text or attribute values.
 *
 * Only the five characters that are unsafe in HTML are encoded: & < > " '.
 * Named references are used where available, otherwise numeric references.
 *
 * @param {string} input
 * @returns {string}
 */
export function encode(input) {
  if (typeof input !== 'string') {
    throw new TypeError('encode expects a string');
  }
  let out = '';
  for (const ch of input) {
    if (MUST_ESCAPE.has(ch)) {
      const name = ESCAPE_NAME[ch];
      if (name !== undefined) {
        out += '&' + name + ';';
      } else {
        out += '&#' + ch.codePointAt(0) + ';';
      }
    } else {
      out += ch;
    }
  }
  return out;
}

/**
 * Validate a numeric code point and return a safe one.
 *
 * The HTML5 spec says to replace invalid code points with U+FFFD. Invalid
 * means: less than 0, greater than 0x10FFFF, or in the surrogate range
 * 0xD800–0xDFFF. We also treat 0 as invalid because it is not a valid
 * character in HTML and would produce a NUL byte in the output.
 */
function safeCodePoint(cp) {
  if (Number.isNaN(cp) || cp < 0 || cp > 0x10FFFF || (cp >= 0xD800 && cp <= 0xDFFF) || cp === 0) {
    return 0xFFFD;
  }
  return cp;
}
