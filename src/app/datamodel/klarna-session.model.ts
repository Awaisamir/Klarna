/*
 * Copyright (c) Flooid Limited 2020. All rights reserved.
 * This source code is confidential to and the copyright of Flooid Limited ("Flooid"), and must not be
 * (i) copied, shared, reproduced in whole or in part; or
 * (ii) used for any purpose other than the purpose for which it has expressly been provided by Flooid under the terms of a license agreement; or
 * (iii) given or communicated to any third party without the prior written consent of Flooid.
 * Flooid at all times reserves the right to modify the delivery and capabilities of its products and/or services.
 * "Flooid", "FlooidCore", "FlooidCommerce", "Flooid Hub", "PCMS", "Vision", "VISION Commerce Suite", "VISION OnDemand", "VISION eCommerce",
 * "VISION Engaged", "DATAFIT", "PCMS DATAFIT" and "BeanStore" are registered trademarks of Flooid.
 * All other brands and logos (that are not registered and/or unregistered trademarks of Flooid) are registered and/or
 * unregistered trademarks of their respective holders and should be treated as such.
 */

import {OrderLine, OrderLineBuilder} from './klarna-order-line.model';

export class SessionRequest {
  // The purchase country of the customer. The billing country always overrides purchase country if the values are different.
  // Formatted according to ISO 3166 alpha-2 standard, e.g. GB, SE, DE, US, etc.
  purchase_country: string;
  // The purchase currency of the order. Formatted according to ISO 4217 standard, e.g. USD, EUR, SEK, GBP, etc.
  purchase_currency: string;
  // Used to define the language and region of the customer. The locale follows the format of RFC 1766, meaning language-country
  locale: string;
  // Used for storing merchant's internal order number or other reference. If set, will be shown on the confirmation page as "order number"
  // The value is also available in the settlement files. (max 255 characters). Example: "45aa52f387871e3a210645d4"
  merchant_reference1: string;
  // Used for storing merchant's internal order number or other reference. The value is available in the settlement files. (max 255 characters).
  merchant_reference2: string;
  // Total amount of the order including tax and any available discounts. The value should be in non-negative minor units.
  // Eg: 25 Euros should be 2500.
  order_amount: number;
  // Total tax amount of the order. The value should be in non-negative minor units. Eg: 25 Euros should be 2500.
  // required = false
  order_tax_amount: number;
  // The array containing list of line items that are part of this order. Maximum of 1000 line items could be processed in a single order.
  order_lines: Array<OrderLine>;

  constructor(builder) {
    this.purchase_country = builder.purchase_country;
    this.purchase_currency = builder.purchase_currency;
    this.locale = builder.locale;
    this.merchant_reference1 = builder.merchant_reference1;
    this.merchant_reference2 = builder.merchant_reference2;
    this.order_amount = builder.order_amount;
    this.order_tax_amount = builder.order_tax_amount;
    this.order_lines = builder.order_lines;
  }

  validate(): void {
    if (this.purchase_country == null) {
      throw new Error('OrderLine required field purchase_country is invalid');
    }

    if (this.purchase_currency == null) {
      throw new Error('OrderLine required field purchase_currency is invalid');
    }

    if (this.order_amount == null || this.order_amount <= 0) {
      throw new Error('OrderLine required field order_amount is invalid');
    }

    const orderLinesAmount: number = this.order_lines.map(o => o.total_amount).reduce((a, b) => a + b);
    if (this.order_amount !== orderLinesAmount) {
      throw new Error('OrderLine required field order_amount ' + this.order_amount
        + ' must equal the sum of the order lines ' + orderLinesAmount);
    }

    if (this.order_lines == null || this.order_lines.length <= 0 || this.order_lines.length > 1000) {
      throw new Error('OrderLine required field order_lines is invalid');
    }

    this.order_lines.forEach(l => l.validate());
  }
}

export class SessionRequestBuilder {
  purchase_country: string;
  purchase_currency: string;
  locale: string;
  order_amount: number;
  order_tax_amount: number;
  merchant_reference1: string;
  merchant_reference2: string;
  order_lines: Array<OrderLine>;

  constructor() {
    this.order_lines = [];
  }

  static buildSessionRequest(inputJson: any): SessionRequest {
    if (inputJson == null || inputJson === '') {
      return null;
    }
    const sessionRequestBuilder = new SessionRequestBuilder()
      .setPurchase_country(inputJson.purchaseCountry)
      .setPurchase_currency(inputJson.purchaseCurrency)
      .setSessionLocale(inputJson.locale)
      .setOrder_amount(inputJson.orderAmount)
      .setOrder_tax_amount(inputJson.orderTaxAmount)
      .setMerchant_reference1(inputJson.merchantReference1)
      .setMerchant_reference2(inputJson.merchantReference2);

    for (const line of inputJson.orderLines) {
      sessionRequestBuilder.withOrder_line()
        .setName(line.name)
        .setReference(line.reference)
        .setTaxRate(line.taxRate)
        .setTotalTaxAmount(line.totalTaxAmount)
        .setType(line.type)
        .setQuantity(line.quantity)
        .setQuantityUnit(line.quantityUnit)
        .setUnitPrice(line.unitPrice)
        .setTotalAmount(line.totalAmount)
        .setTotalDiscountAmount(line.totalDiscountAmount)
        .build();
    }

    const sessionRequest = sessionRequestBuilder.build();
    console.log('KlarnaSessionService.sendRequest sessionRequest = ' + JSON.stringify(sessionRequest));
    return sessionRequest;
  }

  setPurchase_country(purchase_country): this {
    this.purchase_country = purchase_country;
    return this;
  }

  setPurchase_currency(purchase_currency: string): this {
    this.purchase_currency = purchase_currency;
    return this;
  }

  setSessionLocale(locale): this {
    this.locale = locale;
    return this;
  }

  setOrder_amount(order_amount): this {
    this.order_amount = order_amount;
    return this;
  }

  setOrder_tax_amount(order_tax_amount): this {
    this.order_tax_amount = order_tax_amount;
    return this;
  }

  setMerchant_reference1(merchantReference1: any): this {
    this.merchant_reference1 = merchantReference1;
    return this;
  }

  setMerchant_reference2(merchantReference2: any): this {
    this.merchant_reference2 = merchantReference2;
    return this;
  }

  withOrder_line(): OrderLineBuilder {
    return new OrderLineBuilder(this);
  }

  build(): SessionRequest {
    const sessionRequest = new SessionRequest(this);
    sessionRequest.validate();
    return sessionRequest;
  }
}
