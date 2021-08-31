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

import {Injectable} from '@angular/core';
import {KlarnaRemoteSend} from './klarna-remote.send';
import {SettingsService} from './settings.service';
import {WindowRef} from './window.service';
import {RefundRequest, RefundRequestBuilder} from '../datamodel/klarna-refund-request';
import {MockKlarnaRefundOrderService} from './mock-klarna-refund-order.service';
import {v4 as uuidv4} from 'uuid';
import {RefundError} from '../error/klarna-refund-error';

@Injectable({providedIn: 'root'})
export class KlarnaRefundOrderService {
  serverUrl: string;
  constructor(private remoteSend: KlarnaRemoteSend, private settingService: SettingsService,
              private mockKlarnaRefundOrderService: MockKlarnaRefundOrderService,
              private windowRef: WindowRef) {
  }

  async createRefundRequestAsync(serverUrl: string, refundRequest: RefundRequest = null): Promise<void> {
    this.windowRef.validate();
    this.serverUrl = serverUrl;
    if (refundRequest == null) {
      refundRequest = RefundRequestBuilder.buildRefundRequest(this.windowRef.getRefundOrderId(), this.windowRef.getSessionRequest());
    }
    await this.sendRequest(refundRequest);
  }

  private async sendRequest(refundRequest: RefundRequest): Promise<void> {
    if (this.settingService.isMockDataMode()){
      try {
        await this.mockKlarnaRefundOrderService.sendRequest(refundRequest);
      } catch (e) {
        console.log(`RefundOrder Error: ${e}`);
        throw new RefundError();
      }
    }
    else {
      try {
        console.log(`Refund Request: URL: ${this.serverUrl}/ordermanagement/v1/orders/${refundRequest.order_id}/refunds/  and body is ${JSON.stringify(refundRequest)}`);
        await this.remoteSend.sendPostRequest(`${this.serverUrl}/ordermanagement/v1/orders/${refundRequest.order_id}/refunds/`,
          JSON.stringify(refundRequest), uuidv4());
      } catch (e) {
        console.log(`RefundOrder Error: ${e}`);
        throw new RefundError();
      }
    }
    this.windowRef.callbackFunctionAddExternalPayment(refundRequest);
  }

}
