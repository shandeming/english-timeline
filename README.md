# English Timeline for Chrome and Microsoft Edge

Bookmark listening moments directly on YouTube's progress bar.

## Store submission and downloads

Version 1.0.0 was submitted to Microsoft Edge Add-ons on October 3, 2026. At submission, its status was **In review**; a public store link will be added after approval.

- [Download the extension ZIP](dist/english-timeline-1.0.0.zip)
- [Privacy policy](PRIVACY.md)
- [Edge submission record](store/EDGE-SUBMISSION.md)
- [Edge publishing guide](store/EDGE-PUBLISH.md)

To rebuild the upload package and store images on Windows, run `powershell -ExecutionPolicy Bypass -File tools/prepare-store.ps1`. Node.js must be on PATH. The script validates JavaScript syntax and manifest references before packaging the runtime files.

## Install (about one minute)

1. If using the ZIP, extract it first. Keep the extracted `english-timeline` folder somewhere permanent.
2. In Chrome, open `chrome://extensions`; in Edge, open `edge://extensions`.
3. Turn on **Developer mode**, then click **Load unpacked**.
4. Select the `english-timeline` folder containing `manifest.json`.
5. Refresh your YouTube video tab.

## Use

- Press **B** while listening to save the current moment. Playback continues.
- Mint-colored ticks appear above YouTube's progress bar when its controls are visible. Hover for a timestamp; click to replay.
- Click **✦** in the bottom playback controls to open your marks and settings.
- Replay starts **3 seconds before** the saved moment. Change **Lead-in (s)** from 0 to 30 seconds.
- Change **Shortcut** to any single letter or digit. Choose one you do not use for YouTube's built-in shortcuts: the extension takes priority for the selected key.
- Click **×** next to a time to delete that mark.
- Shortcuts work when the YouTube page has keyboard focus, including fullscreen. They are ignored while typing and when modifier keys are held.

## Storage and scope

Marks are saved per video in this browser profile using extension storage. They survive refresh and browser restart. Uninstalling the extension clears its storage; this version has no export feature. No account, server, AI, or video download is required. Its only permission is storage, and its page script runs only on `https://www.youtube.com/*`.

The first version targets recorded videos on standard `/watch?v=...` pages, including theater and fullscreen modes. It does not mark ads, live streams with an indefinite duration, Shorts, embedded videos, or picture-in-picture. Ad detection uses YouTube's current player class and may need adjustment if YouTube changes its layout. Marks record the instant you press the key, not an automatically detected sentence boundary.

YouTube occasionally changes its controls. If the star or ticks are missing, refresh the tab and verify that the extension is enabled. Overlapping marks on long videos remain individually accessible in the list. Simultaneous edits to the same video's marks in multiple tabs use the latest storage write.

## Verify on your video

1. Play a video, press B, and confirm that playback continues and a mint tick appears.
2. Click the tick; confirm playback returns approximately three seconds before the saved time.
3. Add another mark, refresh, and confirm both remain.
4. Enter fullscreen and theater mode; confirm ticks and the star remain usable.
5. Type B in YouTube search; confirm it does not create a mark.
6. Navigate to another video and back; confirm each video's marks are separate.
7. Change the shortcut and lead-in, then remove a mark from the list.

## Updating / removing

After changing files, click **Reload** for the extension on `chrome://extensions` or `edge://extensions`, then refresh YouTube. To stop using it, disable or remove it on that page.

Built with plain JavaScript and CSS, Manifest V3. There is no build step.

## Validation

JavaScript syntax and manifest parsing passed. Automated tests in a headless Edge browser using a simulated YouTube player passed for marking, rapid saves, replay lead-in, typing protection, ad protection, settings, deletion, per-video navigation, and replacement of player controls. The extension has not yet been installed or tested against the live YouTube player; use the verification steps above after installation.
