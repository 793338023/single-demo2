## 描述

[single-demo](https://github.com/793338023/single-demo) 改进版

## yarn workspace 与 lerna

在根目录的`package.json`使用 workspaces，然后在当前目录的任何子目录 yarn 装包都会先检查根目录的 node_modules 是否存在包，不存在才安装到子包项目的 node_modules，整个项目初始化时直接在根目录`yarn`安装就会全部项目都安装并安装到根的 node_modules 上，子项目独有的才会安装到自己项目的 node_modules 上

当 workspace 不足之处就用 lerna 弥补，如打包，yarn 是无法实现到互相依赖顺序打包的

## 目录

app 为应用项目目录

packages 为公共资源目录，如 common 公共工具之类的,如请求，components 组件库，使用 dumi 搭建

lib 放些模板或者第三方包等

## 资料

https://zhuanlan.zhihu.com/p/108118011

https://github.com/lljj-x/vue-json-schema-form/blob/master/package.json

https://www.lljj.me/2020/06/18/%E7%BB%93%E5%90%88lerna%E5%92%8Cyarn-workspace%E7%AE%A1%E7%90%86%E5%A4%9A%E9%A1%B9%E7%9B%AE%E5%B7%A5%E4%BD%9C%E6%B5%81/#lerna-build
