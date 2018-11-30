/*
The 'mParticleUser' is an object with methods on it to get user Identities and set/get user attributes
Partners can determine what userIds are available to use in their SDK
Call mParticleUser.getUserIdentities() to return an object of userIdentities --> { userIdentities: {customerid: '1234', email: 'email@gmail.com'} }
For more identity types, see http://docs.mparticle.com/developers/sdk/javascript/identity#allowed-identity-types
Call mParticleUser.getMPID() to get mParticle ID
For any additional methods, see http://docs.mparticle.com/developers/sdk/javascript/apidocs/classes/mParticle.Identity.getCurrentUser().html
*/

var identityHandler = {
    onRemoveUserAttribute: function(key, mParticleUser) {

    },
    onSetUserAttribute: function(key, value, mParticleUser) {

    },
    onConsentStateUpdated: function(oldState, newState, mParticleUser) {

    }
};

module.exports = identityHandler;
