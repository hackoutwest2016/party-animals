import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.joinGame.onCreated(function joinGameOnCreated() {});

Template.joinGame.helpers({
  games: function() {
    return Games.find();
  },
  partyAnimal: function() {
    console.log(this)
    console.log(Animals.findOne({_id: this.animal}))
    return Animals.findOne({_id: this.animal})
  },
  playerString: function() {
    const numberOfPlayers = this.players.length;
    return `${numberOfPlayers} player${this.players.length !== 1 ? 's' : ''}`
  }
});
