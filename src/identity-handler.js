/*
The 'mParticleUser' is an object with methods get user Identities and set/get user attributes
Partners can determine what userIds are available to use in their SDK
Call mParticleUser.getUserIdentities() to return an object of userIdentities --> { userIdentities: {customerid: '1234', email: 'email@gmail.com'} }
For more identity types, see http://docs.mparticle.com/developers/sdk/javascript/identity#allowed-identity-types
Call mParticleUser.getMPID() to get mParticle ID
For any additional methods, see http://docs.mparticle.com/developers/sdk/javascript/apidocs/classes/mParticle.Identity.getCurrentUser().html
*/

/*
identityApiRequest has the schema:
{
  userIdentities: {
    customerid: '123',
    email: 'abc'
  }
}
For more userIdentity types, see http://docs.mparticle.com/developers/sdk/javascript/identity#allowed-identity-types
*/

function IdentityHandler(common) {
    this.common = common || {};
}
IdentityHandler.prototype.onUserIdentified = function(mParticleUser) {
    branch.setIdentity(mParticleUser.getUserIdentities().);
};


IdentityHandler.prototype.onIdentifyComplete = function(
    mParticleUser,
    identityApiRequest
) {
    branch.setIdentity(identityApiRequest.customerid);
};

IdentityHandler.prototype.onLoginComplete = function(
    mParticleUser,
    identityApiRequest
) {
    branch.setIdentity(identityApiRequest.customerid);
};

IdentityHandler.prototype.onLogoutComplete = function(
    mParticleUser,
    identityApiRequest
) {
    branch.logout();
};

IdentityHandler.prototype.onModifyComplete = function(
    mParticleUser,
    identityApiRequest
) {
    branch.setIdentity(identityApiRequest.customerid);
};

IdentityHandler.prototype.onSetUserIdentity = function(
    forwarderSettings,
    id,
    type
) {
    branch.setIdentity(id);
};

module.exports = IdentityHandler;
