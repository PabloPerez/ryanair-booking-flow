import {$, browser, ElementFinder, ExpectedConditions as until} from 'protractor';


export const additionalServicesSelectors = {
  priorityBoardingPopup: () => $('.priority-boarding-with-bags-popup__close'),
  seatReminderPopup: () => $('button[ng-click="closeThisDialog()"]'),
  checkoutButton: () => $('#booking-selection button.core-btn-primary'),
};


export const additionalServicesActions = {
  closePriorityBoardingIfDisplayed,
  closeSeatReminder,
  clickCheckout
};

async function closePriorityBoardingIfDisplayed() {
  await browser.wait(until.presenceOf(additionalServicesSelectors.priorityBoardingPopup()));
  await additionalServicesSelectors.priorityBoardingPopup().click();
  await browser.wait(until.not(until.presenceOf(additionalServicesSelectors.priorityBoardingPopup())));
}

async function closeSeatReminder() {
  //fixed sleep as same seats dialog takes time to display and we cannot be sure if it will be displayed or not
  await browser.sleep(3000);
  const seatReminderDialog: ElementFinder = await additionalServicesSelectors.seatReminderPopup();
  if (await  seatReminderDialog.isPresent()){
    await seatReminderDialog.click();
    await browser.wait(until.not(until.presenceOf(seatReminderDialog)));
  }
}

async function clickCheckout() {
  await additionalServicesSelectors.checkoutButton().click();
}