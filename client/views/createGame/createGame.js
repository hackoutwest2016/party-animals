import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Animals } from '/both/collections/Animals.js'
import { Session } from 'meteor/session'
import { API } from "/client/utils/API";
import { tryFindCommand } from "/client/utils/commands";

Template.createGame.onCreated(function createGameOnCreated() {
  Session.set({
    selectState: 1,
    addedPlayers: []
  });
});

function _createGame() {
   Meteor.call('games.create', {
    name: Session.get('selectedName'),
    type: Session.get('selectedType'),
    animal: Session.get('selectedAnimal'),
    players: Session.get('addedPlayers')
  }, (err, res) => {
    if (err) {
      alert(err)
    } else {
      console.log('Game created. Id: ', res)
      API.speecher.say("Put the phone in the animal now. The game starts in ten - 9 - 8 - 7 - 6 - 5 - 4 - 3 - 2 - 1 - NOW",() => {
          // Go to new route which creates the game and such
          Router.go("/game/" + res);
      });
    }
  });
}

const helper = {
  animals: function () {
    return Animals.find();
  },
  players: function() {
    return Session.get('addedPlayers')
  },
  state1: () => {
    return Session.get('selectState') === 1
  },
  state2: () => {
    return Session.get('selectState') === 2
  },
  state3: () => {
    return Session.get('selectState') === 3
  },
  state4: () => {
    return Session.get('selectState') === 4
  }
}

Template.createGame.helpers(helper);
Template.selectAnimal.helpers(helper)
Template.selectName.helpers(helper)
Template.selectType.helpers(helper)
Template.addPlayers.helpers(helper)
Template.selectAnimal.onCreated(function selectAnimalOnCreated() {
  API.speecher.say('Which piximal do you want to play with? Tipsy, Flipsy or - Mipsy?')
  API.recognizer.startListening(acceptVoiceCommand);
});

Template.selectAnimal.events({
  'click [data-select-animal]'(event, instance) {
    const id = event.currentTarget.getAttribute('data-id');

    API.speecher.say(name + ' rocks!')

    Session.set({
      selectedAnimal: id,
      selectState: 2
    });
  }
});

Template.selectAnimal.onDestroyed(function selectAnimalOnDestroyed() {
    console.log("animal DESTROYED");
    API.recognizer.stopListening();
});



Template.selectName.onCreated(function selectNameOnCreated() {
  API.speecher.say('what is your name?')
  API.recognizer.startListening(acceptVoiceCommand);
});
Template.selectName.onDestroyed(function selectNameOnDestroyed() {
  API.recognizer.stopListening();
});

Template.selectName.events({
  'input input'(event, instance) {
    let inputField = event.currentTarget;
    $(instance
      .find('button'))
      .toggleClass('disabled', inputField.value.length === 0)
  },
  'click [data-enter-name]'(event, instance) {
    if ($(event.currentTarget).hasClass('disabled')) return;
    else {
      const name = instance.find('input').value
      API.speecher.say('hi '+ name);
      Session.set({
        selectedName: name,
        selectState: 3
      });
    }
  }
});

Template.selectType.onCreated(function selectTypeOnCreated() {
  API.speecher.say('what game do you want to play??')
});

Template.selectType.events({
  'click [data-select-all-vs-all]'(event, instance) {
    Session.set({
      selectedType: 'all-vs-all',
      selectState: 4
    });

  },
  'click [data-select-animal-vs-all]'(event, instance) {
    Session.set({
      selectedType: 'animal-vs-all',
    });
    _createGame()
  }
});

Template.addPlayers.onCreated(function addPlayersOnCreated() {
  API.speecher.say('Add Players!')
});


Template.addPlayers.events({
  'input input'(event, instance) {
    let inputField = event.currentTarget;

    $(instance
      .find('button'))
      .toggleClass('disabled', inputField.value.length === 0)
  },
  'click [data-enter-name]'(event, instance) {
    if ($(event.currentTarget).hasClass('disabled')) return;
    else {
      const name = instance.find('input').value
      let players = Session.get('addedPlayers') || [];
      API.speecher.say(name);
      players.push(name);

      Session.set({
        'addedPlayers': players
      });

      instance.find('input').value = ''
      $(instance
        .find('button'))
        .addClass('disabled')
    }
  },
  'click [data-done]'(event, instance) {
    _createGame()
  }
});

function acceptVoiceCommand(a) {
    console.log("Got voice command", a);
    if (helper.state2()) {
        document.querySelector(".selectName > input").value = a;
        document.querySelector(".selectName > button").className = "";
        document.querySelector(".selectName > button").click();
        return;
    }

    const c = tryFindCommand(a.toLowerCase(), getCommands());
    if (c) {
        c();
    } else {
        console.log("Unrecognized voice command", a);
        API.recognizer.startListening(acceptVoiceCommand);
    }
}

function getCommands() {
    if (helper.state1()) {
        return {
            "first": () => { 
                console.log("tipsy");
                document.querySelector("[data-name='Tipsy']").click();
            },
            "second": () => { 
                console.log("flipsy");
                document.querySelector("[data-name='Flipsy']").click();
            },
            "third": () => { 
                console.log("MIPSY");
                document.querySelector("[data-name='Mipsy']").click();
            },
        };
    } else if (helper.state2()) {
        return {
            
        }
    }
}
