var BranchMetricsKit = (function (exports) {
    'use strict';

    function Common() {}

    Common.prototype.exampleMethod = function () {
        return 'I am an example';
    };

    var common = Common;

    var eventMapping = {
        10: 'ADD_TO_CART',
        11: 'ProductRemoveFromCart',
        12: 'INITIATE_PURCHASE',
        13: 'INITIATE_PURCHASE',
        14: 'CLICK_AD',
        15: 'VIEW_ITEM',
        16: 'PURCHASE',
        17: 'ProductRefund',
        18: 'VIEW_AD',
        19: 'CLICK_AD',
        20: 'ADD_TO_WISHLIST',
        21: 'ProductRemoveFromWishlist',
        22: 'VIEW_ITEM'
    };

    var aliasMapping = {
        13: 'ProductCheckoutOption',
        19: 'PromotionClick'
    };

    function CommerceHandler(common) {
        this.common = common || {};
    }

    CommerceHandler.prototype.logCommerceEvent = function(event) {
        var event_data_and_custom_data = {
            mpid: event.MPID,
            affiliation: event.ProductAction.Affiliation,
            coupon: event.ProductAction.CouponCode,
            transaction_id: event.ProductAction.TransactionId,
            shipping: event.ProductAction.ShippingAmount,
            tax: event.ProductAction.TaxAmount,
            revenue: event.ProductAction.TotalAmount,
            // currency: event.CurrencyCode ? event.CurrencyCode : null
        };

        for (var eventAttr in event.EventAttributes) {
            if (event.EventAttributes.hasOwnProperty(eventAttr)) {
                event_data_and_custom_data[eventAttr] = event.EventAttributes[eventAttr];
            }
        }

        for (var userAttr in event.UserAttributes) {
            if (event.UserAttributes.hasOwnProperty(userAttr)) {
                event_data_and_custom_data[userAttr] = event.UserAttributes[userAttr];
            }
        }

        if (event.CurrencyCode) {
            event_data_and_custom_data["currency"] = event.CurrencyCode;
        }

        // Turn ProductList into Branch content_items
        var content_items = event.ProductAction.ProductList.map(value => {
            var attrs = {};

            for (var attr in value.Attributes) {
                if (value.Attributes.hasOwnProperty(attr)) {
                    attrs[attr] = value.Attributes[attr];
                }
            }

            return {
                $product_brand: value.Brand,
                $coupon_code: value.CouponCode,
                $product_name: value.Name,
                $price: value.Price,
                $quantity: value.Quantity,
                $sku: value.Sku,
                $total_amount: value.TotalAmount,
                $product_variant: value.Variant,
                attrs
            };
        });

        // Handle mapping of mParticle to Branch event names
        var customer_event_alias = aliasMapping[event.EventCategory] || '';
        var event_name = eventMapping[event.EventCategory] || event.EventName;

        // Log Branch Commerce event
        branch.logEvent(
            event_name,
            event_data_and_custom_data,
            content_items,
            customer_event_alias,
            function (err) { console.log(err); }
        );
    };

    var commerceHandler = CommerceHandler;

    function EventHandler(common) {
        this.common = common || {};
    }

    EventHandler.prototype.logEvent = function(event) {
        var attrs = {};

        for (var eventAttr in event.EventAttributes) {
            if (event.EventAttributes.hasOwnProperty(eventAttr)) {
                attrs[eventAttr] = event.EventAttributes[eventAttr];
            }
        }

        for (var userAttr in event.UserAttributes) {
            if (event.UserAttributes.hasOwnProperty(userAttr)) {
                attrs[userAttr] = event.UserAttributes[userAttr];
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

    var eventHandler = EventHandler;

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

    var identityHandler = IdentityHandler;

    var initialization = {
        name: 'BranchMetrics',
        initForwarder: function(settings, testMode, userAttributes, userIdentities, processEvent, eventQueue, isInitialized, common) {
            common.settings = settings;
            if (!testMode) {
                if (!!window.branch) {
                    return;
                }

                (function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h;}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments]);};},{_q:[],_v:1},"addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking getBrowserFingerprintId crossPlatformIds lastAttributedTouchData".split(" "), 0);
                branch.init(settings.branchKey, function(err, data) {
                });
            }
        }
    };

    var initialization_1 = initialization;

    var sessionHandler = {
        onSessionStart: function(event) {

        },
        onSessionEnd: function(event) {

        }
    };

    var sessionHandler_1 = sessionHandler;

    /*
    The 'mParticleUser' is an object with methods on it to get user Identities and set/get user attributes
    Partners can determine what userIds are available to use in their SDK
    Call mParticleUser.getUserIdentities() to return an object of userIdentities --> { userIdentities: {customerid: '1234', email: 'email@gmail.com'} }
    For more identity types, see http://docs.mparticle.com/developers/sdk/javascript/identity#allowed-identity-types
    Call mParticleUser.getMPID() to get mParticle ID
    For any additional methods, see http://docs.mparticle.com/developers/sdk/javascript/apidocs/classes/mParticle.Identity.getCurrentUser().html
    */

    function UserAttributeHandler(common) {
        this.common = common = {};
    }
    UserAttributeHandler.prototype.onRemoveUserAttribute = function(
        key,
        mParticleUser
    ) {};
    UserAttributeHandler.prototype.onSetUserAttribute = function(
        key,
        value,
        mParticleUser
    ) {};
    UserAttributeHandler.prototype.onConsentStateUpdated = function(
        oldState,
        newState,
        mParticleUser
    ) {};

    var userAttributeHandler = UserAttributeHandler;

    // =============== REACH OUT TO MPARTICLE IF YOU HAVE ANY QUESTIONS ===============
    //
    //  Copyright 2018 mParticle, Inc.
    //
    //  Licensed under the Apache License, Version 2.0 (the "License");
    //  you may not use this file except in compliance with the License.
    //  You may obtain a copy of the License at
    //
    //      http://www.apache.org/licenses/LICENSE-2.0
    //
    //  Unless required by applicable law or agreed to in writing, software
    //  distributed under the License is distributed on an "AS IS" BASIS,
    //  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    //  See the License for the specific language governing permissions and
    //  limitations under the License.









    var name = initialization_1.name,
        moduleId = initialization_1.moduleId,
        MessageType = {
            SessionStart: 1,
            SessionEnd: 2,
            PageView: 3,
            PageEvent: 4,
            CrashReport: 5,
            OptOut: 6,
            Commerce: 16,
            Media: 20,
        };

    var constructor = function() {
        var self = this,
            isInitialized = false,
            forwarderSettings,
            reportingService,
            eventQueue = [];

        self.name = initialization_1.name;
        self.moduleId = initialization_1.moduleId;
        self.common = new common();

        function initForwarder(
            settings,
            service,
            testMode,
            trackerId,
            userAttributes,
            userIdentities
        ) {
            forwarderSettings = settings;

            if (window.mParticle.isTestEnvironment) {
                reportingService = function() {};
            } else {
                reportingService = service;
            }

            try {
                initialization_1.initForwarder(
                    settings,
                    testMode,
                    userAttributes,
                    userIdentities,
                    processEvent,
                    eventQueue,
                    isInitialized,
                    self.common
                );
                self.eventHandler = new eventHandler(self.common);
                self.identityHandler = new identityHandler(self.common);
                self.userAttributeHandler = new userAttributeHandler(self.common);
                self.commerceHandler = new commerceHandler(self.common);

                isInitialized = true;
            } catch (e) {
                console.log('Failed to initialize ' + name + ' - ' + e);
            }
        }

        function processEvent(event) {
            var reportEvent = false;
            if (isInitialized) {
                try {
                    if (event.EventDataType === MessageType.SessionStart) {
                        reportEvent = logSessionStart(event);
                    } else if (event.EventDataType === MessageType.SessionEnd) {
                        reportEvent = logSessionEnd(event);
                    } else if (event.EventDataType === MessageType.CrashReport) {
                        reportEvent = logError(event);
                    } else if (event.EventDataType === MessageType.PageView) {
                        reportEvent = logPageView(event);
                    } else if (event.EventDataType === MessageType.Commerce) {
                        reportEvent = logEcommerceEvent(event);
                    } else if (event.EventDataType === MessageType.PageEvent) {
                        reportEvent = logEvent(event);
                    } else if (event.EventDataType === MessageType.Media) {
                        // Kits should just treat Media Events as generic Events
                        reportEvent = logEvent(event);
                    }
                    if (reportEvent === true && reportingService) {
                        reportingService(self, event);
                        return 'Successfully sent to ' + name;
                    } else {
                        return (
                            'Error logging event or event type not supported on forwarder ' +
                            name
                        );
                    }
                } catch (e) {
                    return 'Failed to send to ' + name + ' ' + e;
                }
            } else {
                eventQueue.push(event);
                return (
                    "Can't send to forwarder " +
                    name +
                    ', not initialized. Event added to queue.'
                );
            }
        }

        function logSessionStart(event) {
            try {
                sessionHandler_1.onSessionStart(event);
                return true;
            } catch (e) {
                return {
                    error: 'Error starting session on forwarder ' + name + '; ' + e,
                };
            }
        }

        function logSessionEnd(event) {
            try {
                sessionHandler_1.onSessionEnd(event);
                return true;
            } catch (e) {
                return {
                    error: 'Error ending session on forwarder ' + name + '; ' + e,
                };
            }
        }

        function logError(event) {
            try {
                self.eventHandler.logError(event);
                return true;
            } catch (e) {
                return {
                    error: 'Error logging error on forwarder ' + name + '; ' + e,
                };
            }
        }

        function logPageView(event) {
            try {
                self.eventHandler.logPageView(event);
                return true;
            } catch (e) {
                return {
                    error:
                        'Error logging page view on forwarder ' + name + '; ' + e,
                };
            }
        }

        function logEvent(event) {
            try {
                self.eventHandler.logEvent(event);
                return true;
            } catch (e) {
                return {
                    error: 'Error logging event on forwarder ' + name + '; ' + e,
                };
            }
        }

        function logEcommerceEvent(event) {
            try {
                self.commerceHandler.logCommerceEvent(event);
                return true;
            } catch (e) {
                return {
                    error:
                        'Error logging purchase event on forwarder ' +
                        name +
                        '; ' +
                        e,
                };
            }
        }

        function setUserAttribute(key, value) {
            if (isInitialized) {
                try {
                    self.userAttributeHandler.onSetUserAttribute(
                        key,
                        value,
                        forwarderSettings
                    );
                    return 'Successfully set user attribute on forwarder ' + name;
                } catch (e) {
                    return (
                        'Error setting user attribute on forwarder ' +
                        name +
                        '; ' +
                        e
                    );
                }
            } else {
                return (
                    "Can't set user attribute on forwarder " +
                    name +
                    ', not initialized'
                );
            }
        }

        function removeUserAttribute(key) {
            if (isInitialized) {
                try {
                    self.userAttributeHandler.onRemoveUserAttribute(
                        key,
                        forwarderSettings
                    );
                    return (
                        'Successfully removed user attribute on forwarder ' + name
                    );
                } catch (e) {
                    return (
                        'Error removing user attribute on forwarder ' +
                        name +
                        '; ' +
                        e
                    );
                }
            } else {
                return (
                    "Can't remove user attribute on forwarder " +
                    name +
                    ', not initialized'
                );
            }
        }

        function setUserIdentity(id, type) {
            if (isInitialized) {
                try {
                    self.identityHandler.onSetUserIdentity(
                        forwarderSettings,
                        id,
                        type
                    );
                    return 'Successfully set user Identity on forwarder ' + name;
                } catch (e) {
                    return (
                        'Error removing user attribute on forwarder ' +
                        name +
                        '; ' +
                        e
                    );
                }
            } else {
                return (
                    "Can't call setUserIdentity on forwarder " +
                    name +
                    ', not initialized'
                );
            }
        }

        function onUserIdentified(user) {
            if (isInitialized) {
                try {
                    self.identityHandler.onUserIdentified(user);

                    return (
                        'Successfully called onUserIdentified on forwarder ' + name
                    );
                } catch (e) {
                    return {
                        error:
                            'Error calling onUserIdentified on forwarder ' +
                            name +
                            '; ' +
                            e,
                    };
                }
            } else {
                return (
                    "Can't set new user identities on forwader  " +
                    name +
                    ', not initialized'
                );
            }
        }

        function onIdentifyComplete(user, filteredIdentityRequest) {
            if (isInitialized) {
                try {
                    self.identityHandler.onIdentifyComplete(
                        user,
                        filteredIdentityRequest
                    );

                    return (
                        'Successfully called onIdentifyComplete on forwarder ' +
                        name
                    );
                } catch (e) {
                    return {
                        error:
                            'Error calling onIdentifyComplete on forwarder ' +
                            name +
                            '; ' +
                            e,
                    };
                }
            } else {
                return (
                    "Can't call onIdentifyCompleted on forwader  " +
                    name +
                    ', not initialized'
                );
            }
        }

        function onLoginComplete(user, filteredIdentityRequest) {
            if (isInitialized) {
                try {
                    self.identityHandler.onLoginComplete(
                        user,
                        filteredIdentityRequest
                    );

                    return (
                        'Successfully called onLoginComplete on forwarder ' + name
                    );
                } catch (e) {
                    return {
                        error:
                            'Error calling onLoginComplete on forwarder ' +
                            name +
                            '; ' +
                            e,
                    };
                }
            } else {
                return (
                    "Can't call onLoginComplete on forwader  " +
                    name +
                    ', not initialized'
                );
            }
        }

        function onLogoutComplete(user, filteredIdentityRequest) {
            if (isInitialized) {
                try {
                    self.identityHandler.onLogoutComplete(
                        user,
                        filteredIdentityRequest
                    );

                    return (
                        'Successfully called onLogoutComplete on forwarder ' + name
                    );
                } catch (e) {
                    return {
                        error:
                            'Error calling onLogoutComplete on forwarder ' +
                            name +
                            '; ' +
                            e,
                    };
                }
            } else {
                return (
                    "Can't call onLogoutComplete on forwader  " +
                    name +
                    ', not initialized'
                );
            }
        }

        function onModifyComplete(user, filteredIdentityRequest) {
            if (isInitialized) {
                try {
                    self.identityHandler.onModifyComplete(
                        user,
                        filteredIdentityRequest
                    );

                    return (
                        'Successfully called onModifyComplete on forwarder ' + name
                    );
                } catch (e) {
                    return {
                        error:
                            'Error calling onModifyComplete on forwarder ' +
                            name +
                            '; ' +
                            e,
                    };
                }
            } else {
                return (
                    "Can't call onModifyComplete on forwader  " +
                    name +
                    ', not initialized'
                );
            }
        }

        function setOptOut(isOptingOutBoolean) {
            if (isInitialized) {
                try {
                    self.initialization.setOptOut(isOptingOutBoolean);

                    return 'Successfully called setOptOut on forwarder ' + name;
                } catch (e) {
                    return {
                        error:
                            'Error calling setOptOut on forwarder ' +
                            name +
                            '; ' +
                            e,
                    };
                }
            } else {
                return (
                    "Can't call setOptOut on forwader  " +
                    name +
                    ', not initialized'
                );
            }
        }

        this.init = initForwarder;
        this.process = processEvent;
        this.setUserAttribute = setUserAttribute;
        this.removeUserAttribute = removeUserAttribute;
        this.onUserIdentified = onUserIdentified;
        this.setUserIdentity = setUserIdentity;
        this.onIdentifyComplete = onIdentifyComplete;
        this.onLoginComplete = onLoginComplete;
        this.onLogoutComplete = onLogoutComplete;
        this.onModifyComplete = onModifyComplete;
        this.setOptOut = setOptOut;
    };

    function getId() {
        return moduleId;
    }

    function isObject(val) {
        return (
            val != null && typeof val === 'object' && Array.isArray(val) === false
        );
    }

    function register(config) {
        if (!config) {
            window.console.log(
                'You must pass a config object to register the kit ' + name
            );
            return;
        }

        if (!isObject(config)) {
            window.console.log(
                "'config' must be an object. You passed in a " + typeof config
            );
            return;
        }

        if (isObject(config.kits)) {
            config.kits[name] = {
                constructor: constructor,
            };
        } else {
            config.kits = {};
            config.kits[name] = {
                constructor: constructor,
            };
        }
        window.console.log(
            'Successfully registered ' + name + ' to your mParticle configuration'
        );
    }

    if (window && window.mParticle && window.mParticle.addForwarder) {
        window.mParticle.addForwarder({
            name: name,
            constructor: constructor,
            getId: getId,
        });
    }

    var webKitWrapper = {
        register: register,
    };
    var webKitWrapper_1 = webKitWrapper.register;

    exports.default = webKitWrapper;
    exports.register = webKitWrapper_1;

    return exports;

}({}));
