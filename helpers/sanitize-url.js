/*
    If you don't specify protocol of each url, this helper will include the https
    before it, example:
    input: www.google.com
    output: https://www.google.com

    input: http://www.plainhttp.com
    output: http://www.plainhttp.com
 */
module.exports = uri => {
  if (/http:\/\//.test(uri) || /https:\/\//.test(uri)) {
    return uri;
  } else {
    return "https://" + uri;
  }
};
