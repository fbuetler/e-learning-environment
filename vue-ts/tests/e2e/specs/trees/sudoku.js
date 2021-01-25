module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["game", "trees", "sudoku"],

  "check if all elements are visible in trees/sudoku": (browser) => {
    const page = browser.page.sudoku();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const game = page.section.app.section.game;

    game.expect.section("@title").text.to.match(/^3x3 Baumsudoku$/);

    game.expect.section("@task").to.be.visible;
    const task = game.section.task;

    task.expect.section("@sudoku").to.be.visible;
    const sudoku = task.section.sudoku;

    sudoku.expect.element("@topView").to.be.visible;
    sudoku.assert.elementCount("@topView", 3);
    sudoku.expect.element("@leftView").to.be.visible;
    sudoku.assert.elementCount("@leftView", 3);
    sudoku.expect.element("@fields").to.be.visible;
    sudoku.assert.elementCount("@fields", 9);
    sudoku.expect.element("@rightView").to.be.visible;
    sudoku.assert.elementCount("@rightView", 3);
    sudoku.expect.element("@bottomView").to.be.visible;
    sudoku.assert.elementCount("@bottomView", 3);

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
