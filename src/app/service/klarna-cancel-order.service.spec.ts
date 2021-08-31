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
import {KlarnaCancelOrderService} from './klarna-cancel-order.service';
import {KlarnaRemoteSend} from './klarna-remote.send';
import {SettingsService} from './settings.service';

describe('KlarnaCancelOrderService', () => {
  let fixture: KlarnaCancelOrderServiceFixture;

  beforeAll(() => {
    fixture = new KlarnaCancelOrderServiceFixture();
  });
  describe('sendRequest', () => {
    it('should send a request and return empty response', async () => {
        fixture.givenDependenciesAreMocked();
        fixture.whenCancelOrderServiceIsCalled();
        fixture.thenCreateSessionRequestIsSent();
    });
  });
});

class KlarnaCancelOrderServiceFixture {
  cancelOrderService = null;
  remoteSend: any = {
    sendPostRequest: async () => {
      return new Promise<Response>((resolve): void => {
        resolve(this.createResponse());
      });
    }
  };

  settingsService: any = {
    isMockDataMode: () => {
      return false;
    }
  };

  createResponse(): Response {
    const responseInit: ResponseInit = {status: 204, statusText: 'OK'};
    return new Response(null, responseInit);
  }

  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        KlarnaCancelOrderService,
        {provide: KlarnaRemoteSend, useValue: this.remoteSend},
        {provide: SettingsService, useValue: this.settingsService}
      ]
    });

    this.cancelOrderService = TestBed.inject(KlarnaCancelOrderService);
    spyOn(this.remoteSend, 'sendPostRequest').and.callThrough();
  }

  async whenCancelOrderServiceIsCalled(): Promise<void> {
    const order_id = '36a1b431-db01-2ada-9a0f-re43434343rd';
    const serverUrl = 'http:localhost:8082';
    await this.cancelOrderService.sendRequest(order_id, serverUrl);
  }

  thenCreateSessionRequestIsSent(): void {
    expect(this.remoteSend.sendPostRequest).toHaveBeenCalledWith('http:localhost:8082/ordermanagement/v1/orders/36a1b431-db01-2ada-9a0f-re43434343rd/cancel/', '');
  }
}
