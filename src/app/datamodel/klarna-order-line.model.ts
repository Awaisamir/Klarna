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

import {SessionRequestBuilder} from './klarna-session.model';

export class OrderLine {
  /**
   * Type of the order line item. The possible values are: physical discount shipping_fee sales_tax digital gift_card store_credit surcharge
   * required = false
   */
  type: string;
  /**
   * Client facing article number, SKU or similar. Max length is 64 characters.
   * required = false
   */
  reference: any;
  /**
   * Descriptive name of the order line item.
   */
  name: any;
  /**
   * Quantity of the order line item. Must be a non-negative number.
   */
  quantity: any;
  /**
   * Unit used to describe the quantity, e.g. kg, pcs, etc. If defined the value has to be 1-8 characters.
   * required = false
   */
  quantity_unit: any;
  /**
   * Price for a single unit of the order line. Non-negative minor units. Includes tax, excludes discount. (max value: 100000000)
   */
  unit_price: any;

  /**
   * Tax rate of the order line. Non-negative value. The percentage value is represented with two implicit decimals. I.e 1900 = 19%.
   * required = false
   */
  tax_rate: any;
  /**
   * Total amount of the order line. Must be defined as non-negative minor units. Includes tax and discount.
   * Eg: 2500=25 euros Value = (quantity x unit_price) - total_discount_amount. (max value: 100000000)
   */
  total_amount: any;
  /**
   * Total discount amount of the order line. Non-negative minor units. Includes tax. Eg: 500=5 euros
   * @private
   */
  total_discount_amount: any;
  /**
   * Total tax amount of the order line. Must be within ±1 of total_amount - total_amount 10000 / (10000 + tax_rate).
   * Negative when type is discount.
   * required = false
   */
  total_tax_amount: any;
  /**
   * URL to the product in the merchant’s webshop that can be later used in communications between Klarna and the customer.
   * (max 1024 characters)
   * required = false
   */
  product_url: any;
  /**
   * URL to an image that can be later embedded in communications between Klarna and the customer. (max 1024 characters)
   * required = false
   */
  image_url: any;

  constructor(builder) {
    this.type = builder.type;
    this.reference = builder.reference;
    this.name = builder.name;
    this.quantity = builder.quantity;
    this.quantity_unit = builder.quantity_unit;
    this.unit_price = builder.unit_price;
    this.tax_rate = builder.tax_rate;
    this.total_amount = builder.total_amount;
    this.total_discount_amount = builder.total_discount_amount;
    this.total_tax_amount = builder.total_tax_amount;
    this.product_url = builder.product_url;
    this.image_url = builder.image_url;
  }

  validate(): boolean {
    if (this.name == null) {
      throw new Error('OrderLine required field name is invalid');
    }

    if (this.quantity == null || this.quantity <= 0) {
      throw new Error('OrderLine required field quantity is invalid');
    }

    if (this.unit_price <= 0 || this.unit_price > 100000000) {
      throw new Error('OrderLine required field unit_price is invalid');
    }

    if (this.total_amount <= 0 || this.total_amount > 100000000) {
      throw new Error('OrderLine required field total_amount is invalid');
    }

    return true;
  }
}


export class OrderLineBuilder {
  type: string;
  reference: any;
  name: any;
  quantity: any;
  quantity_unit: any;
  unit_price: any;
  tax_rate: any;
  total_amount: any;
  total_discount_amount: any;
  total_tax_amount: any;
  product_url: any;
  image_url: any;
  sessionRequestBuilder: SessionRequestBuilder;

  constructor(sessionRequestBuilder) {
    this.sessionRequestBuilder = sessionRequestBuilder;
  }

  setType(type): this {
    this.type = type;
    return this;
  }

  setReference(reference): this {
    this.reference = reference;
    return this;
  }

  setName(name): this {
    this.name = name;
    return this;
  }

  setQuantity(quantity): this {
    this.quantity = quantity;
    return this;
  }

  setQuantityUnit(quantity_unit): this {
    this.quantity_unit = quantity_unit;
    return this;
  }

  setUnitPrice(unit_price): this {
    this.unit_price = unit_price;
    return this;
  }

  setTaxRate(tax_rate): this {
    this.tax_rate = tax_rate;
    return this;
  }

  setTotalAmount(total_amount): this {
    this.total_amount = total_amount;
    return this;
  }

  setTotalDiscountAmount(total_discount_amount: any): this {
    this.total_discount_amount = total_discount_amount;
    return this;
  }

  setTotalTaxAmount(total_tax_amount): this {
    this.total_tax_amount = total_tax_amount;
    return this;
  }

  setProductUrl(product_url): this {
    this.product_url = product_url;
    return this;
  }

  setImageUrl(image_url): this {
    this.image_url = image_url;
    return this;
  }

  build(): SessionRequestBuilder {
    const orderLine = new OrderLine(this);
    orderLine.validate();
    this.sessionRequestBuilder.order_lines.push(orderLine);
    return this.sessionRequestBuilder;
  }

  buildOrderLine(): OrderLine {
    const orderLine = new OrderLine(this);
    orderLine.validate();
    return orderLine;
  }
}
