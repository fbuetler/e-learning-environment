module.exports = {
  url: "/coins/normal/from",

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
                coins: {
                  selector: "#items",
                },
                answer: {
                  selector: "#answer",
                },
              },
            },
          },
        },
      },
    },
  },
};
