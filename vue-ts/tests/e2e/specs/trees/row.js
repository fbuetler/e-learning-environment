module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["game", "trees", "row"],

  "check if all elements are visible in trees/row": (browser) => {
    const page = browser.page.row();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const game = page.section.app.section.game;

    game.expect.section("@title").text.to.match(/^Reihe aus 3 Bäumen$/);

    game.expect.section("@task").to.be.visible;
    const task = game.section.task;

    task.expect.section("@row").to.be.visible;
    const row = task.section.row;

    row.expect.element("@leftView").to.be.visible;
    row.expect.element("@fields").to.be.visible;
    row.assert.elementCount("@fields", 3);
    row.expect.element("@rightView").to.be.visible;

    task.expect.section("@interaction").to.be.visible;
    const interaction = task.section.interaction;

    interaction.expect.element("@undo").to.be.visible;
    interaction.expect.element("@trashcan").to.be.visible;

    interaction.expect.section("@trees").to.be.visible;
    const trees = interaction.section.trees;

    trees.expect.element("@tree").to.be.visible;
    trees.assert.elementCount("@tree", 3);

    browser.end();
  },
};
