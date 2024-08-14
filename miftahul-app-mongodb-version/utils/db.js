const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/admin", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  //   useCreateIndex: true,
});

// const Cat = mongoose.model("Cat", { name: String });

// const kitty = new Cat({ name: "Zildjian" });
// kitty.save().then(() => console.log("meow"));
