import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './config/ConfigContext';
import { ThemeProvider } from './components/theme/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Projects } from './pages/Projects';

function App() {
  return (
    <ConfigProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="projects" element={<Projects />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
