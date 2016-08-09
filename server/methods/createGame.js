import { Questions } from '../../both/collections/Questions.js'
import { Games } from '../../both/collections/Games.js'

function getQuestions(game, numberOfQuestions) {
  return Questions.aggregate({ $sample: { size: numberOfQuestions } })
}

Meteor.methods({
  'createGame': function (game) {
    game.questions = getQuestions(game, 10).map((q) => {
      return q._id;
    })

    Games.simpleSchema().clean(game, {
      extendAutoValueContext: {
        isInsert: true,
        isUpdate: false,
        isUpsert: false,
        isFromTrustedCode: false
      }
    });

    check(game, Games.simpleSchema());
    Games.insert(game);
  }
});
