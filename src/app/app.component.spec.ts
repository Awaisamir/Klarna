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

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {PaymentService} from './service/klarna-payment.service';
import {TranslationsServiceImpl} from './translations/translations.service.impl';
import {KlarnaWebComponentComponent} from './klarna-web-component/klarna-web-component.component';
import {ModalService} from './service/modal.service';
import {ChangeDetectorRef, ElementRef} from '@angular/core';
import {WindowRef} from './service/window.service';

describe('AppComponent', () => {
  let fixture: AppComponentFixture;

  beforeAll(() => {
    fixture = new AppComponentFixture();
  });

  it('should create the app', () => {
    fixture.givenDependenciesAreMocked();
    fixture.appCanBeCreated();
  });

  it(`should have as title 'klarna-web-component'`, () => {
    fixture.givenDependenciesAreMocked();
    fixture.appHasCorrectTitle();
  });
});

class AppComponentFixture {
  component: AppComponent;
  translationsServiceImpl: any = {
    reload:  () => {    }
  };

  element: any = {
    nativeElement: {
      getAttribute: () => {
      }
    }
  };
  givenDependenciesAreMocked(): void {
    TestBed.configureTestingModule({
      providers: [
        AppComponent,
        {provide: TranslationsServiceImpl, useValue: this.translationsServiceImpl},
        {provide: ElementRef, useValue: this.element}
      ]
    });
    this.component = TestBed.get(AppComponent);
  }

  appCanBeCreated(): void {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  }

  appHasCorrectTitle(): void {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('klarna-web-component');
  }
}
