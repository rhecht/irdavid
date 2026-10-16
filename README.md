## Screenshot-guided opening update

The new default `index.html` reproduces the three original opening scenes; `hebrew.html` reconstructs the Hebrew 2010 interface. The original English landing has been preserved as `explore.html`. Details: `OPENING_SCREENSHOTS_RESTORATION.md`.

---

# City of David · Historical HTML5 restoration

**A standalone, modern-browser-compatible restoration project built from the supplied Internet Archive extracts and decompiled/embedded SWF assets.** The source material centers on the original City of David site from roughly 2009.

## Open it

- **Easiest:** Extract this entire ZIP, then open `index.html` in a modern browser. Keep the `assets/` and `data/` folders beside the pages. The site was specifically coded without external CDNs, JavaScript libraries, AJAX, ASP, PHP, databases, or Flash.
- **For local development (recommended):** In Terminal/Command Prompt, `cd` into the extracted `cityofdavid-html5` directory and run `python3 -m http.server 8000`. Open `http://localhost:8000` in a browser.
- **For deployment:** Upload the whole directory to a static host (Apache, nginx, Netlify, GitHub Pages, etc.) and visit `index.html`. There is no build step.
- **Mobile:** The layout is responsive, and all navigation also works by touch.

## Pages built

| File | Status |
| --- | --- |
| `index.html` | Recreated landing experience using actual Flash introduction photography, recovered film, music and navigation categories |
| `timeline.html` | All **16 complete text chapters** and paired original period illustrations from the 2009 English source page; selectable via left panel or previous/next |
| `foundation.html` | Complete available original English body copy from the Foundation page (three long paragraphs) |
| `panorama.html` | HTML5 pointer/touch/keyboard horizontal viewer for the original **5,394 × 400** panorama extracted from Flash |
| `virtual-tour.html` | Restored site aerial view with referenced location preview images and explicit placeholders for nine *missing* FLV recordings |
| `archaeology.html` | Original archaeological imagery and recovered embedded short Water System video |
| `gallery.html` | 86 curated, deduplicated original SWF images with group filtering, source-filename search and large-image lightbox |
| `video.html` | Restored original homepage FLV converted to MP4, recovered Flash streaming background music as MP3, and Water System video reference |
| `news.html` | Five original 2009 ticker headlines; full linked articles were not in the supplied archive |
| `games.html` | Three playable HTML5 games: **Matching Pairs**, **City Tetris** and **Jerusalem Adventure**; recovered artwork from `MatchingPairs2.swf`, `games_tetris.swf` and `ninja.swf`, plus 12 original game audio clips (optional sound) |
| `hebrew.html` | Hebrew home/landing information saved from original site, connected to restored sections. Most original Hebrew article text was not in the upload. |
| `archive-index.html` | Honest preservation status, original navigation category labels, and high-priority missing external dependencies |

## Original assets preserved

The restoration uses material from the supplied ZIP, which included original saved Wayback HTML with companion folders, recovered Flash image assets, and previously recovered video and sound.

- Original introductory film supplied as `start.flv`, previously converted to MP4.
- Audio extracted from `bgsound.swf` and assembled into a complete MP3.
- Real 2009-style navigation color palette drawn from `style-eng.css` (`#4d4e52` background and `#ffb500` highlight).
- Original wide panoramic photograph, aerial views, maps, Water System artwork, game cards, and period illustrations.
- Literal English 2009 period and Foundation text, with attribution.
- Multiple small original GIFs and period images in `assets/images/orig-*`, preserving historical UI graphics even when not used by this presentation.

All original source filenames in the curated gallery are recorded in `data/gallery-provenance.csv`. Timeline names and illustrations are indexed in `data/timeline-index.csv`. A machine-readable list of known missing dependencies lives in `data/unrecovered-dependencies.json`.

## What this is and is not

**This is a functioning HTML5 interpretation, not a pixel-perfect port or a complete recovery of an entire dynamic site.** The surviving pages did not include the original complete Flash UI behavior or most server-generated `.asp` article bodies. Some interactive features are new JavaScript implementations, and they are indicated as such on their pages. The original menu labels are retained in the archive index, but pages without preserved texts were not filled with invented material.

The following original assets **have not been recovered**, and are not advertised as working: `config.xml`, nine `video/place*.flv` recordings, externally loaded historical timeline XML/images, and `hp_news_eng.swf`.

English timeline and Foundation article content was available; the full Russian, Spanish, French, and Hebrew language-specific pages were not. Hebrew homepage text is included, but the rest of the restored pages are English.

The site does **not** provide current visitor opening hours, prices, bookings or official contact information, as the archived data would be outdated.

## Credit and legal note

Historical content and photographs are credited to the **City of David** and **Ir David Foundation** as on the preserved source website. This is an independent restoration for historical study and preservation, not affiliated with the present-day website or organization. All statements copied from the 2009 website reflect that source's wording and historical period; they are not independently verified or updated. Please confirm permission/rights before republishing source material publicly.

## Technical notes

- Standard HTML + CSS + vanilla JavaScript, local MP4/MP3/WebP/GIF/JPG files.
- No `fetch()` calls are required for the page logic; data is also embedded in `assets/js/content.js`, making `file://` opening more reliable.
- Timeline can open a chapter via `timeline.html#period-6`.
- Panoramic viewer supports pointer drag, touch gestures, keyboard left/right arrows, slider controls and reset.
- Gallery lightbox supports Esc and arrow-key navigation, paging and collection filtering.
- Arcade features: selectable games, Tetris with rotation/hard drop/hold/ghost/levels; two-stage platform adventure with moving enemies, jumps, collectibles and throwing; optional original-game sound effects, keyboard and touchscreen controls. All games work offline without a backend; rules/levels are new interpretations, not exact AVM1 ports. See `GAMES_RECONSTRUCTION.md`.
- The original background music does **not** autoplay; play/pause requires an explicit click.

### Possible further phases

If additional captures are found, add the genuine nine location films, the site's timeline XML/image data, old ASP-produced article texts as static HTML pages, and any missing language versions. The architecture can accommodate these without reviving Flash or ASP.
