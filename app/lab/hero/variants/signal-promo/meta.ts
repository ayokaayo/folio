import type { VariantMeta } from '../../types'

export const meta: VariantMeta = {
  id: 'signal-promo',
  title: 'Signal (promo cut)',
  author: 'claude',
  concept:
    'The hero as a looping title sequence in ordered dither on round dots, told as a genesis from zero to one and beyond: a blank page, one mark, the mark multiplying across the grid as the DNA glyphs, settling heavier where the title will stand until it is latent in the grid, and the words resolve out of it. The title breaks apart and each word plays what it means (intelligent runs in currents, systems shifts in modules, designer draws its construction and colours in) before they fuse and hold, the DNA mark plays one cycle, and the marks draw back into the one mark. The pointer bends the dot grid like a lens and leaves a sage wake; scrolling away dissolves the hero in ordered dither from the foot up as the words leave.',
  params: [
    { key: 'scene', label: 'Scene', type: 'select', options: ['loop', 'zero', 'one', 'beyond', 'latent', 'word', 'intelligent', 'systems', 'designer', 'title'], default: 'loop', group: 'Sequence' },
    { key: 'speed', label: 'Speed', type: 'range', min: 0.25, max: 2, step: 0.05, default: 1 },
    { key: 'hold', label: 'Title hold (s)', type: 'range', min: 3, max: 40, step: 1, default: 8 },
    { key: 'once', label: 'Play once, then hold', type: 'toggle', default: false },
    { key: 'captions', label: 'Captions', type: 'select', options: ['zero-one', 'blank-page', 'idea', 'numerals', 'none'], default: 'zero-one' },
    { key: 'dot', label: 'Dot pitch (px)', type: 'range', min: 2, max: 8, step: 1, default: 4, group: 'Dither' },
    { key: 'dotFill', label: 'Dot size', type: 'range', min: 0.3, max: 1.2, step: 0.05, default: 0.8 },
    { key: 'round', label: 'Roundness', type: 'range', min: 0, max: 1, step: 0.05, default: 1 },
    { key: 'halftone', label: 'Halftone (size by density)', type: 'range', min: 0, max: 1, step: 0.05, default: 0.35 },
    { key: 'noiseScale', label: 'Noise scale', type: 'range', min: 0.4, max: 2.5, step: 0.05, default: 1 },
    { key: 'palette', label: 'Palette', type: 'select', options: ['brand', 'brand-warm', 'brand-bold', 'brand-cool', 'iridescent', 'mono'], default: 'brand', group: 'Colour' },
    { key: 'colour', label: 'Colour strength', type: 'range', min: 0, max: 1, step: 0.05, default: 0.85 },
    { key: 'grid', label: 'Lattice', type: 'range', min: 0, max: 1, step: 0.05, default: 1, group: 'Layers' },
    { key: 'hud', label: 'HUD metadata', type: 'toggle', default: true },
    { key: 'exit', label: 'Scroll exit', type: 'toggle', default: true },
    { key: 'wake', label: 'Pointer wake', type: 'range', min: 0, max: 1.5, step: 0.05, default: 1 },
    // Freezes the loop at t seconds (URL only, e.g. ?p.t=8): for checking a transition frame by frame.
    { key: 't', label: 'Time', type: 'range', min: 0, max: 60, step: 0.1, default: 0, hidden: true },
    { key: 'size', label: 'Type size', type: 'range', min: 0.6, max: 1.1, step: 0.02, default: 1, group: 'Type' },
  ],
}
