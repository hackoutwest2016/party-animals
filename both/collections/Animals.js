export const Animals = new Mongo.Collection("Animals");

Animals.attachSchema(new SimpleSchema({
  "voices": {
    type: [String],
    label: "language"
  },
  "pitch": {
    type: Number,
    decimal: true
  },
  "rate": {
    type: Number,
    decimal: true
  },
  name: {
    type: String,
    label: "name"
  },
  color: {
    type: String,
    label: 'color'
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

if(Meteor.isClient) {
  window.Animals = Animals
}