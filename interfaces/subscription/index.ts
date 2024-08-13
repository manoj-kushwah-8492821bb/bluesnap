interface SubscriptionInterface {
  payerInfo: {
    zip: Number;
    firstName: String;
    lastName: String;
    phone: Number;
  };
  paymentSource: {
    creditCardInfo: {
      creditCard: {
        expirationYear: Number;
        securityCode: Number;
        expirationMonth: Number;
        cardNumber: Number;
      };
    };
  };
}

interface SubscriptionParamsInterface {
  accountId: String;
  planId: String;
}

export { SubscriptionInterface, SubscriptionParamsInterface };
