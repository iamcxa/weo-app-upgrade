import { call, select } from 'redux-saga/effects';

import { Handler, Upload } from '~/Apis';
import { Logger, Image as ImageHelper } from '~/Helper';

const TAG = '@UploadSaga';

export function* fetchUploadImage({ image }) {
  // yield put(AppStateActions.onLoading(true, null, { hide: true }));
  try {
    const compressedImage = yield call(ImageHelper.compressImage, image);

    const apiToken = yield select((state) => state.user.apiToken);

    const formData = new FormData();
    formData.append('file', {
      uri: compressedImage.uri,
      type: image.mime,
      name: image.filename || 'image',
    });

    const { data: res } = yield call(
      Handler.post({
        Authorization: apiToken,
        header: {
          Accept: 'multipart/form-data',
          'Content-Type': image.mime,
        },
        data: formData,
      }),
      Upload.createImage(),
    );
    // console.log('fetchUploadImage res=>', res);

    if (res.success) {
      return res.data.files[0];
    }
    return null;
  } catch (error) {
    Logger.error(TAG, error);
    return null;
  } finally {
    // yield put(AppStateActions.onLoading(false));
  }
}
