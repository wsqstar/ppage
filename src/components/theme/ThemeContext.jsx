import React, { createContext, useContext, useState, useEffect } from 'react';
import { useThemeConfig } from '../../config/ConfigContext';

// 导入主题 CSS
import '../../themes/light.css';
import '../../themes/dark.css';
import '../../themes/academic.css';

const ThemeContext = createContext(null);

/**
 * 主题提供者组件
 */
export function ThemeProvider({ children }) {
  const themeConfig = useThemeConfig();
  const [currentTheme, setCurrentTheme] = useState(null);

  // 初始化主题
  useEffect(() => {
    if (!themeConfig) return;

    // 从 localStorage 读取用户选择的主题
    const savedTheme = localStorage.getItem('ppage-theme');
    
    // 使用保存的主题，如果没有则使用配置中的默认主题
    const initialTheme = savedTheme || themeConfig.default;
    
    // 验证主题是否在可用列表中
    const validTheme = themeConfig.available.includes(initialTheme) 
      ? initialTheme 
      : themeConfig.default;
    
    setCurrentTheme(validTheme);
    applyTheme(validTheme);
  }, [themeConfig]);

  /**
   * 应用主题到 DOM
   */
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  /**
   * 切换主题
   */
  const switchTheme = (theme) => {
    if (!themeConfig?.available.includes(theme)) {
      console.warn(`主题 "${theme}" 不在可用列表中`);
      return;
    }
    
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('ppage-theme', theme);
  };

  /**
   * 切换到下一个主题
   */
  const toggleTheme = () => {
    if (!themeConfig || !currentTheme) return;
    
    const currentIndex = themeConfig.available.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeConfig.available.length;
    const nextTheme = themeConfig.available[nextIndex];
    
    switchTheme(nextTheme);
  };

  const value = {
    currentTheme,
    availableThemes: themeConfig?.available || [],
    switchTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * 使用主题的 Hook
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用');
  }
  
  return context;
}
