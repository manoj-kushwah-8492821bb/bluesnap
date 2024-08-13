interface AuthCaptureInterface {
  cardTransactionType: String;
  softDescriptor: String;
  amount: Number;
  currency: String;
  cardHolderInfo: {
    firstName: String;
    lastName: String;
    zip: String;
  };
  creditCard: {
    cardNumber: Number;
    securityCode: Number;
    expirationMonth: Number;
    expirationYear: Number;
  };
}

interface AuthOnlyInterface {
  transactionId: Number;
  softDescriptor: String;
  amount: Number;
  usdAmount: Number;
  currency: String;
  transactionApprovalDate: String;
  transactionApprovalTime: String;
  cardHolderInfo: {
    firstName: String;
    lastName: String;
    zip: Number;
  };
  vaultedShopperId: Number;
  creditCard: {
    cardLastFourDigits: Number;
    cardType: String;
    cardSubType: String;
    cardCategory: String;
    binCategory: String;
    binNumber: Number;
    cardRegulated: String;
    expirationMonth: Number;
    expirationYear: Number;
    issuingCountryCode: String;
  };
  processingInfo: {
    processingStatus: String;
    cvvResponseCode: String;
    authorizationCode: Number;
    avsResponseCodeZip: String;
    avsResponseCodeAddress: String;
    avsResponseCodeName: String;
  };
  fraudResultInfo: Object;
  cardTransactionType: String;
}

interface CaptureInterface {
  cardTransactionType: String;
  transactionId: Number;
}

export { AuthCaptureInterface, AuthOnlyInterface, CaptureInterface };
