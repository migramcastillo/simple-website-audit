"use strict";

// Functions to work with
const sanitizeURL = require("./helpers/sanitize-url");
const getSiteMap = require("./helpers/get-sitemap");

// Audits instances
const auditMaker = require("./audits/");
const auditMakerSync = require("./audits/audit_sync");

function auditFunction(url) {
  return {
    //Additional audits to make, default audit is HTTP if it fails no one of the above will run
    audits: {
      regex: false,
      redirect: false,
      w3c: false,
      amp: false,
      seo: false,
      lighthouse: false
    },
    //Regex to find in the HTML result
    regex_strings: [],
    //Domain to attach in the url if set
    domain: "",
    // Some others configurations to test
    configuration: {
      offsetRegex: 200,
      maxTime: 5000,
      maxRedirects: 5,
      resolveWithFullResponse: true,
      followAllRedirects: true,
      ignoreHttpCodes: [],
      listenHttpCodes: [],
      usingSitemap: "",
      fromMobile: false
    },
    // URLs to test
    urls: url,

    // The report result will be stored here
    report: [],

    /* Setters */
    setAudits: function(newAudits) {
      this.audits = { ...this.audits, ...newAudits };
      return this;
    },
    setDomain: function(domain) {
      this.domain = toString(domain);

      if (!Array.isArray(this.urls)) {
        this.urls = [this.urls];
      }

      this.urls = this.urls.map(uri => {
        return sanitizeURL(domain + uri);
      });

      return this;
    },
    setConfiguration: function(newConfiguration) {
      this.configuration = { ...this.configuration, ...newConfiguration };
      return this;
    },
    setRegexStrings: function(newStrings) {
      this.regex_strings = Array.from(newStrings);
      return this;
    },
    setUrlsFromSitemap: async function() {
      // Sanitize URL from config
      const siteUrl = sanitizeURL(this.configuration.usingSitemap);

      // Get sitemap URLs
      const newUrls = await getSiteMap(siteUrl);

      // Set URLs from Sitemap
      this.urls = newUrls;

      return;
    },

    // Audit Fire
    make: async function() {
      //Check if sitemap is in use
      if (this.configuration.usingSitemap) {
        await this.setUrlsFromSitemap();
      }

      //Check if URLs is Array
      if (!Array.isArray(this.urls)) {
        this.urls = [this.urls];
      }

      this.urls = this.urls.map(uri => {
        return sanitizeURL(uri);
      });

      let result = await auditMaker(this);

      return result;
    },

    // Audit Fire
    makeSync: async function() {
      //Check if sitemap is in use
      if (this.configuration.usingSitemap) {
        await this.setUrlsFromSitemap();
      }

      //Check if URLs is Array
      if (!Array.isArray(this.urls)) {
        this.urls = [this.urls];
      }

      this.urls = this.urls.map(uri => {
        return sanitizeURL(uri);
      });

      let result = await auditMakerSync(this);

      return result;
    }
  };
}

module.exports = auditFunction;
