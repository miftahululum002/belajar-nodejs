const fs = require("fs");
const dataDir = "./data";
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const dataPath = dataDir + "/products.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}
const cekKodeDuplikat = (code) => {
  const products = loadProducts();
  const product = products.find((product) => product.code === code);
  return product;
};
const loadProducts = () => {
  const buffer = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(buffer);
};

const saveProducts = (products) => {
  fs.writeFileSync(dataPath, JSON.stringify(products));
};

const saveProduct = (product) => {
  const products = loadProducts();
  product.id = Date.now();
  products.push(product);
  saveProducts(products);
};

const findProduct = (id) => {
  const products = loadProducts();
  const product = products.find((product) => product.id == id);
  return product;
};

const updateProduct = (id, product) => {
  product.id = id;
  const products = loadProducts();
  let newProducts = products.filter((product) => product.id != id);
  newProducts.push(product);
  saveProducts(newProducts);
};

const deleteProduct = (id) => {
  const products = loadProducts();
  let newProducts = products.filter((product) => product.id != id);
  saveProducts(newProducts);
};
module.exports = {
  loadProducts,
  findProduct,
  cekKodeDuplikat,
  saveProduct,
  updateProduct,
  deleteProduct,
};
