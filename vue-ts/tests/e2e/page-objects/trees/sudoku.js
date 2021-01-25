module.exports = {
  url: "/trees/sudoku/3",

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
                sudoku: {
                  selector: "#sudoku",

                  elements: {
                    topView: {
                      selector: "[id^='top-view-']",
                    },
                    leftView: {
                      selector: "[id^='left-view-']",
                    },
                    fields: {
                      selector: "[id^='field-']",
                    },
                    rightView: {
                      selector: "[id^='right-view-']",
                    },
                    bottomView: {
                      selector: "[id^='bottom-view-']",
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
