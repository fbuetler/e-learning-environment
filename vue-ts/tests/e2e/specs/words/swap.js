module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["game", "words", "swap"],

  "check if all elements are visible": (browser) => {
    const page = browser.page.swap();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const game = page.section.app.section.game;

    game.expect
      .section("@title")
      .text.to.match(/^Ähnliche Wörter - Buchstaben vertauschen$/);

    game.expect.section("@task").to.be.visible;
    const task = game.section.task;

    task.expect.section("@word").to.be.visible;
    const word = task.section.word;

    word.expect.element("@letters").to.be.visible;

    word.expect.element("@arrows").to.be.visible;

    word.expect.element("@swapArea").to.be.visible;

    task.expect.section("@interaction").to.be.visible;
    const interaction = task.section.interaction;

    interaction.expect.element("@undo").to.be.visible;

    browser.end();
  },
};
