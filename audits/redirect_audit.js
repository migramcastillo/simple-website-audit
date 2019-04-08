module.exports = (request) => {
    if (request && request._redirect && request._redirect.redirects) {
        return request._redirect.redirects;
    }
    else{
        return [];
    }
}