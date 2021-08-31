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

describe('MockKlarnaSessionService', () => {
  let fixture: MockKlarnaSessionFixture;

  beforeAll(() => {
    fixture = new MockKlarnaSessionFixture();
  });

  describe('sendRequest', () => {
    it('should send a request and return json response', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenCreateRequestIsCalled();
      fixture.thenCreateSessionRequestIsSent();
    });
  });
});

class MockKlarnaSessionFixture {
  sessionService = null;
  SESSION_RESPONSE = {
    session_id: '83a4a840-a09e-26b1-8fe9-b694dec3b5cf', client_token: 'eyJhbGciOiJSUzI1NiIsIm',
    payment_method_categories: [{
      identifier: 'pay_over_time',
      name: 'Buy now, pay later',
      asset_urls: {
        descriptive: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
        standard: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg'
      }
    },
      {
        identifier: 'pay_later',
        name: 'Buy now, pay later',
        asset_urls: {
          descriptive: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
          standard: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg'
        }
      }]
  };
  private jsonResponse: any;

  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        MockKlarnaSessionService
      ]
    });

    this.sessionService = TestBed.get(MockKlarnaSessionService);
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

  thenCreateSessionRequestIsSent(): void {
    expect(this.jsonResponse).toEqual(this.SESSION_RESPONSE);
  }
}
