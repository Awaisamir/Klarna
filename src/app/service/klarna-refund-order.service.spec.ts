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

import {KlarnaRefundOrderService} from './klarna-refund-order.service';
import {TestBed} from '@angular/core/testing';
import {KlarnaRemoteSend} from './klarna-remote.send';
import {RefundRequest, RefundRequestBuilder} from '../datamodel/klarna-refund-request';
import {WindowRef} from './window.service';

describe('KlarnaRefundOrderService', () => {
  let fixture: KlarnaRefundOrderFixture;

  beforeAll(() => {
    fixture = new KlarnaRefundOrderFixture();
  });

  describe('sendRefundRequest', () => {
    it('Should send a refund request and recieve a 2xx status code indicating the refund was successful', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenRefundRequestIsCalled();
      fixture.thenExpectOrderToHaveBeenCalledWith();
    });
  });
});
class KlarnaRefundOrderFixture {
  refundOrderService: KlarnaRefundOrderService;
  windowRef: any = {
    validate(): void {
    },
    callbackFunctionAddExternalPayment(orderResponse: any): void{}
  };
  REFUND_REQUEST_JSON = {
    orderAmount : 5,
    description: 'empty',
    orderLines: [
      {
        name: 'Sony PS4',
        quantity: 1,
        quantityUnit: 'each',
        unitPrice: 80,
        totalAmount: 80
      },
      {
        name: 'Sony PS5',
        quantity: 1,
        quantityUnit: 'each',
        unitPrice: 100,
        totalAmount: 100
      }
    ]
  };
  remoteSend: any = {
    sendPostRequest: async () => {
      return new Promise<Response>((resolve): void => {
        resolve(this.createResponse());
      });
    }
  };

  when;

  private createResponse(): Response{
    const responseInit: ResponseInit = {status: 201, statusText: 'OK'};
    return new Response(null, responseInit);
  }

  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        KlarnaRefundOrderService,
        {provide: KlarnaRemoteSend, useValue: this.remoteSend},
        {provide: WindowRef, useValue: this.windowRef}
      ]
    });
    this.refundOrderService = TestBed.inject(KlarnaRefundOrderService);
    spyOn(this.remoteSend, 'sendPostRequest').and.callThrough();
  }

  async whenRefundRequestIsCalled(): Promise<void> {
    const refundRequest: RefundRequest = RefundRequestBuilder.buildRefundRequest(
      'order_id',
      this.REFUND_REQUEST_JSON
    );
    const serverUrl = 'http:localhost:8082';
    await this.refundOrderService.createRefundRequestAsync(serverUrl, refundRequest);
  }

  thenExpectOrderToHaveBeenCalledWith(): void {
    expect(this.remoteSend.sendPostRequest).toHaveBeenCalledWith(
      'http:localhost:8082/ordermanagement/v1/orders/order_id/refunds/',
      '{"order_id":"order_id","refunded_amount":5,"order_lines":[{"name":"Sony PS4","quantity":1,"quantity_unit":"each","unit_price":80,"total_amount":80},{"name":"Sony PS5","quantity":1,"quantity_unit":"each","unit_price":100,"total_amount":100}]}', jasmine.any(String)
    );
  }
}
