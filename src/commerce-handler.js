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
    var event_data_and_custom_data = {
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

    !!event.CurrencyCode ? (event_data_and_custom_data["currency"] = event.CurrencyCode) : console.log("");

    // Turn ProductList into Branch content_items
    var content_items = event.ProductAction.ProductList.map(value => {
        return {
            $product_brand: value.Brand,
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
        function (err) { console.log(err); }
    );
};

module.exports = CommerceHandler;
