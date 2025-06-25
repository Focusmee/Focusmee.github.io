# 如何将Unity项目上传到Github进行管理

## 1.下载安装Git

忽略，自行安装

## 2.在Github上面新建一个仓库

如下图，这里.gitignore文件十分建议选择Unity模板

## 3.复制仓库地址

把这里的地址复制一下，后面需要用

## 4.在项目文件夹打开Git Bash

进入项目文件夹右击选择Git Bash Here

### 4.1初始化仓库

输入

git init


### 4.2建立远程连接

输入

git remote add origin https://github.com/xxxx/xxxx.git（之前复制的仓库地址）


### 4.3配置信息

输入

git config user.name "名字"
git config user.email "邮箱"

或

git config --global user.name "名字"
git config --global user.email "邮箱"

后者只需要一次，以后上传其他仓库仍按保留，不再需要进行配置

### 4.4下载仓库到本地

输入

git pull origin master

完成后，本地文件夹会下载空仓库中的.gitignore和LICENSE文件，务必确保执行这一步之前本地文件夹没有这两个文件

### 4.5上传项目到仓库

输入

git add .
git commit -m "备注"
git push origin master

至此完成本地项目的上传

## 总结

github创建新仓库(master)，本地现有项目上传
1.git init
2.git remote add origin https://github.com/xxxx/xxxx.git
3.git pull origin master 这一步经常连接不上
4.git add .
5.git commit -m “备注”
6.git push origin master

强制添加被ignore的文件
1.git add -f Builds/
2.git commit -m “备注”
3.git push origin master