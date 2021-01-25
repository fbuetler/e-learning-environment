module.exports = {
  command: function(page) {
    page.navigate();
    page.waitForElementVisible("@app");
  },
};
