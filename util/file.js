const fs = require("fs");
exports.deleteFile = (filePath) => {
    console.log(filePath)
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};
