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

import {Injectable} from '@angular/core';
import {SessionRequest} from '../datamodel/klarna-session.model';
import {WindowRef} from './window.service';
import {AuthenticationError} from '../error/klarna-authentication.error';
import {ServerError} from '../error/klarna-server.error';
import {NetworkError} from '../error/klarna-network.error';
import {PaymentService} from './klarna-payment.service';
import {CancelPaymentService} from './cancel-payment.service';
import {MockKlarnaRefundOrderService} from './mock-klarna-refund-order.service';

@Injectable({providedIn: 'root'})
export class MockKlarnaCreateOrderService {
  constructor(private windowRef: WindowRef, private cancelPaymentService: CancelPaymentService) {
  }
  private serverUrl = 'http:localhost:8082';
  async sendRequest(sessionRequest: SessionRequest): Promise<any> {
    if (this.windowRef.phoneNumber === '07929633556') {
      throw new ServerError(400, 'Server Error');
    }
    else if (this.windowRef.phoneNumber === '07929633557') {
      throw new NetworkError('Request Timeout');
    }
    else if (this.windowRef.phoneNumber === '07929633562') {
      await this.cancelPaymentService.cancelPayment(this.serverUrl, null, 'f52fc7d7-ee28-9c04-8674-8f7b8cdca5d5');
      throw new ServerError(400, 'Server Error');
    }
    else if (this.windowRef.phoneNumber === '07929633563') {
      console.log('MockKlarnaCreateOrderService callbackFunctionSuspendExternalPayment');
      this.windowRef.callbackFunctionSuspendExternalPayment('f52fc7d6-ee28-9c04-8674-8f7b8cdca5d4');
      throw new ServerError(400, 'Server Error');
    }
    else if (this.windowRef.phoneNumber === '07929633564') {
      console.log('MockKlarnaCreateOrderService callbackFunctionSuspendExternalPayment using cancelledPaymentReference');
      this.windowRef.callbackFunctionSuspendExternalPayment('cancelledPaymentReference');
      throw new ServerError(400, 'Server Error');
    } else if (this.windowRef.phoneNumber === '07929633571') {
      return new Promise<Response>((resolve): void => {
        resolve(this.createResponse(MockKlarnaRefundOrderService.KLARNA_REFUND_403_ORDERID));
      });
    } else if (this.windowRef.phoneNumber === '07929633572') {
      return new Promise<Response>((resolve): void => {
        resolve(this.createResponse(MockKlarnaRefundOrderService.KLARNA_REFUND_404_ORDERID));
      });
    }
    else if (this.windowRef.getHppSessionId() === 'cancelledPaymentReference') {
      console.log('MockKlarnaCreateOrderService callbackFunctionAddVoidedExternalPayment using cancelledPaymentReference');
      await this.cancelPaymentService.cancelPayment(this.serverUrl, 'cancelledOrderReference', 'cancelledPaymentReference');
      throw new ServerError(400, 'Server Error');
    }
    return new Promise<Response>((resolve): void => {
      resolve(this.createResponse());
    });
  }

  createResponse(orderId: string = '36a1b431-db01-2ada-9a0f-f53c11851830' ): any {
    const obj = {
      authorized_payment_method: {
        days: 0,
        number_of_installments: 0,
        type: 'invoice'
      },
      fraud_status: 'ACCEPTED',
      order_id: orderId,
      redirect_url: 'https://credit.klarna.com/v1/sessions/0b1d9815-165e-42e2-8867-35bc03789e00/redirect'
    };
    return obj;
  }
}
