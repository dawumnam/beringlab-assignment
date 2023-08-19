import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Express API",
      version: "0.1.0",
      description:
        "This is a REST API application made with Express for bering labs assignment.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Dawum Nam",
        url: "https://github.com/dawumnam",
        email: "dawumnam@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
  },
  apis: ["./src/docs/account.docs.yaml", "./src/docs/card.docs.yaml"],
};

export const specs = swaggerJSDoc(options);
