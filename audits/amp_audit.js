const amphtmlValidator = require("amphtml-validator");

const amp_audit = async (html) => {
    const validator = await amphtmlValidator.getInstance();
    const { status, errors } = validator.validateString(html);

    return { status, errors };
}

module.exports = amp_audit;