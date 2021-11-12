export { default as hook400 } from "./400";
export { default as hook401 } from "./401";
export { default as hook403 } from "./403";
export { default as hook404 } from "./404";
export { default as hook500 } from "./500";
export { default as hook504 } from "./504";
export { default as hookDefaultError } from "./default";

// export const ErrorHandler = (error, isCanceled, canceler) => {
//   // show console warning message
//   __DEV__ &&
//     console.warn(
//       `API Response Error: ${isCanceled ? '(Request Canceled) ' : ''}${
//         error.status || error.message
//       }
//     \n[ Request Path ]\n${get(error, 'config.url')}\n\n[ Full Response ]\n`,
//       JSON.stringify(error, null, 2),
//     );
//
//   switch (error.status) {
//     case 504: {
//       !isCanceled && hook504(error, canceler);
//       break;
//     }
//     default: {
//       !isCanceled && hookDefaultError(error, canceler);
//       break;
//     }
//   }
// };
