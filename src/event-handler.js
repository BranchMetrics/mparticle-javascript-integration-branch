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
    var attrs = {};

    for (var eventAttr in event.EventAttributes) {
        if (event.EventAttributes.hasOwnProperty(eventAttr)) {
            attrs[eventAttr] = event.EventAttributes[eventAttr]
        }
    }

    for (var userAttr in event.UserAttributes) {
        if (event.UserAttributes.hasOwnProperty(userAttr)) {
            attrs[userAttr] = event.UserAttributes[userAttr]
        }
    }

    branch.logEvent(
        event.EventName,
        attrs,
        function (err) { console.log(err); }
    );
};

EventHandler.prototype.logError = function(event) {};

EventHandler.prototype.logPageView = function(event) {};

module.exports = EventHandler;
