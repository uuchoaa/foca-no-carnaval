import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ActiveNavProvider } from './contexts/ActiveNavContext';
import { EventsProvider } from './contexts/EventsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Navigation from './components/Navigation';
import BlocosHomeScreen from './screens/BlocosHomeScreen';
import ShowsHomeScreen from './screens/ShowsHomeScreen';

export default function App() {
  return (
    <BrowserRouter>
      <ActiveNavProvider>
        <EventsProvider>
          <FavoritesProvider>
            <Navigation>
              <Routes>
                <Route path="/" element={<Navigate to="/blocos" replace />} />
                <Route path="/blocos" element={<BlocosHomeScreen />} />
                <Route path="/shows" element={<ShowsHomeScreen />} />
              </Routes>
            </Navigation>
          </FavoritesProvider>
        </EventsProvider>
      </ActiveNavProvider>
    </BrowserRouter>
  );
}
