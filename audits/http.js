// Packages
const rp = require("request-promise");

const httpAudit = async (url, configuration) => {
  try {
    const options = {
      url: url,
      maxRedirects: configuration.maxRedirects,
      timeout: configuration.maxTime,
      resolveWithFullResponse: configuration.resolveWithFullResponse,
      followAllRedirects: configuration.followAllRedirects
    };

    if (configuration.userAgent) {
      options.headers = {
        "user-agent": configuration.userAgent
      };
    }

    const { statusCode, body, request } = await rp.get(options);

    return {
      url,
      request,
      status: statusCode,
      html: body
    };
  } catch (error) {
    if (!error.response) {
      return {
        url,
        status: 500
      };
    }

    return {
      url,
      status: error.statusCode
    };
  }
};

module.exports = httpAudit;
