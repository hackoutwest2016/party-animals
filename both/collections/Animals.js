Animals = new Mongo.Collection("animals");

Animals.attachSchema(new SimpleSchema({
  voiceConfig: {
    type: Object,
  },
  "voiceConfig.$.lang": {
    type: Array,
    label: "language"
  },
  "voiceConfig.$.lang.$": {
    type: String,
  },
  "voiceConfig.$.pitch": {
    type: Number
  },
  "voiceConfig.$.rate": {
    type: Number
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