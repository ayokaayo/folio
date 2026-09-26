/**
 * Hero glyph layer (GLSL, included in shader.ts after `colour`). One glyph per 16px lattice cell,
 * chosen from a slowly blending geometric pattern and lifted by the wave field's energy.
 * See docs/superpowers/specs/2026-09-26-hero-ascii-layer-design.md.
 */
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

// Pattern value 0 to 1 at a cell (cell units). Three fields blend on incommensurate slow clocks;
// the blend is amplitude-normalised so rest glyphs never vanish when the weights even out.
// bend (cycles) shifts every field's phase: the wake bends the pattern where it passes.
float glyphPattern(vec2 c, float t, float bend) {
  float s = max(uGlyphScale, 2.0);
  vec3 w = 0.5 + 0.5 * sin(TAU * t / vec3(40.0, 53.0, 67.0) + vec3(0.0, 2.1, 4.2));
  w /= max(w.x + w.y + w.z, 1e-3);
  vec2 o1 = uGlyphCenter + vec2(18.0 * sin(t / 29.0), 9.0 * sin(t / 37.0 + 1.0));
  float f1 = cos(TAU * (length(c - o1) / s + bend));
  float a = t / 90.0;
  vec2 r = mat2(cos(a), -sin(a), sin(a), cos(a)) * (c - uGlyphCenter);
  float f2 = cos(TAU * ((abs(r.x) + abs(r.y)) / (s * 1.3) + bend));
  vec2 o2 = uGlyphCenter + vec2(-14.0 * sin(t / 43.0 + 2.0), 7.0 * sin(t / 31.0));
  vec2 d = c - o2 + vec2(1e-3);
  float f3 = cos(6.0 * atan(d.y, d.x) + TAU * (length(d) / (s * 1.7) + bend) - t / 7.0);
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

// Glyph layer at tl (CSS px from the section's top-left). Returns (coverage, intensity, E squared).
vec3 glyphs(vec2 tl, float px) {
  vec2 cell = floor((tl - uCellOrigin) / CELL);
  vec2 ctr = uCellOrigin + (cell + 0.5) * CELL;
  float h = fieldH(ctr);
  float E = fieldE(ctr);
  float E2 = E * E;
  float P = glyphPattern(cell, uGlyphT, uGlyphMutate * h);
  float shape = 0.35 + 0.65 * P;
  float rest = 0.33 * smoothstep(uGlyphRest, 1.0, P);
  float lift = uGlyphWake * E2 * shape;
  float I = clamp(rest + lift, 0.0, 1.0);
  // Neighbouring cells pass through the ramp at different moments; only in the wake, so rest stays soft.
  float stagger = (hash01(ivec2(cell)) - 0.5) * 0.6 * clamp(3.0 * lift, 0.0, 1.0);
  float x = clamp(9.0 * I + stagger, 0.0, 9.0);
  if (x < 0.05) return vec3(0.0);
  int lo = int(floor(x));
  float f = fract(x);
  // At 1x, stroke glyphs centre on a device pixel so their strokes stay crisp.
  vec2 q = tl - ctr;
  vec2 snap = uDpr < 1.5 ? vec2(0.5) : vec2(0.0);
  float cov = (1.0 - f) * glyphShape(lo, q, px, snap) + f * glyphShape(min(lo + 1, 9), q, px, snap);
  return vec3(cov, I, E2);
}
`
