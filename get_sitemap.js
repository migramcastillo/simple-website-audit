const getJSONurls = require("./xmlurls_tojson");
const rp = require("request-promise");

module.exports = async (url) => {

    try {
        // Obtener el sitemap del sitio si existe
        const data = await rp.get({
            url: `${url}/sitemap.xml`
        });

        // Convertir XML a JSON
        const urls = getJSONurls(data);

        return urls;
    } catch (error) {
        return error;
    }   
}