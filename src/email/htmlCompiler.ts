import type {
  EmailBlock,
  EmailDocument,
  EmailSettings,
  LeafBlock,
  Padding,
  SocialPlatform,
} from './types';

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTextWithBreaks(input: string): string {
  return escapeHtml(input).replace(/\n/g, '<br />');
}

function paddingStyle(p: Padding): string {
  return `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`;
}

function bgStyle(color: string | undefined): string {
  if (!color || color === 'transparent') return '';
  return `background-color:${color};`;
}

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  twitter: 'X',
  linkedin: 'in',
  instagram: 'IG',
  facebook: 'f',
  youtube: 'YT',
  github: 'GH',
  website: 'Web',
};

function renderLeafBlock(block: LeafBlock, settings: EmailSettings): string {
  const font = settings.fontFamily;

  switch (block.type) {
    case 'header': {
      const p = block.props;
      const navHtml =
        p.showNav && p.navLinks.length > 0
          ? `<td align="right" valign="middle" style="padding:4px 0;">
              ${p.navLinks
                .map(
                  (link, idx) =>
                    `<a href="${escapeHtml(link.url)}" target="_blank" style="font-family:${font};font-size:13px;font-weight:600;color:${p.textColor};text-decoration:none;${idx > 0 ? 'margin-left:16px;' : ''}">${escapeHtml(link.label)}</a>`,
                )
                .join('')}
            </td>`
          : '';

      const logoHtml = p.logoImageUrl
        ? `<img src="${escapeHtml(p.logoImageUrl)}" alt="${escapeHtml(p.logoText)}" width="${p.logoWidth}" style="display:block;border:0;outline:none;text-decoration:none;max-width:100%;height:auto;" />`
        : `<span style="font-family:${font};font-size:18px;font-weight:800;letter-spacing:-0.02em;color:${p.textColor};">${escapeHtml(p.logoText)}</span>`;

      if (p.alignment === 'center' && !p.showNav) {
        return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.backgroundColor)}">
  <tr>
    <td align="center" style="padding:${paddingStyle(p.padding)};">${logoHtml}</td>
  </tr>
</table>`;
      }

      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.backgroundColor)}">
  <tr>
    <td style="padding:${paddingStyle(p.padding)};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="${p.alignment}" valign="middle">${logoHtml}</td>
          ${navHtml}
        </tr>
      </table>
    </td>
  </tr>
</table>`;
    }

    case 'heading': {
      const p = block.props;
      const tag = p.level;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.backgroundColor)}">
  <tr>
    <td align="${p.alignment}" style="padding:${paddingStyle(p.padding)};">
      <${tag} style="margin:0;font-family:${font};font-size:${p.fontSize}px;font-weight:${p.fontWeight};line-height:${p.lineHeight};color:${p.color};text-align:${p.alignment};">${formatTextWithBreaks(p.text)}</${tag}>
    </td>
  </tr>
</table>`;
    }

    case 'text': {
      const p = block.props;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.backgroundColor)}">
  <tr>
    <td align="${p.alignment}" style="padding:${paddingStyle(p.padding)};">
      <p style="margin:0;font-family:${font};font-size:${p.fontSize}px;line-height:${p.lineHeight};color:${p.color};text-align:${p.alignment};">${formatTextWithBreaks(p.text)}</p>
    </td>
  </tr>
</table>`;
    }

    case 'image': {
      const p = block.props;
      const imgTag = `<img src="${escapeHtml(p.src)}" alt="${escapeHtml(p.alt)}" style="display:block;width:${p.widthPercent}%;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;border-radius:${p.borderRadius}px;" />`;
      const wrapped = p.href
        ? `<a href="${escapeHtml(p.href)}" target="_blank" style="text-decoration:none;">${imgTag}</a>`
        : imgTag;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.backgroundColor)}">
  <tr>
    <td align="${p.alignment}" style="padding:${paddingStyle(p.padding)};">${wrapped}</td>
  </tr>
</table>`;
    }

    case 'button': {
      const p = block.props;
      const widthAttr = p.fullWidth ? 'width="100%"' : '';
      const anchorDisplay = p.fullWidth ? 'display:block;text-align:center;' : 'display:inline-block;';
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.containerBackgroundColor)}">
  <tr>
    <td align="${p.alignment}" style="padding:${paddingStyle(p.padding)};">
      <table role="presentation" ${widthAttr} cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" bgcolor="${p.backgroundColor}" style="border-radius:${p.borderRadius}px;background-color:${p.backgroundColor};">
            <a href="${escapeHtml(p.href)}" target="_blank" style="${anchorDisplay}font-family:${font};font-size:${p.fontSize}px;font-weight:${p.fontWeight};color:${p.textColor};text-decoration:none;padding:${p.paddingY}px ${p.paddingX}px;border-radius:${p.borderRadius}px;mso-padding-alt:0;">${escapeHtml(p.label)}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
    }

    case 'divider': {
      const p = block.props;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.backgroundColor)}">
  <tr>
    <td align="center" style="padding:${paddingStyle(p.padding)};">
      <table role="presentation" width="${p.widthPercent}%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-top:${p.thickness}px ${p.style} ${p.color};font-size:1px;line-height:1px;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
    }

    case 'spacer': {
      const p = block.props;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.backgroundColor)}">
  <tr>
    <td height="${p.height}" style="height:${p.height}px;font-size:1px;line-height:1px;">&nbsp;</td>
  </tr>
</table>`;
    }

    case 'social': {
      const p = block.props;
      const radius = p.iconStyle === 'circle' ? '9999px' : '6px';
      const isOutline = p.iconStyle === 'outline';
      const cellBg = isOutline ? 'transparent' : p.iconBackgroundColor;
      const cellBorder = isOutline ? `1px solid ${p.iconBackgroundColor}` : 'none';
      const textCol = isOutline ? p.iconBackgroundColor : p.iconColor;

      const items = p.links
        .map(
          (item) => `<td style="padding:0 5px;">
            <a href="${escapeHtml(item.url)}" target="_blank" title="${escapeHtml(item.label)}" style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;font-family:${font};font-size:12px;font-weight:700;color:${textCol};background-color:${cellBg};border:${cellBorder};border-radius:${radius};text-decoration:none;">${SOCIAL_LABELS[item.platform]}</a>
          </td>`,
        )
        .join('');

      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.backgroundColor)}">
  <tr>
    <td align="${p.alignment}" style="padding:${paddingStyle(p.padding)};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>${items}</tr>
      </table>
    </td>
  </tr>
</table>`;
    }

    case 'footer': {
      const p = block.props;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.backgroundColor)}">
  <tr>
    <td align="${p.alignment}" style="padding:${paddingStyle(p.padding)};font-family:${font};font-size:${p.fontSize}px;line-height:1.6;color:${p.textColor};text-align:${p.alignment};">
      ${p.extraText ? `<p style="margin:0 0 8px 0;">${formatTextWithBreaks(p.extraText)}</p>` : ''}
      <p style="margin:0 0 6px 0;font-weight:600;">${escapeHtml(p.companyName)}${p.address ? ` &bull; ${escapeHtml(p.address)}` : ''}</p>
      ${
        p.unsubscribeText
          ? `<p style="margin:0;"><a href="${escapeHtml(p.unsubscribeUrl)}" target="_blank" style="color:${p.textColor};text-decoration:underline;">${escapeHtml(p.unsubscribeText)}</a></p>`
          : ''
      }
    </td>
  </tr>
</table>`;
    }
  }
}

function renderBlock(block: EmailBlock, settings: EmailSettings): string {
  if (block.type !== 'columns') {
    return renderLeafBlock(block, settings);
  }

  const p = block.props;
  const colCount = p.columnCount;
  const colWidthPercent = Math.floor(100 / colCount);
  const halfGap = Math.floor(p.gap / 2);

  const colsHtml = p.columns
    .slice(0, colCount)
    .map((colBlocks, idx) => {
      const inner = colBlocks.map((child) => renderLeafBlock(child, settings)).join('\n');
      const padLeft = idx === 0 ? 0 : halfGap;
      const padRight = idx === colCount - 1 ? 0 : halfGap;
      return `<td class="stack-column" width="${colWidthPercent}%" valign="top" style="width:${colWidthPercent}%;padding-left:${padLeft}px;padding-right:${padRight}px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>${inner}</td>
          </tr>
        </table>
      </td>`;
    })
    .join('\n');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${bgStyle(p.backgroundColor)}">
  <tr>
    <td style="padding:${paddingStyle(p.padding)};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          ${colsHtml}
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export function compileEmailToHtml(doc: EmailDocument): string {
  const s = doc.settings;
  const bodyBlocks = doc.blocks.map((block) => renderBlock(block, s)).join('\n');

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(s.subject || doc.name)}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: ${s.canvasColor}; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; padding-bottom: 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${s.canvasColor};font-family:${s.fontFamily};color:${s.textColor};">
  ${
    s.preheader
      ? `<div style="display:none;font-size:1px;color:${s.canvasColor};line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${escapeHtml(s.preheader)}</div>`
      : ''
  }
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${s.canvasColor}" style="background-color:${s.canvasColor};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <!--[if mso]>
        <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="${s.contentWidth}">
        <tr>
        <td align="center" valign="top" width="${s.contentWidth}">
        <![endif]-->
        <table role="presentation" class="email-container" align="center" width="${s.contentWidth}" cellpadding="0" cellspacing="0" border="0" bgcolor="${s.contentBackgroundColor}" style="width:100%;max-width:${s.contentWidth}px;background-color:${s.contentBackgroundColor};border-radius:8px;overflow:hidden;">
          <tr>
            <td>
              ${bodyBlocks}
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}
