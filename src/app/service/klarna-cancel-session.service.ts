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
import {SettingsService} from './settings.service';
import {WindowRef} from './window.service';
import {MockCancelSessionService} from './mock-klarna-cancel-session.service';

@Injectable({providedIn: 'root'})
export class CancelSessionService {
  private endPoint = '/hpp/v1/sessions/';

  constructor(private remoteSend: KlarnaRemoteSend, private settingsService: SettingsService,
              private mockCancelSessionService: MockCancelSessionService, private windowRef: WindowRef) {
  }

  async sendRequest(sessionId: string, serverUrl: string): Promise<void> {
    console.log('CancelSessionStatusService sendRequest session_id = ' + sessionId);
    if (this.settingsService.isMockDataMode()) {
      return this.mockCancelSessionService.sendRequest();
    }
    await this.remoteSend.sendDeleteRequest(serverUrl + this.endPoint + sessionId + '/');
  }
}
