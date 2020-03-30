const httpAudit = require("./http");
const htmlAudit = require("./w3c");
const ampAudit = require("./amp");
const regexAudit = require("./regex");
const redirectAudit = require("./redirect");

const audit = ({ audits, configuration, url }) => {
  return new Promise(async (resolve, reject) => {
    const { ignoreHttpCodes } = configuration;
    const report = {};

    const { url: urlRes, request, status, html } = await httpAudit(
      url,
      configuration
    );

    if (ignoreHttpCodes.findIndex(code => code == status) === -1) {
      report.http = { url: urlRes, status };

      if (audits.redirect) report.redirect = redirectAudit(request);
      if (audits.regex && audits.regex.length > 0)
        report.regex = regexAudit(html, audits.regex, configuration);
      if (audits.w3c) report.w3c = await htmlAudit(html);
      if (audits.amp) report.amp = await ampAudit(html);

      report.date = new Date().toString();
    }

    resolve(report);
  });
};

module.exports = audit;
