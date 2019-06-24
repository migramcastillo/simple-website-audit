// Packages
const rp = require('request-promise');

const http_audit = async (url, configuration) => {
  try {
    // Opciones CURL
    const options = {
      url: url,
      maxRedirects: configuration.maxRedirects,
      timeout: configuration.maxTime,
      resolveWithFullResponse: configuration.resolveWithFullResponse,
      followAllRedirects: configuration.followAllRedirects
    };

    if (configuration.fromMobile) {
      options.headers = {
        'user-agent':
          'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Mobile Safari/537.36'
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
    } else {
      const hasFinalRedirect =
        error.response && error.response.request && error.response.request.href;

      return {
        url,
        status: error.statusCode,
        finalURL: hasFinalRedirect ? error.response.request.href : url
      };
    }
  }
};

module.exports = http_audit;
