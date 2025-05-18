// Debug file to add console log override
const originalError = console.error;
console.error = function (...args) {
  // Log to file for debugging
  const fs = require("fs");
  const util = require("util");
  const message = util.format(...args);
  fs.appendFileSync("debug.log", message + "\n");

  // Call original console.error
  originalError.apply(console, args);
};
