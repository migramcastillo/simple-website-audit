const { test } = require("tap");
const simpleWebsiteAudit = require("../");

test("Simple Website Audit", subtest => {
  const auditInstance = simpleWebsiteAudit();

  subtest.test("Should return a SWA instance", async t => {
    t.ok(auditInstance, "Should generate SWA object");
    t.ok(auditInstance.audits, "Should has audits");
    t.ok(auditInstance.configuration, "Should has configuration");
    t.end();
  });

  subtest.test("Should setAudits", async t => {
    auditInstance.setAudits({
      redirect: true,
      amp: true
    });

    const expected = {
      regex: [],
      redirect: true,
      amp: true,
      w3c: false
    };

    t.ok(auditInstance.audits, "Should has audits");
    t.deepEqual(auditInstance.audits, expected, "Should has changed audits");
    t.end();
  });

  subtest.test("Should setUrls from array", async t => {
    const urls = ["https://www.google.com"];

    auditInstance.setUrls(urls);

    t.ok(auditInstance.urls, "Should has urls");
    t.same(auditInstance.urls, urls, "Should have urls setted");
    t.end();
  });

  subtest.test("Should setUrls from string", async t => {
    const urls = "https://www.google.com";

    auditInstance.setUrls(urls);

    t.ok(auditInstance.urls, "Should has urls");
    t.same(
      auditInstance.urls,
      ["https://www.google.com"],
      "Should have urls setted"
    );
    t.end();
  });

  subtest.test("Should addUrl from array", async t => {
    const urls = ["https://www.npmjs.com"];

    auditInstance.addUrls(urls);

    t.ok(auditInstance.urls, "Should has urls");
    t.same(
      auditInstance.urls,
      ["https://www.google.com", "https://www.npmjs.com"],
      "Should have added the new url"
    );
    t.end();
  });

  subtest.test("Should addUrl from string", async t => {
    const urls = "https://www.zeit.co";

    auditInstance.addUrls(urls);

    t.ok(auditInstance.urls, "Should has urls");
    t.same(
      auditInstance.urls,
      [
        "https://www.google.com",
        "https://www.npmjs.com",
        "https://www.zeit.co"
      ],
      "Should have added the new url"
    );
    t.end();
  });

  subtest.test("Should setUserAgent", async t => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";

    auditInstance.setUserAgent(userAgent);

    t.ok(auditInstance.configuration.userAgent, "Should has userAgent");
    t.equal(
      auditInstance.configuration.userAgent,
      userAgent,
      "Should has set the userAgent"
    );
    t.end();
  });

  subtest.test("Should setConfiguration", async t => {
    const configParams = {
      offsetRegex: 20,
      ignoreHttpCodes: [204, 500],
      maxTime: 10000
    };

    const expectedConfiguration = {
      ...auditInstance.configuration,
      ...configParams
    };

    auditInstance.setConfiguration(configParams);

    t.ok(auditInstance.configuration, "Should has configuration");
    t.same(
      auditInstance.configuration,
      expectedConfiguration,
      "Should has set the expected configuration"
    );
    t.end();
  });

  subtest.test("Should setUrlsFromSitemap", async t => {
    const sitemapUrl = "https://zeit.co/sitemap.xml";

    auditInstance.setConfiguration({ sitemapUrl });
    await auditInstance.setUrlsFromSitemap();
    const [firstUrl] = auditInstance.urls;

    t.ok(auditInstance.configuration.sitemapUrl, "Should has configuration");
    t.equal(
      auditInstance.configuration.sitemapUrl,
      sitemapUrl,
      "Should has set the sitemap"
    );
    t.type(auditInstance.urls, "Array", "Urls should be an array");
    t.equal(auditInstance.urls.length > 0, true, "Should has urls");
    t.equal(
      firstUrl,
      "https://zeit.co/",
      "First url should be taken from sitemap"
    );
    t.end();
  });

  subtest.test("Should make()", async t => {
    const report = await auditInstance
      .setUrls(["https://www.google.com"])
      .setAudits({ w3c: false, regex: [], redirect: false, amp: false })
      .make();
    t.ok(report, "Report was generated");
    t.deepEqual(
      report,
      auditInstance.report,
      "Report has been stored in instance"
    );
    t.end();
  });

  subtest.end();
});
