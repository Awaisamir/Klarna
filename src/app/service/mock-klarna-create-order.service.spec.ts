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

import {TestBed} from '@angular/core/testing';
import {MockKlarnaSessionService} from './mock-klarna-session.service';
import {MockKlarnaCreateOrderService} from './mock-klarna-create-order.service';
import {WindowRef} from './window.service';

describe('MockKlarnaCreateOrderService', () => {
  let fixture: MockKlarnaCreateOrderFixture;

  beforeAll(() => {
    fixture = new MockKlarnaCreateOrderFixture();
  });

  describe('sendRequest', () => {
    it('should send a request and return json response', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenCreateRequestIsCalled();
      fixture.thenCreateOrderRequestIsSent();
    });
  });
});

class MockKlarnaCreateOrderFixture {
  sessionService = null;
  SESSION_RESPONSE = {
    authorized_payment_method: {
      days: 0,
      number_of_installments: 0,
      type: 'invoice'
    },
    fraud_status: 'ACCEPTED',
    order_id: '36a1b431-db01-2ada-9a0f-f53c11851830',
    redirect_url: 'https://credit.klarna.com/v1/sessions/0b1d9815-165e-42e2-8867-35bc03789e00/redirect'
  };
  private jsonResponse: any;
  windowRef: any = {
    getHppSessionId(): any {
      return this.getExternal().HPP_SESSION_ID;
    }
  };
  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        MockKlarnaSessionService,
        {provide: WindowRef, useValue: this.windowRef}
      ]
    });

    this.sessionService = TestBed.get(MockKlarnaCreateOrderService);
    spyOn(this.windowRef, 'getHppSessionId').and.returnValue('f52fc7d6-ee28-9c04-8674-8f7b8cdca5d4');
  }

  async whenCreateRequestIsCalled(): Promise<void> {
    const inputJson = {
      purchaseCountry: 'SE',
      purchaseCurrency: 'SEK',
      locale: 'en-SE',
      orderAmount: 10000,
      orderLines:
        [{
          type: 'physical',
          reference: '123050',
          name: 'Tomatoes',
          quantity: 10,
          quantityUnit: 'kg',
          unitPrice: 1000,
          taxRate: 2000,
          totalAmount: 10000,
          totalTaxAmount: 1666,
          productUrl: 'https://example.com/product/829heaia34',
          imageUrl: 'https://example.com/product/829heaia34/image.jpg'
        }],
    };
    const serverUrl = 'http:localhost:8082';

    this.jsonResponse = await this.sessionService.sendRequest(JSON.stringify(inputJson), serverUrl);
  }

  thenCreateOrderRequestIsSent(): void {
    expect(this.jsonResponse).toEqual(this.SESSION_RESPONSE);
  }
}
