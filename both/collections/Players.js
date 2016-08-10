export const Players = new Mongo.Collection("Players");

Players.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "name"
  },
  score: {
    type: Number,
    label: "keywords",
    autoValue: function() {
      if (this.isInsert) {
        return 0;
      }
    }
  }
}));


if(Meteor.isClient) {
  window.Players = Players
}
