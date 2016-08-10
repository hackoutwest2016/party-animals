import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Logs } from '/both/collections/Logs.js'

Template.subs.onCreated(function speechOnCreated() {

});


Template.subs.helpers({
  currentSubs: function() {
    return Logs.find({'createdAt': {
        $gt: new Date(new Date().getTime() - 6000)
      }}, {sort: {createdAt: -1}, limit: 5});
  }
});
