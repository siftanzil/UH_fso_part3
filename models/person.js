const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
   name: {
      type: String,
      minlength: 3,
      required: true,
   },
   number: {
      type: String,
      required: true,
   },
});

personSchema.set("toJSON", {
   transform: (doc, returnedObj) => {
      returnedObj.id = returnedObj._id.toString();
      delete returnedObj._id;
      delete returnedObj.__v;
   },
});

module.exports = mongoose.model("Person", personSchema);
