module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["game", "words", "change"],

  "check if all elements are visible": (browser) => {
    const page = browser.page.wordsChange();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const game = page.section.app.section.game;

    game.expect
      .section("@title")
      .text.to.match(/^Ähnliche Wörter: Buchstaben austauschen$/);

    game.expect.section("@task").to.be.visible;
    const task = game.section.task;

    task.expect.section("@word").to.be.visible;
    const word = task.section.word;

    word.expect.element("@letters").to.be.visible;

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
