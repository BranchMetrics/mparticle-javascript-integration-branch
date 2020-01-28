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

/*
A non-ecommerce event has the following schema:

{
    DeviceId: "a80eea1c-57f5-4f84-815e-06fe971b6ef2",
    EventAttributes: {test: "Error", t: 'stack trace in string form'},
    EventName: "Error",
    MPID: "123123123123",
    UserAttributes: {userAttr1: 'value1', userAttr2: 'value2'},
    UserIdentities: [{Identity: 'email@gmail.com', Type: 7}]
    User Identity Types can be found here:
}

*/

function EventHandler(common) {
    this.common = common || {};
}

EventHandler.prototype.logEvent = function(event) {
    // Log a Branch Standard event if it's on the list

    if(branchStandardEvents[event.EventName]) {
        var event_data_and_custom_data = {};

        // Map EventAttributes to Branch event_data
        if(event.EventAttributes) {
            const eventKeys = Object.keys(event.EventAttributes);
            for (const eventkey of eventKeys) {
                event_data_and_custom_data.eventkey = event.EventAttributes.eventkey;
            }
        }

        // Map UserAttributes to Branch custom_data
        if(event.UserAttributes) {
            const userKeys = Object.keys(event.UserAttributes);
            for (const userkey of userKeys) {
                event_data_and_custom_data.userkey = event.UserAttributes.userkey;
            }
        }

        branch.logEvent(
            event.eventName,
            event_data_and_custom_data,
            callback (err)
        );


    } else {
        var custom_data = {};

        // Map EventAttributes to Branch event_data
        if(event.EventAttributes) {
            const eventKeys = Object.keys(event.EventAttributes);
            for (const eventkey of eventKeys) {
                custom_data.eventkey = event.EventAttributes.eventkey;
            }
        }

        // Map UserAttributes to Branch custom_data
        if(event.UserAttributes) {
            const userKeys = Object.keys(event.UserAttributes);
            for (const userkey of userKeys) {
                custom_data.userkey = event.UserAttributes.userkey;
            }
        }

        // Log a Branch custome event
        branch.logEvent(
            event.eventName,
            custom_data,
            callback (err)
        );
    }

};



EventHandler.prototype.logError = function(event) {
    // The schema for a logError event is the same, but noteworthy differences are as follows:
    // {
    //     EventAttributes: {m: 'name of error passed into MP', s: "Error", t: 'stack trace in string form if applicable'},
    //     EventName: "Error"
    // }
};
EventHandler.prototype.logPageView = function(event) {
    /* The schema for a logPagView event is the same, but noteworthy differences are as follows:
        {
            EventAttributes: {hostname: "www.google.com", title: 'Test Page'},  // These are event attributes only if no additional event attributes are explicitly provided to mParticle.logPageView(...)
        }
        */
};

module.exports = EventHandler;
