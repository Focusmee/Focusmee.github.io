# WSL、Docker 迁移

Windows WSL Docker 默认安装路径在C盘的，导致岌岌可危的C盘空间😱更加吃紧，一不小心就要出现👇这种情况了

![image](https://img2024.cnblogs.com/blog/1131701/202408/1131701-20240815143048352-1440225869.png)

接下来我们一起迁移它们吧

## 迁移 WSL

WSL2 默认安装在 C 盘，我们可以通过以下步骤迁移安装位置
通过以下命令列出已安装的 Linux 发行版：

```
wsl -l -v
```

![image](https://img2024.cnblogs.com/blog/1131701/202408/1131701-20240815145222644-1202975402.png)
可以看到已安装了 Ubuntu，其运行状态为：Stopped

### 导出分发版

如果运行状态为 Running，需先通过以下命令关闭：

```
wsl --shutdown
```

然后我们通过以下命令将 Ubuntu 导出为 tar 文件：

```
wsl --export Ubuntu d:\wsl\Ubuntu.tar
```

![image](https://img2024.cnblogs.com/blog/1131701/202408/1131701-20240815145856500-292128290.png)

> ⚠️
> wsl --export <Distribution Name> <FileName>
> `<Distribution Name>` 为目标 Linux 发行版的名称，我安装的为： `Ubuntu`
> `<FileName>` 为导出的文件名，这里我导出到 `d:\wsl\Ubuntu.tar`
> 当然可以是任意位置

### 注销并卸载

然后注销并卸载 Ubuntu

```
wsl --unregister Ubuntu
```

这时候可以执行验证是否完成注销并卸载
`wsl -l -v`

![image](https://img2024.cnblogs.com/blog/1131701/202408/1131701-20240815160735996-160221150.png)

![image](https://img2024.cnblogs.com/blog/1131701/202408/1131701-20240815160813251-615510379.png)

👍完美，符合预期！！！

### 导入安装

将 Ubuntu 从新位置导入：
`wsl --import Ubuntu d:\wsl\Ubuntu d:\wsl\Ubuntu.tar`
再次查看已安装的 Linux 发行版
`wsl -l -v`
![image](https://img2024.cnblogs.com/blog/1131701/202408/1131701-20240815161553829-1503338969.png)

设置默认用户
`Ubuntu config --default-user bigroc`

> ⚠️
> <DistributionName> config --default-user <Username>
> `<DistributionName>` 为目标 Linux 发行版的名称，我安装的为： `Ubuntu`，命令里要写为：`Ubuntu`
> 假如你的是`Ubuntu-22.04`，命令里要写为：`Ubuntu2204`
> `<Username>` 为 WSL 发行版中存在的用户名，在设置 Linux 用户名和密码时我创建的用户为：`bigroc` ，所以命令里的 `<Username>` 这里就为：`bigroc`

## 迁移 docker-desktop-data 和 docker-desktop

Docker Desktop 会创建两个发行版：`docker-desktop-data` 和 `docker-desktop`，它们的默认位置在 `C:\Users\<你电脑的用户名>\AppData\Local\Docker\wsl`，我们同样可以参考上面导入导出 `Ubuntu` 的过程将`docker-desktop-data` 和 `docker-desktop` 迁移到其他位置

过程一致⬇️

### 导出

```
wsl --export docker-desktop-data d:\wsl\docker-desktop-data.tar`
`wsl --export docker-desktop-data d:\wsl\docker-desktop.tar
```

### 注销卸载

```
wsl --unregister docker-desktop-data`
`wsl --unregister docker-desktop
```

### 导入安装

```
wsl --import docker-desktop-data d:\wsl\docker-desktop-data d:\wsl\docker-desktop-data.tar`
`wsl --import docker-desktop d:\wsl\docker-desktop d:\wsl\docker-desktop.tar
```

至此 公司的电脑又一次成功复活
![image](https://img2024.cnblogs.com/blog/1131701/202408/1131701-20240815165529003-2038965666.png)

## 参考

1. 【microsoft】[WSL 的基本命令](https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands)
2. 【csdn】[Win11 安装 Docker Desktop 和 WSL2 并进行安装位置迁移](https://blog.csdn.net/cn_ljr/article/details/132047516)
3. 【bilibili】【2025【Docker Windows】C盘满了通过WSL将docker数据迁移到D盘】 https://www.bilibili.com/video/BV17qdpYGEEE/?share_source=copy_web&vd_source=654a4e361961dcce96893993981165f5