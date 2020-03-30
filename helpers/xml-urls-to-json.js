/*
    This helper converts XML Urls from the sitemap to json
 */
const xml2json = require("xml2json");

module.exports = data => {
  const json = xml2json.toJson(data);
  const parsed = JSON.parse(json);
  const urls = Array.from(parsed["urlset"]["url"]).map(url => {
    return url.loc;
  });

  return urls;
};
