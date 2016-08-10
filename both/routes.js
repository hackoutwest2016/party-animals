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


//Opportunities

