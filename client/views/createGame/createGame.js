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
   Session.set("selectState", 5);
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
      API.speecher.say("Put the phone in the animal now. The game starts in ten - 9 - 8 - 7 - 6 - 5 - 4 - 3 - 2 - 1 - NOW",false, () => {
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
  },
  state5: () => {
    return Session.get('selectState') === 5
  }
}

Template.createGame.helpers(helper);
Template.selectAnimal.helpers(helper)
Template.selectName.helpers(helper)
Template.selectType.helpers(helper)
Template.addPlayers.helpers(helper)
Template.selectAnimal.onCreated(function selectAnimalOnCreated() {
  API.speecher.say('Which piximal do you want to play with? Tipsy, Flipsy or - Mipsy?', false, () => {
    API.recognizer.startListening(acceptVoiceCommand);
  })
});

Template.selectAnimal.events({
  'click [data-select-animal]'(event, instance) {
    const id = event.currentTarget.getAttribute('data-id');
    const name = event.currentTarget.getAttribute('data-name');

    API.speecher.say('yeaaay! - ' + name + ' rocks!')

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
  API.speecher.say('what is your name?', false , () => {
    API.recognizer.startListening(acceptVoiceCommand);
  })

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
  API.speecher.say('what game do you want to play??', false, () => {
    API.recognizer.startListening(acceptVoiceCommand);
  })
});

Template.selectType.onDestroyed(function selectNameOnDestroyed() {
  API.recognizer.stopListening();
});

Template.selectType.events({
  'click [data-select-all-vs-all]'(event, instance) {
    API.speecher.say('yeay, party play!');

    Session.set({
      selectedType: 'all-vs-all',
      selectState: 4
    });

  },
  'click [data-select-animal-vs-all]'(event, instance) {
    API.speecher.say('all versus me.');
    Session.set({
      selectedType: 'animal-vs-all',
    });
    _createGame()
  }
});

Template.addPlayers.onCreated(function addPlayersOnCreated() {
  API.speecher.say('Who do you want to play with?', false, () => {
    API.recognizer.startListening(acceptVoiceCommand, () => {
      API.recognizer.startListening(acceptVoiceCommand, () => {
        API.recognizer.startListening(acceptVoiceCommand);
      })
    });
  })
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

    if (helper.state4()) {
        if(a === 'done') {
          document.querySelector("[data-done]").click();
          return;
        }
        else {
          document.querySelector(".addPlayers > input").value = a;
          document.querySelector("[data-enter-name]").className = "";
          document.querySelector("[data-done]").className = "";
          document.querySelector("[data-enter-name]").click();
          return;
        }

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
            "tipsy": () => {
                console.log("tipsy");
                document.querySelector("[data-name='tipsy']").click();
            },
            "flipsy": () => {
                console.log("flipsy");
                document.querySelector("[data-name='flipsy']").click();
            },
            "mipsy": () => {
                console.log("MIPSY");
                document.querySelector("[data-name='mipsy']").click();
            },
        };
    } else if (helper.state2()) {
        return {

        }
    } else if (helper.state3()) {
        return {
          "all vs. all": () => {
              console.log('all vs all')
              document.querySelector("[data-select-all-vs-all").click();
          },
          "Piximal vs all": () => {
              console.log("flipsy");
              document.querySelector("data-select-animal-vs-all").click();
          }
        };
    }
}
