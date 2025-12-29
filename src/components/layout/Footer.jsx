import React from 'react';
import { useSiteConfig, useSocialConfig } from '../../config/ConfigContext';
import styles from './Footer.module.css';

/**
 * 页面底部组件
 */
export function Footer() {
  const siteConfig = useSiteConfig();
  const socialLinks = useSocialConfig();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* 社交链接 */}
          {socialLinks && socialLinks.length > 0 && (
            <div className={styles.social}>
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          {/* 版权信息 */}
          <div className={styles.copyright}>
            <p>
              © {currentYear} {siteConfig?.author || siteConfig?.title}. 
              {' '}由 <a 
                href="https://github.com/mappedinfo/ppage" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.link}
              >
                PPage
              </a> 驱动
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
