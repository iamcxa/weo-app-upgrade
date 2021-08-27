import { isArray } from 'lodash';

export const hasThisPermission = (permission) => ({ appPermission: { permissions } }) => {
  // console.log('isArray(permissions)=>', isArray(permissions));
  // console.log('permission=>', permission);
  return isArray(permissions)
    ? permissions.some((e) => e.permission === permission)
    : false;
};

export default {
  hasThisPermission,
};
