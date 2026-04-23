import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';
import CreatePage from './pages/CreatePage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="chat/:sessionId" element={<ChatPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
