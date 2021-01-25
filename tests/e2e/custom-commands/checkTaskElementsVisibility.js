module.exports = {
  command: function(app) {
    app.expect.section("@game").to.be.visible;
    const game = app.section.game;

    game.expect.section("@title").to.be.visible;

    game.expect.section("@title").to.be.visible;

    game.expect.section("@tutorial").to.be.visible;

    // game.expect.section("@result").to.be.visible;

    game.expect.section("@buttonmenu").to.be.visible;
    const buttonmenu = game.section.buttonmenu;

    buttonmenu.expect.element("@next").to.be.visible;
    buttonmenu.expect.element("@check").to.be.visible;

    game.expect.section("@task").to.be.visible;
  },
};
