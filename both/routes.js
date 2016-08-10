Router.route('/', function () {
  this.layout('defaultLayout');
  this.render('splash')
});

Router.route('/subs', function () {
  this.layout('defaultLayout');
  this.render('subs')
});


Router.route('/create', function () {
  this.layout('defaultLayout');
  this.render('createGame')
});

Router.route('/join', function () {
  this.layout('defaultLayout');
  this.render('joinGame')
});


Router.route('/watch/:_id', function () {
  let game = Games.findOne({_id: this.params._id});
  if(!game) return;
  this.layout('defaultLayout');
  this.render('watchGame', {data: {game: game}});
});

Router.route('/game/:_id', function () {
  let game = Games.findOne({_id: this.params._id});
  if(!game) return;
  this.layout('defaultLayout');
  this.render('playGame', {data: {game: game}});
});
