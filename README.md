# Behind the Headlines
Interactive investigative website based on *Dekada '70* by Lualhati Bautista.
University of Caloocan City, Philippine Literature in English, Final Performance Task.
Main question: *How is Dekada '70 still relevant in today's digital age?*

## Run it
Open `index.html` in Chrome, Edge, or Firefox. No server or internet needed. Progress saves in the browser (`localStorage`). Menu > "Reset all saved progress" clears it (with confirmation).

## Files
- `index.html`: page shell and the SVG desk (all desk art is drawn here)
- `style.css`: styling and textures
- `data.js`: **all content** (evidence, claims, sources, members, dialogue, Doro article text)
- `script.js`: behavior
- `assets/`: optional images, audio, video (see below)

## Assets (all optional; missing files show labelled placeholders)
| File | Used for |
|---|---|
| `assets/desk-bg.jpg` | full desk background |
| `assets/typewriter.png`, `newspaper.png`, `radio.png`, `food.png` | replace the drawn desk objects (`food.png` = the plate; draw it at roughly 214x100 ratio, transparent background) |
| `assets/photo-street.png`, `photo-family.png` | photo slots in the evidence viewer. If you add one, add its credit to `SOURCES` |
| `assets/folder.png` | ending |
| `assets/member-1.png`, `member-2.png`, `member-3.png` | Project Credits |
| `assets/audio/radio-track.mp3` | the radio's single track |
| `assets/audio/paper-rip.mp3` | the paper-ripping sound for "Scrap the Case". Currently a silent placeholder: replace it with your own recording, keeping the file name |
| `assets/doro-attacks-tokyo.jpg` | illustration in the Doro tabloid article |
| `assets/doro-article.png` | optional newspaper texture behind the Doro article |
| `assets/doro-truth.mp4` | the video for "THE TRUTH OF DORO" |

**Supplied and in use:** `radio-track.mp3`, `doro-attacks-tokyo.jpg`, `doro-truth.mp4` (H.264/AAC, plays in Chrome, Edge, Firefox, Safari), `member-1/2/3.png`, `photo-family.png`, `photo-street.png`. The other files listed above remain optional upgrades; each falls back to the drawn art if absent. Players never see file paths or developer notes; if something needs finishing, it is marked with a `// TODO` comment in the code (currently: verified quotations and page numbers in `lQuotes`, and a photographer/archive credit for the two photographs).

## Doro easter egg (optional, separate from the investigation)
1. A small torn newspaper scrap sits among the loose scraps at the front of the desk (near the paper clips). Click it (or Tab to it and press Enter): the tabloid "DORO ATTACKS TOKYO!" opens and the journalist reacts with the required line.
2. Close the article. The scrap on the desk gets a faint red underline, and the next time you open the article, "THE TRUTH OF DORO" is highlighted.
3. Click only that highlighted phrase: a video overlay opens and tries to play `assets/doro-truth.mp4`. If the file is missing, it says so honestly. Nothing autoplays.
It is stored in `localStorage` as `doro` (opened, unlocked). It never changes evidence counters, thresholds, the report, or the ending. Edit its text in `DORO` at the bottom of `data.js`.

## PRIVATE: demonstration shortcut
In **Archive > Project Credits**, click any one member portrait **three times** (within about 2.5 seconds between clicks). The full "Pass It On" ending starts immediately, even if the investigation is unfinished. It works on each portrait independently, shows no hint in the interface, and **does not modify saved data** (notes, board, comparisons, progress stay as they were). After the ending, "Return to the desk" resumes normally. Do not mention it on screen if you want it kept discreet. Code: the `demo` block near the end of `script.js`.

## Source Register
The register (Archive > Source Register) is the project's bibliography in APA 7th edition and shows no status labels. Edit `SOURCES` in `data.js`: `apa` (use `_text_` for italics), `url`, `group`, `use`. Every source is cited by at least one evidence item (`src` ids).

### What was checked while building this, and what still needs you
Checked through live web lookups of each source's page or catalogue record (the page text matched the entry): Lawphil Proclamation 2045 and 2045-A; Lawphil 1972 proclamations index (it lists the Proclamation 1081 page used here); Supreme Court E-Library (RA 10368); ChanRobles (*Javellana*); Amnesty International report PDF (title, 22 Nov–5 Dec 1975 mission, published Sept 1976) and the Ortigas Library catalogue record; the 25 Sept 1972 AP dispatch (ECU Digital Collections); UP Diliman exhibit banners; CMFR article on the Task Force Detainees; Bantayog profile; Interaksyon article; Anvil *Dekada '70* catalogue record (ISBN 978-971-27-3398-7).
**Not opened or only partly verified, please check before submission:**
- Wardle & Derakhshan (Council of Europe), Wineburg & McGrew (SSRN), and UNESCO (unesdoc) URLs: the publications are real and cited correctly from knowledge/search snippets, but I did not open every link. Click each.
- Lawphil's Proclamation 1081 page was taken from the Lawphil index listing, not opened directly.
- Abinales & Amoroso (2017, 2nd ed.): no URL, and **no page numbers are given because none was checked**. The site cites it only as general background. If you quote it, add pages.
- The AP dispatch headline is taken from the scan's OCR text and the page number is not recorded.
- UP Diliman exhibit entry S13 has a bracketed descriptive title because the page is untitled.
- Some details in Evidence Files come from the exhibit banners and news-based sources, not peer-reviewed work. The group may prefer to add a scholarly book or article for the strongest claims.
- RA 10368's exact signing date differs across sources; the register uses the year only.
**Dekada '70:** the site contains **no quotations from the novel** and no page numbers. The catalogued edition is Anvil Publishing (2018), a Filipino-language edition; an English translation also exists (self-published by the author). State in your report which text you read. Verify the literary summaries (Amanda's perspective, five sons, eldest son Jules, her questioning of her role) against your copy; anything you quote needs that copy's page number.
**AI-assistance disclosure:** this website was produced with the help of a generative AI assistant. Disclose it as your course policy requires (not listed in the register).

## Replacing desk artwork
Desk objects are `<g class="obj" data-obj="NAME">` in `index.html`. To use a PNG instead, put it in `assets/` with the names above; `script.js` (`assets()` at the top of the desk section) swaps it in and falls back to the drawn art if missing.

## Testing
Automated Playwright runs in headless Chromium (desktop 1366x768 and a 390px mobile viewport; no audio, video, or image assets present) covered: desk size vs. navigation and footer; drawer open/close (mouse and keyboard); archive (38 items) and its three tabs with both exact jokes; Source Register content (no development labels); Doro sequence (clip, exact reaction line, locked/unlocked phrase, video only after the click, honest fallback when the mp4 is missing, progress counters unchanged, persistence after refresh); notes; comparisons; board strings, separate tags, selecting/changing/removing connections, click-to-place, dragging, persistence; radio joke and single slider; demonstration shortcut (works per portrait, needs three clicks, leaves saved data untouched); normal report-to-ending path; reset confirmation.
**Not tested:** real audio/video playback (no files supplied), other browsers, touch devices, screen readers, printing. Please do a full manual run-through, including your own radio track and Doro mp4.

## Case File 07 (the desk dossier)
The book on the desk was replaced by a manila dossier (`data-obj="dossier"` in `index.html`; content in `DOSSIER` at the bottom of `data.js`; `openDossier()` in `script.js`). Its leads open existing newspaper claims (`c1`..`c9`) and evidence ids, and the "looked at" ticks read the existing `inspected` / `claimsSeen` state, so there is no separate progress system and no change to the saved-data schema. The nav button, now labelled `The Bartolome File`, still opens the literary investigation. In the Demonstration guide (Menu), step 1 now says to open Case File 07, then the nav button (The Bartolome File).
## In-universe wording rule
Visible text should read as the journalist's world. Keep explanations of how the project was made in the Source Register (`S20`, the register note), the final record, the README, or code comments. Evidence entries use `auth`: A record, S interpretation, N newspaper/case-file document, L literary analysis, M reading guide; items with `src` pointing at "Project original" entries hide that source row in the evidence viewer.

## Scrap the Case (restart button)
On the typewriter (the Report panel), a small "Scrap the Case" stamp sits under the checklist. It asks for confirmation; on Confirm the report sheet tears into pieces (about 1.3 s, skipped when the device asks for reduced motion), then all of this game's saved and in-memory progress is cleared and the intro opens again. Cancel changes nothing. It removes only the `bth_state_v1` entry from `localStorage`; unrelated entries and the saved radio volume are left alone. The sound is `assets/audio/paper-rip.mp3` (see the table above) and is played only after the player confirms. Code: the "SCRAP THE CASE" block near the end of `script.js`; styling: the end of `style.css`.

## Demonstration walkthrough (for the group, not shown in the game)
The in-game Menu no longer contains presenter instructions. For the 7-10 minute video:
1. Introduce the work: say what *Dekada '70* is (the group explains this, the game does not). On the desk, open Case File 07.
2. Brief literary analysis: open **The Bartolome File** in the nav bar (Amanda's point of view, agency, gender expectations, family and politics, human consequences).
3. Contemporary issue: explain misinformation and selective framing in your own words. In the game, show a newspaper claim and the Compare desk (two sources, one claim).
4. Connection between the work and the issue: this is the group's argument and lives in the video and narrative report.
5. Demonstrate: newspaper claim, compare, a note, a board connection, then the report. The three-click portrait shortcut (Credits) runs the ending quickly.
6. Conclusion.
## Division of labour: game vs. group
The game stays inside the journalist's world. Out-of-universe explanations (the author and publication history, the literary techniques, the link to today's information environment, how to write the report) were removed from the game and belong in the presentation and narrative report. The Source Register keeps the full bibliography, including works that are no longer cited by any in-game item (S17 Wardle & Derakhshan, S18 Wineburg & McGrew, S19 UNESCO, and S2 on the translation); the group can still use them in the report.
## Outstanding verification (unchanged, still open)
See "What was checked while building this, and what still needs you" above. In short: open the Wardle/Wineburg/UNESCO links, add pages for Abinales & Amoroso if quoted, add verified quotations with page numbers (`// TODO` in `data.js`), and add a verified credit for the two photographs if one can be found. Historical summaries were not changed in this revision except to remove classroom phrasing.
