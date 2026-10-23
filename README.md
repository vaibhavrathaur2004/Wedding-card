# Shikha & Veerpal — Wedding Invitation Website

A responsive, luxury-modern wedding invitation built with plain HTML, CSS and JavaScript. It can be hosted free on GitHub Pages.

## Files

- `index.html` — page content and sections
- `style.css` — responsive design, animations and visual theme
- `script.js` — opening envelope, music control, countdown, venue link, gallery and RSVP
- `assets/` — add your own licensed music file here

## Before publishing

### 1. Add music
Place an MP3 you own or are licensed to share at:

`assets/wedding-song.mp3`

The site intentionally does not autoplay music; visitors must press **Play music** because browsers commonly block autoplay.

### 2. Update venue and event details
Open `script.js` and edit the `CONFIG` object near the top:

```js
const CONFIG = {
  weddingDate: "2026-11-26T00:00:00+05:30",
  venueName: "DIVYANI LAWN",
  venueAddress: "Pilibhit Bypass Rd, Gardan City, Bareilly, Uttar Pradesh 243006",
  mapsQuery: "Your venue name, city, state",
  rsvpEndpoint: ""
};
```

`weddingDate` uses India Standard Time (+05:30) in this example. Change the time if you know the ceremony start time. The current countdown reaches midnight at the start of 26 November, not the ceremony time.

Update the Haldi and Mehendi date/time placeholders in `index.html`. Replace sample gallery images with your own images if desired. Search for `images.unsplash.com` in `index.html` to replace the sample photo URLs.

### 3. Connect RSVP responses to Google Sheets (free)

A GitHub Pages site is static; it cannot store form submissions by itself. Use a Google Sheet plus Apps Script:

1. Create a new Google Sheet named `Wedding RSVPs`.
2. In the sheet, choose **Extensions → Apps Script**.
3. Replace the editor content with this script:

```javascript
const SHEET_NAME = "Sheet1";

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = e.parameter || {};
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Contact", "Attendance", "Guests", "Message"]);
  }
  sheet.appendRow([
    new Date(),
    data.name || "",
    data.contact || "",
    data.attendance || "",
    data.guests || "",
    data.message || ""
  ]);
  return ContentService.createTextOutput("OK");
}
```

4. If your tab is not named `Sheet1`, update `SHEET_NAME`.
5. In Apps Script, select **Deploy → New deployment**.
6. Select the gear icon / deployment type **Web app**.
7. Set **Execute as: Me**. Set access to **Anyone** if available and appropriate for your account. This allows anyone with the URL to submit an RSVP, so do not put sensitive information in the form.
8. Click **Deploy**, authorize access, and copy the Web app URL ending in `/exec`.
9. In `script.js`, paste the URL into `rsvpEndpoint` in the `CONFIG` object.
10. Save and push the updated files to GitHub. Test with a sample RSVP and check the Google Sheet.

Important: Google account policies may restrict public Apps Script web apps, and Apps Script deployment screens can vary. If your account does not allow public access, use an RSVP service or a small backend instead. Since the site uses `no-cors`, the browser cannot verify that the remote service stored a row; test the Google Sheet after the first submission.

## Deploy to GitHub Pages

1. Sign in at [GitHub](https://github.com/).
2. Create a **public** repository named `shikha-veerpal-wedding`.
3. Upload `index.html`, `style.css`, `script.js`, and the `assets` folder. Keep `index.html` at the repository root.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select branch `main` and folder `/(root)`, then click **Save**.
7. Wait for the Pages deployment to finish. The URL should look like:
   `https://YOUR-USERNAME.github.io/shikha-veerpal-wedding/`
8. Open that URL on your phone and test the envelope, music button, countdown, gallery, maps link and RSVP.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Notes

- This site uses Google Fonts and sample images from Unsplash, so those resources require internet access. Replace images with photos you have permission to publish.
- Keep the repository public if you are using the free GitHub Pages plan for a standard account.
- The venue and event timings are intentionally marked as not yet announced.
- The code does not include an audio file. Add your own licensed music as described above.
- For privacy, collect only the RSVP details you need and share the Sheet only with trusted hosts.
