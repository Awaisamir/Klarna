/*
 * Copyright (c) Flooid Limited 2020. All rights reserved.
 * This source code is confidential to and the copyright of Flooid Limited ('Flooid'), and must not be
 * (i) copied, shared, reproduced in whole or in part; or
 * (ii) used for any purpose other than the purpose for which it has expressly been provided by Flooid under the terms of a license agreement; or
 * (iii) given or communicated to any third party without the prior written consent of Flooid.
 * Flooid at all times reserves the right to modify the delivery and capabilities of its products and/or services.
 * 'Flooid', 'FlooidCore', 'FlooidCommerce', 'Flooid Hub', 'PCMS', 'Vision', 'VISION Commerce Suite', 'VISION OnDemand', 'VISION eCommerce',
 * 'VISION Engaged', 'DATAFIT', 'PCMS DATAFIT' and 'BeanStore' are registered trademarks of Flooid.
 * All other brands and logos (that are not registered and/or unregistered trademarks of Flooid) are registered and/or
 * unregistered trademarks of their respective holders and should be treated as such.
 */

import {Injectable} from '@angular/core';
import {KlarnaRemoteSend} from './klarna-remote.send';
import {SettingsService} from './settings.service';
import {SessionRequest} from '../datamodel/klarna-session.model';
import {MockKlarnaCreateOrderService} from './mock-klarna-create-order.service';
import {WindowRef} from './window.service';

@Injectable({providedIn: 'root'})
export class KlarnaCreateOrderService {
  private endPoint = '/payments/v1/authorizations/';

  constructor(private remoteSend: KlarnaRemoteSend, private settingsService: SettingsService,
              private mockKlarnaCreateOrderService: MockKlarnaCreateOrderService, private windowRef: WindowRef) {
  }

  async sendRequest(sessionRequest: SessionRequest, authorizationToken: string, serverUrl: string): Promise<any> {
    if (this.settingsService.isMockDataMode()) {
      return this.mockKlarnaCreateOrderService.sendRequest(sessionRequest);
    }

    const response = await this.remoteSend.sendPostRequest(serverUrl + this.endPoint + authorizationToken + '/order/'
      , JSON.stringify(sessionRequest));
    return await response.json();
  }
}
