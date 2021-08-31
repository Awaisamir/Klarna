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

import {OrderLine, OrderLineBuilder} from './klarna-order-line.model';

export class RefundRequest {

  order_id: string;
  // Capture the refunded amount
  refunded_amount: number;
  // Order Reference
  reference: string;
  // Refund OrderLines
  order_lines: Array<OrderLine>;

  constructor(builder) {
    this.order_id = builder.orderId;
    this.refunded_amount = builder.refunded_amount;
    this.reference = builder.reference;
    this.order_lines = builder.order_lines;
  }

  validate(): void {
    if (this.order_id == null) {
      throw new Error('orderId is invalid');
    }
    if (this.refunded_amount == null){
      throw new Error('refunded_amount is invalid');
    }
    if (this.order_lines == null || this.order_lines.length <= 0 || this.order_lines.length > 1000) {
      throw new Error('OrderLine required field order_lines is invalid');
    }
    this.order_lines.forEach(l => l.validate());
  }
}
export class RefundRequestBuilder {
  private orderId: string;
  private refunded_amount: number;
  private reference: string;
  private order_lines: Array<OrderLine>;

  constructor() {
    this.order_lines = [];
  }

  static buildRefundRequest(orderId: string, inputJson: any): RefundRequest {
    if (orderId == null || inputJson == null || inputJson === ''){
      return null;
    }
    console.log(`Building a Refund Request with OrderID: ${orderId} and data: ${JSON.stringify(inputJson)}`);
    const refundRequestBuilder = new RefundRequestBuilder()
      .setOrderId(orderId)
      .setRefundedAmount(Math.abs(inputJson.orderAmount))
      .setReference(inputJson.reference);
    for (const line of inputJson.orderLines) {
      refundRequestBuilder.withOrder_line()
        .setReference(line.reference)
        .setType(line.type)
        .setQuantity(line.quantity)
        .setQuantityUnit(line.quantityUnit)
        .setName(line.name)
        .setTotalAmount(line.totalAmount)
        .setUnitPrice(line.unitPrice)
        .setTotalDiscountAmount(line.totalDiscountAmount)
        .setTaxRate(line.taxRate)
        .setTotalTaxAmount(line.totalTaxAmount)
        .build();
    }
    return refundRequestBuilder.build();
  }

  setOrderId(orderId: string): this {
    this.orderId = orderId;
    return this;
  }

  setRefundedAmount(refunded_amount: number): this{
    this.refunded_amount = refunded_amount;
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

  build(): RefundRequest {
    const refundRequest = new RefundRequest(this);
    refundRequest.validate();
    return refundRequest;
  }

}
