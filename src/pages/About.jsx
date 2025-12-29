import React from 'react';
import { useProfileConfig } from '../config/ConfigContext';
import styles from './About.module.css';

/**
 * 关于页面组件
 */
export function About() {
  const profile = useProfileConfig();

  return (
    <div className={styles.about}>
      <h1 className={styles.title}>关于我</h1>
      
      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.subtitle}>个人简介</h2>
          <p className={styles.text}>{profile?.bio || '欢迎来到我的个人主页！'}</p>
        </section>

        {profile?.email && (
          <section className={styles.section}>
            <h2 className={styles.subtitle}>联系方式</h2>
            <p className={styles.text}>
              Email: <a href={`mailto:${profile.email}`} className={styles.link}>
                {profile.email}
              </a>
            </p>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.subtitle}>关于本站</h2>
          <p className={styles.text}>
            本站点使用 PPage 构建，这是一个纯前端的个人主页生成系统，
            支持通过 YAML 配置文件快速搭建个人主页，支持 Markdown 内容创作，
            支持多种主题切换，部署在 GitHub Pages 上。
          </p>
        </section>
      </div>
    </div>
  );
}
