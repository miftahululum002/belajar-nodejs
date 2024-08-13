const fs = require("fs");
const dataDir = "./data";
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const dataPath = dataDir + "/products.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadProducts = () => {
  const buffer = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(buffer);
};

module.exports = { loadProducts };
