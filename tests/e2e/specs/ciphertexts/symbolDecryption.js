module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["game", "ciphertexts", "symbol", "decryption"],

  "check if all elements are visible": (browser) => {
    const page = browser.page.symbolDecryption();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const game = page.section.app.section.game;

    game.expect.section("@title").text.to.match(/^mit Zeichen entschlüsseln$/);

    game.expect.section("@task").to.be.visible;
    const task = game.section.task;

    task.expect.element("@text").to.be.visible;
    task.expect.element("@answer").to.be.visible;
    task.expect.element("@table").to.be.visible;

    browser.end();
  },
};
