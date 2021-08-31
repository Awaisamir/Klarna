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
import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class TranslationsServiceImpl {

  constructor(private http: HttpClient) {
    this.translations = TranslationsServiceImpl.buildEmptyTranslations();
  }

  public translations: any = {};

  private static buildEmptyTranslations(): { alert: {}; login: {}; trainingMode: {}; errors: {} } {
    return {
      errors: {},
      alert: {},
      trainingMode: {},
      login: {}
    };
  }

  reload(locale: string, onComplete): void {
    if (locale) {
      this.findTranslationsFile(locale, '-translations.json', (translations) => {
        // tslint:disable-next-line:forin
        for (const key in translations) {
          this.translations[key] = translations[key];
        }
        onComplete();
      });
    } else {
      onComplete();
    }
  }

  private findTranslationsFile(locale: string, filenameSuffix: string, onTranslationsFound): void {
    let translationsUrl = 'assets/config/translations/' + locale + filenameSuffix;
    this.loadFile(translationsUrl, onTranslationsFound, () => {
      translationsUrl = 'assets/config/translations/en_GB-translations.json';
      this.loadFile(translationsUrl, onTranslationsFound, onTranslationsFound);
    });
  }

  private loadFile(url: string, onComplete, onError): void {
    console.log('Reading translations:' + url);
    this.http
      .get(url)
      .subscribe((data) => {
        console.log('Successfully read translations:' + url);
        onComplete(data);
      }, (err) => {
        const error = 'Failed to read translations file:' + url + ':' + err;
        console.log(error);
        onError(err);
      });
  }


  getTranslationMsg(fullKey: string): string {
    let result = null;
    const keys: Array<string> = fullKey.split('.');
    if (keys.length === 1) {
      result = this.translations[keys[0]];
    } else if (keys.length === 2) {
      result = this.translations[keys[0]][keys[1]];
    } else if (keys.length === 3) {
      result = this.translations[keys[0]][keys[1]][keys[2]];
    } else {
      throw new Error('Unsupported message key:' + fullKey);
    }
    return result;
  }

  formatMsg(translationMsg: string, arg0?: any, arg1?: any, arg2?: any): any {
    let msg = arguments[0];
    let i = 1;
    while (i < arguments.length) {
      msg = msg.replace('{' + (i - 1) + '}', arguments[i++]);
    }
    return msg;
  }

  formatAppVersion(appName: string, version: any): string {
    return `${appName} : ${version}`;
  }
}
