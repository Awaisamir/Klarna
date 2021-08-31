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

import { ElementFunctions } from '../Framework/element-functions';
import { Launcher } from '../Framework/launcher';
import { WaitFunctions } from '../Framework/wait-functions';
import { browser, by, element, ElementFinder, promise } from 'protractor';

describe('Klarna Financing Web page', () => {
  const elementFunctions = new ElementFunctions();
  const launcher = new Launcher();
  const waitFunctions = new WaitFunctions();
  const title = 'Klarna Financing Tendering';
  const mobileNumber = 'Customer Phone Number:';
  const cancelButton = 'Cancel';
  const payButton = 'Pay';
  const validPhoneNumber = '07919533782';
  const InvalidPhoneNumber = '11111';
  const InvalidPhoneNumberErrorText = 'Invalid mobile phone number entered';
  const paymentInProgressText = 'KLARNA PAYMENT IN PROGRESS';
  const waitingStatus = 'WAITING';
  const inprogressStatus = 'IN_PROGRESS';
  const completedStatus = 'COMPLETED';

  beforeAll(() => {
    launcher.launchApp();
    elementFunctions.navigateTo();
  });

  it('should display Klarna welcome message', () => {
    expect(elementFunctions.getText('titleText')).toEqual(title);
  });

  it('should display mobile number text field', () => {
    expect(elementFunctions.getLabelText('mobileNumber')).toEqual(mobileNumber);
  });

  it('should display cancel button', () => {
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.getButtonText('cancel-button')).toEqual(cancelButton);
  });

  it('should display pay button', () => {
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    expect(elementFunctions.getButtonText('pay-button')).toEqual(payButton);
  });

  it('should display the countrycode dropdown', () => {
    expect(elementFunctions.isVisible('countryCode')).toBeTruthy();
    elementFunctions.clickDropdown('countryCode');
    elementFunctions.clickDropdown('countryCode');
  });

  it('should enter number using keypad', () => {
    elementFunctions.getPhoneTextField().click();
    const keypadValueOne = elementFunctions.EnterNumberFromKeypad('pin-pad-button-1');
    keypadValueOne.click();
    const keypadValueTwo = elementFunctions.EnterNumberFromKeypad('pin-pad-button-2');
    keypadValueTwo.click();
    const keypadValueThree = elementFunctions.EnterNumberFromKeypad('pin-pad-button-3');
    keypadValueThree.click();
    const keypadValueFour = elementFunctions.EnterNumberFromKeypad('pin-pad-button-4');
    keypadValueFour.click();
    const keypadValueFive = elementFunctions.EnterNumberFromKeypad('pin-pad-button-5');
    keypadValueFive.click();
    const keypadValueSix = elementFunctions.EnterNumberFromKeypad('pin-pad-button-6');
    keypadValueSix.click();
    const keypadValueSeven = elementFunctions.EnterNumberFromKeypad('pin-pad-button-7');
    keypadValueSeven.click();
    const keypadValueEight = elementFunctions.EnterNumberFromKeypad('pin-pad-button-8');
    keypadValueEight.click();
    const keypadValueNine = elementFunctions.EnterNumberFromKeypad('pin-pad-button-9');
    keypadValueNine.click();
    const backSpace = elementFunctions.EnterNumberFromKeypad('pin-pad-button-Back');
    for (let i = 0; i < 9; i++) {
      elementFunctions.touchActionElement(backSpace);
    }
    waitFunctions.waitUntilBroswerRefresh();
  });

  it('should validate suspend button is disabled', () => {
    expect(elementFunctions.isEnabled('suspend-button')).toBeFalsy();
    expect(elementFunctions.getButtonText('suspend-button')).toEqual('Suspend');
  });

  it('should suspend the klarna payment', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07405589950')
    waitFunctions.waitUntilPaymentCreated();
    expect(elementFunctions.getText('orderStatus')).toEqual(waitingStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(inprogressStatus);
    waitFunctions.waitUntilOrderStatusChange();;
    expect(elementFunctions.isVisible('suspend-button')).toBeTruthy();
    elementFunctions.ClickSuspendButton();
    waitFunctions.waitUntilModalOpen();
    expect(elementFunctions.isEnabled('cancel-button')).toBeFalsy();
    expect(elementFunctions.isEnabled('pay-button')).toBeFalsy();
    expect(elementFunctions.isEnabled('suspend-button')).toBeFalsy();
    expect(elementFunctions.getText('suspendConfirmationText')).toEqual('Are you sure you wish to suspend?');
    expect(elementFunctions.isEnabled('suspend-ok-button')).toBeTruthy();
    expect(elementFunctions.isEnabled('suspend-cancel-button')).toBeTruthy();;
    elementFunctions.ClickVisibleButton('suspend-ok-button');
    waitFunctions.waitUntilBroswerRefresh();
  });


  it('should validate the invalid phone number error text and color', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterInvalidPhoneNumberAndCreatePayment(InvalidPhoneNumber);
    expect(elementFunctions.getText('validPhoneNumber')).toEqual(InvalidPhoneNumberErrorText);
    expect(elementFunctions.getCssValue('validPhoneNumber')).toBe('rgba(208, 0, 44, 1)');
    const phoneNumberField = elementFunctions.getPhoneTextField();
    phoneNumberField.clear();
  });

  it('should validate the authentication error', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633111');
    expect(elementFunctions.getText('errorTitleText')).toEqual('Klarna Financing not available');
    expect(elementFunctions.getText('errorMessageText')).toEqual('Authentication Error');
    elementFunctions.validatePhoneNumberInputField('07929633111');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    const phoneNumberField = elementFunctions.getPhoneTextField();
    phoneNumberField.clear();
  });

  it('should validate the server error', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633222');
    expect(elementFunctions.getText('errorTitleText')).toEqual('Klarna Financing not available');
    expect(elementFunctions.getText('errorMessageText')).toEqual('Server Error');
    elementFunctions.validatePhoneNumberInputField('07929633222');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    const phoneNumberField = elementFunctions.getPhoneTextField();
    phoneNumberField.clear();
  });

  it('should validate the network error', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633333');
    expect(elementFunctions.getText('errorTitleText')).toEqual('Klarna Financing not available');
    expect(elementFunctions.getText('errorMessageText')).toEqual('Network Error');
    elementFunctions.validatePhoneNumberInputField('07929633333');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    const phoneNumberField = elementFunctions.getPhoneTextField();
    phoneNumberField.clear();
  });

  it('should validate the distribution error', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633444');
    waitFunctions.waitUntilPaymentCreated();
    expect(elementFunctions.getText('orderStatus')).toEqual(waitingStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(inprogressStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(completedStatus);
    expect(elementFunctions.getText('errorTitleText')).toEqual('Klarna Financing not available');
    expect(elementFunctions.getText('errorMessageText')).toEqual('System Error');
    elementFunctions.validatePhoneNumberInputField('07929633444');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    expect(elementFunctions.isEnabled('pay-button')).toBeFalsy();
    waitFunctions.waitUntilBroswerRefresh();
  });

  it('Create a new HPP session Step 2 server error', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633666');
    expect(elementFunctions.getText('errorTitleText')).toEqual('Klarna Financing not available');
    expect(elementFunctions.getText('errorMessageText')).toEqual('Server Error');
    elementFunctions.validatePhoneNumberInputField('07929633666');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    expect(elementFunctions.isEnabled('pay-button')).toBeTruthy();
    const phoneNumberField = elementFunctions.getPhoneTextField();
    phoneNumberField.clear();
  });

  it('Create a new HPP session Step 2 network down', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633777');
    expect(elementFunctions.getText('errorTitleText')).toEqual('Klarna Financing not available');
    expect(elementFunctions.getText('errorMessageText')).toEqual('Network Error');
    elementFunctions.validatePhoneNumberInputField('07929633777');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    expect(elementFunctions.isEnabled('pay-button')).toBeTruthy();
    const phoneNumberField = elementFunctions.getPhoneTextField();
    phoneNumberField.clear();
  });

  it('Create a new order step 5 server error', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633556');
    waitFunctions.waitUntilPaymentCreated();
    expect(elementFunctions.getText('orderStatus')).toEqual(waitingStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(inprogressStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(completedStatus);
    expect(elementFunctions.getText('errorTitleText')).toEqual('Klarna Financing not available');
    expect(elementFunctions.getText('errorMessageText')).toEqual('Server Error');
    elementFunctions.validatePhoneNumberInputField('07929633556');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    expect(elementFunctions.isEnabled('pay-button')).toBeFalsy();
    waitFunctions.waitUntilBroswerRefresh();
  });

  it('Create a new order step 5 network down ', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633557');
    waitFunctions.waitUntilPaymentCreated();
    expect(elementFunctions.getText('orderStatus')).toEqual(waitingStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(inprogressStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(completedStatus);
    expect(elementFunctions.getText('errorTitleText')).toEqual('Klarna Financing not available');
    expect(elementFunctions.getText('errorMessageText')).toEqual('Network Error');
    elementFunctions.validatePhoneNumberInputField('07929633557');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    expect(elementFunctions.isEnabled('pay-button')).toBeFalsy();
    waitFunctions.waitUntilBroswerRefresh();
  });

  it('should terminate the process when customer cancel the payment ', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633560');
    waitFunctions.waitUntilPaymentCreated();
    expect(elementFunctions.getText('orderStatus')).toEqual(waitingStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(inprogressStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('paymentInProgressText')).toEqual('KLARNA PAYMENT CANCELLED');
    elementFunctions.validatePhoneNumberInputField('07929633560');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    expect(elementFunctions.isEnabled('pay-button')).toBeFalsy();
    waitFunctions.waitUntilBroswerRefresh();
  });

  it('should validate the server error when capture order is not allowed', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633565');
    waitFunctions.waitUntilPaymentCreated();
    expect(elementFunctions.getText('orderStatus')).toEqual(waitingStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(inprogressStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('errorTitleText')).toEqual('Klarna Financing not available');
    expect(elementFunctions.getText('errorMessageText')).toEqual('Server Error');
    elementFunctions.validatePhoneNumberInputField('07929633565');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    expect(elementFunctions.isEnabled('pay-button')).toBeFalsy();
    waitFunctions.waitUntilBroswerRefresh();
  });

  it('should validate the server error when no such order is found', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('07929633566');
    waitFunctions.waitUntilPaymentCreated();
    expect(elementFunctions.getText('orderStatus')).toEqual(waitingStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(inprogressStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('errorTitleText')).toEqual('Klarna Financing not available');
    expect(elementFunctions.getText('errorMessageText')).toEqual('Server Error');
    elementFunctions.validatePhoneNumberInputField('07929633566');
    expect(elementFunctions.isVisible('cancel-button')).toBeTruthy();
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    expect(elementFunctions.isEnabled('pay-button')).toBeFalsy();
    waitFunctions.waitUntilBroswerRefresh();
  });

  it('should create and complete payment using different locale', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    const select = element(by.id('countryCode'));
    select.$('[value="PK"]').click();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment('3214041474');
    waitFunctions.waitUntilPaymentCreated();
    expect(elementFunctions.getText('orderStatus')).toEqual(waitingStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(inprogressStatus);
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(completedStatus);
    waitFunctions.waitUntilBroswerRefresh();
  });

  it('should create payment', () => {
    expect(elementFunctions.isVisible('phone-field')).toBeTruthy();
    elementFunctions.EnterValidPhoneNumberAndCreatePayment(validPhoneNumber);
    waitFunctions.waitUntilPaymentCreated();
    expect(elementFunctions.getText('paymentInProgressText')).toEqual(paymentInProgressText);
  });

  it('should display suspend button', () => {
    expect(elementFunctions.isVisible('suspend-button')).toBeTruthy();
    expect(elementFunctions.getButtonText('suspend-button')).toEqual('Suspend');
  });

  it('should display pay button', () => {
    expect(elementFunctions.isVisible('pay-button')).toBeTruthy();
    expect(elementFunctions.getButtonText('pay-button')).toEqual('Pay');
  });

  it('should display waiting status after creating payment', () => {
    expect(elementFunctions.getText('orderStatus')).toEqual(waitingStatus);
  });

  it('should display in-progress status during completing the payment', () => {
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(inprogressStatus);
  });

  it('should display completed status after completing the payment', () => {
    waitFunctions.waitUntilOrderStatusChange();
    expect(elementFunctions.getText('orderStatus')).toEqual(completedStatus);
  });
});
