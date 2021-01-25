module.exports = {
  // could be any game path
  url: "/words/add",

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
