# City of David: Surroundings hover restoration (v7)

This release updates the five Early Jerusalem / Surroundings pages:

- `he/surroundings.html`, `en/surroundings.html`, `es/surroundings.html`, `fr/surroundings.html`, `ru/surroundings.html`

## Source fidelity

The previously used archaeological attraction list did not match the original map. The archived `surroundings.asp` HTML contains `switch(ingal)` with the **11 historical location names**, along with `maingal_1` through `maingal_11`, which provide the exact matching archival photographs. Those Hebrew names, source photographs, and the 11 map markers are now restored. The other four languages have written translations, rather than identical English labels.

The colored hover regions use the **actual transparent button artwork** from `CityofDavidSviva3.swf`, recovered in `sviva3.zip` as `DefineButton2_35` etc. Region sprite placement was aligned to the user's original full-map screenshot at 498 × 653 pixels. The hover targets are SVG silhouettes traced from the alpha channel of each recovered sprite, not plain rectangular hotspots. The base map continues to use the recovered historical screenshot and original aerial photograph.

**Behavior:** Point at a yellow location marker, anywhere inside one of the colored region shapes, or a site-list entry. The corresponding region lights up in its original color and a visible tooltip displays the name in the active language. The archived photograph/caption updates at the side. Click to choose; keyboard focus and Enter/Space are also supported.

## Verification

- Verified 11 labels, photographs, markers and shapes per language (55 of each across 5 languages).
- Checked each page's local asset references.
- JavaScript syntax validation passed.
- Ran Chromium rendering/interaction checks using inlined HTML, CSS and JS; hover, translated labels, photo updates, boundary crossing and click work.
- Direct HTTP/file navigation was blocked by the environment, so full ordinary browser navigation was not available. The sites should be tested on the user's device as well.

## Remaining caveat

The region artwork is original, but the position registration is derived from screenshot alignment rather than exact Flash coordinate matrices. The reconstructed tooltip design is styled to resemble the historic labels, but is not a frame-exact Flash recreation. The French, Spanish, Russian and English names are translations, not independently discovered 2007 localized site copy.

This is entirely static HTML, CSS and JavaScript; no ASP or Flash required.
