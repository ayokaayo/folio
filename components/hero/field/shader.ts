/**
 * Hero moiré shader: two line screens (Codex's analytic box-filtered coverage and overlap
 * integration), a latent form, a low-resolution wave field, per-line highlights traced
 * from the copy, and two-ink overprint colour. Built in the hero lab, 2026-09.
 */

import { colour } from './colour'

export const MAX_MASK = 12

export const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform vec2 uRes;
uniform float uDpr;
uniform float uTheta;
uniform float uScale;
uniform float uPitch;
uniform float uCoverage;
uniform float uInkAlpha;
uniform vec3 uPaper;
uniform vec3 uInk;          // screen 1 ink
uniform vec3 uInk2;         // screen 2 ink
uniform vec3 uInk3;         // screen 2 ink where the form rises / the field is disturbed
uniform float uHueByForm;   // how much latent height shifts screen 2 toward uInk3
uniform float uHueByEnergy; // how much field energy shifts screen 2 toward uInk3
uniform float uLatent;
uniform float uLatentAmp;
uniform vec2 uCenter;       // latent centre, CSS px from top-left
uniform float uRadius;      // latent radius, CSS px
uniform vec4 uBump;         // lens: x, y (CSS px from top-left), radius, amplitude (cycles)
uniform sampler2D uField;   // wake: R = height (0.5 = 0), G = energy
uniform float uFieldAmp;    // cycles at full-scale height; 0 disables
uniform vec2 uFieldTexel;   // CSS px per field cell
uniform vec4 uMask[${MAX_MASK}];  // copy line boxes, CSS px from top-left: x0, y0, x1, y1
uniform float uMaskCount;
uniform float uHiStyle[${MAX_MASK}]; // per line box: 0 off, 1 tint (full line), 2 marker (lower band), 3 underlay (baseline band), 4 label (site chip)
uniform float uHiRadius;    // corner radius for label, CSS px
uniform float uHiGap;       // vertical gap between stacked labels, CSS px
uniform float uHiStrength;  // 0-1 how strongly the highlight tints the paper
uniform float uHiInk;       // 0-1 how much of the ruling keeps running through the highlight
uniform float uHiPad;       // CSS px the highlight extends past each line's ends
uniform vec3 uHiColor;      // sRGB highlight ink
uniform float uEdgeFade;
uniform float uGrain;
uniform float uTime;
uniform vec2 uPivot;
uniform float uDrift;       // screen 2 phase offset, cycles: advancing it makes the fringes glide
uniform float uEnergy;      // 0-1 global activity (ambient + pointer), for colour
uniform float uBottomFade;  // CSS px over which the ruling runs out into the next section
uniform float uEntrance;    // 0-1 arrival: scales only the ruling, never the copy or highlights
uniform float uAngle;       // screen angle, radians: lines parallel to type read as strike-through
uniform vec3 uCopyFade;     // x0, x1 (CSS px from left): ink ramps from z (0-1) at x0 to full at x1
         // screen 2 rotates about this point, CSS px from top-left

// Area of a unit box for which a*x + b*y <= t, with x,y in [-.5,.5].
// The projected box is a trapezoidal distribution. Evaluate its CDF using
// symmetry, not subtraction of near-equal quadratic antiderivatives: the
// latter loses precision precisely when the screens approach alignment.
float boxCDF(float t, vec2 width) {
  float big = max(width.x, width.y);
  float small = min(width.x, width.y);
  if (big <= 0.0) return step(0.0, t);
  float span = big + small;
  float z = t + 0.5 * span;
  if (z <= 0.0) return 0.0;
  if (z >= span) return 1.0;
  float nearEdge = min(z, span - z);
  float area;
  if (nearEdge < small) {
    area = 0.5 * (nearEdge / big) * (nearEdge / small);
  } else {
    area = (nearEdge - 0.5 * small) / big;
  }
  return z > 0.5 * span ? 1.0 - area : area;
}

// Exact box-filtered periodic pulse for an affine phase. width is the phase
// change across each physical-pixel axis (or across a clipped subrectangle).
// Whole periods integrate to duty. The remaining widths are each < 1 cycle,
// so only three neighbouring pulses can intersect their projected footprint.
// This also handles zero-width axes, very narrow lines and wide footprints.
float pulseBox(float phase, vec2 width, float duty) {
  vec2 w = abs(width);
  vec2 whole = floor(w);
  vec2 remainder = w - whole;
  float weightX = w.x > 0.0 ? remainder.x / w.x : 1.0;
  float weightY = w.y > 0.0 ? remainder.y / w.y : 1.0;
  float weight = weightX * weightY;
  if (weight <= 0.0) return duty;
  float p = fract(phase + 0.5 * (whole.x + whole.y) + 0.5) - 0.5;
  float area = 0.0;
  for (int i = -1; i <= 1; i++) {
    float center = float(i) - p;
    area += boxCDF(center + 0.5 * duty, remainder)
          - boxCDF(center - 0.5 * duty, remainder);
  }
  return clamp(mix(duty, area, weight), 0.0, 1.0);
}

// All fields return (height, dHeight/dQx, dHeight/dQy). No finite differences
// or hard distance-field joins: the contours and their normals stay smooth.
vec3 gaussian(vec2 q, vec2 sharpness) {
  float h = exp(-dot(q * q, sharpness));
  return vec3(h, -2.0 * sharpness * q * h);
}

vec3 ridge(vec2 q, vec2 center, vec2 axis, vec2 radius) {
  vec2 normal = vec2(-axis.y, axis.x);
  vec2 d = q - center;
  vec2 local = vec2(dot(d, axis), dot(d, normal));
  vec3 g = gaussian(local, 1.0 / (radius * radius));
  return vec3(g.x, g.y * axis + g.z * normal);
}

vec3 softUnion(vec3 a, vec3 b) {
  return vec3(a.x + b.x - a.x * b.x,
              a.yz * (1.0 - b.x) + b.yz * (1.0 - a.x));
}

vec3 latent(vec2 q) {
  if (uLatent < 0.5) {
    // A rotated, windowed saddle. The Gaussian shoulders make the volume
    // return gently to the plate instead of crashing into its rectangular edge.
    vec2 axis = vec2(0.939372713, 0.342897807);
    vec2 normal = vec2(-axis.y, axis.x);
    float a = dot(q, axis);
    float b = dot(q, normal);
    float h = a * a - b * b;
    vec2 grad = 2.0 * (a * axis - b * normal);
    float envelope = 4.621079108 * exp(-1.7 * dot(q, q));
    return vec3(h * envelope, (grad - 3.4 * q * h) * envelope);
  }
  if (uLatent < 1.5) {
    // A slightly off-centre elliptical lens, with no sqrt rim or flat cap.
    return gaussian(q - vec2(0.06, -0.035), vec2(2.8, 2.05));
  }
  // A relief-like M, not a hard-edged logo mask. Four overlapping Gaussian
  // ridges form shoulders and a valley; soft union preserves smooth slopes.
  vec3 left = ridge(q, vec2(-0.48, -0.02), vec2(0.0, 1.0), vec2(0.60, 0.16));
  vec3 right = ridge(q, vec2(0.48, -0.02), vec2(0.0, 1.0), vec2(0.60, 0.16));
  vec3 foldL = ridge(q, vec2(-0.23, 0.17), vec2(0.6401844, -0.7682213), vec2(0.43, 0.16));
  vec3 foldR = ridge(q, vec2(0.23, 0.17), vec2(0.6401844, 0.7682213), vec2(0.43, 0.16));
  return softUnion(softUnion(left, foldL), softUnion(foldR, right));
}

float sinc(float x) {
  return abs(x) < 0.001 ? 1.0 - x * x / 6.0 : sin(x) / x;
}

float grainWave(vec2 p, vec2 pixel, vec2 frequency, float phase) {
  vec2 halfStep = 0.5 * frequency * pixel;
  return cos(dot(p, frequency) + phase) * sinc(halfStep.x) * sinc(halfStep.y);
}


${colour}

float boxDist(vec2 q, vec4 r) {
  vec2 c = 0.5 * (r.xy + r.zw);
  vec2 h = 0.5 * (r.zw - r.xy);
  vec2 d = abs(q - c) - h;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float fieldH(vec2 tl) {
  vec2 uv = vec2(tl.x / uRes.x, 1.0 - tl.y / uRes.y);
  return (texture2D(uField, uv).r - 0.5) * 2.0;
}

void main() {
  float duty = clamp(uCoverage, 0.0, 1.0);
  float opacity = clamp(uInkAlpha, 0.0, 1.0);
  vec2 res = max(uRes, vec2(1.0));
  vec2 backing = max(floor(res * max(uDpr, 0.25)), vec2(1.0));
  vec2 pixel = res / backing;
  vec2 p = (vUv - 0.5) * res;          // centred, y up
  vec2 tl = vec2(vUv.x * res.x, (1.0 - vUv.y) * res.y); // top-left, y down

  // Highlight: a printer's tint laid under each line of copy, traced from the DOM line boxes.
  float hi = 0.0;
  for (int i = 0; i < ${MAX_MASK}; i++) {
    if (float(i) >= uMaskCount) break;
    float st = uHiStyle[i];
    if (st < 0.5) continue;
    vec4 r = uMask[i];
    float hgt = r.w - r.y;
    // Band per style, as fractions of the line box height from its top. Tint fills the
    // whole line pitch, so stacked lines meet with no gap.
    float top = st < 1.5 ? 0.0 : st < 2.5 ? 0.44 : st < 3.5 ? 0.80 : 0.0;
    float bot = st < 1.5 ? 1.0 : st < 2.5 ? 0.94 : st < 3.5 ? 0.96 : 1.0;
    // Marker edges wander by a pixel or two, like a pen stroke; tint stays straight.
    float wob = (st > 1.5 && st < 3.5)
      ? (sin(tl.x * 0.021 + float(i) * 1.7) * 1.2 + sin(tl.x * 0.067 + float(i) * 4.1) * 0.6)
      : 0.0;
    vec4 band = vec4(r.x - uHiPad, r.y + hgt * top + wob, r.z + uHiPad, r.y + hgt * bot - wob * 0.6);
    float rad = 0.0;
    if (st > 3.5) {
      // Label: the site's chip, a rounded rectangle; stacked lines keep a small gap.
      band.y += 0.5 * uHiGap;
      band.w -= 0.5 * uHiGap;
      rad = min(uHiRadius, 0.5 * (band.w - band.y));
      band += vec4(rad, rad, -rad, -rad);
    }
    float d = boxDist(tl, band) - rad;
    // Stroke ends taper for the marker; tint and label edges are crisp, and a tint
    // overlaps its neighbour by half a pixel so no hairline shows between lines.
    float soft = st > 3.5 ? 0.6 : st > 1.5 ? 1.6 : 0.5;
    hi = max(hi, 1.0 - smoothstep(-soft, soft, d - (st < 1.5 ? 0.5 : 0.0)));
  }
  float maskK = mix(1.0, uHiInk, hi);
  float bottom = 1.0 - smoothstep(res.y - max(uBottomFade, 1.0), res.y, tl.y);
  float fadeK = mix(uCopyFade.z, 1.0, smoothstep(uCopyFade.x, uCopyFade.y, tl.x));
  float a0 = opacity * maskK * bottom * fadeK * clamp(uEntrance, 0.0, 1.0);
  // The paper under the highlight takes a pale wash of the highlight ink.
  vec3 sheet = mix(uPaper, uHiColor, clamp(hi * uHiStrength, 0.0, 1.0));
  // The ruling can be off (no line weight, or no ink here) while the glyph layer still draws, so
  // instead of returning early its ink is zeroed.
  float rule = (duty > 0.0 && a0 > 0.001) ? 1.0 : 0.0;

  float pitch = max(uPitch, 4.0 * max(pixel.x, pixel.y));
  vec2 direction = vec2(sin(uTheta), cos(uTheta));
  float pitch2 = pitch * max(uScale, 0.05);

  // Phase field F = (value in cycles, d/dpx, d/dpy) in centred, y-up CSS px.
  float radius = max(uRadius, 1.0);
  vec2 centre = uCenter - 0.5 * res;
  centre.y = -centre.y;
  vec3 lat = latent((p - centre) / radius);
  vec3 F = uLatentAmp * vec3(lat.x, lat.yz / radius);

  if (uBump.w != 0.0) {
    vec2 b = uBump.xy - 0.5 * res;
    b.y = -b.y;
    vec2 q = (p - b) / max(uBump.z, 1.0);
    float g = exp(-dot(q, q));
    F += uBump.w * vec3(g, -2.0 * q * g / max(uBump.z, 1.0));
  }

  float energy = 0.0;
  if (uFieldAmp != 0.0) {
    vec2 e = uFieldTexel;
    float h = fieldH(tl);
    float dx = (fieldH(tl + vec2(e.x, 0.0)) - fieldH(tl - vec2(e.x, 0.0))) / (2.0 * e.x);
    float dy = (fieldH(tl - vec2(0.0, e.y)) - fieldH(tl + vec2(0.0, e.y))) / (2.0 * e.y); // y up
    F += uFieldAmp * vec3(h, dx, dy);
    vec2 uv = vec2(tl.x / res.x, 1.0 - tl.y / res.y);
    energy = texture2D(uField, uv).g;
  }

  // Screen 2 turns about the pivot, so the screens stay in register near it.
  vec2 piv = uPivot - 0.5 * res;
  piv.y = -piv.y;

  // Screen angle: rotate the whole ruling (positions, phase gradients, pivot) into the
  // screen frame. The pixel footprint stays an axis-aligned box of the same size there,
  // a close approximation to the rotated box at these pitches.
  float ca = cos(uAngle), sa = sin(uAngle);
  mat2 R = mat2(ca, -sa, sa, ca);
  p = R * p;
  F.yz = R * F.yz;
  piv = R * piv;
  float phase1 = p.y / pitch;
  float step1 = pixel.y / pitch;
  float phase2 = dot(p - piv, direction) / pitch2 + piv.y / pitch + F.x + uDrift;
  vec2 step2 = (direction / pitch2 + F.yz) * pixel;

  float cover2 = pulseBox(phase2, step2, duty);
  float cover1 = 0.0;
  float overlap = 0.0;
  float local1 = fract(phase1 + 0.5) - 0.5;
  for (int i = -1; i <= 1; i++) {
    float lo = clamp((float(i) - 0.5 * duty - local1) / step1, -0.5, 0.5);
    float hi = clamp((float(i) + 0.5 * duty - local1) / step1, -0.5, 0.5);
    float height = max(hi - lo, 0.0);
    if (height > 0.0) {
      cover1 += height;
      overlap += height * pulseBox(phase2 + step2.y * 0.5 * (lo + hi),
                                    vec2(step2.x, step2.y * height), duty);
    }
  }
  overlap = clamp(overlap, max(cover1 + cover2 - 1.0, 0.0), min(cover1, cover2));

  vec2 edge = 0.5 * res - abs(p);
  float density = uEdgeFade > 0.0 ? mix(0.88, 1.0, smoothstep(0.0, uEdgeFade, min(edge.x, edge.y))) : 1.0;
  float grain = 0.5 * (grainWave(p, pixel, vec2(1.31, 1.73), 0.4) + grainWave(p, pixel, vec2(-1.97, 0.73), 1.7));
  float a = rule * clamp(a0 * density * (1.0 + clamp(uGrain, 0.0, 0.05) * grain), 0.0, 1.0);

  // Two opaque inks, as printed: where lines cross, screen 2 covers screen 1, so the
  // tone follows the UNION of the screens (c1 + c2 - overlap). That is what makes register
  // visible: in register the union is c, out of register 2c. Density lightens the inks
  // (less absorption) without weakening that contrast.
  float form = clamp(0.5 + 0.5 * F.x / max(uLatentAmp + 0.5, 0.5), 0.0, 1.0);
  vec3 ink1 = inkOne(form, energy, uEnergy);
  vec3 ink2 = inkTwo(form, energy, uEnergy);
  vec3 paper = max(uPaper, vec3(0.02));
  vec3 k1 = clamp(1.0 - ink1 / paper, 0.0, 1.0) * a;
  vec3 k2 = clamp(1.0 - ink2 / paper, 0.0, 1.0) * a;
  vec3 T = 1.0 - k1 * (cover1 - overlap) - k2 * cover2;
  gl_FragColor = vec4(clamp(sheet * T, 0.0, 1.0), 1.0);
}
`
