import { createContext, useContext, useReducer } from 'react';
import { MapView } from './components/MapView';
import { Sidebar } from './components/Sidebar/Sidebar';
import { useStateZipCodes } from './hooks/useStateZipCodes';

const initialState = {
  selectedState: null,
  highlightedZip3: null,
  selectedFeature: null,
  sidebarOpen: false,
  sidebarTitle: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_STATE':
      return {
        ...state,
        selectedState: action.payload,
        highlightedZip3: null,
        selectedFeature: null,
        sidebarOpen: true,
        sidebarTitle: `State: ${action.payload}`,
      };
    case 'SELECT_ZIPCODE': {
      const zip3 = action.payload.properties?.zip3;
      const isToggleOff = state.highlightedZip3 === zip3;
      return {
        ...state,
        highlightedZip3: isToggleOff ? null : zip3,
        selectedFeature: isToggleOff ? null : action.payload,
        sidebarOpen: !isToggleOff,
        sidebarTitle: isToggleOff ? null : `Zipcode: ${zip3}`,
      };
    }
    case 'CLOSE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: false,
      };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within App');
  return ctx;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateZipCodes = useStateZipCodes();

  return (
    <AppContext.Provider value={{ state, dispatch, stateZipCodes }}>
      <MapView />
      <Sidebar />
    </AppContext.Provider>
  );
}
