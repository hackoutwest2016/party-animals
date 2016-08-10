import { Questions } from '../../both/collections/Questions.js'
import { Animals } from '../../both/collections/Animals.js'
import { Games } from '../../both/collections/Games.js'
import { Players } from '../../both/collections/Players.js'
import { check } from 'meteor/check'

function getQuestions(numberOfQuestions) {
  return Questions.aggregate({ $sample: { size: numberOfQuestions } })
}

Meteor.methods({
  'games.create'({ name, type, animal, players }) {
    let game = {
      name: name,
      type: type,
      animal: animal,
      players: players || [],
      questions: [],
      currentQuestion: 0
    }
    console.log(game);

    game.questions = getQuestions(10).map((q) => {
      return q._id;
    })

    game.players.push(name);

    let tempPlayers = game.players.map((name) => {
      return Players.insert({name: name})
    })

    game.players = tempPlayers;

    Games.simpleSchema().clean(game, {
      extendAutoValueContext: {
        isInsert: true,
        isUpdate: false,
        isUpsert: false,
        isFromTrustedCode: false
      }
    });

    check(game, Games.simpleSchema());
    return Games.insert(game);
  }
});
