import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinPadComponent } from './pin-pad.component';
import {ElementRef} from '@angular/core';
import {TranslationsServiceImpl} from '../translations/translations.service.impl';

describe('PinPadComponent', () => {
  let component: PinPadComponent;
  const translationsServiceImpl: any = {
    translations:  {    }
  };
  let fixture: ComponentFixture<PinPadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ PinPadComponent,
        {provide: TranslationsServiceImpl, useValue: translationsServiceImpl},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
