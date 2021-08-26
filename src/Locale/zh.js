export default {
  // Language indicator
  language: 'en',

  // Default values for applying during interpolate automatically
  DEFAULT_VALUES: {
    APP_NAME: 'COOL APP',
  },

  // Default API response status strings
  api: {
    button: {
      ok: 'OK',
      more: 'More',
    },
    success: {
      title: 'API Request Success',
      desc: 'The action is completed successfully.',
    },
    failure: {
      title: 'API Request Failure',
      desc: 'The action is failure due to %{message}.(%{statusCode})',
    },
    unavailable: {
      title: 'Request Unavailable',
      desc: 'Server or network unavailable temporarily',
    },
  },

  // Strings for build-in example screens.
  example: {
    // Strings for RootScreen, within object key 'root'.
    root: {
      hello_world: 'Hello World!',
      right: 'Right',
      left: 'Left',
      greeting: 'This is the first scene of your "%{APP_NAME}"!',
      description:
        'This boilerplate provides some useful example that could helps you develop app faster then ever.',
      btnOpenApiExample: 'API Example',
      btnOpenFcmExample: 'FCM Example',
    },
    // Strings for ApiExampleScreen, within object key 'api'.
    api: {
      title: 'To get started, edit Container/Example/ApiExampleScreen.js',
      instructions_ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu.',
      instructions_android:
        'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu.',
      username: "I'm a fake user, my name is ",
      live_in_eu: 'I live in Europe !',
      not_live_in_eu: "I don't live in Europe.",
      refresh: 'Refresh',
      create: 'Create Data',
    },
  },
};
