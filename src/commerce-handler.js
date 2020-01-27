var branchCommerceEvents = [
    'ADD_TO_CART',
    'ADD_TO_WISHLIST',
    'VIEW_CART',
    'INITIATE_PURCHASE',
    'ADD_PAYMENT_INFO',
    'CLICK_AD',
    'PURCHASE',
    'SPEND_CREDITS',
    'VIEW_AD']

function CommerceHandler(common) {
    this.common = common || {};
}

CommerceHandler.prototype.logCommerceEvent = function(event) {
    /*
        Sample ecommerce event schema:
        {
            CurrencyCode: 'USD',
            DeviceId:'a80eea1c-57f5-4f84-815e-06fe971b6ef2', // MP generated
            EventAttributes: { key1: 'value1', key2: 'value2' },
            EventType: 16,
            EventCategory: 10, // (This is an add product to cart event, see below for additional ecommerce EventCategories)
            EventName: "eCommerce - AddToCart",
            MPID: "8278431810143183490",
            ProductAction: {
                Affiliation: 'aff1',
                CouponCode: 'coupon',
                ProductActionType: 7,
                ProductList: [
                    {
                        Attributes: { prodKey1: 'prodValue1', prodKey2: 'prodValue2' },
                        Brand: 'Apple',
                        Category: 'phones',
                        CouponCode: 'coupon1',
                        Name: 'iPhone',
                        Price: '600',
                        Quantity: 2,
                        Sku: "SKU123",
                        TotalAmount: 1200,
                        Variant: '64GB'
                    }
                ],
                TransactionId: "tid1",
                ShippingAmount: 10,
                TaxAmount: 5,
                TotalAmount: 1215,
            },
            UserAttributes: { userKey1: 'userValue1', userKey2: 'userValue2' }
            UserIdentities: [
                {
                    Identity: 'test@gmail.com', Type: 7
                }
            ]
        }

        If your SDK has specific ways to log different eCommerce events, see below for
        mParticle's additional ecommerce EventCategory types:

            10: ProductAddToCart, (as shown above)
            11: ProductRemoveFromCart,
            12: ProductCheckout,
            13: ProductCheckoutOption,
            14: ProductClick,
            15: ProductViewDetail,
            16: ProductPurchase,
            17: ProductRefund,
            18: PromotionView,
            19: PromotionClick,
            20: ProductAddToWishlist,
            21: ProductRemoveFromWishlist,
            22: ProductImpression
        */

    if(branchCommerceEvents[event.EventName]) { // Log a Standard event
        var event_data_and_custom_data = {};

        // Top-level event stuff
        event_data_and_custom_data.currency = event.CurrencyCode;
        event_data_and_custom_data.mpid = event.MPID;


        // ProductActions stuff
        event_data_and_custom_data.affiliation = event.ProductAction.Affiliation;
        event_data_and_custom_data.coupon = event.ProductAction.CouponCode;
        event_data_and_custom_data.transaction_id = event.ProductAction.TransactionId;
        event_data_and_custom_data.shipping = event.ProductAction.ShippingAmount;
        event_data_and_custom_data.tax = event.ProductAction.TaxAmount;
        event_data_and_custom_data.revenue = event.ProductAction.TotalAmount;


        // Account for EventAttributes --> EventData
        if(event.EventAttributes) {
            const eventKeys = Object.keys(event.EventAttributes);
            for (const eventkey of eventKeys) {
                event_data_and_custom_data.eventkey = event.EventAttributes.eventkey;
            }
        }

        // Account for UserAttributes --> CustomData
        if(event.UserAttributes) {
            const userKeys = Object.keys(event.UserAttributes);
            for (const userkey of userKeys) {
                event_data_and_custom_data.userkey = event.UserAttributes.userkey;
            }
        }

        // Account for Content Items
        if(event.ProductAction.ProductList) {
            content_items = [];
            for (var i = 0; i < event.ProductAction.ProductList.length; i++) {
                var temp_obj = {};
                temp_obj.$product_brand = event.ProductAction.ProductList[i].Brand;
                temp_obj.$product_category = event.ProductAction.ProductList[i].Category;
                temp_obj.$coupon_code = event.ProductAction.ProductList[i].CouponCode;
                temp_obj.$product_name = event.ProductAction.ProductList[i].Name;
                temp_obj.$price = event.ProductAction.ProductList[i].Price;
                temp_obj.$quantity = event.ProductAction.ProductList[i].Quantity;
                temp_obj.$sku = event.ProductAction.ProductList[i].Sku;
                temp_obj.$total_amount = event.ProductAction.ProductList[i].TotalAmount;
                temp_obj.$product_variant = event.ProductAction.ProductList[i].Variant;

                var keys = Object.keys(event.ProductAction.ProductList[i].Attributes);
                for (var key of keys) {
                    temp_obj.key = event.ProductAction.ProductList[i].Attributes.key
                }
                content_items.push(temp_obj);
            }
        }

        // Handle event naming
        var event_name = '';
        switch() {
            case 10:
                event_name = 'ADD_TO_CART';
                break;
            case 11:
                event_name = 'ProductRemoveFromCart,';
                break;
            case 12:
                event_name = 'INITIATE_PURCHASE';
                break;
            case 13:
                event_name = 'INITIATE_PURCHASE';
                var customer_event_alias = 'ProductCheckoutOption';
                break;
            case 14:
                event_name = 'CLICK_AD';
                break;
            case 15:
                event_name = 'VIEW_ITEM';
                break;
            case 16:
                event_name = 'PURCHASE';
                break;
            case 17:
                event_name = 'ProductRefund';
                break;
            case 18:
                event_name = 'VIEW_AD';
                break;
            case 19:
                event_name = 'CLICK_AD';
                var customer_event_alias = 'PromotionClick';
                break;
            case 20:
                event_name = 'ADD_TO_WISHLIST';
                break;
            case 21:
                event_name = 'ProductRemoveFromWishlist';
                break;
            case 22:
                event_name = 'VIEW_ITEM';
                break;
            default:
                event_name = event.EventName;
        }
    }

        branch.logEvent(
            event_name,
            event_data_and_custom_data,
            content_items,
            customer_event_alias,
            callback (err)
        );
    };

module.exports = CommerceHandler;
