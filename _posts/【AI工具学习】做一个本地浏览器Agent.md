开发步骤
根据参考文档，https://docs.browser-use.com/customize/real-browser
用cursor写一个简单的python flask应用
准备好OpenAl或者Claude的APIKey，就可以运行了

- 如何申请APIhttps://www.bilibili.com/video/BV1PqKKeeEnm/?spm_id_from=333.337.search-card.all.click&vd_source=9a75a4b5f792c3cd3b921c00fec104bb

代码地址:https://github.com/jiangyan/browser-operator
。工具列表
。Cursor
OpenAl/Claude AP| Key



安装问题:[致命：无法访问''：21058 毫秒后无法连接到 github.com 端口 443：无法连接到服务器](https://stackoverflow.com/questions/76191061/fatal-unable-to-access-failed-to-connect-to-github-com-port-443-after-2105)

如果你使用VPN，你可以尝试`git config --global http.proxy http://127.0.0.1:7890`（7890是你的VPN端口，我用的是7897）和`git config --global https.proxy https://127.0.0.1:7890`。
如果没有，你可以尝试`git config --global unset http.proxy`和`git config --global unset https.proxy`。

![image-20250411102816799](C:\Users\Jinju\blog\source\images\image-20250411102816799.png)