# Link-preview image

`og-image.html` is the source for the site's Open Graph / Twitter image (1200x630), served
from `public/img/` and referenced by `SITE.OG_IMAGE` in `lib/constants.ts`.

To change it: edit the HTML, open it in Chrome at 1200x630 (or any headless renderer),
save a JPG into `public/img/` under a **new file name**, and point `SITE.OG_IMAGE` at it.
WhatsApp, LinkedIn and Slack cache previews by image URL, so reusing the old name keeps
showing the old image.
