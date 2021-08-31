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

import {WindowRef} from './window.service';
import {SessionRequest} from '../datamodel/klarna-session.model';
import {ServerError} from '../error/klarna-server.error';
import {Injectable} from '@angular/core';
import {CaptureOrderRequest} from '../datamodel/klarna-capture-order.model';
import {CancelPaymentService} from './cancel-payment.service';
import {MockKlarnaRefundOrderService} from './mock-klarna-refund-order.service';

@Injectable({providedIn: 'root'})
export class MockKlarnaCaptureOrderService {
  constructor(private windowRef: WindowRef, private cancelPaymentService: CancelPaymentService) {
  }
  private serverUrl = 'http:localhost:8082';
  async sendRequest(captureOrderRequest: CaptureOrderRequest): Promise<void> {
    if (this.windowRef.phoneNumber === '07929633565') {
      throw new ServerError(403, 'Capture not allowed');
    }
    if (this.windowRef.phoneNumber === '07929633566') {
      throw new ServerError(404, 'No such order');
    }
    if (this.windowRef.phoneNumber === '07929633568') {
      await this.cancelPaymentService.cancelPayment(this.serverUrl, '36a1b431-db01-2ada-9a0f-f53c11851830',
        'f52fc7d7-ee28-9c04-8674-8f7b8cdca5d5');
      throw new ServerError(404, 'No such order');
    }
    if (this.windowRef.phoneNumber === '07929633569') {
      this.windowRef.getCallback().addExternalPayment({
        order_id: MockKlarnaRefundOrderService.KLARNA_REFUND_403_ORDERID
      });
    }
    if (this.windowRef.phoneNumber === '07929633570') {
      this.windowRef.getCallback().addExternalPayment({
        order_id: MockKlarnaRefundOrderService.KLARNA_REFUND_404_ORDERID
      });
    }
  }
}
