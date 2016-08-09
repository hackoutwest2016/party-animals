import { Meteor } from 'meteor/meteor'
export const Games = new Mongo.Collection("Games");

Games.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "name"
  },
  type: {
    type: String,
    allowedValues: ['all-vs-all', 'all-vs-animal'],
    label: "name"
  },

  //Not explicity set by the user
  currentQuestion: {
    type: Meteor.Collection.ObjectID,
    label: "current question",
  },
  animal: {
    type: Meteor.Collection.ObjectID,
    label: 'the animal'
  },
  players: {
    type: [ Meteor.Collection.ObjectID ],
    label: 'the players'
  },
  questions: {
    type: [ Meteor.Collection.ObjectID ],
    label: 'the questions'
  }
}));

if(Meteor.isClient) {
  window.Games = Games
}
