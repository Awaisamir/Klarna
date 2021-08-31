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

import {KlarnaWebComponentComponent} from './klarna-web-component.component';
import {PaymentSessionStatus} from '../datamodel/klarna-order.status';
import {WindowRef} from '../service/window.service';
import {ChangeDetectorRef, ElementRef} from '@angular/core';
import {ModalService} from '../service/modal.service';
import { SessionRequestBuilder} from '../datamodel/klarna-session.model';
import {PaymentService} from '../service/klarna-payment.service';
import {TranslationsServiceImpl} from '../translations/translations.service.impl';

describe('klarnaWebComponentComponent', () => {
  let fixture: KlarnaWebComponentFixture;

  beforeAll(() => {
    fixture = new KlarnaWebComponentFixture();
  });

  it('should send requests to; create session, create hpp,  distribute session, poll session, create order', async () => {
    fixture.givenDependenciesAreMocked();
    await fixture.whenCreatePaymentIsCalled();
    fixture.thenPaymentServiceIsCalled();
  });
});

class KlarnaWebComponentFixture {
  component: KlarnaWebComponentComponent;
  paymentService: any = {
    createPayment: async () => {
      return new Promise<any>((resolve): void => {
        resolve({session_id: '123'});
      });
    },
    onStatusChange: async () => {
    },
    setSuspendButtonText: async (text: any, disable: boolean) => {
    }
  };

  modalService: any = {
    open: () => {
    }
  };

  translationsServiceImpl: any = {
    translations: {},
    open: () => {
    },
    reload: () => {
    }
  };

  changeDetectorRef: any = {
    detectChanges: () => {
    }
  };

  createHppSession: any = {
    sendRequest: async () => {
      return new Promise<any>((resolve): void => {
        resolve({session_id: '123'});
      });
    }
  };

  distributeSession: any = {
    sendRequest: async () => {
      return new Promise<any>((resolve): void => {
        resolve();
      });
    }
  };

  pollSessionStatus: any = {
    sendRequest: async () => {
      return new Promise<any>((resolve): void => {
        resolve({status: PaymentSessionStatus.COMPLETED, authorization_token: 'abc-123'});
      });
    },
    onStatusChange: (t: any) => {
    }
  };

  externalpayment: any = {
    pcmsBrowserFunctionAddExternalPayment: () => {
    }
  };

  inputJson = {
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

  windowRef: any = {
    nativeWindow: () => {
      return {
        externalpayment: this.externalpayment,
        SESSION_REQUEST: this.inputJson,
        COMPANY: 'A001',
        STORE: '2571',
        DEVICE: '1',
      };
    },
    initExternalFields(mockMode: string): void
    {},
    validate(): void {},
    getSessionRequest(): any {
      return {
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
    },
    callbackFunctionAddExternalPayment(orderResponse: any): void {}
  };

  element: any = {
    nativeElement: {
      getAttribute: () => {
        return 'http:localhost:8082';
      }
    }
  };

  sessionRequest = SessionRequestBuilder.buildSessionRequest(this.inputJson);

    givenDependenciesAreMocked(): void {
      spyOn(this.paymentService, 'createPayment').and.callThrough();
      spyOn(this.modalService, 'open').and.callThrough();
      spyOn(this.windowRef, 'callbackFunctionAddExternalPayment').and.callThrough();

      TestBed.configureTestingModule({
        providers: [
          KlarnaWebComponentComponent,
          {provide: PaymentService, useValue: this.paymentService},
          {provide: ModalService, useValue: this.modalService},
          {provide: TranslationsServiceImpl, useValue: this.translationsServiceImpl},
          {provide: ChangeDetectorRef, useValue: this.changeDetectorRef},
          {provide: WindowRef, useValue: this.windowRef},
          {provide: ElementRef, useValue: this.element}
        ]
      });
      this.component = TestBed.get(KlarnaWebComponentComponent);
      this.component.ngOnInit();
    }

    async whenCreatePaymentIsCalled(): Promise<void> {
      await this.component.createPaymentAsync('07919633795');
    }

  thenPaymentServiceIsCalled(): void {
    expect(this.paymentService.createPayment).toHaveBeenCalledWith('http:localhost:8082', '07919633795', 'SE');
  }
}
