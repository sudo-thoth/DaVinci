const { Schema, model } = require("mongoose");

const submissionSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    randID: String,
    submittor: {
      id: String,
      username: String,
    },
    creator: {
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
    work_type: String,
    status: String,
    resolved: Boolean,
    reason_resolved: String,
    resolved_by: {
      id: String,
      username: String,
    },
    timestamp: Number,
    date: String,   
  },
  { collection: "submissions" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("Submission", submissionSchema, "submissions");
