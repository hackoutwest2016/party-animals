Players = new Mongo.Collection("players");

Players.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "name"
  },
  score: {
    type: Number,
    label: "keywords"
  }
}));