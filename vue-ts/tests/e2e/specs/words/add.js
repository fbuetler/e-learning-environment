module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["add"],

  "check if all elements are visible in word/add": (browser) => {
    const page = browser.page.add();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const app = page.section.app;
    browser.checkLayoutVisibility(app);
    browser.checkTaskElementsVisibility(app);

    const game = page.section.app.section.game;

    game.expect
      .section("@title")
      .text.to.match(/^Ähnliche Wörter - Buchstabe hinzufügen$/);

    game.expect.section("@task").to.be.visible;
    const task = game.section.task;

    // task.expect.section("@tutorialAnimation").to.be.visible;

    task.expect.section("@word").to.be.visible;
    const word = task.section.word;

    word.expect.element("@letters").to.be.visible;

    word.expect.element("@arrows").to.be.visible;

    word.expect.element("@addArea").to.be.visible;

    task.expect.section("@interaction").to.be.visible;
    const interaction = task.section.interaction;

    interaction.expect.element("@undo").to.be.visible;

    interaction.expect.section("@alphabet").to.be.visible;
    const alphabet = interaction.section.alphabet;

    alphabet.expect.element("@letters").to.be.visible;
    alphabet.assert.elementCount("@letters", 26);

    browser.end();
  },
};
