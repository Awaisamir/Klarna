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
import {PaymentSessionStatus} from '../datamodel/klarna-order.status';
import {ServerError} from '../error/klarna-server.error';
import {NetworkError} from '../error/klarna-network.error';
import {WindowRef} from './window.service';

@Injectable({providedIn: 'root'})
export class MockPollSessionStatusService {
  constructor(private windowRef: WindowRef) {
  }
  async sendRequest(sessionId: string, serverUrl: string, count: any): Promise<any> {
    return new Promise<Response>((resolve): void => {
      resolve(this.createResponse(count));
    });
  }

  createResponse(count: any): any {
    if (this.windowRef.phoneNumber === '07929633101') {
      throw new ServerError(400, 'Server Error');
    }
    else if (this.windowRef.phoneNumber === '07929633102') {
      throw new NetworkError('Request Timeout');
    }
    if (count <= 1) {
      return {
        session_id: '07d58b19-14fe-9411-bba3-36465198cc57',
        status: PaymentSessionStatus.WAITING,
        updated_at: '2021-03-04T16:17:31.246Z',
        expires_at: '2021-03-06T15:31:31.701Z'
      };
    }
    else if (count <= 2) {
      return {
        session_id: '07d58b19-14fe-9411-bba3-36465198cc57',
        status: PaymentSessionStatus.IN_PROGRESS,
        updated_at: '2021-03-04T16:17:31.246Z',
        expires_at: '2021-03-06T15:31:31.701Z'
      };
    }
    else if (this.windowRef.phoneNumber === '07929633560') {
      return {
        session_id: '07d58b19-14fe-9411-bba3-36465198cc57',
        status: PaymentSessionStatus.CANCELLED,
        authorization_token: '36a1b431-db01-2ada-9a0f-f53c11851830',
        updated_at: '2021-03-04T16:17:31.246Z',
        expires_at: '2021-03-06T15:31:31.701Z',
      };
    }
    return {
      session_id: '07d58b19-14fe-9411-bba3-36465198cc57',
      status: PaymentSessionStatus.COMPLETED,
      authorization_token: '36a1b431-db01-2ada-9a0f-f53c11851830',
      updated_at: '2021-03-04T16:17:31.246Z',
      expires_at: '2021-03-06T15:31:31.701Z',
    };
  }
}


