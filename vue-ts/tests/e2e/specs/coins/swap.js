module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["game", "coins", "normal", "swap"],

  "check if all elements are visible": (browser) => {
    const page = browser.page.swap();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const game = page.section.app.section.game;

    game.expect
      .section("@title")
      .text.to.match(/^Gleichwertige Münzen tauschen$/);

    game.expect.section("@task").to.be.visible;
    const task = game.section.task;

    task.expect.element("@coins").to.be.visible;
    task.expect.element("@dropzone").to.be.visible;

    task.expect.section("@interaction").to.be.visible;
    const interaction = task.section.interaction;

    interaction.expect.element("@undo").to.be.visible;

    interaction.expect.section("@itemSelection").to.be.visible;
    const itemSelection = interaction.section.itemSelection;

    itemSelection.expect.element("@items").to.be.visible;
    itemSelection.assert.elementCount("@items", 6);

    browser.end();
  },
};
