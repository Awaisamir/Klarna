/*
 * Copyright (c) Flooid Limited 2021. All rights reserved.
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

import {KlarnaRemoteSend} from './klarna-remote.send';
import {SettingsService} from './settings.service';
import {MockKlarnaCaptureOrderService} from './mock-klarna-capture-order.service';
import {WindowRef} from './window.service';
import {CaptureOrderRequest} from '../datamodel/klarna-capture-order.model';
import {v4 as uuidv4} from 'uuid';
import {Injectable} from '@angular/core';
import {ServerError} from '../error/klarna-server.error';

@Injectable({providedIn: 'root'})
export class KlarnaCaptureOrderService {

  constructor(private remoteSend: KlarnaRemoteSend, private settingService: SettingsService,
              private mockKlarnaCaptureOrderService: MockKlarnaCaptureOrderService, private windowRef: WindowRef) {
  }

  async sendRequest(captureOrderRequest: CaptureOrderRequest, serverUrl: string): Promise<void> {
    if (this.settingService.isMockDataMode()) {
      return this.mockKlarnaCaptureOrderService.sendRequest(captureOrderRequest);
    }
    for (let count = 0; count < this.windowRef.getMaxTries(); count++) {
      try {
        await this.remoteSend.sendPostRequest(`${serverUrl}/ordermanagement/v1/orders/${captureOrderRequest.orderId}/captures/`
          , JSON.stringify(captureOrderRequest), uuidv4());
        return;
      } catch (e) {
        if (!this.server404Error(e)) {
          throw e;
        }
      }
      await this.sleep(this.windowRef.getWaitTimeBetweenRetries());
    }
  }

  private server404Error(e): boolean
  {
    if (e instanceof ServerError) {
      return e.status === 500;
    }
    return false;
  }

  sleep(ms): Promise<unknown> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
