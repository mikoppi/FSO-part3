const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  number: {
    type: String,
    validate: [
      {
        validator: function (value) {
          const regex = /^[0-9]{2,3}-[0-9]*$/g;
          return value.match(regex) ? true : false;
        },
        msg: "Number is in wrong format. Try xx-xxxxxxx or xxx-xxxxxxx",
      },
      {
        validator: function (value) {
          //hyphen adds +1 to the length
          return value.length > 7;
        },
        msg: "Number is too short",
      },
    ],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
