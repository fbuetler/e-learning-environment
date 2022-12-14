module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["game", "ciphertexts", "symbol", "encryption"],

  "check if all elements are visible": (browser) => {
    const page = browser.page.symbolEncryption();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const game = page.section.app.section.game;

    game.expect.section("@title").text.to.match(/^Mit Zeichen verschlüsseln$/);

    game.expect.section("@task").to.be.visible;
    const task = game.section.task;

    task.expect.element("@text").to.be.visible;
    task.expect.element("@dropzone").to.be.visible;
    task.expect.element("@undo").to.be.visible;
    task.expect.element("@table").to.be.visible;

    browser.end();
  },
};
