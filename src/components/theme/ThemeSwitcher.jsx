import React from 'react';
import { useTheme } from './ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import styles from './ThemeSwitcher.module.css';

/**
 * 主题切换器组件
 */
export function ThemeSwitcher() {
  const { currentTheme, availableThemes, switchTheme } = useTheme();
  const { t } = useI18n();

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
            {t(`theme.${theme}`)}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * 获取主题的显示名称
 * @deprecated 使用 i18n 国际化替代
 */
function getThemeDisplayName(theme) {
  const displayNames = {
    light: '明亮',
    dark: '暗黑',
    academic: '学术',
    glass: '透明艺术'
  };
  
  return displayNames[theme] || theme;
}
