module.exports = {
  url: "/coins/decimal/swap",

  elements: {
    app: "#app",
  },

  sections: {
    app: {
      selector: "#app",

      sections: {
        game: {
          selector: "#game",

          sections: {
            title: {
              selector: "h2",
            },
            task: {
              selector: "#task",

              elements: {
                items: {
                  selector: "#items",
                },
                dropzone: {
                  selector: "#dropzone",
                },
              },

              sections: {
                interaction: {
                  selector: ".interaction-container",

                  elements: {
                    undo: {
                      selector: "#undo",
                    },
                  },

                  sections: {
                    itemSelection: {
                      selector: "#item-selection",

                      elements: {
                        items: {
                          selector: "[id^='item-selection-']",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
