import { Screen } from '~/Helper';

const size = {
  h1: Screen.scale(38),
  h2: Screen.scale(34),
  h3: Screen.scale(30),
  h4: Screen.scale(26),
  input: Screen.scale(18),
  regular: Screen.scale(17),
  medium: Screen.scale(14),
  small: Screen.scale(12),
};

const style = {
  h1: {
    fontSize: size.h1,
  },
  h2: {
    fontSize: size.h2,
  },
  h3: {
    fontSize: size.h3,
  },
  h4: {
    fontSize: size.h4,
  },
  small: {
    fontSize: size.small,
  },
  small500: {
    fontSize: size.small,
    fontWeight: '500',
  },
  normal: {
    fontSize: size.normal,
  },
  normal500: {
    fontSize: size.normal,
    fontWeight: 'bold',
  },
  regular: {
    fontSize: size.regular,
  },
  regular500: {
    fontSize: size.regular,
    fontWeight: '500',
  },
  medium: {
    fontSize: size.medium,
  },
  medium400: {
    fontSize: size.medium,
    fontWeight: '400',
  },
  medium500: {
    fontSize: size.medium,
    fontWeight: '500',
  },
  mediumBold: {
    fontSize: size.medium,
    fontWeight: 'bold',
  },
  input: {
    fontSize: size.input,
  },
  input500: {
    fontSize: size.input,
    fontWeight: '500',
  },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  underline: { textDecorationLine: 'underline' },
};

export default {
  size,
  style,
};
