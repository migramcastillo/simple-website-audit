import { test } from "tap";
const httpAudit = require("../audits/http");
const redirectAudit = require("../audits/redirect");
const simpleWebsiteAudit = require("../index");

test("HTTP Audit testings", subtest => {
  subtest.test("For response 200", async t => {
    const auditInstance = simpleWebsiteAudit();
    const defaultConfig = auditInstance.configuration;
    const urlTest = "https://www.google.com";

    const { status, html } = await httpAudit(urlTest, defaultConfig);
    const redirectPath = redirectAudit();

    t.ok(status, "Should contain status");
    t.ok(html, "Should contain html");
    t.type(status, "number", "Status should be a number");
    t.type(html, "string", "HTML should be a string");
    t.equal(status, 200, "Status should be 200");
    t.type(redirectPath, "Array", "Redirect path should be an array");
    t.equal(redirectPath.length === 0, true, "Redirect path should be empty");

    t.end();
  });

  subtest.test("For mocking user agent", async t => {
    const auditInstance = simpleWebsiteAudit();
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";
    const configuration = { ...auditInstance.configuration, userAgent };
    const urlTest = "https://www.google.com";

    const { status, html, request } = await httpAudit(urlTest, configuration);

    t.ok(status, "Should contain status");
    t.ok(html, "Should contain html");
    t.type(status, "number", "Status should be a number");
    t.type(html, "string", "HTML should be a string");
    t.equal(status, 200, "Status should be 200");
    t.equal(
      request.headers["user-agent"],
      userAgent,
      "User agent should have changed on request"
    );

    t.end();
  });

  subtest.test("Hanlde a redirect and get redirect path", async t => {
    const auditInstance = simpleWebsiteAudit();
    const defaultConfig = auditInstance.configuration;
    const urlTest = "https://httpstat.us/301";

    const { status, request } = await httpAudit(urlTest, defaultConfig);
    const redirectPath = redirectAudit(request);

    t.ok(status, "Should contain status");
    t.type(status, "number", "Status should be a number");
    t.equal(status, 200, "Final status should be 200");
    t.ok(redirectPath, "Should contain redirect path");
    t.type(redirectPath, "Array", "Redirect path should be an array");
    t.deepEqual(
      redirectPath,
      [{ statusCode: 301, redirectUri: "https://httpstat.us" }],
      "Redirect path should show code and redirections"
    );

    t.end();
  });

  subtest.test("Hanlde a HTTP error response", async t => {
    const auditInstance = simpleWebsiteAudit();
    const defaultConfig = auditInstance.configuration;
    const urlTest = "https://httpstat.us/500";

    const { status, url } = await httpAudit(urlTest, defaultConfig);

    t.ok(status, "Should contain status");
    t.ok(url, "Has an URL");
    t.type(status, "number", "Status should be a number");
    t.equal(status, 500, "Status should be 500");

    t.end();
  });

  subtest.test("Handle an infinite loop error", async t => {
    const auditInstance = simpleWebsiteAudit();
    const defaultConfig = auditInstance.configuration;
    const urlTest = "https://demo.cyotek.com/features/redirectlooptest.php";

    const { status } = await httpAudit(urlTest, defaultConfig);

    t.ok(status, "Should contain status");
    t.type(status, "number", "Status should be a number");
    t.equal(status, 500, "Status should be 500");

    t.end();
  });

  subtest.test("Handle an invalid domain", async t => {
    const auditInstance = simpleWebsiteAudit();
    const defaultConfig = auditInstance.configuration;
    const urlTest = "http://demo.demo.demo";

    const { status } = await httpAudit(urlTest, defaultConfig);

    t.ok(status, "Should contain status");
    t.type(status, "number", "Status should be a number");
    t.equal(status, 500, "Status should be 500");

    t.end();
  });

  subtest.end();
});
