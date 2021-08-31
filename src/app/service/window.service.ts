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

import {Injectable, OnInit} from '@angular/core';
import {ConfigError} from '../error/klarna-config.error';
import {SettingsService} from './settings.service';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({providedIn: 'root'})
export class WindowRef {
  phoneNumber: string;
  constructor(private settingsService: SettingsService){}

  nativeWindow(): any {
    return _window();
  }

  initExternalFields(): void {
    this.nativeWindow().flooid = {
      payments: {
        external: {SESSION_REQUEST: '', COMPANY: '', STORE: '', DEVICE: '', TEST_MODE: false, ORDER_ID: 'order_id', REFUND: false, EXTERNAL_PAYMENT_PROPERTIES: '{"pollTime":2000,"waitTimeBetweenRetries":10000,"maxTries":500}'}
      }
    };
  }

  private getExternal(): any {
    return this.nativeWindow().flooid.payments.external;
  }

  getTestMode(): boolean {
    return this.getExternal().TEST_MODE;
  }

  isRefund(): boolean {
    return this.getExternal().REFUND;
  }

  getCompany(): any {
    return this.getExternal().COMPANY;
  }

  getStore(): any {
    return this.getExternal().STORE;
  }

  getDevice(): any {
    return this.getExternal().DEVICE;
  }

  getSessionRequest(): any {
    const sessionrequest = this.getExternal().SESSION_REQUEST;
    if (sessionrequest != null && sessionrequest !== '') {
      return JSON.parse(sessionrequest);
    }
    return null;
  }

  getExternalPaymentProperties(): any {
    const externalPaymentProperties = this.getExternal().EXTERNAL_PAYMENT_PROPERTIES;
    if (externalPaymentProperties != null && externalPaymentProperties !== '') {
      return JSON.parse(externalPaymentProperties);
    }
    return null;
  }

  getMaxTries(): number {
    return this.getExternalPaymentProperties().maxTries;
  }

  getWaitTimeBetweenRetries(): number {
    return this.getExternalPaymentProperties().waitTimeBetweenRetries;
  }

  getPollTime(): number {
    return this.getExternalPaymentProperties().pollTime;
  }

  getCallback(): any {
    return this.getExternal().callback;
  }

  getHppSessionId(): any {
    return this.getExternal().HPP_SESSION_ID;
  }

  getRefundOrderId(): string {
    return this.getExternal().ORDER_ID;
  }

  public validate(): void {
    console.log('** validate **');
    console.log(`mockMode = ${this.settingsService.isMockDataMode()}`);
    console.log(`getTestMode = ${this.getTestMode()}`);
    console.log(`window.SESSION_REQUEST = ${JSON.stringify(this.getSessionRequest())}`);
    console.log(`window.COMPANY = ${this.getCompany()}`);
    console.log(`window.STORE = ${this.getStore()}`);
    console.log(`window.DEVICE = ${this.getDevice()}`);
    console.log(`window.TEST_MODE = ${this.getTestMode()}`);
    console.log(`window.REFUND_MODE = ${this.isRefund()}`);
    console.log(`window.ORDER_ID = ${this.getRefundOrderId()}`);
    console.log(`window.EXTERNAL_PAYMENT_PROPERTIES = ${JSON.stringify(this.getExternalPaymentProperties())}`);
    console.log(`KlarnaSessionService.sendRequest inputJson = ${this.getSessionRequest()}`);
    if (this.settingsService.isMockDataMode()) {
      if (this.getStore() !== '' && !this.getTestMode()) {
        throw new ConfigError('Configuration Error');
      }
      return;
    }
    if (this.getSessionRequest() === null) {
      throw new Error('required field window.flooid.klarna.SESSION_REQUEST is not present');
    }
    if (this.getCompany() === null) {
      throw new Error('required field window.flooid.klarna.COMPANY is not present');
    }
    if (this.getStore() === null) {
      throw new Error('required field window.flooid.klarna.STORE is not present');
    }
    if (this.getDevice() === null) {
      throw new Error('required field window.flooid.klarna.DEVICE is not present');
    }
    if (this.getMaxTries() === null) {
      throw new Error('required field window.flooid.klarna.EXTERNAL_PAYMENT_PROPERTIES.maxTries is not present');
    }
    if (this.getPollTime() === null) {
      throw new Error('required field window.flooid.klarna.EXTERNAL_PAYMENT_PROPERTIES.pollTime is not present');
    }
    if (this.getWaitTimeBetweenRetries() === null) {
      throw new Error('required field window.flooid.klarna.EXTERNAL_PAYMENT_PROPERTIES.waitTimeBetweenRetries is not present');
    }
  }

  callbackFunctionAddExternalPayment(orderResponse: any): void {
      this.getCallback().addExternalPayment({
      order_id: orderResponse.order_id
    });
  }

  callbackFunctionAddVoidedExternalPayment(referenceValue: string, orderId: string): void {
    this.getCallback().addVoidedExternalPayment({
      reference: referenceValue,
      order_id: orderId
    });
  }

  callbackFunctionSuspendExternalPayment(referenceValue: string): void {
      this.getCallback().suspendExternalPayment({
        reference: referenceValue
    });
  }

  callbackFunctionCloseBrowser(): void {
    this.getCallback().closeBrowser();
  }

  callbackFunctionCloseBrowserRefundFailed(): void {
    this.getCallback().onRefundError();
  }
}
