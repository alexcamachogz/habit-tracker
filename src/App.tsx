import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import MainLayout from "./layouts/MainLayout";
import WeeklySummary from "./pages/WeeklySummary";
import Today from "./pages/Today";
import CalendarPage from "./pages/Calendar";
import Habits from "./pages/Habits";
import Progress from "./pages/Progress";

function App() {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}

export default App;
