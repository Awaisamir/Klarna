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

import { browser, by, element, ElementFinder, promise } from 'protractor';
import { WaitFunctions } from './wait-functions';

export class ElementFunctions {
  waitFunctions: WaitFunctions;

  constructor() {
    this.waitFunctions = new WaitFunctions();
  }

  navigateTo(): promise.Promise<any> {
    return browser.get(browser.baseUrl);
  }

  getElementByCss(elementCssPath: string): ElementFinder {
    return element(by.css(elementCssPath));
  }

  getText(elementId: string): promise.Promise<string> {
    return this.getElementbyId(elementId).getText();
  }

  getCssValue(elementId: string): promise.Promise<string> {
    return this.getElementbyId(elementId).getCssValue('color');
  }

  getLabelText(elementId: string): promise.Promise<string> {
    return this.getElementbyId(elementId).getText();
  }

  getButtonText(elementId: string): promise.Promise<string> {
    return this.getElementbyId(elementId).getText();
  }

  getButtonDisplayed(elementId: string): void {
    this.getElementbyId(elementId).isDisplayed().then((isDisplayed) => {
      return isDisplayed;
    });
  }

  isEnabled(elementId: any): promise.Promise<boolean> {
    return this.getElementbyId(elementId).isEnabled();
  }

  isVisible(elementId: any): promise.Promise<boolean> {
    return this.getElementbyId(elementId).isPresent();
  }

  getPhoneTextField(): ElementFinder {
    return this.getElementbyId('phone-field');
  }

  touchActionElement(element: any): void {
    element.click();
  }

  getElementbyId(elementId: string): ElementFinder {
    return element(by.id(elementId));
  }

  EnterValidPhoneNumberAndCreatePayment(validPhoneNumber: any): void {
    this.getPhoneTextField().sendKeys(validPhoneNumber);
    this.touchActionElement(this.getElementbyId('pay-button'));
  }

  EnterNumberFromKeypad(keypadValue: any): ElementFinder {
    return this.getElementbyId(keypadValue);
  }

  EnterInvalidPhoneNumberAndCreatePayment(InvalidPhoneNumber: any): void {
    this.getPhoneTextField().sendKeys(InvalidPhoneNumber);
    this.touchActionElement(this.getElementbyId('pay-button'));
  }

  ClickSuspendButton() {
    this.touchActionElement(this.getElementbyId('suspend-button'));
  }

  ClickVisibleButton(validButtonId: any): void {
    this.touchActionElement(this.getElementbyId(validButtonId));
  }

  validatePhoneNumberInputField(validPhoneNumber: any): void {
    const inputField = this.getElementbyId('phone-field');
    expect(inputField.getAttribute('ng-reflect-model')).toEqual(validPhoneNumber);
  }

  clickDropdown(dropdownId: any): void {
    this.touchActionElement(this.getElementbyId(dropdownId));
  }

}
