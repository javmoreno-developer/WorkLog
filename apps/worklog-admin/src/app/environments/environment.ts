// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders } from "@angular/common/http";


export const environment = {
  production: false,
  headers: new HttpHeaders({
    "api-key": "4f54e235-a92e-4d93-a1a4-ffe842b8e949",
    'Content-Type': 'text/plain',
    "server": "uvicorn",
  }),
  api_url: "http://localhost:8000/api/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
