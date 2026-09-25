/**
 * Ink colour for the moiré engine. Owns how the two screens are coloured; the
 * engine composites them as opaque inks (screen 2 over screen 1) on uPaper.
 *
 * Inputs available to these functions:
 *   form          0-1, local height of the latent form (0.5 = flat)
 *   localEnergy   0-1, local disturbance (wake field energy; 0 in Loupe)
 *   globalEnergy  0-1, overall hand activity (uEnergy)
 * Palette: a fixed key ink, a related second ink, a restrained accent ink.
 * Colour follows the form's height, so it moves with the lens / wake, with no
 * independent colour clock. The compositor supplies paper dilution and contrast.
 */
export const colour = /* glsl */ `
// A small chroma lift at constant weighted RGB brightness: activity enriches
// the ink without pulsing its density or making the field compete with type.
vec3 livelyInk(vec3 ink, float activity) {
  float value = dot(ink, vec3(0.2126, 0.7152, 0.0722));
  return clamp(mix(vec3(value), ink, 1.0 + 0.08 * activity), 0.0, 1.0);
}

vec3 inkOne(float form, float localEnergy, float globalEnergy) {
  // The key plate stays steady; the second plate carries the colour change.
  return uInk;
}

vec3 inkTwo(float form, float localEnergy, float globalEnergy) {
  float activity = smoothstep(0.0, 1.0, clamp(globalEnergy, 0.0, 1.0));
  // Both crests and troughs carry colour. Soft shoulders avoid a painted disc
  // when the engine's normalised height clamps at the top of a deep loupe.
  float relief = smoothstep(0.08, 0.90, abs(form - 0.5) * 2.0);
  float wake = clamp(uHueByEnergy * localEnergy, 0.0, 1.0);
  float amount = clamp(uHueByForm, 0.0, 2.0);
  // No 50/50 complementary mix on flat paper. Even at maximum controls the
  // accent is at most 38% of screen 2; default rest peaks at just 14%.
  float accent = clamp(amount * (relief * (0.14 + 0.10 * activity)
                                + 0.08 * wake), 0.0, 0.38);
  return livelyInk(mix(uInk2, uInk3, accent), activity);
}
`
