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

import {ServerError} from '../error/klarna-server.error';
import {WindowRef} from './window.service';
import {Injectable} from '@angular/core';
import {NetworkError} from '../error/klarna-network.error';
import {AuthenticationError} from '../error/klarna-authentication.error';

@Injectable({providedIn: 'root'})
export class KlarnaRemoteSend {
  constructor(private windowRef: WindowRef) {
  }

  /**
   * If a network failure occurs then retry.
   * Otherwise if any other error occurs on the server then throw an error
   */
  async sendDeleteRequest(url: string): Promise<void> {
    console.log('KlarnaRemoteSend.sendDeleteRequestImpl url=' + url);
    await this.sendRequestWithoutBody(url, 'DELETE');
  }

  /**
   * If a network failure occurs then retry.
   * Otherwise if any other error occurs on the server then throw an error
   */
  async sendGetRequest(url: string): Promise<Response> {
    console.log('KlarnaRemoteSend.sendGetRequest url=' + url);
    for (let count = 0; count < this.windowRef.getMaxTries(); count++) {
      try {
        console.log('KlarnaRemoteSend.sendGetRequest count=' + count + ' maxTries=' + this.windowRef.getMaxTries());
        return await this.sendRequestWithoutBody(url, 'GET');
      } catch (e) {
        if (e instanceof ServerError) {
          throw e;
        }
      }
      await this.sleep(this.windowRef.getWaitTimeBetweenRetries());
    }
    throw new NetworkError('NetworkError');
  }

  /**
   * If a network failure occurs then retry.
   * Otherwise if any other error occurs on the server then throw an error
   * @param url
   * @param jsonString
   * @param idempotencyKey OPTIONAL parameter to use Idempotency in POST requests
   */
  async sendPostRequest(url: string, jsonString: string, idempotencyKey: string = null): Promise<Response> {
    console.log('KlarnaRemoteSend.sendPostRequest url=' + url + ' jsonString=' + jsonString);
    console.log('**** windowRef.getMaxTries ****' + this.windowRef.getMaxTries());
    for (let count = 0; count < this.windowRef.getMaxTries(); count++) {
      try {
        console.log('KlarnaRemoteSend.sendPostRequest count=' + count + ' maxTries=' + this.windowRef.getMaxTries());
        console.log('**** before sendPostRequestImpl ****');
        if (idempotencyKey == null) {
          return await this.sendPostRequestImpl(url, jsonString);
        } else {
          return await this.sendPostRequestWithIdempotency(url, jsonString, idempotencyKey);
        }
      } catch (e) {
        if (e instanceof ServerError) {
          throw e;
        }
      }
      await this.sleep(this.windowRef.getWaitTimeBetweenRetries());
    }
    throw new NetworkError('NetworkError');
  }

  /**
   * The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
   * Instead, it will resolve normally (with ok status set to false)
   * it will only reject on network failure or if anything prevented the request from completing.
   * @param url
   * @param jsonString
   * @private
   */
  protected async sendPostRequestImpl(url: string, jsonString: string): Promise<Response> {
    console.log('KlarnaRemoteSend.sendPostRequestImpl url=' + url);
    console.log('window.COMPANY ' + this.windowRef.getCompany());
    console.log('window.STORE ' + this.windowRef.getStore());
    console.log('window.DEVICE ' + this.windowRef.getDevice());
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'flooid-company': this.windowRef.getCompany(),
        'flooid-store': this.windowRef.getStore(),
        'flooid-device': this.windowRef.getDevice()
      },
      body: jsonString
    })
      .then(this.onfulfilled())
      .catch((error) => {
        console.error('KlarnaRemoteSend.sendPostRequestImpl network error ' + error);
        throw error;
      });
  }

  /**
   * The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
   * Instead, it will resolve normally (with ok status set to false)
   * it will only reject on network failure or if anything prevented the request from completing.
   * Will also send an idempotency key to guarantee the idempotency of the operation
   * @param url
   * @param jsonString
   * @param idempotencyKey
   * @protected
   */
  protected async sendPostRequestWithIdempotency(url: string, jsonString: string, idempotencyKey: string): Promise<Response> {
    console.log(`KlarnaRemoteSend.sendPostRequestImpl url=${url}`);
    console.log('window.COMPANY ' + this.windowRef.getCompany());
    console.log('window.STORE ' + this.windowRef.getStore());
    console.log('window.DEVICE ' + this.windowRef.getDevice());
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'flooid-company': this.windowRef.getCompany(),
        'flooid-store': this.windowRef.getStore(),
        'flooid-device': this.windowRef.getDevice(),
        'Idempotency-Key': idempotencyKey
      },
      body: jsonString
    })
      .then(this.onfulfilled())
      .catch((error) => {
        console.error(`KlarnaRemoteSend.setPostRequestWithIdempotency  network error ${error}`);
        throw error;
      });
  }

  private async sendRequestWithoutBody(url: string, httpmethod: string): Promise<Response> {
    console.log('KlarnaRemoteSend.sendRequestWithoutBody url=' + url + ' httpmethod=' + httpmethod);
    console.log('window.COMPANY ' + this.windowRef.getCompany());
    console.log('window.STORE ' + this.windowRef.getStore());
    console.log('window.DEVICE ' + this.windowRef.getDevice());
    return await fetch(url, {
      method: httpmethod,
      headers: {
        'Content-Type': 'application/json',
        'flooid-company': this.windowRef.getCompany(),
        'flooid-store': this.windowRef.getStore(),
        'flooid-device': this.windowRef.getDevice()
      }
    })
      .then(this.onfulfilled())
      .catch((error) => {
        console.error('KlarnaRemoteSend.sendRequestWithoutBody ' + httpmethod + ' network error ' + error);
        throw error;
      });
  }

  private onfulfilled(): (data) => Promise<Response> {
    return data => {
      console.error('KlarnaRemoteSend.onfulfilled data.ok ' + data.ok);
      if (!data.ok) {
        console.error('KlarnaRemoteSend.onfulfilled error status = ' + data.status + ' statusText = ' + data.statusText + ' data = ' + data);
        if (data.status === 403 || data.status === 401) {
          console.error('Authentication error');
          throw new AuthenticationError(data.status, data.statusText);
        }
        throw new ServerError(data.status, data.statusText);
      }
      return data;
    };
  }

  sleep(ms): Promise<unknown> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
