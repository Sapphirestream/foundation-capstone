const path = require("path");

module.exports = {
  home: (req, res) => {
    //res.sendFile(path.join(__dirname, "../public/index.html"));
    res.sendFile(path.join(__dirname, "../public/index.html"));
  },

  styles: (req, res) => {
    res.sendFile(path.join(__dirname, "../public/styles.css"));
  },

  reset: (req, res) => {
    res.sendFile(path.join(__dirname, "../public/reset.css"));
  },

  js: (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.js"));
  },
};
