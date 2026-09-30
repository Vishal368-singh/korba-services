// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],

//   base: "/PropSurvey/",

//   server: {
//     configureServer(server) {
//       server.middlewares.use((req, res, next) => {
//         // Redirect /PropSurvey → /PropSurvey/
//         if (req.url === "/PropSurvey") {
//           res.statusCode = 301;
//           res.setHeader("Location", "/PropSurvey/");
//           res.end();
//           return;
//         }

//         next();
//       });
//     },

//     proxy: {
//       "/gis-images": {
//         target: "https://weather.mlinfomap.com",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/gis-images/, ""),
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function redirectPropSurveySlash() {
  return {
    name: "redirect-propsurvey-slash",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/PropSurvey") {
          res.statusCode = 302;
          res.setHeader("Location", "/PropSurvey/");
          res.end();
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [redirectPropSurveySlash(), react(), tailwindcss()],

  // Production needs /PropSurvey/
  // Development can avoid Vite's strict base check
  base: "/PropSurvey/",

  server: {
    proxy: {
      "/gis-images": {
        target: "https://weather.mlinfomap.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gis-images/, ""),
      },
    },
  },
}));


/***
 Implemented OTP verification functionality for user email validation
Created the user activation API to change status from Pending to Active
Integrated OTP verification with the user activation API
Implemented user deactivation functionality to change Active users to Inactive.
Added user status validation during the login process.
Added session and token invalidation when a user is deactivated.
Integrated activation and deactivation APIs with the frontend.
Debugged and fixed API integration issues during user activation.*/