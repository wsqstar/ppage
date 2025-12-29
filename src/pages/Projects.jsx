import React from 'react';
import { useConfig } from '../config/ConfigContext';
import styles from './Projects.module.css';

/**
 * 项目列表页面组件
 */
export function Projects() {
  const { config } = useConfig();
  const projects = config?.projects || [];

  return (
    <div className={styles.projects}>
      <h1 className={styles.title}>项目列表</h1>
      
      {projects.length === 0 ? (
        <p className={styles.empty}>暂无项目</p>
      ) : (
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <article key={index} className={styles.card}>
              <h2 className={styles.name}>{project.name}</h2>
              
              {project.description && (
                <p className={styles.description}>{project.description}</p>
              )}
              
              {project.tags && project.tags.length > 0 && (
                <div className={styles.tags}>
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
              
              {project.url && (
                <a 
                  href={project.url} 
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看项目 →
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
