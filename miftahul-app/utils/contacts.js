const fs = require("fs");

const dataDir = "./data";
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const dataPath = dataDir + "/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadContact = () => {
  const fileBuffer = fs.readFileSync(dataPath, "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};
const findContact = (id) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.id == id);
  return contact;
};

const saveContact = (contact) => {
  const contacts = loadContact();
  // tambahkan id pada object
  contact.id = Date.now();
  contacts.push(contact);
  saveContacts(contacts);
};

const saveContacts = (contacts) => {
  fs.writeFileSync(dataPath, JSON.stringify(contacts));
};

const deleteContact = (id) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== Number(id)
  );
  saveContacts(filteredContacts);
};

const updateContact = (id, contact) => {
  contact.id = id;
  const contacts = loadContact();
  let newData = contacts.filter((kon) => kon.id !== id);
  newData.push(contact);
  saveContacts(newData);
};
module.exports = {
  loadContact,
  findContact,
  saveContact,
  deleteContact,
  updateContact,
};
