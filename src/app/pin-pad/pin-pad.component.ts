/*
 * Copyright (c) Flooid Limited 2021. All rights reserved.
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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import {TranslationsServiceImpl} from '../translations/translations.service.impl';

@Component({
  styleUrls: ['./pin-pad.component.scss'],
  selector: 'app-pin-pad',
  templateUrl: './pin-pad.component.html'
})
export class PinPadComponent {
  @Output()
  numberPressed = new EventEmitter<string>();
  @Output()
  deletePressed = new EventEmitter<string>();

  constructor(private translationServiceImpl: TranslationsServiceImpl) {
  }

  keypadButtonPressed(key: string): void {
    this.numberPressed.emit(key);
  }

  keypadDeleteButtonPressed(key: string): void {
    this.deletePressed.emit(key);
  }

  getBackspace(): string {
    return this.translationServiceImpl.translations.backspace;
  }
}

