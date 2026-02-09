import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WiseAppProvider } from './contexts/WiseAppProvider';
import { EventsProvider } from './contexts/EventsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Navigation from './components/Navigation';
import BlocosHomeScreen from './screens/BlocosHomeScreen';
import ShowsHomeScreen from './screens/ShowsHomeScreen';
import ExplorarScreen from './screens/ExplorarScreen';

export default function App() {
  return (
    <BrowserRouter>
      <WiseAppProvider>
        <EventsProvider>
          <FavoritesProvider>
            <Navigation>
              <Routes>
                <Route path="/" element={<Navigate to="/blocos" replace />} />
                <Route path="/blocos" element={<BlocosHomeScreen />} />
                <Route path="/shows" element={<ShowsHomeScreen />} />
                <Route path="/explorar" element={<ExplorarScreen />} />
              </Routes>
            </Navigation>
          </FavoritesProvider>
        </EventsProvider>
      </WiseAppProvider>
    </BrowserRouter>
  );
}
