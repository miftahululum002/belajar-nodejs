const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("./utils/db");
const Contact = require("./model/contact");
const Product = require("./model/product");
const { body, validationResult, check } = require("express-validator");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();
const port = 3000;
const path = require("path");
app.use(methodOverride("_method"));
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
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();
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
app.delete("/contact", async (req, res) => {
  const contact = await Contact.findOne({ _id: req.body.id });
  if (!contact) {
    req.flash("error", "Data contact tidak ditemukan");
    return res.redirect("/contact");
  }
  await Contact.deleteOne({ _id: req.body.id }).then((result) => {
    req.flash("msg", "Data contact berhasil dihapus");
    res.redirect("/contact");
  });
});
app.get("/contact/edit/:id", async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id });
  res.render("contact-edit", {
    layout: "layouts/app",
    title: "Contact Edit",
    contact,
    error: req.flash("error"),
  });
});
app.put(
  "/contact",
  [
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No HP tidak valid").isMobilePhone("id-ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      return res.redirect(`/contact/edit/${req.body.id}`);
    }
    const id = req.body.id;

    await Contact.updateOne(
      { _id: req.body._id },
      {
        $set: {
          name: req.body.name,
          nohp: req.body.nohp,
          email: req.body.email,
        },
      }
    ).then((error, result) => {
      req.flash("msg", "Data contact berhasil disimpan");
      res.redirect("/contact");
    });
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
    Contact.insertMany(req.body);
    req.flash("msg", "Data berhasil disimpan");
    res.redirect("/contact");
  }
);
app.get("/contact/:id", async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id });
  res.render("contact-detail", {
    layout: "layouts/app",
    title: "Contact Detail",
    contact,
  });
});

app.get("/product", async (req, res) => {
  const products = await Product.find();
  res.render("product", {
    layout: "layouts/app",
    title: "Products",
    products,
    msg: req.flash("msg"),
  });
});

app.post(
  "/product",
  [
    body("code").custom(async (value) => {
      const cek = await Product.findOne({ code: value });
      if (cek) {
        throw new Error("Kode sudah digunakan");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      return res.redirect("/product/add");
    }
    await Product.insertMany(req.body).then((error, result) => {
      req.flash("msg", "Data berhasil disimpan");
      return res.redirect("/product");
    });
  }
);

app.get("/product/add", (req, res) => {
  res.render("product-add", {
    layout: "layouts/app",
    title: "Tambah Product",
    error: req.flash("error"),
  });
});
app.delete("/product", async (req, res) => {
  const product = await Product.findOne({ _id: req.body._id });
  if (!product) {
    req.flash("error", "Data product tidak ditemukan");
    return res.redirect("/product");
  }
  await Product.deleteOne({ _id: req.body._id }).then((result) => {
    req.flash("msg", "Data berhasil dihapus");
    return res.redirect("/product");
  });
});
app.get("/product/:id", async (req, res) => {
  const data = await Product.findOne({ _id: req.params.id });
  res.render("product-detail", {
    layout: "layouts/app",
    title: "Detail Product",
    data: data,
    error: req.flash("error"),
  });
});

app.get("/product/edit/:id", async (req, res) => {
  const data = await Product.findOne({ _id: req.params.id });
  res.render("product-edit", {
    layout: "layouts/app",
    title: "Edit Product",
    data: data,
    error: req.flash("error"),
  });
});
app.put(
  "/product",
  [
    body("code").custom(async (value, { req }) => {
      const cek = await Product.findOne({ code: value });
      if (cek && req.body._id != cek._id) {
        throw new Error("Kode sudah digunakan");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      return res.redirect(`/product/edit/${req.body._id}`);
    }
    await Product.updateOne(
      { _id: req.body._id },
      {
        $set: {
          code: req.body.code,
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
        },
      }
    ).then((error, result) => {
      req.flash("msg", "Data berhasil disimpan");
      return res.redirect("/product");
    });
  }
);
app.use("/", (req, res) => {
  res.status(404);
  res.send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port} http://localhost:${port}`);
});
