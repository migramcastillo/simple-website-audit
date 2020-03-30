const httpAudit = require("./http");
const htmlAudit = require("./w3c");
const ampAudit = require("./amp");
const regexAudit = require("./regex");
const redirectAudit = require("./redirect");

const auditMakerSync = async ({
  audits,
  request,
  regex_strings,
  configuration,
  urls,
  report
}) => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    let reportUrl = {};
    const httResponse = await httpAudit(url, configuration);

    const { url: urlRes, request, status, html } = httResponse;

    // Check if status must be ignored
    if (
      configuration.ignoreHttpCodes.findIndex(code => code == status) !== -1
    ) {
      return;
    }
    if (
      configuration.listenHttpCodes.length > 0 &&
      configuration.listenHttpCodes.findIndex(code => code == status) === -1
    ) {
      return;
    }

    // Otherwise, do other audits
    reportUrl.http = {
      url: urlRes,
      status
    };

    if (audits.redirect) reportUrl.redirect = redirectAudit(request);
    if (audits.regex)
      reportUrl.regex = regexAudit(html, regex_strings, configuration);
    if (audits.w3c) reportUrl.w3c = await htmlAudit(html);
    if (audits.amp) reportUrl.amp = await ampAudit(html);

    report.push({
      url: urlRes,
      date: new Date().toString(),
      ...reportUrl
    });
  }
  return report;
};

module.exports = auditMakerSync;
