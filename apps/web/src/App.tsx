import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
// import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/home/HomePage';
import { SearchPage } from './pages/search/SearchPage';
import { PlaylistPage } from './pages/playlist/PlaylistPage';
import { ArtistPage } from './pages/artist/ArtistPage';

// Placeholder tạm thời — xóa khi implement từng page
const PlaceholderPage = ({ name, color = "#1DB954" }: { name: string, color?: string }) => (
  <div className="flex h-[200vh] flex-col items-center pt-24 text-white" style={{ background: `linear-gradient(to bottom, ${color}33, #121212 500px)` }}>
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-2">Spotify Clone</h1>
      <p className="text-[#B3B3B3]">Trang {name} — Đang phát triển</p>
    </div>
  </div>
);

// Màn hình full không có Sidebar (cho Login/Register)
const FullScreenPlaceholder = ({ name }: { name: string }) => (
  <div className="flex h-screen items-center justify-center bg-[#121212] text-white">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-[#1DB954] mb-2">Spotify Clone</h1>
      <p className="text-[#B3B3B3]">Trang {name}</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (No Sidebar/Player) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected routes wrapped in MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<PlaceholderPage name="Thư viện" color="#522bb3" />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/album/:id" element={<PlaceholderPage name="Album" color="#a67124" />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/song/:id" element={<PlaceholderPage name="Bài hát" color="#1DB954" />} />
        </Route>

        {/* Full screen routes for creators/admins */}
        <Route path="/artist-dashboard" element={<FullScreenPlaceholder name="Artist Dashboard" />} />
        <Route path="/admin" element={<FullScreenPlaceholder name="Admin Dashboard" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
