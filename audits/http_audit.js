// Packages
const rp = require("request-promise");

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

        const {
            statusCode,
            body,
            request
        } = await rp.get(options);

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
}

module.exports = http_audit;