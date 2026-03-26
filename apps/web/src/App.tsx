import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// TODO: Import pages khi implement
// import { LoginPage } from './pages/auth/LoginPage';
// import { RegisterPage } from './pages/auth/RegisterPage';
// import { HomePage } from './pages/home/HomePage';
// import { SearchPage } from './pages/search/SearchPage';
// import { LibraryPage } from './pages/library/LibraryPage';
// import { PlayerLayout } from './components/layout/PlayerLayout';

// Placeholder tạm thời — xóa khi implement từng page
const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="flex h-screen items-center justify-center bg-[#121212] text-white">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-[#1DB954] mb-2">Spotify Clone</h1>
      <p className="text-[#B3B3B3]">Trang {name} — Đang phát triển</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<PlaceholderPage name="Đăng nhập" />} />
        <Route path="/register" element={<PlaceholderPage name="Đăng ký" />} />
        <Route path="/forgot-password" element={<PlaceholderPage name="Quên mật khẩu" />} />

        {/* Protected routes — sẽ bọc bằng PrivateRoute */}
        <Route path="/" element={<PlaceholderPage name="Trang chủ" />} />
        <Route path="/search" element={<PlaceholderPage name="Tìm kiếm" />} />
        <Route path="/library" element={<PlaceholderPage name="Thư viện" />} />
        <Route path="/playlist/:id" element={<PlaceholderPage name="Playlist" />} />
        <Route path="/album/:id" element={<PlaceholderPage name="Album" />} />
        <Route path="/artist/:id" element={<PlaceholderPage name="Nghệ sĩ" />} />
        <Route path="/song/:id" element={<PlaceholderPage name="Bài hát" />} />

        {/* Premium */}
        <Route path="/premium" element={<PlaceholderPage name="Premium" />} />

        {/* Artist dashboard */}
        <Route path="/artist-dashboard" element={<PlaceholderPage name="Artist Dashboard" />} />

        {/* Admin */}
        <Route path="/admin" element={<PlaceholderPage name="Admin Dashboard" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
