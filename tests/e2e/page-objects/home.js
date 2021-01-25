module.exports = {
  url: "/",

  elements: {
    app: "#app",
  },

  sections: {
    app: {
      selector: "#app",

      elements: {
        views: {
          selector: ".card",
        },
      },

      sections: {
        header: {
          selector: "header",
        },
        footer: {
          selector: "footer",
        },
      },
    },
  },
};
