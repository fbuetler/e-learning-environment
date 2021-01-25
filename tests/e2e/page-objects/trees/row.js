module.exports = {
  url: "/trees/row/3",

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

              sections: {
                row: {
                  selector: "#row",

                  elements: {
                    leftView: {
                      selector: "#left-view",
                    },
                    fields: {
                      selector: "[id^='field-']",
                    },
                    rightView: {
                      selector: "#right-view",
                    },
                  },
                },

                interaction: {
                  selector: ".interaction-container",

                  elements: {
                    undo: {
                      selector: "#undo",
                    },
                    trashcan: {
                      selector: "#trashcan",
                    },
                  },

                  sections: {
                    trees: {
                      selector: "#item-selection",

                      elements: {
                        tree: {
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
