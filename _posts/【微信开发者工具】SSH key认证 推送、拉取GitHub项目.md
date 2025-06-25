微信开发者工具 SSH key认证 推送、拉取GitHub项目
因为从2021年8月14日之后，使用git对github进行身份验证操作的时候不再接受使用账号密码形式clone和push代码，今天就琢磨了下ssh key的方式来上传下拉代码，要注意的细节还是有的所以记录一下。

1.下载安装、配置git。
git官网地址https://git-scm.com/，安装完后记得设置用户名和邮箱地址（GitHub或者gitee的用户名和邮箱）具体方法百度。

2.生成SSH Key
右键桌面进入Git Bash Here终端

输入ssh-keygen -t ed25519 -C “your_email@example.com” ( your_email@example.com是你GitHub的邮箱),连续回车3次



注意：因密钥安全性问题 GitHub 自 2022 年 3 月 15 日起不再支持 DSA 密钥 (ssh-dss)。

之前使用如下命令生成的密钥对无效：

ssh-keygen -t rsa -C “your_email@example.com”

于是用下面的方法重新生成，这样生成的文件会自动保存在，C:\Users\帅气陈\.ssh目录下（这个路径不能有中文‘帅气陈’卡了我半天，可以将.ssh剪切到纯英文目录）

ssh-keygen -t ed25519 -C “your_email@example.com”



该目录下会生成两个文件，id_ed25519.pub为公钥，id_ed25519为私钥。


输入 ssh -T git@github.com回车，因为是第一次流程提示输入yes回车。这里的-T区分大小写。如果返回【Hi ***! You’ve successfully authenticated, but GitHub does not provide shell access.】 说明配置成功


右键id_ed25519.pub选择记事本打开全选复制里面内容


打开GitHub点击右上角头像——Settings——SSH and GPG keys——New SSH key


title给key命名，key里面粘贴刚刚复制的id_ed25519.pub中的内容——Add SSH key成功之后返回上级页面会出现一个key。



3.微信开发者工具绑定远程仓库
1.微信开发者工具点击“版本管理”——设置——通用——用户名编辑，输入自己GitHub上的用户名和邮箱





2.网络和认证：网络代理设置默认自动不用管，认证方式使用SSH key指定密钥



3.远程——添加，名称填GitHub上的库的名称，url复制库的ssh地址，点击确定。



4.代码上传、下拉


具体怎么用b站有教程

【【微信开发者工具+github】本地代码上传至远端仓库以及从仓库拉取代码到本地】 https://www.bilibili.com/video/BV15f4y1m7rA?share_source=copy_web&vd_source=b5b2a4b0a89cf17fc65c77bb0686404e

