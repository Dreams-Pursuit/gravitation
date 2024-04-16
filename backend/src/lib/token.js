"use strict";
const crypto = require("node:crypto");
const TOKEN_HEADER = { alg: "HS256", type: "JWT" };
const VALID_TIME = 86400;

const generateToken = (content) => {
  const header = Buffer.from(JSON.stringify(TOKEN_HEADER)).toString("base64");
  content.issuedAt = Date.now();
  content.validUntil = content.issuedAt + VALID_TIME;
  const payload = Buffer.from(JSON.stringify(content)).toString("base64");
  const signature = createSignature(header, payload);
  return `${header}.${payload}.${signature}`;
};

const jsonParse = (buffer) => {
  if (buffer.length === 0) return null;
  try {
    return JSON.parse(buffer);
  } catch {
    return null;
  }
};
const parseOptions = (str) => {
  const values = [];
  const temp = str.split(",");
  for (const elem of temp) {
    const [key, val] = elem.split("=");
    values.push([key, val]);
  }
  return Object.fromEntries(values);
};
const createSignature = (header, payload) => {
  const hmac = crypto.createHmac("sha256", "easyPyatyorkaDlaBogdana");
  const temp = header + "." + payload;
  hmac.update(temp);
  return hmac.digest("hex");
};

const validateToken = (token, username) => {
  const [header, payload, signature] = token.split(".");
  const decodedHeaderJSON = Buffer.from(header, "base64").toString("utf-8");
  const decodedHeaderObj = jsonParse(decodedHeaderJSON);
  if (
    !decodedHeaderObj?.alg ||
    !decodedHeaderObj?.type ||
    decodedHeaderObj.alg !== "HS256" ||
    decodedHeaderObj.type !== "JWT"
  ) {
    console.log("Oops! Probably it's not our token");
    return -1;
  }
  if (createSignature(header, payload) !== signature) {
    console.log("The token is invalid!");
    return -1;
  }
  const decodedPayloadJSON = Buffer.from(payload, "base64").toString("utf-8");
  const decodedPayloadObj = jsonParse(decodedPayloadJSON);
  if (
    !decodedPayloadObj?.username ||
    decodedPayloadObj.username != username ||
    decodedHeaderObj.issuedAt > Date.now()
  ) {
    console.log("Put this token back where you got it from!");
    return -1;
  }
  if (decodedHeaderObj.validUntil < Date.now()) {
    console.log("It seems like your token is no longer valid!");
    return 0;
  }
  console.log("It looks like you passed every checks. Here's your reward!");
  return 1;
};

module.exports = { generateToken, validateToken };
