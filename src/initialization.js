var initialization = {
    name: 'Branch',
    initForwarder: function(settings, testMode, userAttributes, userIdentities, processEvent, eventQueue, isInitialized) {
        if (!!window.branch) {
            return;
        }

        var branchScript = document.createElement('script');
        branchScript.type = 'text/javascript';
        branchScript.async = true;
        branchScript.src = 'https://cdn.branch.io/branch-latest.min.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(branchScript);
        branchScript.onload = function(){
            (function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments])}},{_q:[],_v:1},"addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking getBrowserFingerprintId crossPlatformIds lastAttributedTouchData".split(" "), 0);
            // use the test key if testMode
            var key = testMode ? settings.testKey : settings.liveKey;
            branch.init(key, function(err, data) {
            // callback to handle err or data
                isInitialized = true;
                branch.logEvent("Test");
            });
        }
    }
};

module.exports = initialization;
