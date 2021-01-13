module.exports = {
  command: function(app) {
    app.expect.section("@header").to.be.visible;
    // app.expect.section("@footer").to.be.visible; // TODO enable after footer has some content
  },
};
