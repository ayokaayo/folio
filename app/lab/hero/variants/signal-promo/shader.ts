/**
 * Signal hero shader (WebGL2): ordered dithering on round dots. The section is a grid of dots on the
 * lattice; each layer works out a density per dot, and the dot is drawn as an anti-aliased disc whose
 * radius follows the Bayer 8x8 decision, blended toward a true halftone (radius from density) by uHalftone.
 * Layers, back to front: the pastel colour field, the glyph lattice (one DNA glyph per grid node, the
 * ladder from a dot to a double cross, resting as the + marks), the three words, the one mark, and the
 * sage wake. A wave of glyphs carries the made world out from the one mark (uBloomR); the glyphs settle
 * heavier where the title will stand (uLatent), and the words resolve out of them. Each word has its own play: intelligent samples its mask through a moving
 * flow field and sparks; systems is cut into grid modules that shift like a register; designer drops to
 * its outline over a construction of cell lines and is coloured in.
 * The pointer's trail bends the dot grid like a lens and leaves a sage halftone wash that spreads and fades;
 * the choreography lays its own trails the same way (the last SCRIPTED slots), so the lens is part of the film.
 * Scrolling away (uExit) dissolves it all in ordered dither from the foot up while the words leave.
 */

/** Trail slots: the pointer's, then the choreography's. */
export const TRAIL = 48
export const SCRIPTED = 16

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
uniform vec3 uTan;        // the DNA glyphs' lightest ink
uniform vec3 uSage;       // the accent: the wake's ink
uniform vec3 uSageLight;
uniform vec3 uSageDeep;
uniform vec3 uPal[8];
uniform sampler2D uMaskA; // the words, sharp: R intelligent, G systems, B designer
uniform sampler2D uMaskB; // the same, blurred
uniform vec3 uOff;        // each word's x offset, CSS px (the title breaking apart)
uniform vec3 uForm;       // each word gathered, 0 to 1
uniform vec2 uI;          // intelligent: flow, sparks
uniform vec2 uS;          // systems: amount, step (0 to 4)
uniform vec2 uD;          // designer: outline, fill
uniform vec4 uDBox;       // designer's line: ink x0, cap top, ink x1, baseline (unshifted)
uniform vec4 uSBox;       // systems' line, the same
uniform float uAdv;       // one character's advance, CSS px
uniform float uFuse;
uniform vec4 uBlob;       // the DNA mark: centre x, y, size (CSS px), and scale 0 to ~1
uniform float uBlobT;     // its cycle's phase, 0 to 1
uniform vec3 uDim;        // each word stepped back to grey, 0 to 1
uniform vec3 uGrey;       // the greys: mid (the words stepped back)
uniform vec3 uGreyLight;  // and light (the resting marks)
uniform vec3 uGreyDeep;   // and deep (the DNA mark)
uniform float uExit;      // scrolled away, 0 to 1
uniform vec3 uExitW;      // each word leaving, 0 to 1
uniform vec3 uSysCol;     // systems' colour, its hue turning with the register
uniform vec2 uCenter;
uniform float uBit;       // the one mark
uniform float uBloomR;    // radius of the made world, CSS px
uniform float uLatent;    // the title latent in the glyphs
uniform float uGridStep;
uniform vec2 uGridOrigin; // a grid node: the lattice's left edge on the section's top row, CSS px
uniform float uGrid;
uniform float uColour;
uniform float uNoiseScale;
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

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p;
    a *= 0.5;
  }
  return s / 0.9375;
}

// Bayer 8x8 threshold in (0, 1), by bit interleaving.
float bayer(ivec2 p) {
  int x = p.x & 7;
  int y = p.y & 7;
  int q = x ^ y;
  int v = ((q & 1) << 5) | ((x & 1) << 4) | ((q & 2) << 2) | ((x & 2) << 1) | ((q & 4) >> 1) | ((x & 4) >> 2);
  return (float(v) + 0.5) / 64.0;
}

vec3 palette(float c) {
  int i = int(floor(fract(c) * 8.0));
  vec3 r = uPal[0];
  for (int j = 0; j < 8; j++) if (j == i) r = uPal[j];
  return r;
}

// The palette's stronger half run as a spectrum, for the light: blush, peach, butter, mint, sage, mist, lilac.
vec3 spectrum(float c) {
  float k = fract(c) * 7.0;
  int i = int(floor(k));
  int idx[7] = int[7](3, 2, 1, 6, 7, 5, 4);
  vec3 a = uPal[0];
  vec3 b = uPal[0];
  for (int j = 0; j < 7; j++) {
    if (j == i) a = uPal[idx[j]];
    if (j == (i + 1) % 7) b = uPal[idx[j]];
  }
  return mix(a, b, smoothstep(0.0, 1.0, fract(k)));
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

float sharpM(vec2 p, vec3 sel) {
  return dot(texture(uMaskA, p / uRes).rgb, sel);
}
float softM(vec2 p, vec3 sel) {
  return dot(texture(uMaskB, p / uRes).rgb, sel);
}

// Systems' register: a module row (or column) idx's shift at step s, in modules; steps 0 and 4 are home.
float shiftK(float idx, float s, float salt, float span) {
  if (s < 0.5 || s > 3.5) return 0.0;
  return floor(hash(vec2(idx + salt, s * 7.13 + salt)) * (2.0 * span + 1.0)) - span;
}
vec2 register(vec2 p) {
  float G = uGridStep;
  float s0 = floor(uS.y);
  float e = fract(uS.y);
  float row = floor((p.y - uGridOrigin.y) / G);
  p.x -= mix(shiftK(row, s0, 0.0, 3.0), shiftK(row, s0 + 1.0, 0.0, 3.0), e) * G * uS.x;
  float col = floor((p.x - uGridOrigin.x) / G);
  p.y -= mix(shiftK(col, s0, 11.0, 1.0), shiftK(col, s0 + 1.0, 11.0, 1.0), e) * G * uS.x;
  return p;
}

// Intelligent's currents: a slow flow field, in -1 to 1.
vec2 current(vec2 c, float t) {
  return vec2(fbm(c * 0.0042 + vec2(0.0, t * 0.22)), fbm(c * 0.0042 + vec2(5.2, -t * 0.18))) * 2.0 - 1.0;
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
  float ns = uNoiseScale;
  vec3 col = uPaper;

  // Quiet zones: the copy at the foot and the HUD rows stay on paper.
  vec2 qd = max(max(uQuiet.xy - c, c - uQuiet.zw), 0.0);
  float quiet = smoothstep(0.0, 48.0, length(qd));
  quiet *= smoothstep(uBands.x - 16.0, uBands.x + 24.0, c.y) * (1.0 - smoothstep(uRes.y - uBands.y - 24.0, uRes.y - uBands.y + 8.0, c.y));

  // The made world: inside the wave's radius the marks stand and the light is in the field.
  float r = length(c - uCenter);
  float made = uBloomR > 0.0 ? 1.0 - smoothstep(uBloomR - 60.0, uBloomR + 20.0, r) : 0.0;

  // Colour field: soft blooms dithered between neighbouring palette inks.
  if (uColour > 0.0) {
    vec2 p2 = c * 0.0021 * ns;
    float hue = fbm(p2 + vec2(0.03 * t, 0.017 * t)) * 1.7 + c.x * 0.00025 + 0.02 * t;
    float dens = smoothstep(0.32, 0.78, fbm(p2 * 1.3 - vec2(0.021 * t, -0.033 * t) + 7.3));
    dens = (0.06 + 0.5 * dens) * uColour * quiet * made;
    float cov = dotCov(q, dens, th3);
    if (cov > 0.0) {
      float k = fract(hue) * 8.0;
      col = mix(col, palette((floor(k) + step(th2, fract(k))) / 8.0), cov);
    }
  }

  // The glyph lattice: DNA glyphs on a half-grid (the resting + only on whole grid nodes). The wave carries the heavy end of the ladder out from
  // the one mark and leaves the resting + behind it; the latent title lifts the nodes inside its letters
  // up the ladder, each on its own beat; while systems plays, the nodes round it join into box lines.
  if (uGrid > 0.0 && uBloomR > 0.0) {
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
    float E = exp(-pow((uBloomR - rn) / (G * 2.4), 2.0)) * step(rn, uBloomR + G * 2.0);
    if (uLatent > 0.0) {
      // Barely there: inside the letters the nodes step up the ladder, left to right with a scatter, and
      // the rest of the field quietens, so the title is in the grid before it is on the page.
      float inL = smoothstep(0.15, 0.6, dot(texture(uMaskB, node / uRes).rgb, vec3(1.0)));
      float due = clamp(uLatent * 1.6 - (node.x / uRes.x) * 0.4 - h1 * 0.2, 0.0, 1.0);
      E = mix(E * (1.0 - 0.6 * uLatent), 0.52, inL * due);
    }
    // Round the DNA mark the glyphs gather densest, thinning out with distance, as on the case study's cover.
    if (uBlob.w > 0.0) {
      float db = length(node - uBlob.xy);
      E = max(E, exp(-max(db - uBlob.z * 0.42, 0.0) / (G * 0.9)) * 0.92 * min(uBlob.w, 1.0));
    }
    // Present nodes keep swapping glyphs on their own clocks, a step either way on the ladder.
    float tick = floor(t * mix(1.2, 3.5, h1) + h1 * 7.0);
    float jit = (hash(nIdx + tick * vec2(0.37, 1.71)) - 0.5) * 0.24;
    E = clamp(E + jit * step(0.06, E), 0.0, 1.0);
    // The ladder, light to heavy: low dot, colon, plus, cross, diamond, plus, double cross.
    int ladder[7] = int[7](1, 3, 4, 5, 6, 4, 8);
    int k = int(floor(clamp((E - 0.08) / 0.86, 0.0, 0.999) * 7.0));
    int level = E < 0.08 ? 0 : ladder[k];
    vec3 gc = k <= 2 ? uTan : (k <= 4 ? uSage : uSageDeep);
    float a = 0.95;
    if (level == 0 && nMade > 0.0 && whole) {
      level = 4;
      gc = uGreyLight;
      a = 0.8 * nMade;
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
    if (i == 0 && uI.x > 0.0) {
      // The letters stay legible; their edges ripple on a fine, quick current.
      pd += current(c * 2.6, t * 1.6) * 14.0 * uI.x;
      effect = uI.x;
      // An aura of thought round the word, pulsing outward in waves.
      float near = softM(pd, sel) * (1.0 - smoothstep(0.3, 0.6, sharpM(pd, sel)));
      float wave = 0.5 + 0.5 * sin(length(c - vec2(uDBox.x, c.y)) * 0.03 - t * 4.0 + c.y * 0.02);
      float ac = dotCov(q, near * 1.5 * wave * uI.x, th2);
      col = mix(col, mix(uSageLight, uSage, wave), ac);
    }
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
    if (e >= 1.0 && effect <= 0.001) {
      cov = smoothstep(0.25, 0.75, sharpM(pp, sel));
    } else if (i == 2 && uD.x > 0.0 && e >= 1.0) {
      // Outline from the blurred mask's half-way line, solid ink fading to it.
      float bl = softM(pp, sel);
      float outline = 1.0 - smoothstep(0.05, 0.16, abs(bl - 0.5));
      float solid = smoothstep(0.25, 0.75, sharpM(pp, sel)) * (1.0 - uD.x);
      cov = max(outline * uD.x, solid) * (1.0 - ex);
      // The pen is the deep sage, not ink.
      ink = mix(uInk, uSageDeep, uD.x);
      // The fill: the palette, in cell-wide bands that slide, dithered inside the outline.
      float inside = sharpM(c - off, sel);
      float band = floor((c.x - uDBox.x - uOff.z) / uAdv) / 8.0 + t * 0.35;
      float fc = dotCov(q, inside * uD.y * 0.95, th);
      col = mix(col, spectrum(band + 0.06 * step(th2, 0.5)), fc);
    } else {
      float m = sharpM(pd, sel);
      float d = m * mix(0.45, 1.0, e) * (1.0 - ex);
      cov = sq > 0.5 ? shapeCov(q, dotR(d, th) * 1.25, 1.0) : inkCov(q, d, th);
      // Still resolving, the word is the glyphs' green; it cools to ink as it sets.
      ink = mix(mix(uSageDeep, uSage, step(0.7, hash(cell * 0.37))), uInk, smoothstep(0.55, 1.0, e));
      // Systems' modules are outlined while they move.
      if (i == 1 && uS.x > 0.0) {
        vec2 lm = mod(pp - uGridOrigin, uGridStep);
        float edge = min(min(lm.x, uGridStep - lm.x), min(lm.y, uGridStep - lm.y));
        float on = step(0.08, softM(pp, sel)) * step(edge, 0.5 / uDpr + 0.02);
        col = mix(col, uSysCol, on * uS.x * 0.9);
      }
    }
    // Depth: while another word plays, this one steps back to grey.
    ink = mix(ink, uGrey, uDim[i]);
    // The fuse: the light runs through the title once, a spectrum sweeping across it.
    if (uFuse > 0.0) {
      float sweep = fract(c.x * 0.0008 + c.y * 0.0003 - t * 0.45);
      ink = mix(ink, spectrum(sweep), step(th, uFuse * 0.95));
    }
    col = mix(col, mix(ink, uSageDeep, wake * 0.85), cov);
    // Intelligent's signals: pulses run along the letters' lanes at their own speeds, each a bright head
    // with a cooling tail, in the light's colours.
    if (i == 0 && uI.y > 0.0) {
      float lane = floor(c.y / (uDot * 2.0));
      float ph = fract(c.x / 240.0 - t * (0.5 + 0.6 * hash(vec2(lane, 1.0))) + hash(vec2(lane, 7.0)));
      float head = smoothstep(0.0, 0.015, ph) * (1.0 - smoothstep(0.015, 0.11, ph)) * step(0.35, hash(vec2(lane, 3.0)));
      float inside = smoothstep(0.4, 0.6, sharpM(pd, sel));
      float sc = disc(q, 0.5 * uDotFill * mix(0.9, 1.4, head)) * head * inside * uI.y;
      col = mix(col, mix(uSageLight, spectrum(hash(vec2(lane, 9.0)) + t * 0.05), smoothstep(0.2, 0.9, ph / 0.11)), sc);
    }
  }

  // The DNA mark, one cycle: a drop of ink lands; a bud swells out of it and wanders; the bud pulls away
  // until the neck thins to nothing, runs back in, and is taken up; the drop goes.
  if (uBlob.w > 0.0) {
    float S = uBlob.z * uBlob.w;
    float u = uBlobT;
    float grow = smoothstep(0.1, 0.38, u) * (1.0 - smoothstep(0.76, 0.9, u));
    float split = smoothstep(0.4, 0.56, u) * (1.0 - smoothstep(0.6, 0.74, u));
    vec2 m = uBlob.xy + vec2(-0.06, 0.1) * S * grow;
    vec2 bud = m + vec2(0.17, -0.36) * S * grow + vec2(sin(t * 0.9), cos(t * 1.3)) * 0.035 * S * grow + vec2(0.07, -0.14) * S * split;
    float d1 = length(pw - m) - 0.3 * S;
    float d2 = length(pw - bud) - 0.17 * S * mix(0.3, 1.0 + 0.06 * sin(t * 1.7), grow);
    float k = mix(0.17, 0.02, split) * S;
    float hk = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    float db = mix(d2, d1, hk) - k * hk * (1.0 - hk);
    vec2 rel = pw - m;
    db += 0.012 * S * sin(atan(rel.y, rel.x) * 3.0 + t * 0.8);
    col = mix(col, mix(uGreyDeep, uSageDeep, wake * 0.85), clamp(0.5 - db * uDpr, 0.0, 1.0));
  }

  // The one mark: an ink point with a breathing halo of fine sage dots.
  if (uBit > 0.0) {
    float rp = length(px - uCenter);
    float breath = 0.5 + 0.5 * sin(t * 1.6);
    float halo = exp(-r / mix(22.0, 40.0, breath)) * (0.6 + 0.4 * cos(r * 0.22 - t * 2.4)) * uBit;
    col = mix(col, mix(uSage, uSageLight, smoothstep(8.0, 50.0, r)), dotCov(q, halo, th) * step(8.0, r));
    col = mix(col, uInk, clamp((3.4 * uBit - rp) * uDpr + 0.5, 0.0, 1.0));
  }

  // Leaving: as the hero scrolls away, its dots go back to paper in ordered dither, from the foot up.
  if (uExit > 0.0) {
    float k = uExit * 1.6 - (1.0 - c.y / uRes.y) * 0.6;
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
