// netlify/functions/verify.js

const path = require("path");
const { allowedCodes } = require("./allowedCodes.json");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  
  let code = "";
  try {
    const body = JSON.parse(event.body || "{}");
    code = (body.code || "").trim();
  } catch {
    return { statusCode: 400, body: JSON.stringify({ valid: false }) };
  }

  const valid = allowedCodes.includes(code);
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ valid })
  };
};
