import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Animals } from '/both/collections/Animals.js'
import { Session } from 'meteor/session'
import { ContinuousParty } from "../../modes/ContinuousParty";
import { Games } from "../../../both/collections/Games";

Template.playGame.onCreated(function playGameOnCreated() {
    console.log("in playGame", this.data);
    const apa = new ContinuousParty(this.data.game);
    //apa.start();
});


const helper = {
  animals: function () {
    return Animals.find();
  },
}

