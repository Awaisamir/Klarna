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

import {Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'klarna-web-component';
  serverUrl: string;
  mockMode = 'false';

  constructor(private element: ElementRef)
  {
    const serverUrl = element.nativeElement.getAttribute('serverUrl');
    if (serverUrl != null) {
      this.serverUrl = serverUrl;
    }
    const mockMode = element.nativeElement.getAttribute('mockMode');
    if (mockMode != null) {
      this.mockMode = mockMode;
    }
    console.log('AppComponent constructor serverUrl = ' + this.serverUrl);
    console.log('AppComponent constructor mockMode = ' + this.mockMode);
  }
}
