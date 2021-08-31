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
import {KlarnaSessionService} from './klarna-session.service';
import {SettingsService} from './settings.service';
import {SessionRequestBuilder} from '../datamodel/klarna-session.model';


describe('SessionService', () => {
  let fixture: KlarnaSessionFixture;

  beforeAll(() => {
    fixture = new KlarnaSessionFixture();
  });

  describe('sendRequest', () => {
    it('should send a request and return json response', async () => {
      fixture.givenDependenciesAreMocked();
      await fixture.whenCreateRequestIsCalled();
      fixture.thenCreateSessionRequestIsSent();
    });
  });
});

class KlarnaSessionFixture {
  sessionService = null;
  SESSION_RESPONSE = {name: 'SessionResponse'};
  remoteSend: any = {
    sendPostRequest: async () => {
      return new Promise<Response>((resolve): void => {
        resolve(this.createResponse());
      });
    }
  };

  settingsService: any = {
    isMockDataMode:  () => {
      return false;
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
        KlarnaSessionService,
        {provide: KlarnaRemoteSend, useValue: this.remoteSend},
        {provide: SettingsService, useValue: this.settingsService}
      ]
    });

    this.sessionService = TestBed.get(KlarnaSessionService);
    spyOn(this.remoteSend, 'sendPostRequest').and.callThrough();
  }

  async whenCreateRequestIsCalled(): Promise<void> {
    const inputJson = {
      purchaseCountry: 'SE',
      purchaseCurrency: 'SEK',
      locale: 'en-SE',
      merchantReference1: 'merch_ref1_123',
      merchantReference2: 'merch_re2_123',
      orderAmount: 10000,
      orderTaxAmount: 2000,
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
    const sessionRequest = SessionRequestBuilder.buildSessionRequest(inputJson);
    this.jsonResponse = await this.sessionService.sendRequest(sessionRequest, serverUrl);
  }

  thenCreateSessionRequestIsSent(): void {
    expect(this.remoteSend.sendPostRequest).toHaveBeenCalledWith('http:localhost:8082/payments/v1/sessions/',
      '{"purchase_country":"SE","purchase_currency":"SEK","locale":"en-SE",' +
      '"merchant_reference1":"merch_ref1_123","merchant_reference2":"merch_re2_123","order_amount":10000,' +
      '"order_tax_amount":2000,"order_lines":[' +
      '{"type":"physical","reference":"123050","name":"Tomatoes","quantity":10,"quantity_unit":"kg","unit_price":1000,"tax_rate":2000,' +
      '"total_amount":10000,"total_tax_amount":1666}]}');
    expect(this.jsonResponse).toEqual(this.SESSION_RESPONSE);
  }
}
