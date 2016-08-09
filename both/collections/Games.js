// Games = new Mongo.Collection("games");

// Games.attachSchema(new SimpleSchema({
//   name: {
//     type: String,
//     label: "name"
//   },
//   keywords: {
//     type: Array,
//     label: "keywords"
//   },
//   description: {
//     type: String,
//     label: "description",
//   },
//   hash: {
//     type: String,
//     label: "description",
//   },
//   currentQuestion: {
//     type: Meteor.Collection.ObjectID,
//     label: "current question",
//   },
//   user: {
//     type: Meteor.Collection.ObjectID,
//     label: 'the user which we auth with'
//   },
//   animal: {
//     type: Meteor.Collection.ObjectID,
//     label: 'the animal'
//   },
//   players: {
//     type: [ Meteor.Collection.ObjectID ],
//     label: 'the players'
//   },
//   questions: {
//     type: [ Meteor.Collection.ObjectID ],
//     label: 'the questions'
//   }
// }));