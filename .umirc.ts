import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'fe-book',
  mode: 'site',
  devServer: {
    port: 1998,
  },

  base:
    process.env.NODE_ENV === 'production'
      ? 'https://github.com/huhaha24/dumi-book'
      : '/',
  publicPath:
    process.env.NODE_ENV === 'production'
      ? 'https://github.com/huhaha24/dumi-book/'
      : '/',

  // more config: https://d.umijs.org/config
});
