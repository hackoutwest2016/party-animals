export const Questions = new Mongo.Collection("Questions");

Questions.attachSchema(new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['song', 'text'],
    label: "name"
  },
  question: {
    type: [Object],
    label: "question"
  },
  answer: {
    type: [Object],
    label: "answer"
  },
  song: {
    type: SimpleSchema.RegEx.Url,
    label: "song"
  }
}));