/**
 * Hero glyph layer (GLSL, included in shader.ts after `colour`). One glyph per 16px lattice cell,
 * chosen from a slowly blending geometric pattern and lifted by the wave field's energy.
 * See docs/superpowers/specs/2026-09-26-hero-ascii-layer-design.md.
 */
import { MAX_MASK } from './glyphInputs'

export const glyphs = /* glsl */ `
const float CELL = 16.0;
const float TAU = 6.28318531;

uint hashCell(ivec2 c) {
  uint h = uint(c.x) * 0x8da6b343u ^ uint(c.y) * 0xd8163841u;
  h ^= h >> 13u;
  h *= 0x5bd1e995u;
  h ^= h >> 15u;
  return h;
}

float hash01(ivec2 c) {
  return float(hashCell(c) & 0xffffu) / 65535.0;
}

float fieldE(vec2 tl) {
  vec2 uv = vec2(tl.x / uRes.x, 1.0 - tl.y / uRes.y);
  return texture2D(uField, uv).g;
}

// Raw (R, G) at tl: R is height (0.5 = flat), G is energy.
vec2 fieldHE(vec2 tl) {
  vec2 uv = vec2(tl.x / uRes.x, 1.0 - tl.y / uRes.y);
  return texture2D(uField, uv).rg;
}

// Pattern value 0 to 1 at a cell (cell units). Three fields blend on incommensurate slow clocks;
// the blend is amplitude-normalised so rest glyphs never vanish when the weights even out.
// bend (cycles) shifts every field's phase: the wake bends the pattern where it passes.
// Everything that depends only on the pattern clock (the blend weights, both centres, the diamond's
// turn and the rosette's spin) is worked out once per frame in engine.ts (glyphClockTerms).
float glyphPattern(vec2 c, float bend) {
  float s = max(uGlyphScale, 2.0);
  vec3 w = uGlyphW;
  vec2 o1 = uGlyphCenter + uGlyphO1;
  float f1 = cos(TAU * (length(c - o1) / s + bend));
  vec2 r = mat2(uGlyphRot.x, -uGlyphRot.y, uGlyphRot.y, uGlyphRot.x) * (c - uGlyphCenter);
  float f2 = cos(TAU * ((abs(r.x) + abs(r.y)) / (s * 1.3) + bend));
  vec2 o2 = uGlyphCenter + uGlyphO2;
  vec2 d = c - o2 + vec2(1e-3);
  float f3 = cos(6.0 * atan(d.y, d.x) + TAU * (length(d) / (s * 1.7) + bend) - uGlyphSpin);
  float S = dot(w, vec3(f1, f2, f3)) / sqrt(dot(w, w));
  return clamp(0.5 + 0.5 * S, 0.0, 1.0);
}

float cover(float d, float px) {
  return clamp(0.5 - d / px, 0.0, 1.0);
}

float segment(vec2 q, vec2 a, vec2 b) {
  vec2 pa = q - a;
  vec2 ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
}

// Coverage of glyph level 0-9 at q (CSS px from the cell centre, y down). px: CSS px per device pixel.
// snap moves stroke centres onto device pixel centres at 1x. Only strokes take it: the dots and the
// square have edges on whole CSS px, which already fall on pixel boundaries, so shifting them would
// blur every edge by half a pixel.
float glyphShape(int level, vec2 q, float px, vec2 snap) {
  const float HW = 0.625; // half of a 1.25 px stroke
  if (level <= 0) return 0.0;
  if (level == 1) return cover(length(q - vec2(0.0, 3.5)) - 1.5, px);
  if (level == 2) return cover(length(q) - 2.0, px);
  if (level == 3) return max(cover(length(q - vec2(0.0, -2.5)) - 1.5, px), cover(length(q - vec2(0.0, 2.5)) - 1.5, px));
  if (level == 9) {
    vec2 e = abs(q) - vec2(4.0);
    return cover(length(max(e, 0.0)) + min(max(e.x, e.y), 0.0), px);
  }
  q -= snap;
  if (level == 4) return cover(min(segment(q, vec2(-5.0, 0.0), vec2(5.0, 0.0)), segment(q, vec2(0.0, -5.0), vec2(0.0, 5.0))) - HW, px);
  if (level == 5) return cover(min(segment(q, vec2(-4.0), vec2(4.0)), segment(q, vec2(-4.0, 4.0), vec2(4.0, -4.0))) - HW, px);
  if (level == 6) return cover(abs(abs(q.x) + abs(q.y) - 5.0) * 0.70710678 - HW, px);
  // Box glyphs run to the cell edges so neighbours join into continuous lines.
  if (level == 7) return cover(min(abs(q.x), abs(q.y)) - HW, px);
  return cover(min(min(abs(q.x - 2.0), abs(q.x + 2.0)), min(abs(q.y - 2.0), abs(q.y + 2.0))) - HW, px);
}

// Distance (CSS px) from a cell's rectangle to the nearest copy line box or the CTA; 0 when touching.
// Measured per axis (the larger gap), so distance under d means the cell grown by d meets the box,
// corners included.
float copyDistance(vec2 cell) {
  vec2 a = uCellOrigin + cell * CELL;
  vec2 b = a + vec2(CELL);
  float best = 1e6;
  for (int i = 0; i < ${MAX_MASK}; i++) {
    if (float(i) >= uMaskCount) break;
    vec4 m = uMask[i] + vec4(-uHiPad, 0.0, uHiPad, 0.0);
    vec2 gap = max(max(m.xy - b, a - m.zw), 0.0);
    best = min(best, max(gap.x, gap.y));
  }
  vec2 gap = max(max(uCtaBox.xy - b, a - uCtaBox.zw), 0.0);
  return min(best, max(gap.x, gap.y));
}

// Churned level for a cell at a churn tick: hashed, biased toward the lighter glyphs, 1 to top.
float churnLevel(ivec2 ic, int tick, float top) {
  float pick = float(hashCell(ic + ivec2(tick * 7919, tick * 104729)) & 0xffffu) / 65535.0;
  return min(1.0 + floor(pow(pick, 1.6) * top), top);
}

// Flurries (uFx.y): a churn level that never repeats the previous tick's. Even ticks pick freely; an
// odd tick starts from its own pick and steps by +1 (wrapping within 1 to top) past both neighbours,
// so no two consecutive ticks match, which a single step past the previous tick can't promise.
float flurryLevel(ivec2 ic, int tick, float top) {
  if (top < 1.5) return 1.0;
  if (top < 2.5) return 1.0 + mod(float(tick), 2.0);
  bool odd = tick - 2 * (tick / 2) != 0;
  if (!odd) return churnLevel(ic, tick, top);
  float a = churnLevel(ic, tick - 1, top);
  float b = churnLevel(ic, tick + 1, top);
  float level = churnLevel(ic, tick, top);
  for (int i = 0; i < 2; i++) {
    if (level == a || level == b) level = mod(level, top) + 1.0;
  }
  return level;
}

// Rest glyph for a cell: presence from the pattern (or a falling stream), identity from a per-cell churn
// clock, so present cells keep swapping characters. t is the churn clock (real time, not the pattern's).
// Returns (level 0-6, ink scale, deepen); 0 is empty.
vec3 restGlyph(vec2 cell, float P, float t) {
  ivec2 ic = ivec2(cell);
  float presence = smoothstep(uGlyphRest, 1.0, P);
  // Occupancy: only a hashed share of cells may carry pattern glyphs (stream trails are unaffected).
  if (hash01(ic * 5 + 3) >= uGlyphKeep) presence = 0.0;
  float head = 0.0;
  bool written = false;
  uint hc = hashCell(ivec2(ic.x, 7919));
  float col = float(hc & 0xffffu) / 65535.0;
  if (col < uGlyphRain) {
    float speed = mix(4.0, 10.0, float((hc >> 16u) & 0xffu) / 255.0) * uStreamSpeed;
    float trail = max(uStreamTrail, 1.0);
    float rows = uRes.y / CELL + trail;
    float headRow = mod(t * speed + col * 997.0, rows);
    float d = headRow - cell.y;
    if (d >= 0.0 && d < trail) {
      // Fade over a third of the trail, so the trail length shows (exp(-d/4) at the default of 12).
      presence = max(presence, exp(-d / (trail / 3.0)));
      head = 1.0 - smoothstep(0.0, 1.5, d);
    } else if (uFx.z > 0.5 && speed > 0.0) {
      // Writing streams: the head leaves a glyph behind that fades over tau seconds once the trail has
      // passed. Above the head, the last pass left it (one wrap of the column ago).
      float dd = d < 0.0 ? d + rows : d;
      float tSince = (dd - trail) / speed;
      float tau = mix(1.0, 3.0, hash01(ic * 11 + 7));
      float w = exp(-tSince / tau);
      if (w > presence) {
        presence = w;
        written = true;
      }
    }
  }
  if (presence < 0.12) return vec3(0.0);
  float top = clamp(floor(uGlyphRestTop + 0.5), 1.0, 6.0);
  // A written glyph is the pattern's own level, held still, not churned.
  if (written) return vec3(min(1.0 + floor(P * top), top), mix(0.5, 1.0, presence), 0.0);
  // Stepped, not continuous: a rate that varies smoothly with head would scale the absolute clock t
  // and make heads flicker at frame rate, worse the longer the page is open.
  float rate = uGlyphChurn * mix(0.4, 1.6, hash01(ic * 3 + 1)) * (head > 0.5 ? 3.0 : 1.0);
  float level;
  if (uFx.y > 0.5 && rate > 1e-3) {
    // Flurries: each cell's period (2 to 5 s) opens with a burst at four times its rate for a quarter
    // of the period, then holds the burst's last glyph. The average rate is unchanged. Ticks run on
    // without gaps across periods, so the no-repeat rule also holds from a hold into the next burst.
    float period = mix(2.0, 5.0, hash01(ic * 7 + 2));
    float cyc = t / period + hash01(ic + ivec2(13, 5));
    float phase = fract(cyc);
    int n = int(max(1.0, floor(period * rate)));
    int k = min(int(floor(phase * 4.0 * float(n))), n - 1);
    level = flurryLevel(ic, int(floor(cyc)) * n + k, top);
  } else {
    int tick = int(floor(t * rate + 7.0 * hash01(ic + ivec2(13, 5))));
    level = churnLevel(ic, tick, top);
  }
  return vec3(level, mix(0.5, 1.0, presence), 0.6 * head);
}

// Scroll band: a horizontal Gaussian lift centred on uBand.x, sigma uBand.z.
float glyphBand(vec2 ctr) {
  float z = (ctr.y - uBand.x) / max(uBand.z, 1.0);
  return uBand.y * exp(-z * z);
}

// Glyph layer at tl (CSS px from the section's top-left). Returns (coverage, intensity, deepen): deepen is
// the larger of E squared and a stream head's deepening.
vec3 glyphs(vec2 tl, float px) {
  vec2 cell = floor((tl - uCellOrigin) / CELL);
  vec2 ctr = uCellOrigin + (cell + 0.5) * CELL;
  float dCopy = copyDistance(cell);
  if (dCopy < CELL) return vec3(0.0); // one clear cell around every copy box and the CTA
  // The column rule covers the copy block's height (top to the CTA's bottom) plus one cell; below it,
  // on phones where the column is nearly full width, rest glyphs and streams still appear.
  bool inColumn = ctr.x >= uCopyCol.x && ctr.x <= uCopyCol.y && ctr.y >= uCopyCol.z - CELL && ctr.y <= uCopyCol.w + CELL;
  // Height and energy share a texel: one tap reads both.
  vec2 hE = fieldHE(ctr);
  float h = (hE.x - 0.5) * 2.0;
  float E = hE.y;
  float E2 = E * E;
  float P = glyphPattern(cell, uGlyphMutate * h);
  float shape = 0.35 + 0.65 * P;
  // Fringes: rest presence leans toward the moiré's interference phase at the cell, so rest glyphs
  // gather where the two screens fall into register.
  if (uFx.x > 0.5) {
    vec2 ph = moirePhases(ctr);
    float fringe = 0.5 + 0.5 * cos(TAU * (ph.y - ph.x));
    P = mix(P, fringe, 0.65 * uFx.x);
  }
  // No rest glyphs in the copy column: beside monospace type they read as stray punctuation.
  vec3 rg = inColumn ? vec3(0.0) : restGlyph(cell, P, uChurnT);
  // Wave edges: the energy gradient across a cell lifts the burst's expanding edge into a crisp ring.
  // Scaled by the burst control's wake, so burst 0 still draws no wake and the default is unscaled.
  float edge = 0.0;
  if (uFx.w > 0.5) {
    float gx = fieldE(ctr + vec2(CELL, 0.0)) - fieldE(ctr - vec2(CELL, 0.0));
    float gy = fieldE(ctr + vec2(0.0, CELL)) - fieldE(ctr - vec2(0.0, CELL));
    edge = uFx.w * smoothstep(0.04, 0.25, length(vec2(gx, gy))) * 0.9 * min(uGlyphWake / 2.0, 1.0);
  }
  float lift = (uGlyphWake * E2 + glyphBand(ctr) + edge) * shape;
  // Neighbouring cells pass through the ramp at different moments; only in the wake.
  float stagger = (hash01(ivec2(cell)) - 0.5) * 0.6 * clamp(3.0 * lift, 0.0, 1.0);
  float xw = clamp(9.0 * clamp(lift, 0.0, 1.0) + stagger, 0.0, dCopy < 3.0 * CELL ? 7.0 : 9.0);
  if (xw < 0.05 && rg.x < 0.5) return vec3(0.0);
  // At 1x, stroke glyphs centre on a device pixel so their strokes stay crisp (glyphShape applies
  // the snap to strokes only).
  vec2 q = tl - ctr;
  vec2 snap = uDpr < 1.5 ? vec2(0.5) : vec2(0.0);
  float cov;
  if (xw <= rg.x) {
    // Rest: whole characters, swapped instantly by the churn clock.
    cov = glyphShape(int(rg.x), q, px, snap) * rg.y;
  } else {
    // Wake: the crossfaded ramp, as before. A rest glyph's ink scale carries over the two levels above
    // it, measured from where the wake overtakes that glyph, so the crossover doesn't pop even for the
    // heavier rest glyphs (a lift-based blend had already finished by the time it passed a diamond).
    int lo = int(floor(xw));
    float f = fract(xw);
    cov = (1.0 - f) * glyphShape(lo, q, px, snap) + f * glyphShape(min(lo + 1, 9), q, px, snap);
    cov *= mix(rg.x > 0.5 ? rg.y : 1.0, 1.0, smoothstep(rg.x, rg.x + 2.0, xw));
  }
  return vec3(cov, max(xw, rg.x) / 9.0, max(E2, rg.z));
}
`
