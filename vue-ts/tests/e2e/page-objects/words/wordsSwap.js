module.exports = {
  url: "/words/swap",

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
                    arrows: {
                      selector: "[id^='arrow-']",
                    },
                    swapArea: {
                      selector: "[id^='rect-around-arrow-']",
                    },
                  },
                },

                interaction: {
                  selector: ".interaction-container",

                  elements: {
                    undo: {
                      selector: "#undo",
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
