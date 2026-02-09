import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventsProvider } from './contexts/EventsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Navigation from './components/Navigation';
import BlocosHomeScreen from './screens/BlocosHomeScreen';
import ShowsHomeScreen from './screens/ShowsHomeScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';

export default function App() {
  return (
    <BrowserRouter>
      <EventsProvider>
        <FavoritesProvider>
          <Navigation>
              <Routes>
                <Route path="/" element={<Navigate to="/blocos" replace />} />
                <Route path="/blocos" element={<BlocosHomeScreen />} />
                <Route path="/shows" element={<ShowsHomeScreen />} />
                <Route path="/event/:id" element={<EventDetailScreen />} />
                <Route path="/favorites" element={<FavoritesScreen />} />
              </Routes>
            </Navigation>
        </FavoritesProvider>
      </EventsProvider>
    </BrowserRouter>
  );
}
