module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["home"],

  "check if all views are visible in home": (browser) => {
    const page = browser.page.home();
    browser.openPage(page);

    const app = page.section.app;
    browser.checkLayoutVisibility(app);

    app.expect.element("@views").to.be.visible;
    app.assert.elementCount("@views", 21);
  },
};
