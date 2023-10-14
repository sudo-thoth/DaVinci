const { Schema, model } = require("mongoose");

const compSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    compID: String,
    randID: String,
    lastUpdated: {
      user: {
        id: String,
        username: String
      },
      timestamp: Number,
      date: String,
    },
    compInfo: {
      title: String,
      artist: String,
      description: String,
      sourceDomain: String,
      url: String,
      tags: [String], // comp tags: cover art, pictures, instrumentals, accapellas, remasters, masters, stem-edits, session edits, edits, unreleased, released, og files, studio files, ai remasters, video snippets, audio snippets, gifs, music videos, wallpapers, visualizers, docs, freestyles, interviews
      owner: {
        id: String,
        username: String,
        name: String,
        socials: {
          twitter: String,
          instagram: String,
          tiktok: String,
          youtube: String,
          soundcloud: String,
          spotify: String,
          appleMusic: String,
          bandcamp: String,
          other: String,
        },
      },
    },
    compHistory: {
      created: {
        user: {
          id: String,
          username: String
        },
        guild:{
          id: String,
          name: String,
          url: String,
        },
        timestamp: Number,
        date: String,
      },
      versions: Array,
    },

  },
  { collection: "compilations" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("Comp", compSchema, "compilations");
