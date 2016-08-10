import { Meteor } from 'meteor/meteor'
export const Games = new Mongo.Collection("Games");

Games.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "name"
  },
  type: {
    type: String,
    allowedValues: ['all-vs-all', 'animal-vs-all'],
    label: "name"
  },

  animal: {
    type: String,
    label: 'the animal'
  },

  //Not explicity set by the user
  currentQuestion: {
    type: String,
    label: "current question",
  },
  players: {
    type: [ String ],
    label: 'the players'
  },
  questions: {
    type: [ String ],
    label: 'the questions'
  }
}));

if(Meteor.isClient) {
  window.Games = Games
}
