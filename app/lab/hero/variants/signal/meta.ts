import type { VariantMeta } from '../../types'

export const meta: VariantMeta = {
  id: 'signal',
  title: 'Signal',
  author: 'claude',
  concept:
    'The hero as a short looping title sequence in ordered dither on round dots, opening on the title: the one mark goes out across the grid as a wave of DNA glyphs, the glyphs settle where the title will stand, and the words resolve out of them. The title holds, then each word plays what it means (intelligent carries signals, systems shifts in modules, designer draws its construction and fills with colour) while the others step back to grey, and in the return the words dissolve back into the one mark. Meanwhile, in the upper right, large and cropped by the edges, the field keeps evolving on its own: an atom, a molecule turning, a cell dividing, each lit like a sphere in soft psychedelic pastels, drawn as dense 1-bit bitmap in ordered dither, mostly white, dissolving one into the next. Greys and the sage, with colour in two places: the systems modules turning round the hue wheel (its hex in the readout), and designer filling with one gradient ramp across the word. A faint grey haze and a dot on every grid node keep the page from going bare. The pointer bends the dot grid like a lens and leaves a sage wake; scrolling away dissolves the hero in ordered dither as the words leave.',
  params: [
    { key: 'scene', label: 'Scene', type: 'select', options: ['loop', 'resolve', 'intelligent', 'systems', 'designer', 'title'], default: 'loop', group: 'Sequence' },
    { key: 'speed', label: 'Speed', type: 'range', min: 0.25, max: 2, step: 0.05, default: 1 },
    { key: 'hold', label: 'Title hold (s)', type: 'range', min: 3, max: 40, step: 1, default: 6 },
    { key: 'once', label: 'Play once, then hold', type: 'toggle', default: false },
    { key: 'intro', label: 'Opening once a session, then idle', type: 'toggle', default: true },
    { key: 'dot', label: 'Dot pitch (px)', type: 'range', min: 2, max: 8, step: 1, default: 4, group: 'Dither' },
    { key: 'dotFill', label: 'Dot size', type: 'range', min: 0.3, max: 1.2, step: 0.05, default: 0.8 },
    { key: 'round', label: 'Roundness', type: 'range', min: 0, max: 1, step: 0.05, default: 1 },
    { key: 'halftone', label: 'Halftone (size by density)', type: 'range', min: 0, max: 1, step: 0.05, default: 0.35 },
    { key: 'formTone', label: 'Forms tone', type: 'select', options: ['soft', 'vivid'], default: 'soft', group: 'Colour' },
    { key: 'palette', label: "Designer's fill", type: 'select', options: ['brand', 'iridescent', 'mono'], default: 'brand' },
    { key: 'grid', label: 'Lattice', type: 'range', min: 0, max: 1, step: 0.05, default: 1, group: 'Layers' },
    { key: 'hud', label: 'Progress bar', type: 'toggle', default: true },
    { key: 'exit', label: 'Scroll exit', type: 'toggle', default: true },
    { key: 'wake', label: 'Pointer wake', type: 'range', min: 0, max: 1.5, step: 0.05, default: 1 },
    // Freezes the loop at t seconds (URL only, e.g. ?p.t=8): for checking a transition frame by frame.
    { key: 't', label: 'Time', type: 'range', min: 0, max: 60, step: 0.1, default: 0, hidden: true },
    { key: 'size', label: 'Type size', type: 'range', min: 0.6, max: 1.1, step: 0.02, default: 1, group: 'Type' },
  ],
}
