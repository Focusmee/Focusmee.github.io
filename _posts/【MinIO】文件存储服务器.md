本文主要记录一下`docker`如何安装和启动`minio`，先看一下成功启动的步骤：

首先下载相关镜像：

```bash
bash 代码解读复制代码# 搜索minio镜像
docker search minio
# 下载minio/minio
docker pull minio/minio
```

创建文件挂载目录：

```bash
bash 代码解读复制代码sudo mkdir /opt/docker/minio/miniodata
# 提供可写的权限，否则启动时会出现如下错误
# unable to use the drive /data:file access denied: Invalid arguments specified
sudo chmod 777 /opt/docker/minio/miniodata
```

启动：`minio`

```bash
bash 代码解读复制代码docker run \
-p 9000:9000 \
-p 5001:5001 \
-v /opt/docker/minio/miniodata:/data \
-e "ROOT_ACCESS_KEY=minioadmin" \
-e "ROOT_SECRET_KEY=minioadmin" \
-d minio/minio server /data --console-address ":5001"
```

命令说明：

> 1. docker run：启动程序
> 2. -p：指定端口号 9000: 是minio默认的端口号
> 3. -v：指定挂载目录，这是因为如果不指定，当容器被删除之后容器的数据将会丢失。
> 4. -e：指定环境变量，这里是指定了`minio dashboard`的登录账号和密码。
> 5. -d：后台运行 `minio/minio` 是我们下载的镜像，server /data 是minio的命令指定文件存放的目录。--console-address：指定`minio dashbord`的端口号。有时在命令后面还会看见 -address参数，该参数指定的是`minio s3 api` 的端口号。

启动后便可通过`docker logs containerId`的方式查看`log`，如果在电脑上安装了`docker desktop`也可以在容器的`logs`看到如下信息：

![WechatIMG9.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac95d11aebfb4b2da2e919370801086f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1484&h=594&s=411864&e=jpg&b=fcfcfc)

其中`s3-api`这个地址就可以配置在springboot项目的`yaml`中，进行文件上传操作。如下所示：

```yml
yml 代码解读复制代码minio:
  endpoint: http://127.0.0.1:9000
  accessKey: minioadmin
  secretKey: minioadmin
  bucketName: minio-first-bucket
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 100MB
```

下面的内容就是记录一下踩坑的过程：

> - 本人首先是成功安装启动后，通过`spring boot`项目上传文件后，文件上传成功但是我的挂载目录本没有这个文件。
> - 接着从docker官网了解到文件应该是会在挂载目录的，但是由于不知道如何排查这个问题，就将该容器删除，打算重新启动一个容器试一下【大坑】
> - 在删除之后，按照同样的方式启动，容器就无法启动出现如下信息的错误：`unable to rename xxx`和`unable to use the drive /data:file access denied`。
> - 接着在网上搜寻一番，有的人说是因为之前安装过，不能指定相同的目录，于是呼：换一个目录，失败，删掉之前的目录重新启动，失败！换版本失败！包括但不限于`stack overflow`或者官网给定的解决方法。 最后在打算放弃的关头：执行了`chmod 777 挂载目录`，重启成功，不仅重启成功通过`java`上传文件，在该目录下也有了备份。
> - ps: 整个过程大概耗费了三个小时，

参考资料：

- [sof:inio-permission-denied](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F72332735%2Fminio-permission-denied)
- [解决minio启动报ERROR Unable to use the drive ** found backend type fs, expected xl or xl-single](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2FDCTANT%2Farticle%2Fdetails%2F129861486)
- [MinIO Object Storage for MacOS](https://link.juejin.cn?target=https%3A%2F%2Fmin.io%2Fdocs%2Fminio%2Fmacos%2Findex.html)

