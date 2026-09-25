# Link-preview image

`og-image.html` is the source for the site's Open Graph / Twitter image (1200x630), served
from `public/img/` and referenced by `SITE.OG_IMAGE` in `lib/constants.ts`.

To change it: edit the HTML, open it in Chrome at 1200x630 (or any headless renderer),
save a JPG into `public/img/` under a **new file name**, and point `SITE.OG_IMAGE` at it.
WhatsApp, LinkedIn and Slack cache previews by image URL, so reusing the old name keeps
showing the old image.

The cream bands use `field.png`, a text-free render of the home hero field at 2x: open
`/lab/hero?v=moire-wake&embed=1&p.highlight=off&p.hiSub=off&p.copyFade=0` in dev, hide the
copy, and capture a 1200x630 CSS-px area of the section at device scale 2. Render the
card at device scale 2 (2400x1260), then downsample to 1200x630 with a Lanczos filter
and save as JPG quality 90 (about 190 KB; WhatsApp is unreliable above ~300 KB).
