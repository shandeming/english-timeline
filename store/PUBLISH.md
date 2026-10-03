# Publish English Timeline

Prepared files:

- Upload: dist/english-timeline-1.0.0.zip (manifest at ZIP root).
- Store icon: icons/icon128.png.
- Small promotional tile: store/promo-440x280.png.
- Listing and privacy explanations: store/LISTING.md.
- Privacy policy source: PRIVACY.md.

## Remaining steps

1. Load the project unpacked in Chrome at chrome://extensions and follow README.md's live-video verification steps. Existing automated results used a simulated player; real YouTube compatibility still needs verification.
2. Capture at least one real screenshot showing the working extension, ideally the marks panel and timeline ticks. Use 1280 × 800 or 640 × 400, PNG or JPEG, square corners and no padding. A simulated player should not be submitted as a real YouTube screenshot.
3. Publish PRIVACY.md at a public HTTPS URL and verify access without sign-in. A public GitHub file page can be used once pushed. No public policy URL has been verified yet.
4. Sign in at https://chrome.google.com/webstore/devconsole. Register if needed, complete the one-time registration payment, verify your developer email, and enable Google account 2-Step Verification. Complete any account verification Google requests.
5. Choose New item, upload the ZIP, fill the listing from LISTING.md, and upload the icon, promotional tile, and actual screenshot.
6. Fill Privacy practices using the supplied explanations and verified policy URL. Review each data-use certification against actual extension behavior.
7. Select intended distribution countries and Public visibility for a public launch. Fill developer/trader declarations accurately using your own details.
8. Resolve dashboard validation errors, then submit for review. Choose automatic publication after approval for an immediate launch following Google's review, or deferred publication to launch manually.

Uploading alone creates a draft. Submission and approval are still required; this extension has not been submitted or published.

## Rebuild

From the project root run: powershell -ExecutionPolicy Bypass -File tools/prepare-store.ps1

Node.js must be on PATH. The script regenerates icons and the promotional tile, checks JS syntax and manifest references, and packages only runtime files and icons.

Official references:

- https://developer.chrome.com/docs/webstore/prepare
- https://developer.chrome.com/docs/webstore/images
- https://developer.chrome.com/docs/webstore/publish
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- https://developer.chrome.com/docs/webstore/register
