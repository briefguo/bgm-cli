# 说明

脚手架基于node开发

## 脚手架安装

在项目根目录下运行

```shell
npm install -g bgm-cli
```

## 基本用法

```shell

Usage: bgm <command>


Commands:

  add|a      Add a new template
  list|l     List all the templates
  server     Start a devServer
  fetch      fetch something
  init|i     Generate a new project
  dll        create dll
  build      build production
  clean      clean outputdir
  delete|d   Delete a template
  map|m      Place files to diffirent position

Options:

  -h, --help     output usage information
  -V, --version  output the version number
```

### 创建模版

```shell
bgm add
```

新建模版，向本地添加一个模版的git仓库，主要来自GitHub上，比如domain模版

新建模版时，按照向导

- 第一步）? Set the custom name of the template: domain
- 第二步）? Owner/name of the template:snmi/domain
- 第三步）? Branch of the template: (master) master

回车确定，然后可以通过bgm list命令进行查看

```
bgm list
┌───────────────┬─────────────┬────────┐
│ Template Name │ Owner/Name  │ Branch │
├───────────────┼─────────────┼────────┤
│ domain        │ snmi/domain │ master │
└───────────────┴─────────────┴────────┘
```

### 运行开发服务器

```shell
bgm server
```

说明：当dll没打的时候，server命令会把dll按照development环境生成一遍

### 基于模版新建

```shell
bgm init
```

生成模版时，按照向导

- 第一步）? Template name: domain
- 第二步）? Project name: Market
- 第三步）? Where to init the project: (./)

回车确认之后，脚手架会在当前目录下新建./Market文件夹

### 打包DLL

```shell
bgm dll
```

注意：运行打包dll的命令时，打的是production环境下的包

### 打包、部署

```shell
bgm build <host>
```

例如：bgm build test打包测试环境 注意：无参数时打包release环境代码

### 清理dist目录

```shell
bgm clean
```
