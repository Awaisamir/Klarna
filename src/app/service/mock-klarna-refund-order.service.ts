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

import {Injectable} from '@angular/core';
import {WindowRef} from './window.service';
import {ServerError} from '../error/klarna-server.error';
import {RefundRequest} from '../datamodel/klarna-refund-request';

@Injectable({providedIn: 'root'})
export class MockKlarnaRefundOrderService {
  public static readonly KLARNA_REFUND_403_ORDERID = 'klarnaRefund403';
  public static readonly KLARNA_REFUND_404_ORDERID = 'klarnaRefund404';
  constructor(private windowRef: WindowRef) {
  }

  async sendRequest(refundOrderRequest: RefundRequest): Promise<void> {

    if (refundOrderRequest.order_id === MockKlarnaRefundOrderService.KLARNA_REFUND_403_ORDERID) {
      this.windowRef.callbackFunctionCloseBrowser();
      throw new ServerError(403, 'Refund not allowed');
    }
    if (refundOrderRequest.order_id === MockKlarnaRefundOrderService.KLARNA_REFUND_404_ORDERID) {
      this.windowRef.callbackFunctionCloseBrowser();
      throw new ServerError(404, 'Order not found');
    }
  }
}
