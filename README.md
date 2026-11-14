# Gandepalli Preetham - Portfolio Website

Plain HTML5, CSS3 and JavaScript. No build step, no dependencies (only Google Fonts via CDN).

```
my-portfolio/
  index.html
  style.css
  script.js
  README.md
  emailjs-test.html     (owner-only EmailJS diagnostic, not linked from the site)
  assets/
    profile.jpg         (your photo, shown in the Home section)
    resume.pdf          (Download Resume button)
    images/             (project cover images, og-image.png social preview)
    icons/              (GP favicon: svg, 32px png, apple-touch-icon)
    certificates/       (create this folder when you add certificates)
```

## 1. Run in VS Code
1. Install VS Code and the **Live Server** extension (Ritwick Dey).
2. File > Open Folder > select `my-portfolio`.
3. Right-click `index.html` > **Open with Live Server**. (Or just double-click `index.html`.)

## 2. Things you MUST configure
The LinkedIn link is the very first line of code in `script.js` (`const LINKEDIN_URL`). Other settings are in the `CONFIG` block just below it.

| What | Setting | How |
|---|---|---|
| LinkedIn | `LINKEDIN_URL` (top of `script.js`) | Set to https://www.linkedin.com/in/preetham-gandepalli-4a7b02348/. Drives the Home LinkedIn button, the Contact LinkedIn row and button, and the LinkedIn account email link. All open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`). To change it, edit that one line. |
| Resume | `assets/resume.pdf` | Your uploaded resume (TSC.pdf) is installed. Replace it with a newer one when needed, keeping the same file name. The Download Resume buttons (Home and footer) save it as `Gandepalli_Preetham_Resume.pdf`. On Live Server / GitHub Pages, if the file is missing the buttons change to "Resume Not Added Yet". |
| Profile photo | `assets/profile.jpg` | Your photo is already included (square, 800x800). To change it, replace the file keeping the same name. It is shown circular with `object-fit: cover`. |
| Contact form | `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY` (top of `script.js`) | See "Contact form (EmailJS)" below. Until all three are set the form shows "Email service is not configured. Please try again later." |
| Open Graph URL/image | `<head>` of `index.html` | After deploying, make sure `og:url` and `og:image` match your real site URL (they currently assume `https://preethamgandepalli2006-source.github.io/portfolio/`). The social preview image is `assets/images/og-image.png`. |
| Certificates | `CERTIFICATES` list (top of `script.js`) | Pre-filled with the 6 certificates from your resume (text only). Add certificate images/PDFs to show a preview/button. See "Adding certificates". |
| Project screenshots | `assets/images/` and the `<img>` of each Featured Project in `index.html` | The covers are title graphics, not screenshots. Add real screenshots (for example `assets/images/smartbuy.png`) and change the `src`. |
| Project live demos | `data-demo-url` on each Featured Project card | Leave empty until a real demo exists. Add a full `https://` address to show a "Live Demo" button. |

## Contact form (EmailJS)
A website made only of HTML/CSS/JS cannot send email by itself, so the form uses [EmailJS](https://www.emailjs.com/docs/), which sends the email through your own Gmail account. The code is already written. You only add three values.

### Step 1: Create the account and connect Gmail
1. Sign up (free) at https://www.emailjs.com and log in.
2. Go to **Email Services > Add New Service**, choose **Gmail**, and connect `preethamgandepalli2006@gmail.com`.
3. After saving, copy the **Service ID** (looks like `service_xxxxxxx`).

### Step 2: Create the template
Go to **Email Templates > Create New Template** and fill in:

| EmailJS field | Value |
|---|---|
| To Email | `preethamgandepalli2006@gmail.com` |
| From Name | `{{name}}` |
| Reply To | `{{email}}` |
| Subject | `New Portfolio Enquiry from {{name}} - {{subject}}` |

Content (body):
```
You have a new enquiry from your portfolio website.

Name: {{name}}
Email: {{email}}
Subject: {{subject}}

Message:
{{message}}
```
Save it and copy the **Template ID** (looks like `template_xxxxxxx`). The variable names must be exactly `name`, `email`, `subject`, `message` (they must match `script.js`). With Reply To set to `{{email}}`, pressing Reply in Gmail answers the visitor directly.

### Step 3: Get the Public Key
Go to **Account > General** and copy the **Public Key**. It is meant for browser code and is safe to publish. Never put a Private Key in this site.

### Step 4: Paste the three values into `script.js`
Near the top of the file:
```js
const EMAILJS_SERVICE_ID = "service_4oxvsi6";    // already set
const EMAILJS_TEMPLATE_ID = "template_h03m5yl";  // set
const EMAILJS_PUBLIC_KEY = "sA9zoPQtOJMPBhd9Z";  // set
```

### Step 5: Test
1. Open the project with VS Code Live Server and press Ctrl+Shift+R.
2. Fill in all four fields (message of at least 10 characters) and click **Send Message**.
3. The button shows "Sending..." and the form shows success only after EmailJS confirms.
4. Check the inbox of `preethamgandepalli2006@gmail.com` (and Spam the first time). If the email is there, it works.
5. If your EmailJS account restricts allowed domains (Account > Security), add `127.0.0.1` for Live Server and your real site domain after deploying.

### How the form behaves
- Validates name, a correct email format, subject, and a message of at least 10 characters.
- Disables the button and shows "Sending..." while sending; duplicate clicks are ignored.
- Shows "Message sent successfully!..." ONLY when EmailJS confirms success, and clears the form only then.
- If the three values are not set: "Email service is not configured. Please try again later."
- If sending fails: "Message could not be sent. Please try again or contact me through WhatsApp." The typed text is kept and email-app and WhatsApp links are offered.
- A hidden honeypot field filters simple spam bots. The free EmailJS plan has a monthly email limit.

## GitHub automatic synchronization
- The Projects section loads every **public** repository from `https://api.github.com/users/<username>/repos` (all pages, 100 per page).
- It syncs on page load, every 5 minutes while the page is open and whenever you press **Refresh Projects**. It pauses while the browser tab is hidden and catches up when you return.
- Deleted, renamed, private and newly created repositories, plus description and language changes, appear on the next sync. Buttons always use the URL GitHub currently reports.
- No repository data is stored in the browser, and there is no fallback list. If a refresh fails after an earlier success, the page keeps showing that data but marks it **STALE** with a warning. If the very first load fails, no repositories are shown, only a link to your GitHub profile.
- Rate limits: GitHub allows 60 unauthenticated requests per hour per IP address. The page reads the reset time, shows it and stops retrying until then. No token is used or needed, and none should ever be added to this site's code.
- The Featured Project cards (CodeRefactor AI, SmartBuy, CareerBridge AI, SafeNest) get a **Source Code** button automatically only if a public repository with exactly the same name exists on your account. Until then they say they are not listed as public repositories.
- Repository statistics such as stars and forks are intentionally not displayed.
- The repository count is always the number of repositories GitHub returned. As a safety check the page also reads GitHub's own `public_repos` number; if the two differ it shows a note instead of hiding the difference.
- If a repository you expect (for example `portfolio`) is missing, it is not public on GitHub: open the repository > **Settings** > **General** > **Danger Zone** > **Change visibility** > **Make public**. Then press **Refresh Projects** (GitHub's API can lag a few minutes).

## Adding certificates
The Certifications section lists only what you put in `CERTIFICATES` at the top of `script.js` (pre-filled from your resume; with an empty list the section shows a short placeholder line). For each real certificate add one entry and put the files in `assets/certificates/`:
```js
const CERTIFICATES = [
  { title: "Exact certificate name", issuer: "Issuing organisation", date: "Month YYYY",
    image: "assets/certificates/my-certificate.jpg",
    pdf: "assets/certificates/my-certificate.pdf" },
];
```
Only `title` is required. `image` shows a preview and `pdf` adds a "View PDF" button. Use exact names and dates from the certificate itself.

## Editing the Featured Projects
The text on the four cards comes only from the descriptions you supplied. To change it, edit the card in the Projects section of `index.html`. SafeNest and CareerBridge AI use the technologies from your resume. CodeRefactor AI still shows "Focus areas" because no technologies were supplied: once you know them, change that label to "Technologies" and list them.

## 3. Upload to GitHub
```bash
cd my-portfolio
git init
git add .
git commit -m "Add portfolio website"
git branch -M main
git remote add origin https://github.com/preethamgandepalli2006-source/portfolio.git
git push -u origin main
```
If the `portfolio` repository already has files, run `git pull origin main --allow-unrelated-histories` first, or push to a new repository.

## 4. Deploy with GitHub Pages
1. Open the repository on GitHub > **Settings** > **Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)`, then **Save**.
4. Wait 1-2 minutes. Your site will be at `https://preethamgandepalli2006-source.github.io/portfolio/`.

## 5. Connect LinkedIn and resume
- LinkedIn: already set. To change it, edit `LINKEDIN_URL` at the top of `script.js`.
- Resume: export your resume as PDF, name it `resume.pdf`, replace `assets/resume.pdf`, then commit and push.

## 6. Contact section reference
| Item | Value | Action |
|---|---|---|
| Phone | 8919990149 | `tel:+918919990149` |
| GitHub Email | preethamgandepalli2006@gmail.com | `mailto:` (Send Email button too) |
| GitHub Profile | https://github.com/preethamgandepalli2006-source | opens in new tab |
| LinkedIn Account Email | vigneshgandepalli2006@gmail.com | opens the LinkedIn profile from `LINKEDIN_URL` (never `mailto:`) |
| WhatsApp | https://wa.me/918919990149 | opens in new tab |

## 7. Photo checklist
`assets/profile.jpg` must be your own square photo (at least 640x640 px, under 200 KB, face centred). The path in `index.html` is relative (`assets/profile.jpg`), so it works on Live Server and on GitHub Pages. File names are case-sensitive on GitHub Pages: keep it exactly `profile.jpg`.

## Troubleshooting the contact form
| What you see | Cause | Fix |
|---|---|---|
| "Email service is not configured. Please try again later." | `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID` or `EMAILJS_PUBLIC_KEY` is still empty or a `YOUR_...` placeholder. On Live Server / localhost the message also names the missing setting, and the browser console (F12) lists it. | Paste the real value at the top of `script.js` (Public Key: EmailJS > Account > General). Save and press Ctrl+Shift+R. |
| "Message could not be sent..." | EmailJS rejected the request. The console (F12) shows the reason, e.g. 400 / 403 / 412. | 400: wrong Service ID, Template ID or Public Key (check them in the dashboard). 403 or a domain error: add `127.0.0.1` / your site domain under Account > Security. 412: reconnect the Gmail service under Email Services. |
| Email arrives but fields are blank | Template variables do not match the code. | The template must use exactly `{{name}}`, `{{email}}`, `{{subject}}`, `{{message}}`. |

## Finding the real reason a send fails
When a send fails, the form now shows the real EmailJS reason after the standard message, for example `Reason: EmailJS error 400: The template ID not found ...`, with a hint for the usual fix. The browser console (F12) has a group called "EmailJS send FAILED" with the status, text, the IDs used, the parameter names sent and the page origin.

For a clean test outside the portfolio, open `emailjs-test.html` with Live Server and click **Send test email**. It sends one real email using the same endpoint as the SDK and prints EmailJS's exact reply on screen. It is not linked from the site; delete it when you are done.

Common EmailJS replies: `400 ... template ID not found` or `service ID not found` (ID mismatch, check letter o vs digit 0), `400 ... public key` (wrong key), `412 Gmail_API ...` (reconnect Gmail and allow sending), `403` (domain restriction under Account > Security, add `127.0.0.1` and your site domain), `429` (limit reached).

### "The template ID not found" (400)
This means the ID in `script.js` is not a template in the account that owns your Public Key. The most common cause is a look-alike typo: digit `1` vs letter `l`, digit `0` vs letter `o`. Open `emailjs-test.html` with Live Server and click **Find my Template ID**: it tries every look-alike spelling and tells you which one EmailJS accepts. Otherwise copy the ID with the copy button from EmailJS > Email Templates, and make sure you are logged into the same account that owns the Service ID and Public Key.
