# City of David restoration — screenshot + Hebrew timeline edition

**Inputs reviewed:** 46 SWF files, 59 screenshots (intro, menus, Hebrew, English, French, Spanish and Russian), 47 audio files, 9 video assets, 23.37-second Hebrew timeline walkthrough, and 100+ archived HTML captures (see `RESTORATION_AUDIT_V3.json`).

## Run
Open `index.html` in a modern browser. Click **Start intro with sound** to start the original recovered 3:04 background MP3; browsers prohibit unmuted autoplay without a user gesture. The intro now cycles through recovered scene artwork before language selection. Skip and Replay are supported.

All 5 language buttons open real HTML5 pages. Hebrew is the authoritative source where multilingual source data is incomplete. The original Hebrew timeline survives with all 16 sections and full original Hebrew descriptions, with an interactive expanding-photo selector. Non-Hebrew timelines show navigation labels in English (not purported authentic original translations) and preserve the original Hebrew descriptions.

## Interface
The historical 766px shell uses original extracted archaeological backgrounds and artwork. Hebrew is RTL; English, French, Spanish and Russian are LTR. In the reconstructed HP virtual tour, Hebrew has the audio panel on the left and panorama on the right; non-Hebrew languages put the audio panel on the right. Panoramas use the original 5,394px bitmap.

## Source accuracy
Archived articles in five languages have been extracted into linked pages (source URL shown). Archive pages without recoverable text are explicitly marked. Some source media files, original game mechanics, and external XML/FLV content remain unavailable; no working media is falsely implied. Historical contact forms are nonfunctional because ASP was deliberately excluded.

## Needs from the archive, if they turn up
- `config.xml`, `flash_data/timeline_*.xml`, and corresponding timeline images/translated descriptions.
- `video/place1.flv`, `place2.flv`, `place3.flv`, `place5.flv`, `place7.flv`, `place8.flv`, `place11.flv`, `place12.flv`, `place13.flv`.
- Exact annotated timings / audio cues for the intro if frame-perfect reproduction is needed.
- Screenshots or recordings of the original games in action if pixel-accurate game interactions are required.

## Additional finds during complete archive review
Two Windows Media videos were preserved and converted to MP4 (`Emek`, 1:11, and `segwayinter`, 1:03) alongside the original introductory video and recovered Water System animation. See each language's `films.html`. Also included the single-page 2005 *New York Times* archaeological article scanned PDF.

**QA:** HTML source paths and stylesheet/script references were scanned locally; the recovered audio stream and both converted WMV files were probed successfully. JavaScript passes Node.js syntax validation. Automated browser navigation was denied by the execution environment, so a full interactive Chromium pass was **not** possible here; please verify playback, interactions and layout on your browser.

**Historical accuracy:** The sequence of stills and recovered animation images follows the supplied reference screenshots, and the timing approximates the 23.48-second SWF movie. Precise frame-for-frame playback and complete original multi-language chronology are still unattainable without the missing XML/Flash behavior; do not treat this as a byte-perfect Flash conversion.
