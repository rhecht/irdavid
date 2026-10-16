# City of David historical website: v6 restoration

**Standalone HTML5 preservation project.** Open `index.html` for the original-language-intro sequence; browse to `he/index.html`, `en/index.html`, `fr/index.html`, `es/index.html`, or `ru/index.html` directly if preferred. There are no ASP or Flash runtime dependencies. For the best playback behavior, it may help to serve the folder from a local web server (`python3 -m http.server 8080`) but the links and scripts use local relative paths.

## Changes in v6

- Restored original header/background art (`bgPic1.jpg`, `bgPic2.jpg`, `bgPic3.jpg`) from the complete archive. The new CSS selects background by page.
- Replaced text language links with the **five exact SWF flag bitmaps**. Native language tooltip and alt text are included: עברית, English, Español, Français, Русский.
- Restored menu-specific header hover artworks extracted from `cityofdavidnav.swf` and positioned above the links. These remain available in each language's navigation.
- Rebuilt `he/hp.html`, `en/hp.html`, `fr/hp.html`, `es/hp.html`, and `ru/hp.html` to begin with an Earth-to-radar introduction using original `hp4.swf`-derived bitmaps. The 48 frames of the Earth animation are ordered according to their SWF bitmap IDs (100, 103, 107 ... 243). Earth frames last roughly 1.6 seconds at 30 fps; subsequent radar images follow. The visual motion beyond the original static bitmaps is a reconstruction, not a frame-for-frame ActionScript emulation.
- Corrected the HP music source to `start_original_soundtrack.mp3` (duration ~83s), preserved as an individual audio player and launched by **Start tour with sound**. SWF examination confirmed StartSound 106 at frame 3 and StartSound 200 at frame 34; corresponding short MP3 cues play during the opening. IDs 261 and 270 are defined in the SWF but have no matching direct StartSound top-level tag, so their exact triggering is not claimed.
- Localized the HP overlaid place labels: Jewish Quarter, Western Wall, City of David, including their Hebrew, English, French, Spanish and Russian translations.
- Retained the original two **independent** controls: the past-to-present slider changes the imagery; the magnifying glass enlarges **that same image**, never the opposite era.
- Added original `klali.jpg` and the Hebrew panorama introduction you supplied; provided an English translation for the panorama.
- Added `/he/surroundings.html` (ירושלים הקדומה), `/en/surroundings.html` (Early Jerusalem), and linked equivalents in the remaining three language menus. The reconstructed color-overlay map uses the recovered 1,333 × 1,768-pixel original SWF aerial photograph; interactive marker and name selections update an accompanying archival site photograph. Markers and regional overlay boundaries are based on the reference video and approximated, rather than extracted coordinate-perfect from ActionScript.
- Added static-browser-compatible search pages for each language, replacing broken search utility links.

## Known limitations

- The HP intro transition is reconstructed from its original SWF frames and user-provided screenshots, not an exact replay of all 524 ActionScript frames; user comparison remains useful.
- The five language archives are unequal. Original archaeological site descriptions were not inventively filled when the page's text was not preserved. English names on non-Hebrew Early Jerusalem pages are provisional where original translations were unavailable.
- Modern browsers do not permit guaranteed *audible* auto-play of music. Use **Start tour with sound**, or the visible audio player.
- Missing linked remote FLV movies remain unavailable, but the recovered existing videos from prior versions are preserved.
- The recreated Early Jerusalem map uses hotspots based on user recordings; exact region shapes and click semantics from the Flash engine may differ.

## Assets and provenance

Assets in `assets/v6/head`, `assets/v6/globe`, `assets/v6/sviva`, `assets/v6/surroundings` come from user-supplied SWFs, the City of David archive, and supplied image `klali.jpg`. The scripts and markup in v6 are new reconstructions. Earlier original media and HTML pages remain under `assets/restored/` and other folders.

## Final visual-fidelity refinement

Original archaeology background artwork now repeats across wide browser windows, and the navigation includes all ten original icon classes (including booking, news and City Friends). Historical booking controls lead to the preserved contact page rather than an invented live booking service. The Early Jerusalem map now uses a direct crop of the supplied historical screenshot for faithful colored boundaries and golden square markers. Transparent clickable targets align with visible markers. The final listed location has no clearly visible corresponding marker in the reference frame, and is accessible from the list. Photo associations remain approximations pending exact ActionScript/button mapping.
