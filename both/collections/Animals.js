Animals = new Mongo.Collection("animals");

Animals.attachSchema(new SimpleSchema({
  voiceConfig: {
    type: Object,
  },
  name: {
    type: String,
    label: "name"
  },
  picture: {
    type: String,
    label: "picture(base64)",
  },
  score: {
    type: Number,
    optional: true
  }
}));