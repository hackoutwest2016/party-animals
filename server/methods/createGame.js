Meteor.methods({
  'createGame': function (game) {
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
