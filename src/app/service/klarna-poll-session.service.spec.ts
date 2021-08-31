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
import {PollSessionStatusService} from './klarna-poll-session.service';
import {PaymentSessionStatus} from '../datamodel/klarna-order.status';
import {WindowRef} from './window.service';

describe('PollSessionStatusService', () => {
  let fixture: PollSessionFixture;

  beforeAll(() => {
    fixture = new PollSessionFixture();
  });

  describe('sendRequest', () => {
    it('should send a request', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenCreateRequestIsCalled();
      fixture.thenPollStatusRequestIsSent();
    });
  });
});

class PollSessionFixture {
  pollSessionStatusService: PollSessionStatusService;
  windowRef: any = {
    getMaxTries(): number {
      return this.getExternalPaymentProperties().maxTries;
    }
  };
  remoteSend: any = {
    sendGetRequest: async () => {
      return new Promise<Response>((resolve): void => {
        resolve(this.createResponse());
      });
    }
  };
  statusChange: any = {
    updateStatus: (status: string) => {}
  };

  createResponse(): Response {
    const obj = {status: PaymentSessionStatus.COMPLETED};
    const blob = new Blob([JSON.stringify(obj, null, 2)], {type: 'application/json'});
    const responseInit: ResponseInit = {status: 200, statusText: 'OK'};
    return new Response(blob, responseInit);
  }

  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        PollSessionStatusService,
        {provide: KlarnaRemoteSend, useValue: this.remoteSend},
        {provide: WindowRef, useValue: this.windowRef}
      ]
    });

    this.pollSessionStatusService = TestBed.get(PollSessionStatusService);
    spyOn(this.remoteSend, 'sendGetRequest').and.callThrough();
    spyOn(this.statusChange, 'updateStatus').and.callThrough();
    spyOn(this.windowRef, 'getMaxTries').and.returnValue(500);
  }

  async whenCreateRequestIsCalled(): Promise<void> {
    this.pollSessionStatusService.onStatusChange(this.statusChange.updateStatus.bind(this));
    await this.pollSessionStatusService.sendRequest('123', 'http:localhost:8082');
  }

  thenPollStatusRequestIsSent(): void {
    expect(this.remoteSend.sendGetRequest).toHaveBeenCalledWith('http:localhost:8082/hpp/v1/sessions/123/');
  }
}
