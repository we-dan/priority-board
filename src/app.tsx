import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from '@/components/providers/theme';
import { Board } from '@/components/board';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        <Routes>
          <Route path="/" element={<Board />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}