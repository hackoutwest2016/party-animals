import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Animals } from '/both/collections/Animals.js'
import { Session } from 'meteor/session'


Template.createGame.onCreated(function createGamehOnCreated() {
  Session.set({selectState: 1});
});

function _createGame() {
   Meteor.call('games.create', {
    name: Session.get('selectedName'),
    type: Session.get('selectedType'),
    animal: Session.get('selectedAnimal')
  }, (err, res) => {
    if (err) {
      alert(err)
    } else {
      console.log('sucess!!!')
    }
  });
}

const helper = {
  animals: function () {
    return Animals.find();
  },
  state1: () => {
    return Session.get('selectState') === 1
  },
  state2: () => {
    return Session.get('selectState') === 2
  },
  state3: () => {
    return Session.get('selectState') === 3
  }
}

Template.createGame.helpers(helper);
Template.selectAnimal.helpers(helper)
Template.selectName.helpers(helper)
Template.selectType.helpers(helper)

Template.selectAnimal.events({
  'click [data-select-animal]'(event, instance) {
    const id = event.currentTarget.getAttribute('data-id');

    Session.set({
      selectedAnimal: id,
      selectState: 2
    });
  }
});

Template.selectName.events({
  'input input'(event, instance) {
    let inputField = event.currentTarget;
    console.log(inputField.value)
    $(instance
      .find('button'))
      .toggleClass('disabled', inputField.value.length === 0)
  },
  'click [data-enter-name]'(event, instance) {
    if ($(event.currentTarget).hasClass('disabled')) return;
    else {
      const name = instance.find('input').value
      Session.set({
        selectedName: name,
        selectState: 3
      });
    }
  }
});

Template.selectType.events({
  'click [data-select-all-vs-all]'(event, instance) {
    Session.set({selectedType: 'all-vs-all'});
    _createGame()

  },
  'click [data-select-animal-vs-all]'(event, instance) {
    Session.set({selectedType: 'animal-vs-all'});
    _createGame()
  }
});
