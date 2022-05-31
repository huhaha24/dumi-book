import { defineConfig } from 'dumi';

const repo = 'dumi-book';

export default defineConfig({
  title: 'dumi-book',
  mode: 'site',
  devServer: {
    port: 1998,
  },
  base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  publicPath: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',

  // more config: https://d.umijs.org/config
});
