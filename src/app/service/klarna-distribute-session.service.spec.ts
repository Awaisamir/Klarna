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
import {DistributeSessionService} from './klarna-distribute-session.service';

describe('DistributeSessionService', () => {
  let fixture: DistributeSessionFixture;

  beforeAll(() => {
    fixture = new DistributeSessionFixture();
  });

  describe('sendRequest', () => {
    it('should send a request to the distribution endpoint', () => {
      fixture.givenDependenciesAreMocked();
      fixture.whenDistributeSessionRequestIsCalled();
      fixture.thenDistributeSessionRequestIsSent();
    });
  });
});

class DistributeSessionFixture{
  distributeSessionService: DistributeSessionService;

  remoteSend: any = {
    sendPostRequest: () => new Promise<Response>(resolve => new Response())
  };

  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        DistributeSessionService,
        {provide: KlarnaRemoteSend, useValue: this.remoteSend }
      ]
    });

    this.distributeSessionService = TestBed.get(DistributeSessionService);
    spyOn(this.remoteSend, 'sendPostRequest').and.callThrough();
  }

  whenDistributeSessionRequestIsCalled(): void {
    const sessionId = '123';
    const serverUrl = 'http:localhost:8082';
    const phoneNumber = '07919633795';
    const countryCode = 'GB';
    this.distributeSessionService.sendRequest(sessionId, serverUrl, phoneNumber, countryCode);
  }

  thenDistributeSessionRequestIsSent(): void {
    expect(this.remoteSend.sendPostRequest).toHaveBeenCalledWith('http:localhost:8082/hpp/v1/sessions/123/distribution/',
      '{"contact_information":{"phone":"07919633795","phone_country":"GB"},"method":"sms","template":"INSTORE_PURCHASE"}');
  }
}
