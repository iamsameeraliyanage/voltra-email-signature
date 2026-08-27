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
- [src/app/page.tsx](src/app/page.tsx) is the editor: form on the left, live
  preview on the right, and the actions on the preview header. The `<>` button
  opens a right drawer ([CodeDrawer.tsx](src/components/CodeDrawer.tsx)) with the
  generated markup.
- `buildSignatureTable` renders the table on its own — that is what the preview
  shows. `buildSignatureDocument` wraps it in a complete HTML document, and that
  is what **Copy HTML** and **Download HTML** hand over.

## Built for Outlook

Outlook on Windows renders mail through Word, which is the constraint the markup
is written against:

- **Rows, not divs.** Word applies its own paragraph spacing to block elements
  and honours `margin` inconsistently. Every line of the signature is a table
  row spaced with cell padding, the one mechanism it gets right.
- **Attributes beside the CSS.** `width`, `height`, `align`, `valign` and
  `bgcolor` are set as HTML attributes as well as inline styles, because Word
  trusts the attributes when it ignores the CSS.
- **`mso-line-height-rule:exactly`** precedes every `line-height`, or Word adds
  its own leading.
- **Unquoted font names.** Word can discard a font stack it fails to parse and
  fall back to Times New Roman. `Sora, Arial, …` sidesteps that. Outlook cannot
  load webfonts at all, so it lands on Arial — the intended fallback.
- **A fixed 410px inner table**, so a long name or job title wraps inside the
  cell rather than widening the whole signature past 700px.
- **`<span>` inside every link**, which stops iOS and Outlook.com recolouring and
  underlining detected phone numbers and addresses.
- **`-ms-interpolation-mode:bicubic`** on the logo so Windows scales it cleanly,
  and `mso-table-lspace/rspace:0pt` so Word adds no gutter around the tables.

The download is a complete document rather than a fragment, for two reasons:
Outlook keeps signatures as standalone `.htm` files in
`%APPDATA%\Microsoft\Signatures`, and the `<meta charset="utf-8">` is what
stops a name like "Söderström" arriving as mojibake. The `<!--[if mso]>` block
pins Outlook to 96 DPI so the fixed pixel sizes are not scaled up on high-DPI
Windows displays.

Two ways to install it: paste the copied HTML into Outlook's signature editor,
or drop the downloaded `.htm` into the Signatures folder.

## The logo

Mail clients cannot load local files, so the signature needs a publicly
reachable logo URL. It points at this app's own deployment:

    https://voltra-email-signature.vercel.app/voltra-logo.png

That URL has to keep resolving for as long as the signatures are in use — if the
deployment ever moves, update `LOGO_URL` in
[src/lib/signature.ts](src/lib/signature.ts) *and* re-issue the signatures,
because already-pasted ones embed the old URL.

## Language

The UI ships in German (default) and English. The strings live in
[src/i18n/dictionaries.ts](src/i18n/dictionaries.ts); the chosen locale is kept
in `localStorage` and read through `useSyncExternalStore`
([src/i18n/useLocale.ts](src/i18n/useLocale.ts)) so the server can prerender
German and the browser can swap in a stored choice during hydration without a
cascading render. There is no locale routing — two languages on one static page
do not need it. The signature's own content is never translated.

To add a language: add the code to `LOCALES`, add its `Dictionary` entry, and
the header toggle picks it up. `Dictionary` is a closed type, so a missing
string is a build error.

## Brand

Colours, type, and layout follow **voltra Brand Guidelines V2** (kept at the
repo root):

| Token | Value | Source in the guidelines |
| --- | --- | --- |
| Apple Green | `#56BB09` | Colors → Color Palette |
| Charcoal Heather | `#3A4044` | Colors → Color Palette |
| Light tint | `#EEF8E6` | Brand In Use — the backdrop the deck itself uses to present the email signature |
| Heading green | `#244F04` | section headings throughout the deck |
| Button label | `#2C2B2B` | Typography → Type Hierarchy |

Type follows the same section: Sora for headings (SemiBold) and subheadings
(Medium), Manrope for body (Regular, Medium to emphasise), overlines in Regular,
button labels in SemiBold. Buttons are Apple Green with the dark label colour —
white text on Apple Green would fail contrast and is not what the guidelines
show.

The header crops the supplied logo rather than redrawing it: the asset is a
256px Charcoal Heather square whose wordmark occupies only its middle third, so
it is scaled proportionally and the surrounding field — the same colour as the
header — is masked. Nothing is stretched or recoloured.

## Fonts

The signature asks for `Sora` and `Manrope` with an Arial/Helvetica fallback.
Those are loaded by their real family names in
[src/app/layout.tsx](src/app/layout.tsx) rather than through `next/font`, which
rewrites family names and would make the preview diverge from what a mail client
renders. Recipients without the webfonts see the fallback, which is expected for
email.
