# City of David HTML5 — targeted historical player correction (v4)

## Timeline
- Rebuilt **17 selectable eras** using the exact year/asset list supplied by the archive owner.
- Every image tile has its year ABOVE the picture. The currently selected year turns white; other years remain gold.
- Preserved the original Hebrew explanations where the corresponding era is actually documented. A missing separate description stays identified as missing instead of being silently mapped to another period.
- Several labels (e.g. British Mandate at 1948) are preserved exactly as supplied, even though the date/name pairing can be historically debated.
- For years -141, -37, 326, 638 the King David image is the supplied fallback; no alternative was invented.
- The previous extraction incorrectly bound text to images by array index. V4 keys media by the specified year.

## HP comparison
- Five functional localized tours: `/he/hp.html`, `/en/hp.html`, `/es/hp.html`, `/fr/hp.html`, `/ru/hp.html`.
- Horizontal slider moves between the archived images from ancient Jerusalem to modern aerial photography. Drag the slider; move the pointer across the main photo for a magnifying lens enlarging the current image. Click the lens button to pin/unpin it.
- Hebrew audio column is LEFT. In the other four languages the audio column is RIGHT.
- The five image states per language are preserved using actual embedded source bitmaps. IDs from the Hebrew, Spanish and Russian SWFs are **+1** relative to English/French IDs: they are not missing assets.
- Some image variants include annotations/hotspots that differ only slightly from neighboring frames, as expected from source media.
- External location videos are not invented. The restoration uses the media already archived locally.

## Usage
Extract the ZIP and open `index.html`. Visit the relevant language's timeline or HP page. Does not use Flash, ASP or a database. The slider/period selectors are client-side and work over `file://` too.

## Limitations
The original SWF ActionScript easing, masking and hover effects are reconstructed using observed media and the supplied recordings rather than byte-for-byte ActionScript conversion. Audio still requires a user click due to browser autoplay policies.

## Version 5 magnifier correction
The magnifier now enlarges the image currently on screen at 2.35× and precisely reproduces the current slider blend at intermediate transitions. It no longer reveals the opposite era. Move the mouse over the image to magnify; use the ⌕ toolbar button to pin or unpin the lens. This change applies to all five languages and does not change the ancient-to-modern slider.
