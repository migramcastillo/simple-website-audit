const amphtmlValidator = require("amphtml-validator");

const ampAudit = async html => {
  const validator = await amphtmlValidator.getInstance();
  const { status, errors } = validator.validateString(html);

  return { status, errors };
};

module.exports = ampAudit;
