module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["game", "coins", "normal", "from"],

  "check if all elements are visible": (browser) => {
    const page = browser.page.coinsFrom();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const game = page.section.app.section.game;

    game.expect.section("@title").text.to.match(/^Münzbeträge ausrechnen$/);

    game.expect.section("@task").to.be.visible;
    const task = game.section.task;

    task.expect.element("@coins").to.be.visible;
    task.expect.element("@answer").to.be.visible;

    browser.end();
  },
};
