Router.route('/', function () {
  this.layout('defaultLayout');
  this.render('splash')
});

Router.route('/subs', function () {
  this.layout('subLayout');
});


Router.route('/create', function () {
  this.layout('defaultLayout');
  this.render('createGame')
});

Router.route('/join', function () {
  this.layout('defaultLayout');
  this.render('joinGame')
});


Router.route('/watch/:id', function () {
  this.layout('defaultLayout');
  this.render('watch')
});


Router.route('/game/:_id', function () {
  let game = Games.findOne({_id: this.params._id});
  if(!game) return;
  this.layout('defaultLayout');
  this.render('playGame', {data: {game: game}});
});


//Opportunities

