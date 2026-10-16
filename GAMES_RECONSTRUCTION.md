# Rebuilt City of David Flash games

The archived SWF collection contains **three identifiable Flash games**:

| Archived SWF | Replacement | Reused material | Uncertainty |
| --- | --- | --- | --- |
| `MatchingPairs2.swf` | Matching Pairs | original card photographs | original score server `highscores.php` unavailable; modern memory mechanics |
| `games_tetris.swf` | City Tetris | original stone block tile images, two photos and 7 embedded sound assets | referenced `photo2.swf` through `photo9.swf` missing; standard Tetris-style game rules are a reinterpretation |
| `ninja.swf` | Jerusalem Adventure | original panorama, underground background, character, fire, snake, eagle, seal and 5 embedded audio clips | original level map and mechanics not fully reconstructed; new 2-level platform game |

All replacements are pure browser JavaScript and Canvas with no plugins, server scripts, score service, external libraries, CDN or network access. Original SWFs remain user-provided research material and are not needed to play.

## Controls

**Matching Pairs:** Click or tap two cards, match six pairs, use New Game to reshuffle.

**City Tetris:** Left/Right move, Down accelerate, Up/X clockwise rotation, Z counterclockwise rotation, Space hard drop, C swap with hold, P pause. Uses 7-piece shuffle bag, next-piece preview, hold, line-clear scoring and rising difficulty. Touchscreen buttons are provided.

**Jerusalem Adventure:** Left/Right or A/D move, Space/Up/W jump, X/K throw, P pause. Collect ancient seals, avoid/counter hazards, reach the end of each level. Touchscreen buttons are provided. Game levels are newly designed, not recovered maps.

Both added games have opt-in sound buttons using audio from their corresponding original SWFs. Sound events are assigned by the restoration and may not match the original exactly. Switching away from a game pauses it. Opening `games.html` directly in a modern browser works offline.

## Verification

Browsers tested: Chromium (headless). Verified game tabs, memory cards, Tetris key movement/score/hard drop/pause/resume, platform movement/jump/throw/score, and responsive mobile layout without horizontal overflow. JavaScript errors: none during tested flows. This is functional testing rather than a full play-through of every possible game state.
