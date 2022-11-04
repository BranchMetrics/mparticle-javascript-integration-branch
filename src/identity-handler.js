function IdentityHandler(common) {
    this.common = common || {};
}


function identified(mParticleUser, identityApiRequest) {
    var mPUser = mParticleUser.getUserIdentities().userIdentities;
    var userId = '';

    switch (this.common.settings.userIdentificationType) {
      case ('CustomerId'):
        userId = mPUser.customerid;
        break;
      case ('MPID'):
        userId = mParticleUser.getMPID();
        break;
      case ('Email'):
        userId = mPUser.email;
        break;
      case ('Other'):
        userId = mPUser.other;
        break;
      case ('Other2'):
        userId = mPUser.other2;
        break;
      case ('Other3'):
        userId = mPUser.other3;
        break;
      case ('Other4'):
        userId = mPUser.other4;
        break;
      case ('Other5'):
        userId = mPUser.other5;
        break;
      case ('Other6'):
        userId = mPUser.other6;
        break;
      case ('Other7'):
        userId = mPUser.other7;
        break;
      case ('Other8'):
        userId = mPUser.other8;
        break;
      case ('Other9'):
        userId = mPUser.other9;
        break;
      case ('Other10'):
        userId = mPUser.other10;
        break;
      default:
        userId = mPUser.customerid;
        break;
    }

    if (userId !== '' && typeof userId !== undefined) {
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
