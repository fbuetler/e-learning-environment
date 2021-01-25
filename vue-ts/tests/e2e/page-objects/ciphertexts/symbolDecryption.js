module.exports = {
  url: "/symbol/decryption",

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
                text: {
                  selector: "#text",
                },
                answer: {
                  selector: "#answer-input",
                },
                table: {
                  selector: "#symbol-table",
                },
              },
            },
          },
        },
      },
    },
  },
};
