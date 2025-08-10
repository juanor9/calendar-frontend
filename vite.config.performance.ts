/**
 * Vite Performance Configuration
 * Optimized build configuration for Auth0 and overall performance
 */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import viteCompression from 'vite-plugin-compression';
import { auth0OptimizationPlugin } from './src/performance/auth-bundle-optimizer';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    
    // Auth0 specific optimizations
    auth0OptimizationPlugin(),
    
    // Bundle analysis
    visualizer({
      filename: './dist/bundle-stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    }),
    
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10kb
      deleteOriginFile: false
    }),
    
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    }),
    
    // Image optimization
    ViteImageOptimizer({
      png: {
        quality: 85,
      },
      jpeg: {
        quality: 85,
      },
      jpg: {
        quality: 85,
      },
      webp: {
        lossless: false,
        quality: 85,
        alphaQuality: 85,
      },
    }),
  ],
  
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    
    // Optimize chunk sizes
    chunkSizeWarningLimit: 100, // 100kb warning for individual chunks
    
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    
    // Source maps for production debugging (optional)
    sourcemap: 'hidden',
    
    // Rollup optimizations
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: (id) => {
          // Auth0 SDK in separate chunk
          if (id.includes('@auth0/auth0-spa-js')) {
            return 'auth0-sdk';
          }
          
          // Auth0 Vue wrapper
          if (id.includes('@auth0/auth0-vue')) {
            return 'auth0-vue';
          }
          
          // GraphQL client
          if (id.includes('@apollo/client') || id.includes('graphql')) {
            return 'graphql';
          }
          
          // Vue ecosystem
          if (id.includes('vue') || id.includes('@vue')) {
            return 'vue-ecosystem';
          }
          
          // UI components
          if (id.includes('@headlessui') || id.includes('@heroicons')) {
            return 'ui-components';
          }
          
          // Utilities
          if (id.includes('@vueuse') || id.includes('lodash')) {
            return 'utils';
          }
          
          // Other vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        
        // Asset naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name].[hash][extname]`;
          }
          
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name].[hash][extname]`;
          }
          
          return `assets/[name].[hash][extname]`;
        },
        
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
      },
      
      // Tree shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    
    // CSS optimizations
    cssCodeSplit: true,
    cssMinify: true,
    
    // Asset inlining threshold (4kb)
    assetsInlineLimit: 4096,
    
    // Report compressed sizes
    reportCompressedSize: true,
    
    // Prevent bundling of certain large libraries
    commonjsOptions: {
      exclude: ['moment', 'chart.js'],
      transformMixedEsModules: true
    }
  },
  
  // Development optimizations
  server: {
    warmup: {
      clientFiles: [
        './src/main.ts',
        './src/auth/index.ts',
        './src/router/index.ts'
      ]
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@auth0/auth0-spa-js',
      '@apollo/client'
    ],
    exclude: [],
    esbuildOptions: {
      target: 'es2020',
      supported: {
        bigint: true
      }
    }
  },
  
  // Performance hints
  define: {
    // Feature flags for conditional loading
    __AUTH0_LAZY_LOAD__: true,
    __ENABLE_PERFORMANCE_MONITORING__: true,
    __ENABLE_SERVICE_WORKER__: true
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@auth': path.resolve(__dirname, './src/auth'),
      '@components': path.resolve(__dirname, './src/components'),
      '@performance': path.resolve(__dirname, './src/performance')
    }
  }
});