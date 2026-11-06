# CartShare — Collaborative Shopping Ecosystem

A responsive four-view web application built with HTML, CSS and vanilla JavaScript.

## Included features
- Create a shopping room and share its room code.
- Join a room by entering a room code and participant display name.
- Add, remove and change quantities of shared cart items.
- Assign item activity to a member and display a chronological activity log.
- Persist the room and cart in browser `localStorage`.
- Synchronize changes across open tabs on the same browser/origin using the `storage` event and `BroadcastChannel`.
- Estimate delivery cost and show progress toward the ₹75 free-delivery target.
- Generate a printable group receipt using CSS print rules and the browser print dialog.
- Responsive layout for mobile and desktop.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser. For best cross-tab testing, serve the folder using VS Code Live Server or run `python -m http.server 8000` inside this folder, then visit `http://localhost:8000`.
3. Open the same URL in two browser tabs. Add or update an item in one tab and observe the other tab update.

## Important collaboration scope
This submission implements browser-based collaboration across tabs sharing the same browser storage and origin, matching the supplied syllabus requirement to use browser storage and JavaScript event listeners. It is a front-end prototype, not a production multi-device backend. Participant names are stored per browser tab session so two tabs can simulate different contributors. Different devices/browsers do not share `localStorage`; production cross-device collaboration would require a hosted database/realtime service and authenticated user sessions.

## Deploy (required before portal submission)
- GitHub Pages: create a public repository, upload the contents of this folder, then enable Pages from Settings → Pages → Deploy from branch → `main` → `/root`.
- Netlify: drag the extracted folder into Netlify's manual deploy area, or connect the GitHub repository.
- Vercel: import the repository as a static project; no build command is needed and the output directory is the project root.
After deployment, test the public URL in two browser tabs and paste the live URL into the course portal.

## Suggested submission naming
`BatchID_FullName_CartShare`
Keep the folders `css/` and `js/` intact. Include the repository URL and deployed URL in the portal submission.
