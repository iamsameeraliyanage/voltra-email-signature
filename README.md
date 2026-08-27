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
  canonical copy of the original signature design. Only four details vary per
  person — name, job title, phone, email — and they are substituted and
  HTML-escaped. The company address, website, and logo URL are constants at the
  top of the same file: change them there and every signature follows. A blank
  phone or email drops its line from the markup entirely.
- [src/app/page.tsx](src/app/page.tsx) is the editor: form, live preview, code
  panel, and the copy/download actions.
- **Copy signature** puts the rendered signature on the clipboard as `text/html`,
  so it pastes styled straight into Gmail or Outlook. **Copy HTML** / **Download
  HTML** give you the raw markup instead.

## The logo

Mail clients cannot load local files, so the signature needs a publicly
reachable logo URL. It points at this app's own deployment:

    https://voltra-email-signature.vercel.app/voltra-logo.png

That URL has to keep resolving for as long as the signatures are in use — if the
deployment ever moves, update `LOGO_URL` in
[src/lib/signature.ts](src/lib/signature.ts) *and* re-issue the signatures,
because already-pasted ones embed the old URL.

## Fonts

The signature asks for `Sora` and `Manrope` with an Arial/Helvetica fallback.
Those are loaded by their real family names in
[src/app/layout.tsx](src/app/layout.tsx) rather than through `next/font`, which
rewrites family names and would make the preview diverge from what a mail client
renders. Recipients without the webfonts see the fallback, which is expected for
email.
