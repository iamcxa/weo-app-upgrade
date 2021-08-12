This directory contains configuration variables. the boilerplate is supporting react-native-dot-env, so you can use
.env/.env.development/.env.production and even .env.local and so to pre-set the configuration variables in different
environments. import all variables into this js file to be used in unified.

The boilerplate contains these preset configurations,

- Logger - configuration for react-native-logs
- API - configuration for setup whole app's API host and configuration such as timeout...etc

## Examples

```
import Config from '~/Config'

...
let uri = Config.API_URL
...

```
