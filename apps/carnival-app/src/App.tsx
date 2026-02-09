import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { EventsProvider } from './contexts/EventsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { setNavigationHandler } from './design-system';
import Navigation from './components/Navigation';
import BlocosHomeScreen from './screens/BlocosHomeScreen';
import ShowsHomeScreen from './screens/ShowsHomeScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import MapScreen from './screens/MapScreen';
import FavoritesScreen from './screens/FavoritesScreen';

function NavigationSetup({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationHandler(navigate);
  }, [navigate]);

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <EventsProvider>
        <FavoritesProvider>
          <NavigationSetup>
            <Navigation>
              <Routes>
                <Route path="/" element={<Navigate to="/blocos" replace />} />
                <Route path="/blocos" element={<BlocosHomeScreen />} />
                <Route path="/shows" element={<ShowsHomeScreen />} />
                <Route path="/event/:id" element={<EventDetailScreen />} />
                <Route path="/map" element={<MapScreen />} />
                <Route path="/favorites" element={<FavoritesScreen />} />
              </Routes>
            </Navigation>
          </NavigationSetup>
        </FavoritesProvider>
      </EventsProvider>
    </BrowserRouter>
  );
}
