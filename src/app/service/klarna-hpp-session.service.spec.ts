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

import {KlarnaRemoteSend} from './klarna-remote.send';
import {TestBed} from '@angular/core/testing';
import {HppSessionService} from './klarna-hpp-session.service';

describe('HppSessionService', async () => {
  let fixture: HppSessionFixture;

  beforeAll(() => {
    fixture = new HppSessionFixture();
  });

  describe('sendRequest', () => {
    it('should send a request to the hpp endpoint and return a json response', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenCreateRequestIsCalled();
      fixture.thenCreateHppRequestIsSent();
    });
  });
});

class HppSessionFixture {
  hppSessionService: HppSessionService;
  SESSION_RESPONSE = {name: 'SessionResponse'};
  remoteSend: any = {
    sendPostRequest: async () => {
      return new Promise<Response>((resolve): void => {
        resolve(this.createResponse());
      });
    }
  };
  private jsonResponse: any;

  createResponse(): Response {
    const blob = new Blob([JSON.stringify(this.SESSION_RESPONSE, null, 2)], {type: 'application/json'});
    const responseInit: ResponseInit = {status: 200, statusText: 'OK'};
    return new Response(blob, responseInit);
  }

  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        HppSessionService,
        {provide: KlarnaRemoteSend, useValue: this.remoteSend}
      ]
    });

    this.hppSessionService = TestBed.get(HppSessionService);
    spyOn(this.remoteSend, 'sendPostRequest').and.callThrough();
  }

  async whenCreateRequestIsCalled(): Promise<void> {
    const sessionId = '123';
    const serverUrl = 'http:localhost:8082';
    this.jsonResponse = await this.hppSessionService.sendRequest(sessionId, serverUrl);
  }

  thenCreateHppRequestIsSent(): void {
    expect(this.remoteSend.sendPostRequest).toHaveBeenCalledWith('http:localhost:8082/hpp/v1/sessions/'
      , '{"merchant_urls":{"back":null,"cancel":null,"error":null,"failure":null,"privacy_policy":null,"success":null,"terms":null}' +
      ',"options":{"place_order_mode":"NONE"},"payment_session_url":"http:localhost:8082/payments/v1/sessions/123"}');
    expect(this.jsonResponse).toEqual(this.SESSION_RESPONSE);
  }
}
