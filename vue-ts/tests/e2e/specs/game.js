module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["game"],

  "check if all elements are visible in game": (browser) => {
    const page = browser.page.game();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const app = page.section.app;
    browser.checkLayoutVisibility(app);
    browser.checkTaskElementsVisibility(app);

    browser.end();
  },
};
