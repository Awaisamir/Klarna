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

import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslationsServiceImpl} from '../translations/translations.service.impl';

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss']
})
export class CustomDialogComponent implements OnInit {

  public suspend_transaction_title = null;
  public suspend_transaction_body = null;

  constructor(public modal: NgbActiveModal, private translationService: TranslationsServiceImpl) { }

  ngOnInit(): void {
  }

  setDialogProperties(prpos: any){
    this.suspend_transaction_title = prpos.suspend_transaction_title || 'no title';
    this.suspend_transaction_body = prpos.suspend_transaction_body || 'no body';
  }

  getOK(): string {
    return this.translationService.translations.ok;
  }

  getCancel(): string {
    return this.translationService.translations.cancel;
  }

}
