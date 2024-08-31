import actions from "./actions";
import { domainsToLocation } from "../../helpers/utility";

const initState = {
  loading: false,
  data: {},
  selectedCoordinate: "hg19",
  tab: 1,
  chromoBins: {},
  domains: [],
  defaultDomain: null,
  genomeLength: 0,
  error: null,
};

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_SETTINGS_DATA_REQUEST:
      return {
        ...state,
        error: null,
        domains: [],
        data: {},
        loading: true,
      };
    case actions.FETCH_SETTINGS_DATA_SUCCESS:
      return {
        ...state,
        data: action.data,
        selectedCoordinate: action.selectedCoordinate,
        chromoBins: action.chromoBins,
        defaultDomain: action.defaultDomain,
        genomeLength: action.genomeLength,
        loading: false,
      };
    case actions.FETCH_SETTINGS_DATA_FAILED:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case actions.UPDATE_DOMAINS:
      let doms = action.domains;
      // eliminate domains that are smaller than 10 bases wide
      if (doms.length > 1) {
        doms = doms.filter((d) => d[1] - d[0] > 10);
      }
      let url0 = new URL(decodeURI(document.location));
      url0.searchParams.set(
        "location",
        domainsToLocation(state.chromoBins, doms)
      );
      window.history.replaceState(
        unescape(url0.toString()),
        "Case Report",
        unescape(url0.toString())
      );
      return { ...state, domains: doms };
    case actions.UPDATE_TAB:
      return { ...state, tab: action.tab };
    default:
      return state;
  }
}