const validator = require("html-validator");

const html_audit = async (html) => {
    try{
        const { messages } = await validator({ format: "json", data: html });

        return messages;
    }catch(error){
        console.log("HTML Validator Error", error);
    }
}

module.exports = html_audit;