import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventsProvider } from './contexts/EventsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Navigation from './components/Navigation';
import BlocosHomeScreen from './screens/BlocosHomeScreen';

export default function App() {
  return (
    <BrowserRouter>
      <EventsProvider>
        <FavoritesProvider>
          <Navigation>
              <Routes>
                <Route path="/" element={<Navigate to="/blocos" replace />} />
                <Route path="/blocos" element={<BlocosHomeScreen />} />
              </Routes>
            </Navigation>
        </FavoritesProvider>
      </EventsProvider>
    </BrowserRouter>
  );
}
