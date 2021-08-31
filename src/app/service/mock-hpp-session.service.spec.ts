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
import {MockHppSessionService} from './mock-hpp-session.service';


describe('MockHppSessionService', () => {
  let fixture: MockHppSessionFixture;

  beforeAll(() => {
    fixture = new MockHppSessionFixture();
  });

  describe('sendRequest', () => {
    it('should send a request and return json response', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenCreateRequestIsCalled();
      fixture.thenCreateSessionRequestIsSent();
    });
  });
});

class MockHppSessionFixture {
  hppSessionService = null;
  SESSION_RESPONSE = {
    session_id: 'f52fc7d6-ee28-9c04-8674-8f7b8cdca5d4',
    redirect_url: 'https://pay.playground.klarna.com/eu/9qGNmlZ',
    session_url: 'https://api.playground.klarna.com/hpp/v1/sessions/f52fc7d6-ee28-9c04-8674-8f7b8cdca5d4',
    qr_code_url: 'https://pay.playground.klarna.com/eu/payments/f52fc7d6-ee28-9c04-8674-8f7b8cdca5d4/qr',
    distribution_url: 'https://api.playground.klarna.com/hpp/v1/sessions/f52fc7d6-ee28-9c04-8674-8f7b8cdca5d4/distribution',
    expires_at: '2021-03-06T14:36:28.655Z',
    distribution_module: {
      token: 'eyJhbGciOiJub25lIn0.eyJzZXNzaW9uX2lkIjoiMTA2OTdkZWQtN2MxMi05OTY2LTgwMjYtNmEyMGMxY2Q3MjU3IiwiaWZyYW1lX3VybCI6Imh0dHBzOi8vcGF5bWVudC1ldS5wbGF5Z3JvdW5kLmtsYXJuYS5jb20vZGlzdHJpYnV0aW9ucy8xMDY5N2RlZC03YzEyLTk5NjYtODAyNi02YTIwYzFjZDcyNTc_cHJvZmlsZV9pZD17e3Byb2ZpbGVfaWR9fVx1MDAyNnZpZXdfaWQ9e3t2aWV3X2lkfX0iLCJpZnJhbWVfb3JpZ2luIjoiaHR0cHM6Ly9wYXltZW50LWV1LnBsYXlncm91bmQua2xhcm5hLmNvbSIsImV2ZW50X3VybCI6Imh0dHBzOi8vZXUucGxheWdyb3VuZC5rbGFybmFldnQuY29tIn0.',
      standalone_url: 'https://payment-eu.playground.klarna.com/distributions/10697ded-7c12-9966-8026-6a20c1cd7257?profile_id={{profile_id}}&view_id={{view_id}}',
      generation_url: 'https://api.playground.klarna.com/hpp/v1/sessions/f52fc7d6-ee28-9c04-8674-8f7b8cdca5d4/distribution-module/token'
    }
  };
  private jsonResponse: any;

  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        MockHppSessionService
      ]
    });

    this.hppSessionService = TestBed.get(MockHppSessionService);
  }

  async whenCreateRequestIsCalled(): Promise<void> {
    const sessionId = '123';
    const serverUrl = 'http:localhost:8082';
    this.jsonResponse = await this.hppSessionService.sendRequest(sessionId, serverUrl);
  }

  thenCreateSessionRequestIsSent(): void {
    expect(this.jsonResponse).toEqual(this.SESSION_RESPONSE);
  }
}
