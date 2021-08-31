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

import {Injectable} from '@angular/core';
import {SettingsService} from './settings.service';
import {KlarnaSessionService} from './klarna-session.service';
import {HppSessionService} from './klarna-hpp-session.service';
import {DistributeSessionService} from './klarna-distribute-session.service';
import {PollSessionStatusService} from './klarna-poll-session.service';
import {KlarnaCreateOrderService} from './klarna-create-order.service';
import {WindowRef} from './window.service';
import {SessionRequestBuilder} from '../datamodel/klarna-session.model';
import {PaymentSessionStatus} from '../datamodel/klarna-order.status';
import {CaptureOrderBuilder, CaptureOrderRequest} from '../datamodel/klarna-capture-order.model';
import {KlarnaCaptureOrderService} from './klarna-capture-order.service';
import {ServerError} from '../error/klarna-server.error';

@Injectable({providedIn: 'root'})
export class PaymentService {
  private serverUrl: string;
  constructor(private sessionService: KlarnaSessionService,
              private createHppSession: HppSessionService,
              private distributeSession: DistributeSessionService,
              private pollSessionStatusService: PollSessionStatusService,
              private createOrderService: KlarnaCreateOrderService,
              private captureOrderService: KlarnaCaptureOrderService,
              private settingsService: SettingsService,
              private windowRef: WindowRef
  ) {
  }

  private statusFunc: (status: string) => void;
  private hppResponse: any;
  private orderResponse: any;

  async createPayment(serverUrl: string, phoneNumber: string, countryCode: string): Promise<void> {
    this.windowRef.validate();
    this.serverUrl = serverUrl;
    console.log('serverUrl ' + serverUrl);
    const sessionRequest = SessionRequestBuilder.buildSessionRequest(this.windowRef.getSessionRequest());
    let hppSessionId = this.windowRef.getHppSessionId();
    console.log('createPayment sessionId is ' + this.windowRef.getHppSessionId());
    if (hppSessionId == null) {
      const klarnaResponse = await this.sessionService.sendRequest(sessionRequest, serverUrl);
      this.hppResponse = await this.createHppSession.sendRequest(klarnaResponse.session_id, serverUrl);
      await this.distributeSession.sendRequest(this.hppResponse.session_id, serverUrl, phoneNumber, countryCode);
      hppSessionId = this.hppResponse.session_id;
    }
    this.statusFunc(PaymentSessionStatus.WAITING);
    this.enableSuspendButton();
    const sessionStatusResponse = await this.pollSessionStatusService.sendRequest(hppSessionId, serverUrl);
    if (sessionStatusResponse.status === PaymentSessionStatus.COMPLETED) {
      await this.onOrderCompleted(sessionRequest, sessionStatusResponse, serverUrl);
    }
  }

  async onOrderCompleted(sessionRequest, sessionStatusResponse, serverUrl: string): Promise<void> {
    this.orderResponse = await this.createOrderService.sendRequest(sessionRequest, sessionStatusResponse.authorization_token, serverUrl);
    console.log('createOrderResponse ' + JSON.stringify(this.orderResponse));
    console.log('order_id = ' + this.orderResponse.order_id);
    console.log('fraud_status = ' + this.orderResponse.fraud_status);
    if (this.orderResponse.fraud_status === 'ACCEPTED') {
      await this.captureOrder(this.orderResponse, sessionRequest, serverUrl);
    }
    else {
      throw new ServerError(200, 'fraud status pending');
    }
  }

  private async captureOrder(orderResponse, sessionRequest, serverUrl: string): Promise<void> {
    console.log('orderResponse ' + JSON.stringify(orderResponse));
    const captureOrderRequest = this.createCaptureOrderRequest(orderResponse.order_id, sessionRequest);
    console.log('captureOrderRequest ' + JSON.stringify(captureOrderRequest));
    await this.captureOrderService.sendRequest(captureOrderRequest, serverUrl);
    console.log('captureOrder callbackFunctionAddExternalPayment');
    this.windowRef.callbackFunctionAddExternalPayment(orderResponse);
  }

  createCaptureOrderRequest(orderId: string, sessionRequest: any): CaptureOrderRequest {
    return CaptureOrderBuilder.buildCaptureOrder(orderId, sessionRequest);
  }

  onStatusChange(callback: (status: string) => void): void {
    this.statusFunc = callback;
  }

  getHppResponse(): any {
    return this.hppResponse;
  }

  getOrderId(): any {
    if (this.orderResponse == null)
    {
      return null;
    }
    return this.orderResponse.order_id;
  }

  getHppSessionId(): any {
    let hppSessionId = this.windowRef.getHppSessionId();
    if (hppSessionId == null && this.getHppResponse() != null) {
      hppSessionId = this.getHppResponse().session_id;
    }
    return hppSessionId;
  }

  enableSuspendButton(): void {
    this.setSuspendButtonText('Suspend', false);
  }

  setSuspendButtonText(text, disable: boolean): void{
    const btn = document.getElementById('suspend-button');
    btn.textContent = text;
    if (disable) {
      btn.setAttribute('disabled', 'disabled');
    } else {
      btn.removeAttribute('disabled');
    }
  }

  async suspendPayment(): Promise<void> {
    this.pollSessionStatusService.stopPolling();
    console.log('suspendPayment called, sessionId = ' + this.getHppSessionId());
    if (this.getHppSessionId() != null) {
      this.windowRef.callbackFunctionSuspendExternalPayment(this.getHppSessionId());
    }
  }
}
