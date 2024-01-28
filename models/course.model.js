const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});



// we write the model name in a single case, and the compiler will transform it to the uppercase and الجمع
module.exports = mongoose.model("Course", courseSchema);
