const fs = require("fs");
const path = require("path");

function exportJsonFile(url, data) {
  const hostname = new URL(url).hostname;
  const parts = hostname.split(".");

  let folderName = parts[parts.length - 2];

  if (parts.length > 3 && parts[parts.length - 1].length <= 3) {
    folderName = parts[parts.length - 3];
  }

  folderName = folderName.replace(/^www\./, "");

  const outputDir = path.join(__dirname, folderName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFilename = path.join(outputDir, `output.json`);

  fs.writeFileSync(outputFilename, JSON.stringify(data, null, 2));
  console.info("output file is written in" + outputDir);
}

module.exports = exportJsonFile;
