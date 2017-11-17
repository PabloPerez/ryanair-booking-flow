exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',

  baseUrl: 'https://www.ryanair.com/ie/en/',

  SELENIUM_PROMISE_MANAGER: false,

  capabilities: {
    browserName: 'chrome'
  },

  framework: 'custom',  // set to "custom" for cucumber.

  frameworkPath: require.resolve('protractor-cucumber-framework'),  // path relative to the current config file

  specs: [
    './features/*.feature'
  ],

  //had to increase it substantially, as some angular scripts block the execution
  allScriptsTimeout: 100000,

  cucumberOpts: {
    compiler: "ts:ts-node/register",
    require: ['./features/step_definitions/*.ts']
  },

  onPrepare: function () {
    browser.manage().window().maximize(); // maximize the browser before executing the feature files
  }
};
