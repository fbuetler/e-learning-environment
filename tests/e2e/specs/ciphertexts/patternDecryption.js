module.exports = {
  beforeEach: (browser) => browser.init(),
  tags: ["game", "ciphertexts", "pattern", "decryption"],

  "check if all elements are visible": (browser) => {
    const page = browser.page.patternDecryption();
    browser.openPage(page);
    // browser.source((result) => console.log(result.value));

    const game = page.section.app.section.game;

    game.expect.section("@title").text.to.match(/^mit Muster entschlüsseln$/);

    game.expect.section("@task").to.be.visible;
    const task = game.section.task;

    task.expect.element("@text").to.be.visible;
    task.expect.element("@answer").to.be.visible;
    task.expect.element("@pattern").to.be.visible;

    browser.end();
  },
};
