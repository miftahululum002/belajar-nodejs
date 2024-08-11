const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
const path = require("path");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
// app.use('/static', express.static(path.join(__dirname, 'public')))

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
  res.render("contact", {
    layout: "layouts/app",
    title: "Contact",
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
