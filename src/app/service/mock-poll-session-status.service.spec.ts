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
import {MockPollSessionStatusService} from './mock-poll-session-status.service';
import {PaymentSessionStatus} from '../datamodel/klarna-order.status';

describe('MockPollSessionStatusService', () => {
  let fixture: MockPollSessionStatusFixture;

  beforeAll(() => {
    fixture = new MockPollSessionStatusFixture();
  });

  describe('first sendRequest', () => {
    it('should send a request and get a status of WAITING', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenCreateRequestIsCalled(1);
      fixture.thenCreateSessionRequestIsSent(PaymentSessionStatus.WAITING);
    });
  });

  describe('second sendRequest', () => {
    it('should send a request and get a status of COMPLETED', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenCreateRequestIsCalled(2);
      fixture.thenCreateSessionRequestIsSent(PaymentSessionStatus.IN_PROGRESS);
    });
  });

  describe('third sendRequest', () => {
    it('should send a request and get a status of COMPLETED', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenCreateRequestIsCalled(3);
      fixture.thenCreateSessionRequestIsSent(PaymentSessionStatus.COMPLETED);
    });
  });
});

class MockPollSessionStatusFixture {
  pollSessionStatusService = null;
  private jsonResponse: any;

  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        MockPollSessionStatusService
      ]
    });

    this.pollSessionStatusService = TestBed.get(MockPollSessionStatusService);
  }

  async whenCreateRequestIsCalled(count: any): Promise<void> {
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

    this.jsonResponse = await this.pollSessionStatusService.sendRequest(JSON.stringify(inputJson), serverUrl, count);
  }

  thenCreateSessionRequestIsSent(orderStatus: PaymentSessionStatus): void {
    if (orderStatus === PaymentSessionStatus.COMPLETED)
    {
      expect(this.jsonResponse).toEqual({
        session_id: '07d58b19-14fe-9411-bba3-36465198cc57',
        status: 'COMPLETED',
        authorization_token: '36a1b431-db01-2ada-9a0f-f53c11851830',
        updated_at: '2021-03-04T16:17:31.246Z',
        expires_at: '2021-03-06T15:31:31.701Z'
      });
      return;
    }

    expect(this.jsonResponse).toEqual({
      session_id: '07d58b19-14fe-9411-bba3-36465198cc57',
      status: orderStatus,
      updated_at: '2021-03-04T16:17:31.246Z',
      expires_at: '2021-03-06T15:31:31.701Z'
    });
  }
}
