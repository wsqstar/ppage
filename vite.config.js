import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'build' ? '/ppage/' : '/';
  
  return {
    plugins: [
      react(),
      // 复制 content 目录到构建输出
      viteStaticCopy({
        targets: [
          {
            src: 'content',
            dest: ''
          }
        ]
      })
    ],
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild', // 使用 esbuild 代替 terser
    },
  };
});
