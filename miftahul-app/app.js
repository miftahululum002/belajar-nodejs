const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  saveContact,
  deleteContact,
  updateContact,
} = require("./utils/contacts");

const {
  loadProducts,
  findProduct,
  cekKodeDuplikat,
  saveProduct,
  updateProduct,
  deleteProduct,
} = require("./utils/products");
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

app.get("/product", (req, res) => {
  const products = loadProducts();
  res.render("product", {
    layout: "layouts/app",
    title: "Products",
    products,
    msg: req.flash("msg"),
  });
});

app.post("/product", (req, res) => {
  const cek = cekKodeDuplikat(req.body.code);
  if (cek) {
    req.flash("error", "Kode sudah digunakan");
    return res.redirect("/product/add");
  }
  saveProduct(req.body);
  req.flash("msg", "Data berhasil disimpan");
  return res.redirect("/product");
});

app.get("/product/add", (req, res) => {
  res.render("product-add", {
    layout: "layouts/app",
    title: "Tambah Product",
    error: req.flash("error"),
  });
});
app.get("/product/delete/:id", (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    req.flash("error", "Data product tidak ditemukan");
    return res.redirect("/product");
  }
  deleteProduct(req.params.id);
  req.flash("msg", "Data berhasil dihapus");
  return res.redirect("/product");
});
app.get("/product/:id", (req, res) => {
  const data = findProduct(req.params.id);
  res.render("product-detail", {
    layout: "layouts/app",
    title: "Detail Product",
    data: data,
    error: req.flash("error"),
  });
});

app.get("/product/edit/:id", (req, res) => {
  const data = findProduct(req.params.id);
  res.render("product-edit", {
    layout: "layouts/app",
    title: "Edit Product",
    data: data,
    error: req.flash("error"),
  });
});
app.post("/product/update", (req, res) => {
  const cek = cekKodeDuplikat(req.body.code);
  if (cek && cek.id != req.body.id) {
    req.flash("error", "Kode sudah digunakan");
    return res.redirect(`/product/edit/${req.body.id}`);
  }
  updateProduct(req.body.id, req.body);
  req.flash("msg", "Data berhasil disimpan");
  return res.redirect("/product");
});
app.use("/", (req, res) => {
  res.status(404);
  res.send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port} http://localhost:${port}`);
});
