import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AuthAppContext";
import { useApp } from "./context/AuthAppContext";
import MainLayout from "./layouts/MainLayout";
import WeeklySummary from "./pages/WeeklySummary";
import Today from "./pages/Today";
import CalendarPage from "./pages/Calendar";
import Habits from "./pages/Habits";
import Progress from "./pages/Progress";
import Login from "./components/Login";
import Loading from "./components/Loading";

// Componente principal de la aplicación
const AppContent: React.FC = () => {
  const { state, signIn } = useApp();

  // Mostrar loading mientras se verifica la autenticación
  if (state.loading) {
    return <Loading />;
  }

  // Mostrar login si no está autenticado
  if (!state.isAuthenticated) {
    return (
      <Login 
        onSignIn={signIn}
        loading={state.loading}
        error={state.error}
      />
    );
  }

  // Aplicación principal si está autenticado
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<WeeklySummary />} />
          <Route path="/today" element={<Today />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
