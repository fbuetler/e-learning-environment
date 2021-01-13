module.exports = {
  url: "/wordsadd",

  elements: {
    app: "#app",
  },

  sections: {
    app: {
      selector: "#app",

      sections: {
        header: {
          selector: "header",
        },
        game: {
          selector: "#game",

          sections: {
            title: {
              selector: "h2",
            },
            tutorial: {
              selector: "#tutorial-wrapper",
            },
            result: {
              selector: "#result",
            },
            buttonmenu: {
              selector: "#button-menu",

              elements: {
                next: {
                  selector: "#button-menu-next",
                },
                check: {
                  selector: "#button-menu-check",
                },
              },
            },
            task: {
              selector: "#task",

              sections: {
                tutorialAnimation: {
                  selector: "#tutorial-animation",
                },
                description: {
                  selector: "#task-description", // TODO add as slot
                },
                word: {
                  selector: "#word-container",

                  elements: {
                    letters: {
                      selector: "[id^='word-char-']",
                    },
                    arrows: {
                      selector: "[id^='arrow-']",
                    },
                    addArea: {
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

                  sections: {
                    alphabet: {
                      selector: "#alphabet",

                      elements: {
                        letters: {
                          selector: "[id^='alphabet-']",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        footer: {
          selector: "footer",
        },
      },
    },
  },
};
