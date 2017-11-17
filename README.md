#Ryanair  automated booking flow: Protractor, Cucumber and Typescript

Ryanair booking flow automation until payment page

#### Technologies used
- Protractor
- CucumberJS
- Typescript 

Ryanair website has been built with AngularJS, so **Protractor** has been used as e2e framework due to Its good support and features
for Angular Apps (specific locators, automatic waiting)

**Jasmine** is the default BDD framework supported by Protractor, so in order to make it work with **CucumberJS**, some 
custom configuration was needed in `conf.js` file. Also, **chai** assertion library is used for the checks

**Typescript** has been chosen over plain Javascript for its benefits (type-checking, latest ES support, IDE integration)

**MomentJS** used for date-time management

Synchronization has been managed with async/await. For that, Selenium promise manager has been disabled `SELENIUM_PROMISE_MANAGER=false`.
The reason behind It It's the improved readability and makes asynchronous code management easier.


### Features

- **Citypair selection**: It's possible to introduce different origin and destination in the scenario Given step
- **Relative and absolute dates supported**: It's possible to enter both absolute dates in the format `20/02/2018` or 
relative dates, in the format `+34`, meaning 34 days from now
- **One Way and Round Trip supported**: It's possible to give departing and arrival dates in the formats `20/02/2018-26/02/2018` or
`+34-+40`, and in this case, the flow will be round trip.
- **Passenger combination**: Any passenger combination allowed by the web should be working
- **Payment details**: CC details are given in the When step, though for the moment, credit card type is just Mastercard
- **Popup and dialog management**: Dialogs and alerts like mandatory seat selection, priority boarding are detected and managed 
during the flow
- **Seat selection**: It's possible to select different type of seats for the passengers. In the example scenarios, they are
only added if mandatory

### Future enhancements

- Enhance login process and login details storage
- Additional services booking (other than seats)
- Creation of more atomic steps in order to give input on any step of the flow

### Installing and running

#### Requirements:

You should have installed:

- Java SDK and JRE
- node.js
- Google Chrome

##### Install Cucumber

``` npm install -g cucumber ```

##### Install protractor

``` npm install -g protractor ```

##### Update webdriver

``` webdriver-manager update ```

##### Go on the project folder and install it

``` npm install ```

#### Running

Make sure webdriver is running and leave it running for the test execution

``` webdriver-manager start ```

Run the tests

``` npm run test ```

### Results and reporting
