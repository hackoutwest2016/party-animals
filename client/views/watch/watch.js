import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.watchGame.onCreated(function watchGameOnCreated() {});

Template.watchGame.helpers({
  playerString: function() {
    // const numberOfPlayers = this.players.length;
    // return `${numberOfPlayers} player${this.players.length !== 1 ? 's' : ''}`
  },
  partyAnimal: function() {
    return Animals.findOne({_id: this.game.animal})
  },
  players: function() {
    return Players.find({
      "_id": { "$in": this.game.players }
    })
  },
  modeIsAllVsAll: function() {
    return (this.game.type === 'all-vs-all')
  }
});
