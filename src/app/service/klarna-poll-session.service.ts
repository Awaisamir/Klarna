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
import {KlarnaRemoteSend} from './klarna-remote.send';
import {PaymentSessionStatus} from '../datamodel/klarna-order.status';
import {SettingsService} from './settings.service';
import {MockPollSessionStatusService} from './mock-poll-session-status.service';
import {WindowRef} from './window.service';
import {ServerError} from '../error/klarna-server.error';

@Injectable({providedIn: 'root'})
export class PollSessionStatusService {

  private endPoint = '/hpp/v1/sessions/';
  private statusFunc: (status: string) => void;
  private pollingStopped: boolean;
  private pollingPaused: boolean;

  constructor(private remoteSend: KlarnaRemoteSend, private settingsService: SettingsService,
              private mockPollSessionStatusService: MockPollSessionStatusService, private windowRef: WindowRef) {
  }

  async sendRequest(sessionId: string, serverUrl: string): Promise<any> {
    this.pollingStopped = false;
    this.pollingPaused = false;
    console.log('PollSessionStatus sendRequest session_id = ' + sessionId);
    let count = 0;
    while (!this.pollingStopped) {
      try {
        if (this.pollingPaused) {
          await this.sleep(this.windowRef.getPollTime());
        } else {
          const jsonResponse = await this.getResponse(sessionId, serverUrl, count++);
          console.log('sessionStatusResponse ' + JSON.stringify(jsonResponse));
          if (this.validateEndStatus(jsonResponse)) {
            console.log('createPaymentAsync status ' + jsonResponse.status);
            return jsonResponse;
          }
          await this.sleep(this.windowRef.getPollTime());
        }
      }
      catch (e) {
        if (!this.server500Error(e))
        {
          throw e;
        }
      }
    }
  }

  private server500Error(e): boolean
  {
    if (e instanceof ServerError) {
      return e.status === 500;
    }
    return false;
  }

  private async getResponse(sessionId: string, serverUrl: string, count: any): Promise<any> {
    if (this.settingsService.isMockDataMode()) {
      return this.mockPollSessionStatusService.sendRequest(sessionId, serverUrl, count);
    }
    const response: Response = await this.remoteSend.sendGetRequest(serverUrl + this.endPoint + sessionId + '/');
    return await response.json();
  }

  validateEndStatus(data: any): boolean {
    console.log('validateEndStatus ' + data.status);
    this.statusFunc(data.status);
    return data.status === PaymentSessionStatus.COMPLETED ||
      data.status === PaymentSessionStatus.CANCELLED ||
      data.status === PaymentSessionStatus.DISABLED;
  }

  onStatusChange(callback: (status: string) => void): void {
    this.statusFunc = callback;
  }

  sleep(ms): Promise<unknown> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stopPolling(): void {
    this.pollingStopped = true;
  }

  pausePolling(): void {
    this.pollingPaused = true;
  }

  resumePolling(): void {
    this.pollingPaused = false;
  }
}
