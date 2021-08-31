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

import {TestBed} from '@angular/core/testing';
import {KlarnaCaptureOrderService} from './klarna-capture-order.service';
import {KlarnaRemoteSend} from './klarna-remote.send';
import {CaptureOrderBuilder, CaptureOrderRequest} from '../datamodel/klarna-capture-order.model';
import {WindowRef} from './window.service';


describe('KlarnaCaptureOrderService', () => {
  let fixture: KlarnaCaptureOrderFixture;

  beforeAll(() => {
    fixture = new KlarnaCaptureOrderFixture();
  });

  describe('sendSuccessfulRequest', () => {
    it('should send a request and receive a 201 status code indicating a successful capture', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenCaptureRequestIsCalled();
      fixture.thenExpectCaptureOrderToHaveBeenCalledWith();
    });
  });
});

class KlarnaCaptureOrderFixture {
  captureOrderService: KlarnaCaptureOrderService;
  windowRef: any = {
    validate(): void {
    },
    getMaxTries(): number {
      return 1;
    },
    getWaitTimeBetweenRetries(): number {
      return 1;
    }
  };
  public CAPTURE_ORDER_REQUEST = {
    order_amount: 180,
    description: 'string',
    reference: 'string',
    order_lines: [
      {
        name: 'Sony PS4',
        quantity: 1,
        quantity_unit: 'each',
        unit_price: 80,
        total_amount: 80
      },
      {
        name: 'Sony PS5',
        quantity: 1,
        quantity_unit: 'each',
        unit_price: 100,
        total_amount: 100
      }
    ]
  };
  public CAPTURE_ORDER_RESPONSE_SUCCESS = {};
  remoteSend: any = this.createRemoteSendWithResponse(this.createSuccessfulResponse());

  private createRemoteSendWithResponse(response: Response): any {
    return {
      sendPostRequest: async () => {
        return new Promise<Response>((resolve): void => {
          resolve(response);
        });
      }
    };
  }

  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        KlarnaCaptureOrderService,
        {provide: KlarnaRemoteSend, useValue: this.remoteSend},
        {provide: WindowRef, useValue: this.windowRef}
      ]
    });
    this.captureOrderService = TestBed.inject(KlarnaCaptureOrderService);
    spyOn(this.remoteSend, 'sendPostRequest').and.callThrough();
  }

  createSuccessfulResponse(): Response {
    const blob = new Blob([JSON.stringify(this.CAPTURE_ORDER_RESPONSE_SUCCESS, null, 2)], {type: 'application/json'});
    const responseInit: ResponseInit = {status: 201, statusText: 'OK'};
    return new Response(blob, responseInit);
  }

  async whenCaptureRequestIsCalled(): Promise<void> {
    const captureRequest = new CaptureOrderRequest(CaptureOrderBuilder.buildCaptureOrder(
      'order_id',
      this.CAPTURE_ORDER_REQUEST
    ));
    const serverUrl = 'http:localhost:8082';
    if (this.captureOrderService != null) {
      await this.captureOrderService.sendRequest(captureRequest, serverUrl);
    } else {
      console.error('Error. CaptureOrderService is null');
    }
  }

  thenExpectCaptureOrderToHaveBeenCalledWith(): void {
    expect(this.remoteSend.sendPostRequest).toHaveBeenCalledWith('http:localhost:8082/ordermanagement/v1/orders/order_id/captures/',
      '{"orderId":"order_id","captured_amount":180,"description":"string","reference":"string","order_lines":[{"name":"Sony PS4","quantity":1,"quantity_unit":"each","unit_price":80,"total_amount":80},{"name":"Sony PS5","quantity":1,"quantity_unit":"each","unit_price":100,"total_amount":100}]}', jasmine.any(String));
  }

}
