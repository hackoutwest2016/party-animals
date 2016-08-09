export const Questions = new Mongo.Collection("Questions");

Questions.attachSchema(new SimpleSchema({
  question: {
    type: String,
    label: "question"
  },
  answer: {
    type: String,
    label: "answer"
  },
  song: {
    type: SimpleSchema.RegEx.Url,
    label: "song"
  }
}));


if(Meteor.isClient) {
  window.Questions = Questions
}
