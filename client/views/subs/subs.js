import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.subs.onCreated(function speechOnCreated() {
  this.subs = new ReactiveVar([]);
  startTranscript();
});

Template.subs.helpers({
    currentSubs() {
        return Template.instance().subs.get();
    }
});
