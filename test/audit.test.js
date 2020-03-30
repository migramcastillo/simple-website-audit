import { test } from "tap";
const auditPromise = require("../audits/audit");
const auditPromiseRunner = require("../audits/");
const auditInstance = require("../");
const util = require("util");

test("Audit testings", subtest => {
  const defaultConfig = auditInstance().configuration;

  subtest.test("Should make an auditPromise with basic audits ", async t => {
    const report = await auditPromise({
      audits: {
        redirect: true,
        regex: ["<?php"],
        w3c: true,
        amp: false
      },
      url: "https://httpstat.us/301",
      configuration: defaultConfig
    });

    t.ok(report, "Should return a report object");
    t.ok(report.http, "Should have http property");
    t.ok(report.http.url, "Should have http url property");
    t.ok(report.http.status, "Should have http status property");
    t.equal(
      report.http.url,
      "https://httpstat.us/301",
      "Should return the same URL"
    );
    t.equal(report.http.status, 200, "Should return status 200");
    t.ok(report.redirect, "Should contain redirect property");
    t.type(report.redirect, "Array", "Redirect path should be an array");
    t.deepEqual(
      report.redirect,
      [{ statusCode: 301, redirectUri: "https://httpstat.us" }],
      "Should contain expected redirect path"
    );
    t.ok(report.w3c, "Should contain w3c property");
    t.type(report.w3c, "Array", "W3C should be an array");
    t.ok(report.date, "Should have date property");

    t.end();
  });

  subtest.test("Should ignore specific code", async t => {
    const report = await auditPromise({
      audits: {
        redirect: true,
        regex: ["<?php"],
        w3c: true
      },
      url: "https://httpstat.us",
      configuration: { ...defaultConfig, ignoreHttpCodes: [200, 201, 204] }
    });

    t.ok(report, "Should return a report object");
    t.same(report, {}, "Report should be empty object");

    t.end();
  });

  subtest.test("Should make amp audits", async t => {
    const report = await auditPromise({
      audits: {
        redirect: false,
        regex: [],
        w3c: false,
        amp: true
      },
      url:
        "https://amp.dev/documentation/examples/introduction/hello_world/preview/?format=websites",
      configuration: defaultConfig
    });

    t.ok(report, "Should return a report object");
    t.ok(report.amp, "Should contain amp property in report");
    t.ok(report.amp.status, "Should contain amp status property in report");
    t.ok(report.amp.errors, "Should contain amp errors property in report");

    t.end();
  });

  subtest.test(
    "Should do audits if status code is not in ignoreList",
    async t => {
      const report = await auditPromise({
        audits: {
          redirect: false,
          regex: [],
          w3c: false,
          amp: false
        },
        url: "https://httpstat.us/301",
        configuration: { ...defaultConfig, ignoreHttpCodes: [500, 400, 404] }
      });

      t.ok(report, "Should return a report object");
      t.ok(report.http, "Should have http property");
      t.ok(report.http.url, "Should have http url property");
      t.ok(report.http.status, "Should have http status property");
      t.equal(
        report.http.url,
        "https://httpstat.us/301",
        "Should return the same URL"
      );
      t.equal(report.http.status, 200, "Should return status 200");
      t.ok(report.date, "Should have date property");

      t.end();
    }
  );

  subtest.test("Should run audits for urls", async t => {
    const report = await auditPromiseRunner({
      audits: {
        w3c: false,
        redirect: true,
        regex: [],
        amp: false
      },
      configuration: { ...defaultConfig, ignoreHttpCodes: [500] },
      urls: ["https://httpstat.us/500", "https://www.google.com"]
    });

    const [googleReport] = report;

    t.ok(report, "Should return a report array");
    t.type(report, "Array", "Report should be an array");
    t.equal(
      report.length === 1,
      true,
      "Report length should be 1 for the ignoreRule"
    );
    t.ok(googleReport.http, "First report should include http property");
    t.ok(googleReport.date, "First report should include date property");

    t.end();
  });

  subtest.end();
});
