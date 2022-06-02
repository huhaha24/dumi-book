import { defineConfig } from 'dumi';

const repo = 'dumi-book';
const logo =
  'https://avatars.githubusercontent.com/u/37647607?s=400&u=fc820b7bbcc6c348fd4c5c597e0d4c79b29e9f4c&v=4';

export default defineConfig({
  title: 'Huhu‘s blog',
  mode: 'site',
  locales: [['zh-CN', '中文']],
  favicon: logo,
  logo,
  devServer: {
    port: 1998,
  },
  base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  publicPath: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',

  // more config: https://d.umijs.org/config
});
