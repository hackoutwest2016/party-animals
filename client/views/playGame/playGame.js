import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Animals } from '/both/collections/Animals.js'
import { Session } from 'meteor/session'
import { ContinuousParty } from "../../modes/ContinuousParty";
import { PartyRound } from "../../modes/PartyRound";
import { Games } from "../../../both/collections/Games";

Template.playGame.onCreated(function playGameOnCreated() {
    console.log("in playGame", this.data);
    setTimeout(() => {
      Session.set("currentGame", this.data.game._id);
      let apa;
      if (this.data.game.type === "animal-vs-all") {
          apa = new ContinuousParty(this.data.game);
      } else {
          apa = new PartyRound(this.data.game);
      }

      apa.start();
    }, 2000);
});


const helper = {
  animals: function () {
    return Animals.find();
  },
}

