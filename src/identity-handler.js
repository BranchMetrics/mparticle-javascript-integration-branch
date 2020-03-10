function IdentityHandler(common) {
    this.common = common || {};
}

function identified(mParticleUser, identityApiRequest) {
    var mPUser = mParticleUser.getUserIdentities();
    var userId = mPUser.customerid || mPUser.other || mPUser.other2 || mPUser.other3 || mPUser.other4;
    if (typeof userId !== 'undefined') {
        branch.setIdentity(userId);
    }
}

function logout(mParticleUser, identityApiRequest) {
    branch.logout();
}

function setUserIdentity(forwarderSettings, id, type) {
    if (type === 1) { branch.setIdentity(id); }
}

IdentityHandler.prototype.onUserIdentified = identified;
// IdentityHandler.prototype.onIdentifyComplete = identified;
// IdentityHandler.prototype.onLoginComplete = identified;
// IdentityHandler.prototype.onModifyComplete = identified;
IdentityHandler.prototype.onLogoutComplete = logout;
IdentityHandler.prototype.onSetUserIdentity =  setUserIdentity;

module.exports = IdentityHandler;
