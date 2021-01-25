module.exports = {
  url: "/symbol/encryption",

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
                dropzone: {
                  selector: "#dropzone",
                },
                undo: {
                  selector: "#undo",
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
