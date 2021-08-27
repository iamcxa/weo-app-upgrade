// import * as Colors from './Colors';
// import * as Fonts from './Fonts';
// import * as Metrics from './Metrics';
// import * as Images from './Images';
// import * as Styles from './Styles';
// import * as Classes from './Classes';
// import * as Global from './Global';
//
// export { Colors, Fonts, Images, Metrics, Styles, Classes, Global };

export { default as Classes } from './Classes';
export { default as Colors } from './Colors';
export { default as Fonts } from './Fonts';
export { default as Global } from './Global';
export { default as Images } from './Images';
export { default as Metrics } from './Metrics';
export { default as Styles } from './Styles';

// export * from './Colors';

// var fs = require('fs');
//
// // Read in the libs from this directory and add them as exports
// // This way you can just reference
// fs.readdirSync('./lib/auth').forEach(function (file) {
//   if (file.indexOf('.js') > -1 && file != 'index.js')
//     exports[file.replace('.js', '')] = require('./' + file);
// });
