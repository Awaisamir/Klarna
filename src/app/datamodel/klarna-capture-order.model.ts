/*
 * Copyright (c) Flooid Limited 2021. All rights reserved.
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

import validate = WebAssembly.validate;
import {OrderLine, OrderLineBuilder} from './klarna-order-line.model';

export class CaptureOrderRequest {

  orderId: string;
  // The capture order amount
  captured_amount: number;
  // Order description
  description: string;
  // Order reference
  reference: string;
  // The array containing list of line items that are part of this order. Maximum of 1000 line items could be processed in a single order.
  order_lines: Array<OrderLine>;

  constructor(builder) {
    this.orderId = builder.orderId;
    this.captured_amount = builder.captured_amount;
    this.description = builder.description;
    this.reference = builder.reference;
    this.order_lines = builder.order_lines;
  }

  validate(): void {
    if (this.orderId == null){
      throw new Error('orderId is invalid');
    }
    if (this.captured_amount == null){
      throw new Error('captured_amount is invalid');
    }

    if (this.order_lines == null || this.order_lines.length <= 0 || this.order_lines.length > 1000) {
      throw new Error('OrderLine required field order_lines is invalid');
    }
    this.order_lines.forEach(l => l.validate());
  }
}

export class CaptureOrderBuilder {
  private orderId: string;
  private captured_amount: number;
  private description: string;
  private reference: string;
  private order_lines: Array<OrderLine>;

  constructor() {
    this.order_lines = [];
  }

  static buildCaptureOrder(orderId: string, inputJson: any): CaptureOrderRequest {
    if (orderId == null || inputJson == null || inputJson === '') {
      return null;
    }

    console.log('Inside CaptureOrderBuilder ' + JSON.stringify(inputJson));

    const captureOrderBuilder = new CaptureOrderBuilder()
      .setOrderId(orderId)
      .setCaptured_amount(inputJson.order_amount)
      .setDescription(inputJson.description)
      .setReference(inputJson.reference);

    for (const line of inputJson.order_lines) {
      captureOrderBuilder.withOrder_line()
        .setReference(line.reference)
        .setType(line.type)
        .setQuantity(line.quantity)
        .setQuantityUnit(line.quantity_unit)
        .setName(line.name)
        .setTotalAmount(line.total_amount)
        .setUnitPrice(line.unit_price)
        .setTotalDiscountAmount(line.total_discount_amount)
        .setTaxRate(line.tax_rate)
        .setTotalTaxAmount(line.total_tax_amount)
        .build();

    }

    const captureOrderRequest = captureOrderBuilder.build();
    console.log('KlarnaSessionService.sendRequest captureOrderRequest = ' + JSON.stringify(captureOrderRequest));
    return captureOrderRequest;
  }

  setOrderId(orderId: string): this {
    this.orderId = orderId;
    return this;
  }

  setCaptured_amount(captured_amount: number): this{
    this.captured_amount = captured_amount;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setReference(reference: string): this {
    this.reference = reference;
    return this;
  }

  setOrder_lines(order_lines: Array<OrderLine>): this {
    this.order_lines = order_lines;
    return this;
  }

  withOrder_line(): OrderLineBuilder {
    return new OrderLineBuilder(this);
  }

  build(): CaptureOrderRequest {
    const captureOrderRequest = new CaptureOrderRequest(this);
    captureOrderRequest.validate();
    return captureOrderRequest;
  }
}
