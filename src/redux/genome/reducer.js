import actions from "./actions";

const initState = {
  loading: false,
  data: {
    settings: {},
    intervals: [],
    connections: [],
  },
  error: null,
};

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_GENOME_DATA_REQUEST:
      return {
        ...state,
        error: null,
        data: {
          settings: {},
          intervals: [],
          connections: [],
        },
        loading: true,
      };
    case actions.FETCH_GENOME_DATA_SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    case actions.FETCH_GENOME_DATA_FAILED:
      return {
        ...state,
        data: {
          settings: {},
          intervals: [],
          connections: [],
        },
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
