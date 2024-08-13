const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  saveContact,
  deleteContact,
  updateContact,
} = require("./utils/contacts");

const { body, validationResult, check } = require("express-validator");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();
const port = 3000;
const path = require("path");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.get("/", (req, res) => {
  const mahasiswa = [
    {
      name: "Miftahul Ulum",
      email: "ulumiftahul06@gmail.com",
    },
    {
      name: "Ulum Miftahul",
      email: "miftahululum002@gmail.com",
    },
    {
      name: "Oke Miftahul",
      email: "okemiftahululum002@gmail.com",
    },
  ];
  res.render("index", {
    layout: "layouts/app",
    name: "Miftahul Ulum",
    title: "Home",
    mahasiswa,
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/app",
    title: "About",
  });
});
app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    layout: "layouts/app",
    title: "Contact",
    contacts,
    msg: req.flash("msg"),
    error: req.flash("error"),
  });
});
app.get("/contact/add", (req, res) => {
  res.render("contact-add", {
    layout: "layouts/app",
    title: "Contact Add",
    error: req.flash("error"),
  });
});
app.get("/contact/delete/:id", (req, res) => {
  const contact = findContact(req.params.id);
  if (!contact) {
    req.flash("error", "Data contact tidak ditemukan");
    return res.redirect("/contact");
  }
  deleteContact(req.params.id);
  req.flash("msg", "Data contact berhasil dihapus");
  res.redirect("/contact");
});
app.get("/contact/edit/:id", (req, res) => {
  const contact = findContact(req.params.id);
  res.render("contact-edit", {
    layout: "layouts/app",
    title: "Contact Edit",
    contact,
    error: req.flash("error"),
  });
});
app.post(
  "/contact/update",
  [
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      return res.redirect(`/contact/edit/${req.body.id}`);
    }
    const id = req.body.id;
    updateContact(id, req.body);
    req.flash("msg", "Data contact berhasil disimpan");
    res.redirect("/contact");
  }
);
app.post(
  "/contact",
  [
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      return res.redirect("/contact/add");
    }
    saveContact(req.body);
    req.flash("msg", "Data berhasil disimpan");
    res.redirect("/contact");
  }
);
app.get("/contact/:id", (req, res) => {
  const contact = findContact(req.params.id);
  res.render("contact-detail", {
    layout: "layouts/app",
    title: "Contact Detail",
    contact,
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port} http://localhost:${port}`);
});
