module.exports = {
  url: "/coins/decimal/from",

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
