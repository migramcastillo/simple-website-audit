const httpAudit = require("./http_audit");
const htmlAudit = require("./html_audit");
const ampAudit = require("./amp_audit");
const regexAudit = require("./regex_audit");
const redirectAudit = require("./redirect_audit");

const auditMaker = ({ audits, request, regex_strings, configuration, urls, report }) => {

    return new Promise((resolve, reject) => {

        //Counter of HTML getter 
        let asyncCounter = urls.length;

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            
            let reportUrl = {};
    
            // Async to use I/O Non blocking
            httpAudit(url, configuration).then(async (response) => {
                const {
                    url: urlRes,
                    request,
                    status,
                    html
                } = response;

                // Check if status must be ignored
                if(configuration.ignoreHttpCodes.findIndex(code => code == status) !== -1){
                    asyncCounter--;
                    if(asyncCounter === 0){
                        resolve(report);
                    }
                    return;
                }
                if(configuration.listenHttpCodes.length > 0 && configuration.listenHttpCodes.findIndex(code => code == status) === -1)
                {
                    asyncCounter--;
                    if(asyncCounter === 0){
                        resolve(report);
                    }
                    return;
                }

                // Otherwise, do other audits
                reportUrl.http = {
                    url: urlRes,
                    status 
                };

                if(audits.redirect)
                    reportUrl.redirect = redirectAudit(request);
                if(audits.regex)
                    reportUrl.regex = regexAudit(html, regex_strings, configuration);
                if(audits.w3c)
                    reportUrl.w3c = await htmlAudit(html);
                if(audits.amp)
                    reportUrl.amp = await ampAudit(html);
        
                report.push({
                    url: urlRes,
                    date: (new Date()).toString(),
                    ...reportUrl
                });

                asyncCounter--;
                if(asyncCounter === 0){
                    resolve(report);
                }
            }).catch(error => {
                reject("Audit Index Error");
            });
        }

    });
    
}

module.exports = auditMaker;