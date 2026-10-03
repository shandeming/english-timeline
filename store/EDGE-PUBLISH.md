# Publish English Timeline to Microsoft Edge Add-ons

Microsoft's Edge extension developer program has no registration fee. The existing Manifest V3 ZIP is used unchanged.

## Files

- Package: dist/english-timeline-1.0.0.zip
- Recommended 300 × 300 listing logo: store/edge-logo-300.png
- Optional 440 × 280 promotional tile: store/promo-440x280.png
- Description, single-purpose statement, permission justifications, remote-code declaration, data-use explanation, and reviewer notes: store/EDGE-LISTING.md
- Privacy policy source to host publicly: PRIVACY.md

## Registration

1. Sign in at https://partner.microsoft.com/dashboard/microsoftedge/overview using your personal Microsoft account. The Edge program doesn't support initial registration using a work or school account.
2. If not enrolled, use Account settings > Programs > Microsoft Edge > Get started.
3. Choose your actual country/region and Individual or Company account type. These fields cannot be changed after enrollment. Choose Individual if publishing personally, or Company for a registered business.
4. Enter your publisher display name and accurate contact details, review the developer agreement, and complete registration. Wait for any required verification.

## Submission

1. In Edge's Partner Center workspace select Create new extension and upload the ZIP.
2. Set Availability to Public for a public launch, and choose the intended markets.
3. Set the closest education category in Properties; add verified homepage/support links if desired.
4. Fill Privacy using EDGE-LISTING.md. Host PRIVACY.md at a public HTTPS URL and verify that it can be accessed without login before entering that URL.
5. Add an English store listing. Paste the description, upload edge-logo-300.png, optionally add the promotional tile, and add the suggested search terms.
6. Screenshots are optional under Microsoft's current guide. If supplied, use actual screenshots at 1280 × 800 or 640 × 480 (not Chrome's 640 × 400 size). Up to six screenshots are supported.
7. Before submitting, load the extension unpacked through edge://extensions and complete README.md's live YouTube checks. Prior automated checks used a simulated player; live compatibility has not been verified.
8. Save the listing, click Publish, enter the reviewer instructions under Notes for certification, and complete submission. Verify the dashboard confirms certification is underway. Publication follows Microsoft's approval.

The package passed local syntax, manifest-reference, and ZIP-root checks. Version 1.0.0 was submitted on October 3, 2026 and Partner Center confirmed In review. See EDGE-SUBMISSION.md for the submission record. Approval and public availability are pending. No public privacy URL was supplied; Partner Center accepted the submission. Live YouTube testing by this assistant remains outstanding.

Sources checked October 3, 2026:

- https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account
- https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension
