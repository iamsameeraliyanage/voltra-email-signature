/** The per-person details. Everything else about the signature is fixed. */
export type SignatureData = {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
};

/** Same for every Voltra signature, so not worth putting in the form. */
export const COMPANY_ADDRESS =
  "Green Energy Solution GmbH, Zikadenweg 7, CH-3006 Bern";
export const WEBSITE = "www.voltra.ch";

/**
 * Absolute by necessity — mail clients cannot resolve a relative path. Points
 * at this app's own deployment, which also serves the logo.
 */
export const LOGO_URL =
  "https://voltra-email-signature.vercel.app/voltra-logo.png";

/** Brand colours, from voltra Brand Guidelines V2 (Colors → Color Palette). */
export const APPLE_GREEN = "#56BB09";
export const CHARCOAL_HEATHER = "#3A4044";

export const DEFAULT_SIGNATURE: SignatureData = {
  fullName: "John Doe",
  jobTitle: "Technical Engineer",
  phone: "+41 31 561 92 93",
  email: "john@voltra.ch",
};

/**
 * Family names are deliberately unquoted. Word — the engine behind Outlook on
 * Windows — can drop a whole font stack it fails to parse and fall back to
 * Times New Roman; unquoted single-word names avoid that entirely and are
 * still valid CSS everywhere else. Outlook cannot load webfonts, so it lands
 * on Arial, which is the intended fallback.
 */
const SORA = "Sora, Arial, Helvetica, sans-serif";
const MANROPE = "Manrope, Arial, Helvetica, sans-serif";

/** Word ignores CSS line-height unless this rule precedes it. */
const EXACT_LINE_HEIGHT = "mso-line-height-rule:exactly;";

/** Keeps Word from adding its own spacing either side of a table. */
const TABLE_RESET =
  "border-collapse:collapse; border-spacing:0; mso-table-lspace:0pt; mso-table-rspace:0pt;";

/** Escape text that gets placed into the HTML body. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Escape text that gets placed into a double-quoted attribute. */
function escAttr(value: string): string {
  return esc(value).replace(/"/g, "&quot;");
}

/** `+41 31 561 92 93` -> `+41315619293` */
export function telHref(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/** `www.voltra.ch` -> `https://www.voltra.ch` (an explicit protocol is kept as-is). */
export function websiteHref(website: string): string {
  const trimmed = website.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

type Line = { label: string; text: string; href?: string; last?: boolean };

/**
 * One contact line as its own table row. Rows rather than divs because Word
 * applies its own paragraph spacing to block elements and honours margin
 * inconsistently — cell padding is the one spacing mechanism it gets right.
 */
function textLine({ label, text, href, last }: Line): string {
  const spacing = last ? "0" : "0 0 3px 0";
  const type = `font-family:${MANROPE}; font-size:11px; ${EXACT_LINE_HEIGHT} line-height:15px; font-weight:500; color:#000000;`;

  // The inner span keeps iOS and Outlook.com from recolouring and underlining
  // detected phone numbers and addresses despite the anchor's own styles.
  const content = href
    ? `<a href="${escAttr(href)}" style="${type} text-decoration:none;"><span style="color:#000000; text-decoration:none;">${esc(text)}</span></a>`
    : esc(text);

  return `          <!-- ${label} -->
          <tr>
            <td style="padding:${spacing}; ${type}">${content}</td>
          </tr>`;
}

/**
 * The signature table. Built for Outlook on Windows first: table layout,
 * inline styles only, presentational width/height/bgcolor attributes
 * alongside the CSS (Word trusts the attributes), and no shorthand or
 * positioning it cannot parse.
 */
export function buildSignatureTable(data: SignatureData): string {
  // Address first and website last are fixed; phone and email sit between them
  // and drop out when blank.
  const lines: Line[] = [{ label: "COMPANY / ADDRESS", text: COMPANY_ADDRESS }];

  if (data.phone.trim()) {
    lines.push({
      label: "PHONE",
      text: data.phone.trim(),
      href: `tel:${telHref(data.phone)}`,
    });
  }
  if (data.email.trim()) {
    lines.push({
      label: "EMAIL",
      text: data.email.trim(),
      href: `mailto:${data.email.trim()}`,
    });
  }
  lines.push({
    label: "WEBSITE",
    text: WEBSITE,
    href: websiteHref(WEBSITE),
    last: true,
  });

  const contactRows = lines.map(textLine).join("\n");

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="474" style="width:474px; ${TABLE_RESET} margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
  <tr>

    <!-- LOGO -->
    <td width="124" height="116" align="center" valign="middle" bgcolor="${CHARCOAL_HEATHER}" style="width:124px; height:116px; background-color:${CHARCOAL_HEATHER}; text-align:center; vertical-align:middle; padding:0;">
      <img src="${escAttr(LOGO_URL)}" alt="Voltra" width="82" height="82" border="0" style="display:block; width:82px; height:82px; border:0; outline:none; text-decoration:none; margin:0 auto; -ms-interpolation-mode:bicubic;">
    </td>

    <!-- CONTENT -->
    <td width="350" height="116" valign="middle" bgcolor="#FFFFFF" style="width:350px; height:116px; background-color:#FFFFFF; vertical-align:middle; padding:6px 16px;">

      <!-- 350px cell less its 16px side padding. Fixed so long text wraps
           inside the cell instead of widening the whole signature. -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="318" style="width:318px; ${TABLE_RESET}">

          <!-- NAME -->
          <tr>
            <td style="padding:0 0 3px 0; font-family:${SORA}; font-size:14px; ${EXACT_LINE_HEIGHT} line-height:18px; font-weight:600; color:#000000;">${esc(data.fullName.trim())}</td>
          </tr>

          <!-- JOB TITLE -->
          <tr>
            <td style="padding:0 0 10px 0; font-family:${SORA}; font-size:12px; ${EXACT_LINE_HEIGHT} line-height:16px; font-weight:500; color:${APPLE_GREEN};">${esc(data.jobTitle.trim())}</td>
          </tr>

${contactRows}

      </table>

    </td>

  </tr>
</table>`;
}

/**
 * The signature wrapped in a complete document. This is what gets copied and
 * downloaded: Outlook keeps signatures as standalone .htm files, the charset
 * declaration is what stops names like "Söderström" arriving as mojibake, and
 * the mso block pins Outlook to 96 DPI so the fixed pixel sizes are not scaled
 * up on high-DPI Windows displays.
 */
export function buildSignatureDocument(data: SignatureData): string {
  const name = data.fullName.trim() || "Voltra";

  return `<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!--[if mso]>
<xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<![endif]-->
<title>${esc(name)} — Voltra</title>
</head>
<body style="margin:0; padding:0; background-color:#FFFFFF;">

${buildSignatureTable(data)}

</body>
</html>`;
}

/**
 * Filename for the downloaded signature. `.htm` is what Outlook keeps in its
 * Signatures folder, so the file can be dropped straight in.
 */
export function signatureFileName(fullName: string): string {
  const slug = fullName
    .trim()
    .toLowerCase()
    // Split accents off their base letters and drop them, so "Söderström"
    // slugs to "soderstrom" rather than "s-derstr-m".
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `voltra-signature-${slug}.htm` : "voltra-signature.htm";
}
