var branchStandardEvents = [
    'START_TRIAL',
    'SUBSCRIBE',
    'SEARCH',
    'VIEW_ITEM',
    'VIEW_ITEMS',
    'RATE',
    'SHARE',
    'COMPLETE_REGISTRATION',
    'COMPLETE_TUTORIAL',
    'ACHIEVE_LEVEL',
    'UNLOCK_ACHIEVEMENT',
    'INVITE',
    'LOGIN'
]

function EventHandler(common) {
    this.common = common || {};
}

EventHandler.prototype.logEvent = function(event) {
    branch.logEvent(
        event.EventName,
        {...event.UserAttributes, ...event.EventAttributes},
        function (err) { console.log(err); }
    );
};

EventHandler.prototype.logError = function(event) {};

EventHandler.prototype.logPageView = function(event) {};

module.exports = EventHandler;
