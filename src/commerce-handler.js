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
}

var aliasMapping = {
    13: 'ProductCheckoutOption',
    19: 'PromotionClick'
}

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

    var event_data_and_custom_data = {
        currency: event.CurrencyCode,
        mpid: event.MPID,
        affiliation: event.ProductAction.Affiliation,
        coupon: event.ProductAction.CouponCode,
        transaction_id: event.ProductAction.TransactionId,
        shipping: event.ProductAction.ShippingAmount,
        tax: event.ProductAction.TaxAmount,
        revenue: event.ProductAction.TotalAmount,
        ...event.EventAttributes, 
        ...event.UserAttributes
    };

    // Turn ProductList into Branch content_items
    var content_items = event.ProductAction.ProductList.map(value => {
        return {
            $product_brand: value.Brand,
            $product_category: value.Category,
            $coupon_code: value.CouponCode,
            $product_name: value.Name,
            $price: value.Price,
            $quantity: value.Quantity,
            $sku: value.Sku,
            $total_amount: value.TotalAmount,
            $product_variant: value.Variant,
            ...value.Attributes
        };
    })

    // Handle mapping of mParticle to Branch event names
    var customer_event_alias = aliasMapping[event.EventCategory] || '';
    var event_name = eventMapping[event.EventCategory] || event.EventName;

    // Log Branch Commerce event
    branch.logEvent(
        event_name,
        event_data_and_custom_data,
        content_items,
        customer_event_alias,
        callback (err)
    );
};

module.exports = CommerceHandler;
