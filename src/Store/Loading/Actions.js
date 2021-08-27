export const RECEIVED_LOADING = 'RECEIVED_LOADING';
export function updateLoading(bool) {
  return {
    type: RECEIVED_LOADING,
    bool,
  };
}

export default { updateLoading };
