import React from 'react';
import { useTheme } from './ThemeContext';
import styles from './ThemeSwitcher.module.css';

/**
 * 主题切换器组件
 */
export function ThemeSwitcher() {
  const { currentTheme, availableThemes, switchTheme } = useTheme();

  if (!currentTheme || availableThemes.length === 0) {
    return null;
  }

  return (
    <div className={styles.themeSwitcher}>
      <select 
        className={styles.themeSelect}
        value={currentTheme}
        onChange={(e) => switchTheme(e.target.value)}
        aria-label="切换主题"
      >
        {availableThemes.map((theme) => (
          <option key={theme} value={theme}>
            {getThemeDisplayName(theme)}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * 获取主题的显示名称
 */
function getThemeDisplayName(theme) {
  const displayNames = {
    light: '明亮',
    dark: '暗黑',
    academic: '学术'
  };
  
  return displayNames[theme] || theme;
}
