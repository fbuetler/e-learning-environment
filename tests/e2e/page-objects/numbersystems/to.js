module.exports = {
  url: "/coins/normal/to",

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
                number: {
                  selector: "#number",
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
