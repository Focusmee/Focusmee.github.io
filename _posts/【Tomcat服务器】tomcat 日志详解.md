## 1 tomcat 日志详解

### 1.1 tomcat 日志配置文件

　　**tomcat 对应日志的配置文件**：tomcat目录下的/conf/logging.properties。

　　**tomcat 的日志等级有：**日志输出级别：SEVERE (最高级别) > WARNING > INFO > CONFIG > FINE > FINER(精心) > FINEST (所有内容,最低级别)

　　**tomcat 有五类日志 ：**catalina、localhost、manager、admin、host-manager

　　/conf/logging.properties 配置文件：

![img](https://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif) View Code

### 1.2 tomcat 日志文件详解

　**tomcat 有五类日志 ：**catalina、localhost、manager、admin、host-manager

#### 　1.2.1 catalina.out ：

catalina.out即标准输出和标准出错，所有输出到这两个位置的都会进入catalina.out，这里包含tomcat运行自己输出的日志以及应用里向console输出的日志。默认这个日志文件是不会进行自动切割的，我们需要借助其他工具进行切割（注意：catalina.out文件如果过大会影响）

![img](https://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif) View Code

####   1.2.2 catalina.YYYY-MM-DD.log

　catalina.{yyyy-MM-dd}.log是tomcat自己运行的一些日志，这些日志还会输出到catalina.out，但是应用向console输出的日志不会输出到catalina.{yyyy-MM-dd}.log,它是tomcat的启动和暂停时的运行日志，**注意，它和catalina.out是里面的内容是不一样的。**

![img](https://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif) View Code

#### 　**1.2.3 localhost.**YYYY-MM-DD.log

　localhost.{yyyy-MM-dd}.log主要是应用初始化(listener, filter, servlet)未处理的异常最后被tomcat捕获而输出的日志,它也是包含tomcat的启动和暂停时的运行日志,但它没有catalina.2018-09-19.log 日志全。它只是记录了部分日志。

![img](https://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif) View Code

#### 　1.2.4 localhost_access_log**.**YYYY-MM-DD.txt

　localhost_access_log.2018-09-19.txt：这个是访问tomcat的日志，请求时间和资源，状态码都有记录。

```
192.168.1.220 - - [19/Sep/2018:03:57:42 -0400] "GET / HTTP/1.1" 200 11286
192.168.1.220 - - [19/Sep/2018:03:57:42 -0400] "GET /tomcat.css HTTP/1.1" 200 5581
192.168.1.220 - - [19/Sep/2018:03:57:42 -0400] "GET /tomcat.png HTTP/1.1" 200 5103
192.168.1.220 - - [19/Sep/2018:03:57:42 -0400] "GET /bg-button.png HTTP/1.1" 200 713
192.168.1.220 - - [19/Sep/2018:03:57:42 -0400] "GET /bg-nav.png HTTP/1.1" 200 1401
192.168.1.220 - - [19/Sep/2018:03:57:42 -0400] "GET /asf-logo-wide.svg HTTP/1.1" 200 27235
192.168.1.220 - - [19/Sep/2018:03:57:42 -0400] "GET /bg-middle.png HTTP/1.1" 200 1918
192.168.1.220 - - [19/Sep/2018:03:57:42 -0400] "GET /bg-upper.png HTTP/1.1" 200 3103
192.168.1.220 - - [19/Sep/2018:03:58:14 -0400] "GET / HTTP/1.1" 200 11286
192.168.1.220 - - [19/Sep/2018:03:58:14 -0400] "GET /favicon.ico HTTP/1.1" 200 21630
192.168.1.220 - - [19/Sep/2018:03:58:16 -0400] "GET / HTTP/1.1" 200 11286
192.168.1.220 - - [19/Sep/2018:03:58:16 -0400] "GET /favicon.ico HTTP/1.1" 200 21630
192.168.1.220 - - [19/Sep/2018:03:58:21 -0400] "GET / HTTP/1.1" 200 11286
192.168.1.220 - - [19/Sep/2018:03:58:21 -0400] "GET /favicon.ico HTTP/1.1" 200 21630
192.168.1.220 - - [19/Sep/2018:03:58:28 -0400] "GET /docs/setup.html HTTP/1.1" 200 14470
192.168.1.220 - - [19/Sep/2018:03:58:28 -0400] "GET /docs/images/docs-stylesheet.css HTTP/1.1" 200 5780
192.168.1.220 - - [19/Sep/2018:03:58:28 -0400] "GET /docs/images/tomcat.png HTTP/1.1" 200 5103
192.168.1.220 - - [19/Sep/2018:03:58:28 -0400] "GET /docs/images/asf-logo.svg HTTP/1.1" 200 20486
192.168.1.220 - - [19/Sep/2018:03:58:28 -0400] "GET /docs/images/fonts/fonts.css HTTP/1.1" 200 1943
192.168.1.220 - - [19/Sep/2018:03:58:29 -0400] "GET /docs/images/fonts/OpenSans400.woff HTTP/1.1" 200 21956
192.168.1.220 - - [19/Sep/2018:03:58:29 -0400] "GET /docs/images/fonts/OpenSans700.woff HTTP/1.1" 200 22748
192.168.1.220 - - [19/Sep/2018:03:58:29 -0400] "GET /docs/images/fonts/OpenSans600.woff HTTP/1.1" 200 22604
```

#### 　1.2.5 host-manager.YYYY-MM-DD.log

  host-manager.2018-09-19.log：这个估计是放tomcat的自带的manager项目的日志信息的，未看到有什么重要的日志信息。

#### 　 **1.2.6 manager.YYYY-MM-DD.log**

　 manager.2018-09-19.log ：　这个是tomcat manager项目专有的日志文件.

### 1.3 tomcat 日志文件切割

　　tomcat 的 catalina.out 文件tomcat 是不会进行日志切割的，当这个文件大于2G 时，会影响tomcat的运行。那么我们需要对这个文件进行日志切割，切割的方法有很多种：

　　第一种：

　　通过系统自带的切割工具：logrotate来进行切割。

　　第二种:

　　使用logj4进行切割日志。

　　第三种：

　　使用用cronolog分割tomcat的catalina.out文件 

　　以上三种方法见：https://www.cnblogs.com/happy-king/p/9193401.html