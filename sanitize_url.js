module.exports = (uri) => {
    if (/http:\/\//.test(uri) || /https:\/\//.test(uri)) {
        return uri;
    } else {
        return "http://" + uri;
    }
}