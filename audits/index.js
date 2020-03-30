const auditPromise = require("./audit");

const getNotIgnoredReports = reports => {
  return reports.filter(report => report && report.http);
};

const asyncAudits = ({ audits, configuration, urls }) => {
  return new Promise(async (resolve, reject) => {
    const auditPromises = urls.map(url =>
      auditPromise({ audits, configuration, url })
    );

    const reports = await Promise.all(auditPromises);

    resolve(getNotIgnoredReports(reports));
  });
};

module.exports = asyncAudits;
