export type SignatureData = {
  fullName: string;
  jobTitle: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
};

export const DEFAULT_SIGNATURE: SignatureData = {
  fullName: "John Doe",
  jobTitle: "Technical Engineer",
  company: "Green Energy Solution GmbH, Zikadenweg 7, CH-3006 Bern",
  phone: "+41 31 561 92 93",
  email: "john@voltra.ch",
  website: "www.voltra.ch",
  // Relative on purpose: it is only the pre-hydration placeholder, replaced by
  // an absolute origin URL as soon as the browser knows one.
  logoUrl: "/voltra-logo.png",
};

const SORA = "'Sora', Arial, Helvetica, sans-serif";
const MANROPE = "'Manrope', Arial, Helvetica, sans-serif";

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

function textLine({ label, text, href, last }: Line): string {
  const spacing = last ? "margin:0; padding:0;" : "margin:0 0 7px 0; padding:0;";
  const base = `font-family:${MANROPE}; font-size:14px; line-height:20px; font-weight:500; color:#000000; ${spacing}`;

  const inner = href
    ? `\n        <a href="${escAttr(href)}" style="font-family:${MANROPE}; color:#000000; text-decoration:none;">\n          ${esc(text)}\n        </a>\n      `
    : `\n        ${esc(text)}\n      `;

  return `      <!-- ${label} -->\n      <div style="${base}">${inner}</div>`;
}

/**
 * Renders the Voltra signature table. This is the canonical copy of the
 * original design: table layout, inline styles only, and no shorthand CSS —
 * the combination Outlook and Gmail both survive. Rendering it with
 * DEFAULT_SIGNATURE reproduces that design exactly.
 */
export function buildSignatureHtml(data: SignatureData): string {
  const lines: Line[] = [];

  if (data.company.trim()) {
    lines.push({ label: "COMPANY / ADDRESS", text: data.company.trim() });
  }
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
  if (data.website.trim()) {
    lines.push({
      label: "WEBSITE",
      text: data.website.trim(),
      href: websiteHref(data.website),
    });
  }
  if (lines.length > 0) {
    lines[lines.length - 1].last = true;
  }

  const contactBlock = lines.map(textLine).join("\n\n");

  return `<table cellpadding="0" cellspacing="0" border="0" style="width:700px; border-collapse:collapse; margin:0; padding:0;">

  <tr>

    <!-- LOGO -->
    <td valign="middle" style="width:220px; height:195px; background-color:#3B4044; text-align:center; vertical-align:middle; padding:0; margin:0;">

      <img
        src="${escAttr(data.logoUrl.trim())}"
        alt="Voltra"
        width="165"
        style="display:block; width:165px; height:165px; border:0; outline:none; text-decoration:none; margin:0 auto;"
      >

    </td>

    <!-- CONTENT -->
    <td valign="middle" style="width:480px; height:195px; background-color:#FFFFFF; vertical-align:middle; padding:28px 35px; margin:0;">

      <!-- NAME -->
      <div style="font-family:${SORA}; font-size:20px; line-height:24px; font-weight:600; color:#000000; margin:0 0 7px 0; padding:0;">
        ${esc(data.fullName.trim())}
      </div>

      <!-- JOB TITLE -->
      <div style="font-family:${SORA}; font-size:16px; line-height:20px; font-weight:400; color:#4DBD00; margin:0 0 25px 0; padding:0;">
        ${esc(data.jobTitle.trim())}
      </div>

${contactBlock}

    </td>

  </tr>

</table>`;
}

/** Filename for the downloaded signature, derived from the person's name. */
export function signatureFileName(fullName: string): string {
  const slug = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `voltra-signature-${slug}.html` : "voltra-signature.html";
}
