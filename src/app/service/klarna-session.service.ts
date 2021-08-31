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
import {MockKlarnaSessionService} from './mock-klarna-session.service';
import {SessionRequest} from '../datamodel/klarna-session.model';

@Injectable({providedIn: 'root'})
export class KlarnaSessionService {
  private endPoint = '/payments/v1/sessions/';

  constructor(private remoteSend: KlarnaRemoteSend, private settingsService: SettingsService,
              private mockSessionService: MockKlarnaSessionService) {
  }

  /**
   * If a network failure occurs then retry.
   * Otherwise if any other error occurs on the server then throw an error
   * @param inputJson the klarna session request
   * @param serverUrl the server URL
   */
  async sendRequest(sessionRequest: SessionRequest, serverUrl: string): Promise<any> {
    if (this.settingsService.isMockDataMode()) {
      return this.mockSessionService.sendRequest(sessionRequest, serverUrl);
    }
    const response = await this.remoteSend.sendPostRequest(serverUrl + this.endPoint, JSON.stringify(sessionRequest));
    const klarnaResponse = await response.json();
    console.log('klarnaResponse ' + JSON.stringify(klarnaResponse));
    console.log('sessionId ' + klarnaResponse.session_id);
    return klarnaResponse;
  }
}
