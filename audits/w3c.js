const validator = require("html-validator");

const w3cAudit = async html => {
  const { messages } = await validator({ format: "json", data: html });

  return messages;
};

module.exports = w3cAudit;
