const actions = {
  FETCH_ALLELIC_DATA_REQUEST: "FETCH_ALLELIC_DATA_REQUEST",
  FETCH_ALLELIC_DATA_SUCCESS: "FETCH_ALLELIC_DATA_SUCCESS",
  FETCH_ALLELIC_DATA_FAILED: "FETCH_ALLELIC_DATA_FAILED",

  fetchAllelicData: () => ({
    type: actions.FETCH_ALLELIC_DATA_REQUEST,
  }),
};

export default actions;
