const hrefIsWebPage = href => {
  const matchWithNotAllowedRegex =
    /^mailto/i.test(href) || /^#/i.test(href) || /^tel/i.test(href);

  return !matchWithNotAllowedRegex;
};

const deepAnchor = async html => {
  const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
  const anchorMatches = String(html).matchAll(regex);
  const anchorInHtml = [];
  for (const anchorMatch of anchorMatches) {
    if (anchorMatch[2] && hrefIsWebPage(anchorMatch[2])) {
      anchorInHtml.push(anchorMatch[2]);
    }
  }

  return anchorInHtml;
};

module.exports = deepAnchor;
