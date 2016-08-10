export const Logs = new Mongo.Collection("Logs");

Logs.attachSchema(new SimpleSchema({
  log: {
    type: String,
    label: "question",
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
}));


if(Meteor.isClient) {
  window.Logs = Logs
}
