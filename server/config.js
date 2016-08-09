import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

if (!Meteor.settings.spotify) {
  console.warn('Could not find client ID and secret in settings, not setting up Spotify auth.');
  return
}
console.log(Meteor.settings)
const {clientId, secret} = Meteor.settings.spotify


ServiceConfiguration.configurations.update(
  { service: 'spotify' }, {
    $set: { clientId, secret, loginStyle: 'redirect' }
  },
  { upsert: true }
)
