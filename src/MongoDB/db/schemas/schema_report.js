const { Schema, model } = require("mongoose");

const reportSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    randID: String,
    reporter: {
      id: String,
      username: String,
    },
    target: {
      id: String,
      username: String,
    },
    reason: String,
    message: {
      id: String,
      content: String,
      media: Array,
      message: Object,
    },
    guild: {
      id: String,
      name: String,
    },
    channel: {
      id: String,
      name: String,
    },
    report_type: String,
    resolved: Boolean,
    reason_resolved: String,
    resolved_by: {
      id: String,
      username: String,
    },
    timestamp: Number,
    date: String,   
  },
  { collection: "reports" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("Report", reportSchema, "reports");
