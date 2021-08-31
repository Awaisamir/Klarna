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
import { Injectable } from '@angular/core';
import { SessionRequest } from '../datamodel/klarna-session.model';
import { AuthenticationError } from '../error/klarna-authentication.error';
import { ConfigError } from '../error/klarna-config.error';
import { DistributionError } from '../error/klarna-distribution.error';
import { NetworkError } from '../error/klarna-network.error';
import { ServerError } from '../error/klarna-server.error';
import { WindowRef } from './window.service';

@Injectable({ providedIn: 'root' })
export class MockKlarnaSessionService {
  constructor(private windowRef: WindowRef) {
  }

  async sendRequest(sessionRequest: SessionRequest, serverUrl: string): Promise<any> {
    return new Promise<Response>((resolve): void => {
      resolve(this.createResponse());
    });
  }

  createResponse(): any {
    if (this.windowRef.phoneNumber === '07929633111') {
      throw new AuthenticationError(403, 'Unauthorized');
    }
    else if (this.windowRef.phoneNumber === '07929633222') {
      throw new ServerError(500, 'Server Error');
    }
    else if (this.windowRef.phoneNumber === '07929633333') {
      throw new NetworkError('Request Timeout');
    }
    const obj = {
      session_id: '83a4a840-a09e-26b1-8fe9-b694dec3b5cf', client_token: 'eyJhbGciOiJSUzI1NiIsIm',
      payment_method_categories: [{
        identifier: 'pay_over_time',
        name: 'Buy now, pay later',
        asset_urls: {
          descriptive: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
          standard: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg'
        }
      },
      {
        identifier: 'pay_later',
        name: 'Buy now, pay later',
        asset_urls: {
          descriptive: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
          standard: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg'
        }
      }]
    };
    return obj;
  }
}
