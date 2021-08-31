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
import {KlarnaSessionService} from './klarna-session.service';
import {WindowRef} from './window.service';
import {CancelSessionService} from './klarna-cancel-session.service';
import {KlarnaCancelOrderService} from './klarna-cancel-order.service';

@Injectable({providedIn: 'root'})
export class CancelPaymentService {
  private serverUrl: string;
  constructor(private sessionService: KlarnaSessionService,
              private cancelSessionService: CancelSessionService,
              private cancelOrderService: KlarnaCancelOrderService,
              private windowRef: WindowRef
  ) {
  }

  async cancelPayment(serverUrl: string, orderId: string, hppSessionId: string): Promise<void> {
    this.serverUrl = serverUrl;
    if (hppSessionId == null) {
      this.windowRef.callbackFunctionCloseBrowser();
      return;
    } else {
      if (orderId != null)
      {
        await this.cancelOrder(orderId);
      }
      await this.cancelSession(hppSessionId);
      this.windowRef.callbackFunctionAddVoidedExternalPayment(hppSessionId, orderId);
    }
  }

  private async cancelSession(hppSessionId: string): Promise<void> {
    try {
      await this.cancelSessionService.sendRequest(hppSessionId, this.serverUrl);
    } catch (e) {
      console.log('cancelOrderService sendRequest failed, sessionId = ' + hppSessionId);
    }
  }

  private async cancelOrder(orderId: string): Promise<void> {
    try {
      await this.cancelOrderService.sendRequest(orderId, this.serverUrl);
    } catch (e) {
      console.log('cancelOrderService sendRequest failed, orderId = ' + orderId);
    }
  }
}
