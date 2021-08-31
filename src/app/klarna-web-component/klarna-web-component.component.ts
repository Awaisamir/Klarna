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

import {Component, ElementRef, Input, OnInit, OnChanges, ViewEncapsulation, NgZone, ChangeDetectorRef} from '@angular/core';
import {PollSessionStatusService} from '../service/klarna-poll-session.service';
import {WindowRef} from '../service/window.service';
import {PaymentSessionStatus} from '../datamodel/klarna-order.status';
import {SettingsService} from '../service/settings.service';
import {ModalService} from '../service/modal.service';
import {isValidPhoneNumber} from 'libphonenumber-js/mobile';
import {CountryCode} from 'libphonenumber-js/types';
import {getCountries} from 'libphonenumber-js/mobile';
import {ConfigError} from '../error/klarna-config.error';
import {NetworkError} from '../error/klarna-network.error';
import {ServerError} from '../error/klarna-server.error';
import {AuthenticationError} from '../error/klarna-authentication.error';
import {PaymentService} from '../service/klarna-payment.service';
import {DistributionError} from '../error/klarna-distribution.error';
import {CustomDialogService} from '../service/custom-dialog.service';
import {CancelPaymentService} from '../service/cancel-payment.service';
import {KlarnaRefundOrderService} from '../service/klarna-refund-order.service';
import {RefundError} from '../error/klarna-refund-error';
import {TranslationsServiceImpl} from '../translations/translations.service.impl';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-klarna-web-component',
  templateUrl: './klarna-web-component.component.html',
  styleUrls: ['./klarna-web-component.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KlarnaWebComponentComponent implements OnInit, OnChanges {
  @Input()
  serverUrl: string;
  imageSource: string;
  @Input()
  mockMode = 'false';

  @Input()
  phoneNumber = '';
  @Input()
  countryCode: string;
  @Input()
  maxLength = 15;
  @Input()
  countries: CountryCode[];

  private status = 'ENTRY';
  private validNumber: boolean;
  private errorTitle: string;
  private errorMessage: string;
  errorOccurred: boolean;
  cancelButtonDisabled = false;
  payButtonDisabled = false;
  suspendButtonDisabled = false;
  elementHidden = false;
  okButtonHidden = true;
  userInputCountryCode = false;

  constructor(private paymentService: PaymentService,
              private cancelPaymentService: CancelPaymentService,
              private refundOrderService: KlarnaRefundOrderService,
              private pollSessionStatusService: PollSessionStatusService,
              private settingsService: SettingsService,
              private windowRef: WindowRef,
              private element: ElementRef,
              private modalService: ModalService,
              private dialogService: CustomDialogService,
              private translationsServiceImpl: TranslationsServiceImpl,
              private zone: NgZone,
              private changeDetectorRef: ChangeDetectorRef) {
    this.translationsServiceImpl.reload('en_GB', () => {});
    const attribute = element.nativeElement.getAttribute('serverUrl');
    if (attribute != null) {
      this.serverUrl = attribute;
    }
    window[`updateMFELocale`] = (locale) => {
      zone.run(() => {
        this.updateLocale(locale);
      });
    };
    const mockMode = element.nativeElement.getAttribute('mockMode');
    if (mockMode != null) {
      this.mockMode = mockMode;
    }
    console.log('KlarnaWebComponentComponent constructor serverUrl = ' + this.serverUrl);
    console.log('KlarnaWebComponentComponent constructor mockMode = ' + this.mockMode);
  }

  ngOnChanges(): void{
    console.log('Ng On Changes');
    this.onRefresh();
  }

  getCountryCode(): string{
    if (!this.userInputCountryCode) {
      try {
        this.countryCode = this.windowRef.getSessionRequest().purchaseCountry;
      } catch (e) {
        this.countryCode = 'GB';
      }
    }
    return this.countryCode;
  }

  setCountryCode($event: Event): void {
    this.countryCode = ($event.target as HTMLInputElement).value;
    this.userInputCountryCode = true;
    console.log(`Setting country code to ${this.countryCode}`);
  }

  private onRefresh(): void {
    console.log(`On the Refresh`);
    this.countries = getCountries();
    this.windowRef.initExternalFields();
  }


  ngOnInit(): void {
    console.log(`On Init`);
    this.pollSessionStatusService.onStatusChange(this.updateStatus.bind(this));
    this.paymentService.onStatusChange(this.updateStatus.bind(this));
    console.log('KlarnaWebComponentComponent ngOnInit mockMode = ' + this.mockMode);
    console.log('KlarnaWebComponentComponent ngOnInit serverUrl = ' + this.serverUrl);
    this.settingsService.setMockMode(this.mockMode);
    this.changeDetectorRef.detectChanges();
    this.phoneNumber = '';
    this.errorMessage = '';
    this.disableSuspendButton();
    this.onRefresh();
  }

  updateStatus(status: string): void {
    console.log('KlarnaFinanceComponent updateStatus ' + status);
    this.status = status;
    if (this.status === PaymentSessionStatus.WAITING ||
      this.status === PaymentSessionStatus.IN_PROGRESS ||
      this.status === PaymentSessionStatus.COMPLETED) {
      this.disablePayButton();
    } else if (this.status === PaymentSessionStatus.DISABLED ||
      this.status === PaymentSessionStatus.CANCELLED) {
      this.closeModal('custom-modal');
      this.hideProgressBar();
      this.setPayButtonText(this.translationsServiceImpl.translations.pay, true);
      this.disableSuspendButton();
    }
  }

  handleKlarnaFinanceTransaction(phoneNumber: string): void {
    if (this.windowRef.isRefund()){
      this.hideScreenElements(true);
      this.createRefund();
    } else {
      this.createPayment(phoneNumber);
    }
  }

  async createRefund(): Promise<void> {
    this.errorOccurred = false;
    try {
      await this.refundOrderService.createRefundRequestAsync(this.serverUrl);
      this.closeModal('custom-modal');
    } catch (e) {
      this.handleError(e);
    }
  }

  createPayment(phoneNumber: string): void {
    if (this.windowRef.getHppSessionId() == null) {
      console.log(`Country Code is ${this.countryCode}`);
      // @ts-ignore
      this.validNumber = isValidPhoneNumber(phoneNumber, this.countryCode);
      this.windowRef.phoneNumber = phoneNumber;
      console.log(phoneNumber + ' checked, validNumber is ' + this.validNumber);
    }
    else {
      /**
       * This is recall scenario, So customer phone number will not be captured.
       */
      this.validNumber = true;
    }
    if (this.validNumber === true) {
      this.status = '';
      this.clearErrorMessage();
      this.createPaymentAsync(phoneNumber);
      this.closeModal('custom-modal');
    } else {
      this.setPayButtonDisabled(false);
      this.hideProgressBar();
    }
  }

  suspendPayment(): void {
    this.hideProgressBar();
    this.disableSuspendButton();
    this.setCancelButtonDisable(true);
    this.pollSessionStatusService.pausePolling();
    this.dialogService.openDialog().then(result => {
      this.paymentService.suspendPayment();
    }, () => {
      this.pollSessionStatusService.resumePolling();
      this.showProgressBar();
      this.enableSuspendButton();
      this.setCancelButtonDisable(false);
    });
  }

  isMockMode(): boolean {
    return this.mockMode === 'true';
  }

  async createPaymentAsync(phoneNumber: string): Promise<void> {
    this.errorOccurred = false;
    try {
      await this.paymentService.createPayment(this.serverUrl, phoneNumber, this.getCountryCode());
    } catch (e) {
      this.handleError(e);
    }
    this.openModal('custom-modal');
  }

  private handleError(e): void {
    console.error('ServerError ' + e);
    this.setCancelButtonDisable(false);
    this.errorOccurred = true;
    if (e instanceof ConfigError) {
      console.error('*** ConfigError ***');
      this.showErrorMessage(this.translationsServiceImpl.translations.configError.title, this.translationsServiceImpl.translations.configError.message);
    } else if (e instanceof NetworkError) {
      console.error('*** NetworkError ***');
      this.showErrorMessage(this.translationsServiceImpl.translations.networkError.title, this.translationsServiceImpl.translations.networkError.message);
    } else if (e instanceof AuthenticationError) {
      console.error('*** AuthenticationError ***');
      this.showErrorMessage(this.translationsServiceImpl.translations.authenticationError.title, this.translationsServiceImpl.translations.authenticationError.message);
    } else if (e instanceof ServerError) {
      console.error('*** ServerError ***');
      this.showErrorMessage(this.translationsServiceImpl.translations.serverError.title, this.translationsServiceImpl.translations.serverError.message);
    } else if (e instanceof DistributionError) {
      console.error('*** DistributionError ***');
      this.showErrorMessage(this.translationsServiceImpl.translations.distributionError.title, this.translationsServiceImpl.translations.distributionError.message);
    } else if (e instanceof RefundError){
      console.error('*** RefundError ***');
      this.showErrorMessage(this.translationsServiceImpl.translations.refundError.title, this.translationsServiceImpl.translations.refundError.message);
      this.hideOtherElementsAndShowOkButton();
    } else {
      this.showErrorMessage(this.translationsServiceImpl.translations.defaultError.title, this.translationsServiceImpl.translations.defaultError.message);
      if (!this.isMockMode()) {
        this.hideOtherElementsAndShowOkButton();
      }
    }
  }

  private hideOtherElementsAndShowOkButton(): void  {
    this.elementHidden = true;
    this.okButtonHidden = false;
  }

  getTitle(): string {
    return `${this.translationsServiceImpl.translations.title}`;
  }

  getMessage1(): string {
    try {
      return this.translationsServiceImpl.translations.message1[this.status];
    } catch (e) {
      return '';
    }
  }

  getMessage2(): string {
    try {
      return this.translationsServiceImpl.translations.message2[this.status];
    } catch (e) {
      return '';
    }
  }

  getMessage3(): string {
    try {
      return this.translationsServiceImpl.translations.message3[this.status];
    } catch (e) {
      return '';
    }
  }

  getMessage4(): string {
    if (this.validNumber === false) {
      return this.translationsServiceImpl.translations.message4.INVALID;
    } else {
      return '';
    }
  }

  getOK(): string {
    return this.translationsServiceImpl.translations.ok;
  }

  getPay(): string {
    return this.translationsServiceImpl.translations.pay;
  }

  getSuspend(): string {
    return this.translationsServiceImpl.translations.suspend;
  }

  getCancel(): string {
    return this.translationsServiceImpl.translations.cancel;
  }
  getCustomerPhoneNumberText(): string {
    return this.translationsServiceImpl.translations.customerPhoneNumber;
  }

  getErrorTitle(): string {
    return this.errorTitle;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  showErrorMessage(title: string, message: string): void {
    this.errorTitle = title;
    this.errorMessage = message;
  }

  clearErrorMessage(): void {
    this.errorTitle = '';
    this.errorMessage = '';
  }

  getStatus(): string {
    if (this.status === PaymentSessionStatus.WAITING ||
      this.status === PaymentSessionStatus.IN_PROGRESS ||
      this.status === PaymentSessionStatus.COMPLETED ||
      this.status === PaymentSessionStatus.DISABLED ||
      this.status === PaymentSessionStatus.CANCELLED
    ) {
      return this.status;
    } else {
      return '';
    }
  }

  closeBrowser(): void {
    this.cancelPaymentService.cancelPayment(this.serverUrl, this.paymentService.getOrderId(), this.paymentService.getHppSessionId());
  }

  closeBrowserRefund(): void {
    this.windowRef.callbackFunctionCloseBrowserRefundFailed();
  }

  openModal(id: string): void {
    this.modalService.open(id);
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }

  showProgressBar(): void {
    this.imageSource = './assets/please_wait_anim.gif';
  }

  hideProgressBar(): void {
    this.imageSource = '';
  }

  onKeypadButtonPressed(value: string): void {
    this.phoneNumber = this.ensureValidLength(this.phoneNumber + value);
  }

  onKeypadDeleteButtonPressed(event: string): void {
    this.phoneNumber = this.phoneNumber.substring(0, this.phoneNumber.length - 1);
  }

  private ensureValidLength(value: string): string {
    let result = value;
    if (value && value.length > this.maxLength) {
      result = result.substring(0, this.maxLength);
    }
    return result;
  }

  disablePayButton(): void {
    this.setPayButtonText(this.getPay(), true);
  }

  disableSuspendButton(): void {
    this.setSuspendButton(true);
    console.log(`Disabling Suspend Button ${this.suspendButtonDisabled}`);
  }

  enableSuspendButton(): void {
    this.setSuspendButton(false);
  }

  setSuspendButton(disable: boolean): void {
    const btn = document.getElementById('suspend-button');
    if (btn != null) {
      if (disable) {
        btn.setAttribute('disabled', 'disabled');
      } else {
        btn.removeAttribute('disabled');
      }
    }
  }

  setCancelButtonDisable(disable: boolean): void {
    this.cancelButtonDisabled = disable;
  }

  setPayButtonText(text, disable: boolean): void {
    const btn = document.getElementById('pay-button');
    btn.textContent = text;
    this.setPayButtonDisabled(disable);
  }

  setPayButtonDisabled(disabled: boolean): void {
    this.payButtonDisabled = disabled;
  }

  hideScreenElements(hidden: boolean): void {
    this.elementHidden = hidden;
  }
  /**
   * Updates the locale with the given locale if the translation exists
   * @param locale the locale to switch to. The default in this app is 'en_GB'
   */
  updateLocale(locale: string): void {
    console.log(`Reloading with new Locale ${locale}`);
    this.translationsServiceImpl.reload(locale, () => {
      console.log(`Completed reload. Initialising component the locale is ${locale}`);
      this.changeDetectorRef.detectChanges();
      console.log('Translation: ', JSON.stringify(this.translationsServiceImpl.translations));
    });
  }


}
