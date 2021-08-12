import { get } from 'lodash';
import { Dialog } from '~/Helper';

export default (error, canceler) => {
  if (canceler) {
    canceler.cancel(`${error.status} - ${get(error, 'data.message', error.message)}`);
  }
  Dialog.showServiceUnavailableAlert(error);
};
