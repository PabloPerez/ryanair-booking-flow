import {$, $$, browser, by, element, ElementFinder, ExpectedConditions as until} from 'protractor';
import {LOGINDATA, utilsActions} from '../utils';
import {expect} from 'chai';


export const passengerPaymentDetailsSelectors = {
  loginPanel: () => $('div.login-register'),
  loginDialog: () => $('.signup-home-form-dialog'),
  loginButton: () => $('button[ui-sref="login"]'),
  loginEmail: () => $('input[type=email]'),
  loginPassword: () => $('input[type=password]'),
  loginDialogButton: () => $('signup-home-form button.core-btn-primary'),
  loginRememberCheckbox: () => $('input[id^=remember]'),
  passengerRow: (paxNum: number) => $$('div.pax-form-element').get(paxNum),
  infantRow: (paxNum: number) => $$('div[ng-if="::passenger.infant"]').get(paxNum),
  titleInput: (row: ElementFinder) => row.$('.payment-passenger-title select'),
  firstNameInput: (row: ElementFinder) => row.$('.payment-passenger-first-name input'),
  lastNameInput: (row: ElementFinder) => row.$('.payment-passenger-last-name input'),
  infantFirstNameInput: (row: ElementFinder) => element(by.model('passenger.infant.name.first')),
  infantLastNameInput: (row: ElementFinder) => element(by.model('passenger.infant.name.last')),
  infantBirthDay: () => element(by.model('selectedDate.date')),
  infantBirthMonth: () => element(by.model('selectedDate.month')),
  infantBirthYear: () => element(by.model('selectedDate.year')),
  phoneCountryInput: () => $('.phone-number-country select'),
  phoneNumberInput: () => $('.phone-number input'),
  cardNumberInput: () => $('input[id^=cardNumber]'),
  cardTypeInput: () => $('select[id^=cardType]'),
  cardSecurityCodeInput: () => $('input[name="securityCode"]'),
  cardHolderInput: () => $('input.cardholder'),
  expMonthInput: () => $('select.expiry-month-select'),
  expYearInput: () => $('select.expiry-year-select'),
  addressInput: () => $('#billingAddressAddressLine1'),
  cityInput: () => $('#billingAddressCity'),
  acceptTermsCheckbox: () => $('div.terms svg'),
  payNowButton: () => element(by.buttonText('Pay Now')),
  paymentError: () => $('prompt.error'),
  planeSpinner: () => $('div[loading-spinner]:not(.ng-hide)')
};

export const passengerPaymentDetailsActions = {
  login,
  fillPassengerData,
  fillContactDetails,
  fillPaymentDetails,
  fillBillingAddress,
  acceptAndContinue
};

export const passengerPaymentDetailsChecks = {
  checkPaymentDeclined,
};

async function login() {
  await browser.wait(until.presenceOf(passengerPaymentDetailsSelectors.loginPanel()));
  await passengerPaymentDetailsSelectors.loginButton().click();
  await browser.wait(until.presenceOf(passengerPaymentDetailsSelectors.loginEmail()));
  const loginDetails: string [] = Buffer.from(LOGINDATA, 'base64').toString().split(':');
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.loginEmail(), loginDetails[0]);
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.loginPassword(), loginDetails[1]);
  await passengerPaymentDetailsSelectors.loginRememberCheckbox().click();
  await passengerPaymentDetailsSelectors.loginDialogButton().click();
  await browser.wait(until.not(until.presenceOf(passengerPaymentDetailsSelectors.loginDialog())));
}

async function fillPassengerData(adtNum: number, teenNum: number, chdNum: number, infNum: number) {
  const paxNums: number[] = [adtNum, teenNum, chdNum, infNum];
  const numbers: string[] = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const paxNames: string[] = ['Adt', 'Teen', 'Chd', 'Inf'];
  let paxIndex: number = 0;
  for (let i = 0; i < paxNums.length; i++) {
    for (let j = 0; j < paxNums[i]; j++) {
      //special row and input selectors for infant under adult
      let passengerRow: ElementFinder;
      if (i == 3) {
        passengerRow = await passengerPaymentDetailsSelectors.infantRow(paxIndex);
        await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.infantFirstNameInput(passengerRow), paxNames[i] + numbers[j % 10]);
        await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.infantLastNameInput(passengerRow), 'Testuser');
        const infantDate: string[] = utilsActions.getInfantBirthDate();
        await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.infantBirthDay(), infantDate[0]);
        await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.infantBirthMonth(), infantDate[1]);
        await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.infantBirthYear(), infantDate[2]);
      }
      else {
        passengerRow = await passengerPaymentDetailsSelectors.passengerRow(paxIndex);
        //children and infants don't have title
        if (i < 2) {
          const titleInput: ElementFinder = passengerPaymentDetailsSelectors.titleInput(passengerRow);
          await titleInput.click();
          await utilsActions.sendKeyToInput(titleInput, 'Mr');
        }
        await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.firstNameInput(passengerRow), paxNames[i] + numbers[j % 10]);
        await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.lastNameInput(passengerRow), 'Testuser');
      }
      paxIndex++;
    }
  }
}

async function fillContactDetails() {
  const phoneCountryInput: ElementFinder = passengerPaymentDetailsSelectors.phoneCountryInput();
  await phoneCountryInput.click();
  await utilsActions.sendKeyToInput(phoneCountryInput, 'Spain');
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.phoneNumberInput(), '666666666');
}

async function fillPaymentDetails(cardNum: string, expDate: string, cvv: string) {
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.cardNumberInput(), cardNum.replace(/ /g, ''));
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.cardTypeInput(), 'MasterCard');
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.expMonthInput(), expDate.split('/')[0]);
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.expYearInput(), '20' + expDate.split('/')[1]);
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.cardHolderInput(), 'Adtone Testuser');
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.cardSecurityCodeInput(), cvv);
}

async function fillBillingAddress() {
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.addressInput(), 'False Street 123');
  await utilsActions.sendKeyToInput(passengerPaymentDetailsSelectors.cityInput(), 'Dublin');
}

async function acceptAndContinue() {
  await utilsActions.scrollAndClickOn(passengerPaymentDetailsSelectors.acceptTermsCheckbox());
  await utilsActions.scrollAndClickOn(passengerPaymentDetailsSelectors.payNowButton());
}

async function checkPaymentDeclined() {
  await browser.wait(until.presenceOf(passengerPaymentDetailsSelectors.planeSpinner()));
  await browser.wait(until.not(until.presenceOf(passengerPaymentDetailsSelectors.planeSpinner())));
  await expect(await passengerPaymentDetailsSelectors.paymentError().isDisplayed()).to.be.true;
}


