module.exports = {
  url: "/words/remove",

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
                word: {
                  selector: "#word-container",

                  elements: {
                    letters: {
                      selector: "[id^='word-char-']",
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
                },
              },
            },
          },
        },
      },
    },
  },
};
