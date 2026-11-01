/**
 * Signal hero shader (WebGL2): ordered dithering on round dots. The section is a grid of dots on the
 * lattice; each layer works out a density per dot, and the dot is drawn as an anti-aliased disc whose
 * radius follows the Bayer 8x8 decision, blended toward a true halftone (radius from density) by uHalftone.
 * Greys and the sage, with colour in two places: systems' modules, turning round the hue wheel, and
 * designer's fill, one solid colour for the whole word, turning from ink to ink. Layers, back to front: the glyph
 * lattice (one DNA glyph per grid node, the ladder from a dot to a double cross, resting as the + marks),
 * the three words, the one mark, and the sage wake. A wave of glyphs carries the made world out from the
 * one mark (uBloomR); the glyphs settle heavier where the title will stand (uLatent), and the words
 * resolve out of them. Each word has its own play: intelligent carries signals along its letters; systems
 * is cut into grid modules that shift like a register; designer drops to its outline over a construction
 * of cell lines and is coloured in.
 * The pointer's trail bends the dot grid like a lens and leaves a sage halftone wash that spreads and fades.
 * In the upper right, after the genesis, the field keeps evolving on its own (uEvo): an atom, a molecule
 * turning, a cell dividing, each large and cropped by the edges, lit like a sphere and coloured in a soft
 * psychedelic gradient, drawn as dense 1-bit bitmap in ordered dither with a grain of pixel noise, mostly
 * white; one dissolves into the next.
 * Scrolling away, each part leaves as it slides up under the nav: the words drift off and the field
 * dissolves there in ordered dither (uExit, uTop), so what is still in view stays whole.
 */

/** The pointer's trail slots. */
export const TRAIL = 48

export const vertex = /* glsl */ `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

export const fragment = /* glsl */ `#version 300 es
precision highp float;
precision highp int;

uniform vec2 uRes;        // section, CSS px
uniform float uDpr;
uniform float uTime;      // field clock, s
uniform float uDot;       // dot pitch, CSS px
uniform float uDotFill;   // dot diameter as a share of the pitch
uniform float uHalftone;  // 0 ordered (on/off), 1 halftone (radius from density)
uniform float uRound;     // 0 square dots, 1 round
uniform vec2 uOrigin;     // dot grid origin (the lattice), CSS px
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uSage;       // the accent: the wake's ink
uniform vec3 uSageLight;
uniform vec3 uSageDeep;
uniform vec3 uFill;       // designer's fill: one colour, turning through the palette
uniform sampler2D uMaskA; // the words, sharp: R intelligent, G systems, B designer
uniform sampler2D uMaskB; // the same, blurred
uniform vec3 uOff;        // each word's x offset, CSS px (the title breaking apart)
uniform vec3 uForm;       // each word gathered, 0 to 1
uniform float uI;         // intelligent: its signals
uniform vec2 uS;          // systems: amount, step (0 to 4)
uniform vec2 uD;          // designer: outline, fill
uniform vec4 uDBox;       // designer's line: ink x0, cap top, ink x1, baseline (unshifted)
uniform vec4 uSBox;       // systems' line, the same
uniform float uAdv;       // one character's advance, CSS px
uniform float uFuse;
uniform vec3 uDim;        // each word stepped back to grey, 0 to 1
uniform vec3 uGrey;       // the greys: mid (the words stepped back)
uniform vec3 uGreyLight;  // and light (the resting marks)
uniform vec3 uIri[6];     // the evolving forms' light: a loop of soft pastels
uniform float uEvoS;      // their strength: 1 soft, more for a denser, stronger tone
uniform float uExit;      // leaving: the dissolve under the nav, 0 off to 1 on
uniform float uTop;       // the section's top in the viewport, CSS px
uniform float uNav;       // the nav's height, CSS px
uniform vec3 uExitW;      // each word leaving, 0 to 1
uniform vec3 uSysCol;     // systems' colour, its hue turning with the register
uniform vec2 uCenter;
uniform float uBit;       // the one mark
uniform float uBloomR;    // radius of the made world, CSS px
uniform float uLatent;    // the title latent in the glyphs
uniform vec3 uEvo;        // the evolving forms: centre x, y and radius, CSS px
uniform float uEvoA;      // their amount, 0 to 1
uniform float uEvoT;      // their clock, s (never resets: they keep evolving across loops)
uniform float uGridStep;
uniform vec2 uGridOrigin; // a grid node: the lattice's left edge on the section's top row, CSS px
uniform float uGrid;
uniform vec4 uQuiet;      // the copy at the foot, CSS px: the field keeps off it
uniform vec2 uBands;      // HUD rows: the field keeps off the top y0 and the bottom y1 px
uniform vec4 uTrail[${TRAIL}]; // pointer trail: x, y (CSS px), age 0 to 1, strength
uniform float uWake;      // wake strength (lab)

out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Bayer 8x8 threshold in (0, 1), by bit interleaving.
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float bayer(ivec2 p) {
  int x = p.x & 7;
  int y = p.y & 7;
  int q = x ^ y;
  int v = ((q & 1) << 5) | ((x & 1) << 4) | ((q & 2) << 2) | ((x & 2) << 1) | ((q & 4) >> 1) | ((x & 4) >> 2);
  return (float(v) + 0.5) / 64.0;
}

// Distance from the dot's centre, q in -0.5 to 0.5: round or square by uRound.
float dotDist(vec2 q) {
  return mix(max(abs(q.x), abs(q.y)), length(q), uRound);
}

// Anti-aliased coverage of a dot of radius r (in pitches).
float disc(vec2 q, float r) {
  if (r <= 0.0) return 0.0;
  return clamp((r - dotDist(q)) * uDot * uDpr + 0.5, 0.0, 1.0);
}

// Radius of a dot of density d (0 to 1) at threshold th. Ordered: full size when d clears th, else
// nothing; halftone: the radius grows with density.
float dotR(float d, float th) {
  d = clamp(d, 0.0, 1.0);
  float full = 0.5 * uDotFill;
  return mix(step(th, d) * full, full * sqrt(d) * 1.12, uHalftone);
}

float dotCov(vec2 q, float d, float th) {
  return disc(q, dotR(d, th));
}

// Dense dots swell until they merge, so near-full density reads as ink, not grey.
float inkCov(vec2 q, float d, float th) {
  return disc(q, dotR(d, th) * (1.0 + 0.8 * smoothstep(0.5, 1.0, d)));
}

// Dot shapes: 0 round, 1 square, 2 ring, 3 plus. Radius r in pitches.
float shapeCov(vec2 q, float r, float kind) {
  if (r <= 0.0) return 0.0;
  float px = uDot * uDpr;
  vec2 a = abs(q);
  if (kind < 0.5) return disc(q, r);
  if (kind < 1.5) return clamp((r * 0.9 - max(a.x, a.y)) * px + 0.5, 0.0, 1.0);
  if (kind < 2.5) {
    float rr = r * 1.2;
    float l = length(q);
    return clamp((rr - l) * px + 0.5, 0.0, 1.0) * clamp((l - rr * 0.5) * px + 0.5, 0.0, 1.0);
  }
  float bar = min(max(a.x - r * 0.38, a.y - r * 1.25), max(a.y - r * 0.38, a.x - r * 1.25));
  return clamp(-bar * px + 0.5, 0.0, 1.0);
}

float cover(float d, float px) {
  return clamp(0.5 - d / px, 0.0, 1.0);
}

float segment(vec2 q, vec2 a, vec2 b) {
  vec2 pa = q - a;
  vec2 ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
}

// The DNA glyphs, as the site's hero draws them: q in CSS px from the node, px CSS px per device pixel.
// 1 low dot, 2 dot, 3 colon, 4 plus, 5 cross, 6 diamond, 7 box lines (run to the cell edges, so
// neighbours join into lines), 8 double cross, 9 square.
float glyphShape(int level, vec2 q, float px) {
  const float HW = 0.625;
  if (level <= 0) return 0.0;
  if (level == 1) return cover(length(q - vec2(0.0, 3.5)) - 1.5, px);
  if (level == 2) return cover(length(q) - 2.0, px);
  if (level == 3) return max(cover(length(q - vec2(0.0, -2.5)) - 1.5, px), cover(length(q - vec2(0.0, 2.5)) - 1.5, px));
  if (level == 4) return cover(min(segment(q, vec2(-5.0, 0.0), vec2(5.0, 0.0)), segment(q, vec2(0.0, -5.0), vec2(0.0, 5.0))) - HW, px);
  if (level == 5) return cover(min(segment(q, vec2(-4.0), vec2(4.0)), segment(q, vec2(-4.0, 4.0), vec2(4.0, -4.0))) - HW, px);
  if (level == 6) return cover(abs(abs(q.x) + abs(q.y) - 5.0) * 0.70710678 - HW, px);
  if (level == 7) return cover(min(abs(q.x), abs(q.y)) - HW, px);
  if (level == 8) {
    if (max(abs(q.x), abs(q.y)) > 6.0) return 0.0;
    return cover(min(min(abs(q.x - 2.0), abs(q.x + 2.0)), min(abs(q.y - 2.0), abs(q.y + 2.0))) - HW, px);
  }
  vec2 e = abs(q) - vec2(4.0);
  return cover(length(max(e, 0.0)) + min(max(e.x, e.y), 0.0), px);
}

// A sphere of radius rr at c (z towards the viewer), lit from L: its coverage, its light (0 to 1, with the
// rim's fresnel), its depth at p, and its normal's angle, which sets the hue.
vec4 ball(vec2 p, vec2 c, float rr, float zc, vec3 L) {
  vec2 d = (p - c) / rr;
  float q = dot(d, d);
  if (q >= 1.0) return vec4(0.0, 0.0, -9.0, 0.0);
  vec3 n = vec3(d, sqrt(1.0 - q));
  float lam = max(dot(n, L), 0.0);
  float fres = pow(1.0 - n.z, 2.0);
  return vec4(1.0, clamp(0.25 + 0.75 * lam + 0.4 * fres, 0.0, 1.0), zc + n.z * rr, atan(n.y, n.x) * 0.16 + n.z * 0.5);
}

// The evolving forms at p (in radii from their centre), time tt: coverage (0 to 1), light (0 dark to 1
// white), and a hue coordinate for the gradient. 0 an atom, 1 a molecule, 2 a cell dividing.
const float FORM_S = 11.0;
vec3 evoForm(int f, vec2 p, float tt) {
  vec3 L = normalize(vec3(-0.55, -0.65, 0.55));
  if (f == 0) {
    // An atom: a nucleus of packed spheres, three orbitals tilted round it, an electron on each.
    vec3 o = vec3(0.0, 0.0, 0.0);
    float zb = -9.0;
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      vec2 c = i == 0 ? vec2(0.0) : vec2(cos(fi * 1.047 + tt * 0.2), sin(fi * 1.047 + tt * 0.2)) * 0.12;
      vec4 b = ball(p, c, 0.11, i == 0 ? 0.08 : 0.0, L);
      if (b.x > 0.0 && b.z > zb) {
        zb = b.z;
        o = vec3(1.0, b.y * 0.85, b.w + fi * 0.13);
      }
    }
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float a = fi * 1.047 + tt * 0.06;
      vec2 rp = vec2(cos(a) * p.x + sin(a) * p.y, -sin(a) * p.x + cos(a) * p.y);
      vec2 e = rp / vec2(0.92, 0.3);
      float band = abs(length(e) - 1.0) * 0.3;
      float ring = 1.0 - smoothstep(0.006, 0.018, band);
      if (ring > 0.0 && o.x < 0.5) o = vec3(ring * 0.75, 0.75, atan(e.y, e.x) * 0.16 + fi * 0.33);
      float ea = tt * (0.7 + 0.25 * fi) + fi * 2.0;
      vec2 ep = vec2(cos(ea) * 0.92, sin(ea) * 0.3);
      vec2 ew = vec2(cos(a) * ep.x - sin(a) * ep.y, sin(a) * ep.x + cos(a) * ep.y);
      vec4 b = ball(p, ew, 0.045, 0.3, L);
      if (b.x > 0.0) o = vec3(1.0, b.y, 0.6 + fi * 0.2);
    }
    return o;
  }
  if (f == 1) {
    // A molecule: spheres bonded, turning slowly about two axes, nearest drawn over farthest.
    float ay = tt * 0.25;
    float ax = 0.35 + 0.2 * sin(tt * 0.17);
    vec3 P[6] = vec3[6](vec3(0.0, 0.0, 0.0), vec3(0.5, 0.18, 0.1), vec3(-0.42, 0.3, -0.2), vec3(0.05, -0.5, 0.25), vec3(-0.3, -0.25, -0.45), vec3(0.62, -0.38, -0.3));
    float R6[6] = float[6](0.26, 0.17, 0.2, 0.15, 0.13, 0.11);
    vec3 o = vec3(0.0);
    float zb = -9.0;
    vec2 S[6];
    float Z[6];
    for (int i = 0; i < 6; i++) {
      vec3 v = P[i];
      v = vec3(cos(ay) * v.x + sin(ay) * v.z, v.y, -sin(ay) * v.x + cos(ay) * v.z);
      v = vec3(v.x, cos(ax) * v.y - sin(ax) * v.z, sin(ax) * v.y + cos(ax) * v.z);
      S[i] = v.xy;
      Z[i] = v.z;
    }
    // Bonds: from the centre atom and along the chain, as thin rods behind the spheres.
    for (int i = 1; i < 6; i++) {
      int j = i == 4 ? 2 : (i == 5 ? 1 : 0);
      float sd = segment(p, S[j], S[i]);
      float rod = 1.0 - smoothstep(0.025, 0.035, sd);
      float zr = mix(Z[j], Z[i], 0.5) - 0.05;
      if (rod > 0.0 && zr > zb) {
        zb = zr;
        o = vec3(rod * 0.8, 0.55 + 0.3 * (1.0 - sd / 0.035), 0.9 + float(i) * 0.1);
      }
    }
    for (int i = 0; i < 6; i++) {
      vec4 b = ball(p, S[i], R6[i], Z[i], L);
      if (b.x > 0.0 && b.z > zb) {
        zb = b.z;
        o = vec3(1.0, b.y, b.w + float(i) * 0.17);
      }
    }
    return o;
  }
  // A cell dividing, one into two into four: metaballs, so each division pinches and parts, lit as a
  // soft body, a nucleus in each.
  float u = fract(tt / FORM_S);
  float s1 = smoothstep(0.06, 0.36, u);
  float s2 = smoothstep(0.46, 0.76, u);
  float rc = 0.5 * mix(1.0, 0.72, s1) * mix(1.0, 0.74, s2);
  float field = 0.0;
  vec2 grad = vec2(0.0);
  float nuc = 0.0;
  for (int i = 0; i < 4; i++) {
    float sx = (i % 2 == 0 ? -1.0 : 1.0);
    float sy = (i < 2 ? -1.0 : 1.0);
    vec2 ci = vec2(sx * 0.36 * s1, sy * 0.32 * s2) + 0.02 * vec2(sin(tt * 0.9 + float(i)), cos(tt * 0.7 + float(i) * 2.0));
    vec2 dv = p - ci;
    float dd = max(dot(dv, dv), 1e-4);
    field += rc * rc / dd;
    grad += -2.0 * rc * rc * dv / (dd * dd);
    nuc = max(nuc, 1.0 - smoothstep(rc * 0.24, rc * 0.3, sqrt(dd)));
  }
  float norm = mix(1.0, 2.0, s1) * mix(1.0, 2.0, s2);
  field /= norm;
  grad /= norm;
  float body = smoothstep(0.95, 1.05, field);
  vec3 n = normalize(vec3(-grad * 0.12, 1.0 / max(field - 0.9, 0.05)));
  float light = clamp(0.3 + 0.7 * max(dot(n, L), 0.0) + 0.5 * pow(1.0 - n.z, 2.0), 0.0, 1.0);
  float membrane = exp(-pow((field - 1.0) / 0.12, 2.0));
  return vec3(max(body, membrane), mix(light, 0.35, nuc * 0.8), atan(p.y, p.x) * 0.16 + field * 0.08 + nuc * 0.5);
}

// The form of the moment at c (CSS px), and through the last third of each, the next, chosen per point by
// threshold th, so one form dissolves into the next in ordered dither.
vec3 evoAt(vec2 c, float th) {
  vec2 p = (c - uEvo.xy) / uEvo.z;
  if (length(p) > 1.3) return vec3(0.0);
  float T = uEvoT / FORM_S;
  int fa = int(mod(floor(T), 3.0));
  int fb = int(mod(floor(T) + 1.0, 3.0));
  float mut = smoothstep(0.72, 0.98, fract(T));
  return th < mut ? evoForm(fb, p, uEvoT) : evoForm(fa, p, uEvoT);
}

// The forms' soft psychedelic light: the pastel loop at h, blended smoothly.
vec3 iri(float h) {
  float k = fract(h) * 6.0;
  int i = int(floor(k));
  vec3 a = uIri[0];
  vec3 b = uIri[0];
  for (int j = 0; j < 6; j++) {
    if (j == i) a = uIri[j];
    if (j == (i + 1) % 6) b = uIri[j];
  }
  return mix(a, b, smoothstep(0.0, 1.0, fract(k)));
}

float sharpM(vec2 p, vec3 sel) {
  return dot(texture(uMaskA, p / uRes).rgb, sel);
}
float softM(vec2 p, vec3 sel) {
  return dot(texture(uMaskB, p / uRes).rgb, sel);
}

// Systems' register: a module row's shift at step s, in whole modules; steps 0 and 4 are home.
float shiftK(float idx, float s, float salt, float span) {
  if (s < 0.5 || s > 3.5) return 0.0;
  return floor(hash(vec2(idx + salt, s * 7.13 + salt)) * (2.0 * span + 1.0)) - span;
}
vec2 register(vec2 p) {
  float G = uGridStep;
  float s0 = floor(uS.y);
  float e = fract(uS.y);
  float row = floor((p.y - uGridOrigin.y) / G);
  // Rows of modules slide sideways, a whole module or two, like the tumblers of a lock.
  p.x -= mix(shiftK(row, s0, 0.0, 2.0), shiftK(row, s0 + 1.0, 0.0, 2.0), e) * G * uS.x;
  return p;
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;

  // The pointer's wake: a trail of soft discs that widen as they age; their summed slope bends the grid.
  float wake = 0.0;
  vec2 bend = vec2(0.0);
  if (uWake > 0.0) {
    for (int i = 0; i < ${TRAIL}; i++) {
      vec4 tp = uTrail[i];
      if (tp.w <= 0.0) continue;
      vec2 d = px - tp.xy;
      float r = mix(26.0, 150.0, tp.z);
      float life = (1.0 - tp.z) * (1.0 - tp.z);
      float g = exp(-dot(d, d) / (r * r)) * life * tp.w;
      wake += g;
      bend += d / r * g;
    }
    wake = clamp(wake * uWake, 0.0, 1.0);
    bend *= uWake;
  }
  // Sample the field from nearer the trail: the dots swell outward around it, like a lens passing over.
  vec2 pw = px - bend * 7.0;

  // The dot this pixel belongs to.
  vec2 g = (pw - uOrigin) / uDot;
  vec2 cell = floor(g);
  vec2 q = g - cell - 0.5;
  vec2 c = (cell + 0.5) * uDot + uOrigin;
  ivec2 ci = ivec2(cell + 4096.0);
  float th = bayer(ci);
  float th2 = bayer(ci + ivec2(5, 3));
  float th3 = bayer(ci + ivec2(2, 6));

  float t = uTime;
  vec3 col = uPaper;

  // Quiet zones: the copy at the foot and the HUD rows stay on paper.
  vec2 qd = max(max(uQuiet.xy - c, c - uQuiet.zw), 0.0);
  float quiet = smoothstep(0.0, 48.0, length(qd));
  quiet *= smoothstep(uBands.x - 16.0, uBands.x + 24.0, c.y) * (1.0 - smoothstep(uRes.y - uBands.y - 24.0, uRes.y - uBands.y + 8.0, c.y));

  // The made world: inside the wave's radius the marks stand and the light is in the field.
  float r = length(c - uCenter);
  float made = uBloomR > 0.0 ? 1.0 - smoothstep(uBloomR - 60.0, uBloomR + 20.0, r) : 0.0;

  // The glyph lattice: DNA glyphs on a half-grid (the resting + only on whole grid nodes). The wave carries the heavy end of the ladder out from
  // the one mark and leaves the resting + behind it; the latent title lifts the nodes inside its letters
  // up the ladder, each on its own beat; while systems plays, the nodes round it join into box lines.
  // The paper's texture, always there: a faint grey haze of dots drifting slowly, so the page is never bare.
  {
    float n = vnoise(c * 0.0035 + vec2(t * 0.025, -t * 0.018)) * 0.6 + vnoise(c * 0.011 - vec2(t * 0.04, 0.0)) * 0.4;
    float hz = smoothstep(0.42, 0.85, n) * 0.16 * quiet * uGrid;
    col = mix(col, uGreyLight, dotCov(q, hz, th3) * 0.7);
  }

  // The evolving forms, as dense 1-bit bitmap: each dot cell a square pixel, on or off by the ordered
  // threshold (with a grain of pixel noise) against the form's tone. The tone runs from white in the light
  // to the pastel loop in the shade, the hue drifting across the form and over time; off the forms, paper.
  if (uEvoA > 0.0) {
    vec3 ev = evoAt(c, th3);
    if (ev.x > 0.0) {
      float grain = (hash(cell * 0.71 + floor(t * 6.0)) - 0.5) * 0.12;
      float thp = clamp(th + grain, 0.0, 1.0);
      float shade = (1.0 - ev.y);
      vec3 hueA = iri(ev.z + t * 0.03 + c.x * 0.0004);
      vec3 hueB = iri(ev.z + t * 0.03 + c.x * 0.0004 + 0.17);
      vec3 ink = mix(hueA, hueB, step(th2, 0.5));
      // Deep shade steps a little toward the mid grey, for depth; the light breaks into white pixels.
      ink = mix(ink, uGreyLight, smoothstep(0.6, 1.0, shade) * 0.6);
      float on = step(thp, (0.25 + 0.75 * shade) * ev.x * uEvoA * uEvoS);
      float white = step(thp, smoothstep(0.55, 1.0, ev.y) * ev.x * uEvoA * 0.9 / uEvoS) * (1.0 - on);
      vec2 aq = abs(q);
      float px = step(max(aq.x, aq.y), 0.5 - 0.06 / uDot);
      col = mix(col, ink, on * px * quiet);
      col = mix(col, vec3(1.0), white * px * quiet);
    }
  }

  if (uGrid > 0.0) {
    float G = uGridStep;
    // Half steps where the grid is wide enough for a glyph to breathe in them (the glyphs are 10px).
    float Gh = G >= 32.0 ? G * 0.5 : G;
    vec2 nIdx = floor((pw - uGridOrigin) / Gh + 0.5);
    vec2 node = nIdx * Gh + uGridOrigin;
    bool whole = Gh == G || (mod(nIdx.x, 2.0) < 0.5 && mod(nIdx.y, 2.0) < 0.5);
    vec2 gq = pw - node;
    float rn = length(node - uCenter);
    float h1 = hash(nIdx * 0.731 + 0.17);
    float nMade = 1.0 - smoothstep(uBloomR - G, uBloomR, rn);
    float E = uBloomR > 0.0 ? exp(-pow((uBloomR - rn) / (G * 2.4), 2.0)) * step(rn, uBloomR + G * 2.0) : 0.0;
    if (uLatent > 0.0) {
      // Barely there: inside the letters the nodes step up the ladder, left to right with a scatter, and
      // the rest of the field quietens, so the title is in the grid before it is on the page.
      float inL = smoothstep(0.15, 0.6, dot(texture(uMaskB, node / uRes).rgb, vec3(1.0)));
      float due = clamp(uLatent * 1.6 - (node.x / uRes.x) * 0.4 - h1 * 0.2, 0.0, 1.0);
      E = mix(E * (1.0 - 0.6 * uLatent), 0.52, inL * due);
    }
    // The evolving forms come through the lattice too, in heavier glyphs.
    // Present nodes keep swapping glyphs on their own clocks, a step either way on the ladder.
    float tick = floor(t * mix(1.2, 3.5, h1) + h1 * 7.0);
    float jit = (hash(nIdx + tick * vec2(0.37, 1.71)) - 0.5) * 0.24;
    E = clamp(E + jit * step(0.06, E), 0.0, 1.0);
    // The ladder, light to heavy: low dot, colon, plus, cross, diamond, plus, double cross.
    int ladder[7] = int[7](1, 3, 4, 5, 6, 4, 8);
    int k = int(floor(clamp((E - 0.08) / 0.86, 0.0, 0.999) * 7.0));
    int level = E < 0.08 ? 0 : ladder[k];
    // A grey ramp, the heaviest marks in the sage.
    vec3 gc = k <= 2 ? uGreyLight : (k <= 4 ? uGrey : uSage);
    float a = 0.95;
    // Resting: the + inside the made world, and outside it a plain dot on every node, so the grid is
    // always on the page.
    if (level == 0 && whole) {
      level = nMade > 0.5 ? 4 : 2;
      gc = uGreyLight;
      a = nMade > 0.5 ? 0.8 * nMade : 0.6;
    }
    if (uS.x > 0.0) {
      vec4 b = uSBox + vec4(uOff.y - G, -G, uOff.y + G, G);
      if (node.x >= b.x && node.x <= b.z && node.y >= b.y && node.y <= b.w) {
        level = 7;
        gc = uSysCol;
        a = mix(a, 0.8, uS.x);
      }
    }
    // Marks stay off the copy and the HUD rows; near the pointer they take the sage.
    float rows = step(uBands.x, pw.y) * step(pw.y, uRes.y - uBands.y);
    float gcov = glyphShape(level, gq, 1.0 / uDpr) * a * uGrid * rows * smoothstep(0.0, 24.0, length(qd));
    col = mix(col, mix(gc, uSage, wake * 0.6), gcov);
  }

  // Under the latent glyphs, the letters as a faint halftone of light sage, so the title reads at any
  // grid size; it arrives with the glyphs, left to right.
  if (uLatent > 0.0) {
    float m = dot(texture(uMaskA, c / uRes).rgb, vec3(1.0));
    float due = clamp(uLatent * 1.6 - (c.x / uRes.x) * 0.4 - hash(cell * 0.11) * 0.2, 0.0, 1.0);
    col = mix(col, mix(uSageLight, uSage, 0.4), dotCov(q, m * 0.6 * due, th2));
  }

  // Designer's construction: the character cells and the cap, middle and baseline, in sage, under the word.
  if (uD.x > 0.0) {
    vec4 b = uDBox + vec4(uOff.z, 0.0, uOff.z, 0.0);
    float G = uGridStep;
    float hair = 0.5 / uDpr + 0.02;
    bool inY = pw.y > b.y - G && pw.y < b.w + G;
    bool inX = pw.x > b.x - G && pw.x < b.z + G;
    float cx = mod(pw.x - b.x + uAdv * 0.08, uAdv);
    float l = 0.0;
    if (inY && pw.x > b.x - 2.0 && pw.x < b.z + 2.0 && min(cx, uAdv - cx) < hair) l = 1.0;
    if (inX && (abs(pw.y - b.y) < hair || abs(pw.y - b.w) < hair)) l = 1.0;
    if (inX && abs(pw.y - (b.y + b.w) * 0.5) < hair && mod(pw.x, 6.0) < 3.0) l = 0.7;
    // Circles of construction on the round letters' counters: one per cell, faint.
    float cc = length(vec2(min(cx, uAdv - cx) - uAdv * 0.5, pw.y - (b.y + b.w) * 0.5));
    if (inX && inY && abs(cc - (b.w - b.y) * 0.5) < hair) l = max(l, 0.45);
    col = mix(col, uSage, l * 0.75 * uD.x);
  }

  // The words.
  for (int i = 0; i < 3; i++) {
    float e = uForm[i];
    if (e <= 0.0) continue;
    vec3 sel = vec3(i == 0, i == 1, i == 2);
    vec2 off = vec2(uOff[i], 0.0);
    // Resolving: the word's dots come up out of the latent grid in ordered dither, a shimmer on its way.
    vec2 pd = c - off;             // where this dot reads the mask
    pd.x += (1.0 - e) * 8.0 * sin(c.y * 0.05 + t * 3.0);
    vec2 pp = pw - off;            // where this pixel reads it, for solid type
    float effect = 0.0;
    vec3 ink = uInk;
    float sq = 0.0;
    if (i == 1 && uS.x > 0.0) {
      pd = register(pd);
      pp = register(pp);
      effect = uS.x;
      sq = 1.0;
    }
    if (i == 2) effect = max(uD.x, uD.y);
    float ex = uExitW[i];
    effect = max(max(effect, uFuse), ex);

    float cov = 0.0;
    // Systems' register runs on solid type, so its rows read as clean slices.
    bool plain = effect <= 0.001 || (i == 1 && ex <= 0.001 && uFuse <= 0.001);
    if (e >= 1.0 && plain) {
      cov = smoothstep(0.25, 0.75, sharpM(pp, sel));
    } else if (i == 2 && uD.x > 0.0 && e >= 1.0) {
      // Outline from the blurred mask's half-way line, solid ink fading to it.
      float bl = softM(pp, sel);
      float outline = 1.0 - smoothstep(0.05, 0.16, abs(bl - 0.5));
      float solid = smoothstep(0.25, 0.75, sharpM(pp, sel)) * (1.0 - uD.x);
      cov = max(outline * uD.x, solid) * (1.0 - ex);
      // The pen is the deep sage, not ink.
      ink = mix(uInk, uSageDeep, uD.x);
      float inside = sharpM(c - off, sel);
      // The fill: one colour for the whole word, rising in dither until the dots merge.
      float fc = inkCov(q, inside * uD.y, th);
      col = mix(col, uFill, fc);
    } else {
      float m = sharpM(pd, sel);
      float d = m * mix(0.45, 1.0, e) * (1.0 - ex);
      cov = sq > 0.5 ? shapeCov(q, dotR(d, th) * 1.25, 1.0) : inkCov(q, d, th);
      // Still resolving, the word is the glyphs' green; it cools to ink as it sets.
      ink = mix(mix(uSageDeep, uSage, step(0.7, hash(cell * 0.37))), uInk, smoothstep(0.55, 1.0, e));
    }
    // Systems' modules are outlined in its colour while they move.
    if (i == 1 && uS.x > 0.0) {
      vec2 lm = mod(pp - uGridOrigin, uGridStep);
      float edge = min(min(lm.x, uGridStep - lm.x), min(lm.y, uGridStep - lm.y));
      float on = step(0.08, softM(pp, sel)) * step(edge, 0.5 / uDpr + 0.02);
      col = mix(col, uSysCol, on * uS.x * 0.9);
    }
    // Depth: while another word plays, this one steps back to grey.
    ink = mix(ink, uGrey, uDim[i]);
    // Home: a sage sweep runs through the title once.
    if (uFuse > 0.0) {
      float sweep = fract(c.x * 0.0008 + c.y * 0.0003 - t * 0.45);
      ink = mix(ink, mix(uSage, uSageDeep, sweep), step(th, uFuse * 0.9));
    }
    col = mix(col, mix(ink, uSageDeep, wake * 0.85), cov);
    // Intelligent's signals: pulses run along the letters' lanes at their own speeds, each a bright head
    // with a cooling tail, in the light's colours.
    if (i == 0 && uI > 0.0) {
      float lane = floor(c.y / (uDot * 2.0));
      float ph = fract(c.x / 240.0 - t * (0.5 + 0.6 * hash(vec2(lane, 1.0))) + hash(vec2(lane, 7.0)));
      float head = smoothstep(0.0, 0.015, ph) * (1.0 - smoothstep(0.015, 0.11, ph)) * step(0.35, hash(vec2(lane, 3.0)));
      float inside = smoothstep(0.4, 0.6, sharpM(pd, sel));
      float sc = disc(q, 0.5 * uDotFill * mix(0.9, 1.4, head)) * head * inside * uI;
      col = mix(col, mix(uSageLight, uSage, smoothstep(0.2, 0.9, ph / 0.11)), sc);
    }
  }

  // The one mark: an ink point with a breathing halo of fine sage dots.
  if (uBit > 0.0) {
    float rp = length(px - uCenter);
    float breath = 0.5 + 0.5 * sin(t * 1.6);
    float halo = exp(-r / mix(22.0, 40.0, breath)) * (0.6 + 0.4 * cos(r * 0.22 - t * 2.4)) * uBit;
    col = mix(col, mix(uSage, uSageLight, smoothstep(8.0, 50.0, r)), dotCov(q, halo, th) * step(8.0, r));
    col = mix(col, uInk, clamp((3.4 * uBit - rp) * uDpr + 0.5, 0.0, 1.0));
  }

  // Leaving: as the hero slides up under the nav, its dots go back to paper in ordered dither there, and
  // only there, so what is still in view stays whole.
  if (uExit > 0.0) {
    float k = clamp((uNav + 24.0 - (c.y + uTop)) / 96.0, 0.0, 1.0) * uExit;
    col = mix(col, uPaper, step(bayer(ci + ivec2(3, 1)), k));
  }

  // The wake's wash: a sage halftone, densest at the pointer, spreading and paling as it ages.
  if (wake > 0.004) {
    float wd = smoothstep(0.0, 1.0, wake) * 0.85;
    float cov = disc(q, 0.5 * uDotFill * sqrt(wd) * 1.1);
    col = mix(col, mix(uSageLight, uSage, wd), cov * quiet * 0.7);
  }

  outColor = vec4(col, 1.0);
}
`
