# Voltra Email Signature Generator

A single-page Next.js app for building Voltra email signatures. Enter your
details on the left; the rendered signature and its HTML appear on the right,
ready to copy or download.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

## How it works

- [src/lib/signature.ts](src/lib/signature.ts) is the whole template and the
  canonical copy of the original signature design — rendering it with
  `DEFAULT_SIGNATURE` reproduces that markup byte for byte. Entered details are
  substituted and HTML-escaped. Optional lines (phone, website, address) drop
  out of the markup when left blank, and the last remaining line loses its
  bottom margin so spacing stays correct.
- [src/app/page.tsx](src/app/page.tsx) is the editor: form, live preview, code
  panel, and the copy/download actions.
- **Copy signature** puts the rendered signature on the clipboard as `text/html`,
  so it pastes styled straight into Gmail or Outlook. **Copy HTML** / **Download
  HTML** give you the raw markup instead.

## The logo

Mail clients cannot load local files, so the signature needs a publicly
reachable logo URL. The **Logo URL** field defaults to this app's own copy at
`/voltra-logo.png` on whatever origin you are viewing it from — deploy the app
and the default is already correct. Override the field to point at a different
host if you serve the logo elsewhere.

## Fonts

The signature asks for `Sora` and `Manrope` with an Arial/Helvetica fallback.
Those are loaded by their real family names in
[src/app/layout.tsx](src/app/layout.tsx) rather than through `next/font`, which
rewrites family names and would make the preview diverge from what a mail client
renders. Recipients without the webfonts see the fallback, which is expected for
email.
