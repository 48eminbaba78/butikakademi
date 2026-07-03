import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
        about: resolve(__dirname, 'about.html'),
        blog: resolve(__dirname, 'blog.html'),
        contact: resolve(__dirname, 'contact.html'),
        cookies: resolve(__dirname, 'cookies.html'),
        fix_demo_accounts: resolve(__dirname, 'fix_demo_accounts.html'),
        koc_bul: resolve(__dirname, 'koc_bul.html'),
        kvkk: resolve(__dirname, 'kvkk.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        setup: resolve(__dirname, 'setup.html'),
        site_admin: resolve(__dirname, 'site_admin.html'),
        terms: resolve(__dirname, 'terms.html'),
        test: resolve(__dirname, 'test.html'),
        kaynak_yoneticisi: resolve(__dirname, 'kaynak_yoneticisi.html'),
        nasil_yapilir: resolve(__dirname, 'nasil-yapilir.html')
      }
    }
  }
});
