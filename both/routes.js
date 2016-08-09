Router.route('/', function () {
  this.layout('homeLayout');
});

Router.route('/subs', function () {
  this.layout('subLayout');
});


Router.route('/create', function () {
  this.layout('defaultLayout');
  this.render('createGame')
});


Router.route('/watch/:id', function () {
  this.layout('defaultLayout');
  this.render('watch')
});


//Opportunities

