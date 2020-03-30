"use strict";

// Functions to work with
const sanitizeURL = require("./helpers/sanitize-url");
const getSiteMap = require("./helpers/get-sitemap");

// Audits instances
const asyncAudits = require("./audits/");

function auditFunction() {
  return {
    //  Additional audits to make, default audit is HTTP if it fails no one of the above will run
    audits: {
      regex: [],
      redirect: false,
      w3c: false,
      amp: false
    },
    // Some others configurations to test
    configuration: {
      offsetRegex: 200,
      maxTime: 5000,
      maxRedirects: 5,
      resolveWithFullResponse: true,
      followAllRedirects: true,
      ignoreHttpCodes: [],
      sitemapUrl: "",
      userAgent: ""
    },
    // URLs to test
    urls: [],

    // The report result will be stored here
    report: [],

    /* Functions, getters and setters */
    setAudits: function(newAudits) {
      this.audits = { ...this.audits, ...newAudits };
      return this;
    },

    setUrls: function(urls) {
      if (typeof urls === "string") {
        this.urls = [sanitizeURL(urls)];
      }

      if (Array.isArray(urls)) {
        this.urls = urls.map(url => {
          return sanitizeURL(url);
        });
      }

      return this;
    },
    addUrls: function(urls) {
      if (typeof urls === "string") {
        this.urls.push(sanitizeURL(urls));
      }

      if (Array.isArray(urls)) {
        const sanitized = urls.map(url => sanitizeURL(url));
        this.urls = [...this.urls, ...sanitized];
      }

      return this;
    },
    setUserAgent: function(userAgent) {
      this.configuration.userAgent = userAgent;
      return this;
    },
    setConfiguration: function(newConfiguration) {
      this.configuration = { ...this.configuration, ...newConfiguration };
      return this;
    },
    setUrlsFromSitemap: async function() {
      // Sanitize URL from config
      const siteUrl = sanitizeURL(this.configuration.sitemapUrl);

      // Get sitemap URLs
      const newUrls = await getSiteMap(siteUrl);

      // Set URLs from Sitemap
      this.urls = newUrls;

      return this;
    },

    // Audit Fire
    make: async function() {
      const result = await asyncAudits(this);

      this.report = result;

      return result;
    }
  };
}

module.exports = auditFunction;
