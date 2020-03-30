/*
    This helper gets all the urls from the sitemap location to JSON format to use
    in the audits
 */
const convertToJson = require("./xml-urls-to-json");
const rp = require("request-promise");

module.exports = async sitemapUrl => {
  try {
    const data = await rp.get({
      url: sitemapUrl
    });

    const urls = convertToJson(data);

    return urls;
  } catch (error) {
    throw new Error(error);
  }
};
