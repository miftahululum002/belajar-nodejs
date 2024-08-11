const fs = require("fs");

const dataDir = "./data";
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadContact = () => {
  const fileBuffer = fs.readFileSync("./data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};
const findContact = (id) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.id == id);
  return contact;
};
module.exports = { loadContact, findContact };
