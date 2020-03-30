import { test } from "tap";
const { readFile } = require("fs");
const path = require("path");
const { promisify } = require("util");
const simpleWebsiteAudit = require("../index");
const ampAudit = require("../audits/amp");
const regexAudit = require("../audits/regex");
const w3cAudit = require("../audits/w3c");

const readFilePromise = promisify(readFile);

test("AMP Regex and W3C Tests", async subtest => {
  const ampHtml = await readFilePromise(path.resolve(__dirname, "./amp.html"), {
    encoding: "utf8"
  });

  const simpleHtml = await readFilePromise(
    path.resolve(__dirname, "./simple.html"),
    {
      encoding: "utf8"
    }
  );
  const auditInstance = simpleWebsiteAudit();
  const defaultConfig = auditInstance.configuration;

  subtest.test("Should pass with a valid AMP page ", async t => {
    const { status, errors } = await ampAudit(ampHtml);
    t.ok(status, "Should contain status");
    t.equals(status, "PASS", "Status should be pass");
    t.type(errors, "Array", "Errors should be an array");
    t.equals(errors.length, 0, "Errors must be empty");

    t.end();
  });

  subtest.test("Should return errors for non valid AMP pages ", async t => {
    const { status, errors } = await ampAudit(simpleHtml);
    t.ok(status, "Should contain status");
    t.equals(status, "FAIL", "Status should be fail");
    t.type(errors, "Array", "Errors should be an array");
    t.equals(errors.length > 0, true, "Should contain errors");

    t.end();
  });

  subtest.test("Should find Regex within the HTML file ", async t => {
    const ocurrences = regexAudit(simpleHtml, ["<?php"], {
      ...defaultConfig,
      offsetRegex: 100
    });
    t.ok(ocurrences, "Should contain ocurrences");
    t.type(ocurrences, "Array", "Ocurrences should be an array");
    t.equal(ocurrences.length > 0, true, "Should have found the PHP error");

    t.end();
  });

  subtest.test(
    "Should return empty ocurrences for empty regex array ",
    async t => {
      const ocurrences = regexAudit(simpleHtml, [], defaultConfig);
      t.ok(ocurrences, "Should contain ocurrences");
      t.type(ocurrences, "Array", "Ocurrences should be an array");
      t.equal(ocurrences.length === 0, true, "Should have 0 occurrences");

      t.end();
    }
  );

  subtest.test("Should make w3c validation in HTML file ", async t => {
    const messages = await w3cAudit(simpleHtml);
    t.ok(messages, "Should contain messages");
    t.type(messages, "Array", "Messages should be an array");
    t.equal(
      messages.length > 0,
      true,
      "Should contain w3c errors this test document"
    );
    t.end();
  });

  subtest.end();
});
