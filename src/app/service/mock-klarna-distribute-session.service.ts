/*
 * Copyright (c) Flooid Limited 2021. All rights reserved.
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
import {SettingsService} from './settings.service';
import {ServerError} from '../error/klarna-server.error';
import { WindowRef } from './window.service';
import {NetworkError} from '../error/klarna-network.error';
import {DistributionError} from '../error/klarna-distribution.error';

@Injectable({providedIn: 'root'})
export class MockKlarnaDistributeSessionService {
  endPoint = '/hpp/v1/sessions/';

  constructor(private remoteSend: KlarnaRemoteSend, private settingsService: SettingsService, private windowRef: WindowRef) {
  }

  async sendRequest(sessionId: string, serverUrl: string, phoneNumber: string): Promise<any> {
    return new Promise<Response>((resolve): void => {
      resolve(this.createResponse());
    });
  }

  createResponse(): any {
    if (this.windowRef.phoneNumber === '07929633888') {
      throw new DistributionError();
    }
    else if (this.windowRef.phoneNumber === '07929633999') {
      throw new ServerError(401, 'Server Error');
    }
    else if (this.windowRef.phoneNumber === '07929633100') {
      throw new NetworkError('Request Timeout');
    }
    return;
  }
}
