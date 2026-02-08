import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventsProvider } from './contexts/EventsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Navigation from './components/Navigation';
import BlocosHomeScreen from './screens/BlocosHomeScreen';
import ShowsHomeScreen from './screens/ShowsHomeScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import CalendarScreen from './screens/CalendarScreen';
import MapScreen from './screens/MapScreen';
import FavoritesScreen from './screens/FavoritesScreen';

function App() {
  return (
    <BrowserRouter>
      <EventsProvider>
        <FavoritesProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="pb-20">
              <Routes>
                <Route path="/" element={<Navigate to="/blocos" replace />} />
                <Route path="/blocos" element={<BlocosHomeScreen />} />
                <Route path="/shows" element={<ShowsHomeScreen />} />
                <Route path="/event/:id" element={<EventDetailScreen />} />
                <Route path="/calendar" element={<CalendarScreen />} />
                <Route path="/map" element={<MapScreen />} />
                <Route path="/favorites" element={<FavoritesScreen />} />
              </Routes>
            </div>
            <Navigation />
          </div>
        </FavoritesProvider>
      </EventsProvider>
    </BrowserRouter>
  );
}

export default App;
