---

tilte: GoPATH

---



**一、GOPATH的概念**

GOPATH 是 Go 语言中使用的一个环境变量，它使用绝对路径提供项目的**工作目录（**也称为**工作区）**。

工作目录是一个工程开发的相对参考目录，好比当你要在公司编写一套服务器代码，你的工位所包含的桌面、计算机及椅子就是你的工作区。

工作区的概念与工作目录的概念也是类似的。如果不使用工作目录的概念，在多人开发时，每个人有一套自己的目录结构，读取配置文件的位置不统一，

输出的二进制运行文件也不统一，这样会导致开发的标准不统一，影响开发效率。

GOPATH 适合处理大量 Go语言源码、多个包组合而成的复杂工程。

从 Go 1.8 版本开始，Go 开发包在安装完成后，将 GOPATH 赋予了一个默认的目录，参见下表

![img](https://img2020.cnblogs.com/blog/907091/202008/907091-20200810145305229-244770147.png)

可以通过go env命令查看Go的环境变量，我使用的mac效果如下（安装后，更改过）

![img](https://img2020.cnblogs.com/blog/907091/202011/907091-20201102150001647-651359307.png)

**二、GOPATH的使用**

`GOPATH`目录一般为：

```
$HOME/go
  --bin      # 存放编译后的可执行文件
  --pkg      # 依赖包编译后的*.a文件
  --src      # 存放源码文件，以代码包为组织形式
```

如下是一个完整的Go项目的开发目录：

[![复制代码](https://assets.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
my-go                 // my-go为GOPATH目录
  -- bin
     -- myApp1        // 编译生成
     -- myApp2        // 编译生成
     -- myApp3        // 编译生成
  -- pkg                             依赖包编译后的*.a文件//
  -- src
     -- MyApp1        // 项目1
        -- models
        -- controllers
        -- others
        -- main.go 
     -- MyApp2        // 项目2
        -- models
        -- controllers
        -- others
        -- main.go 
```

[![复制代码](https://assets.cnblogs.com/images/copycode.gif)](javascript:void(0);)

设置GOPATH后，工程中使用 **import的根目录是GOPATH中的src目录**

GOPATH为/Users/lxxxxxk/GolandProjects，工程为/Users/lxxxxxk/Desktop/my-go/src/MyApp1

那么MyApp1中使用import导入本地包的时候，这样写：

```
import "MyApp1/models"  // models为包名
```

也就是说，**GOPATH下必须要有src目录**，不然import导包的时候会找不到

import导包规则：

　　1、先去GOROOT/src/路径下找   /usr/local/go/src/MyApp1 (系统环境变量 $GOROOT，即使用go env命令显示的GOROOT)

　　2、如果1没有，就去Project GOPATH/src/路径下找   /Users/lxxxxxk/Desktop/my-go/src/MyApp1

　　3、如果2还没找到，就去Global GOPATH路径下找   /Users/lxxxxxk/GolandProjects（系统环境变量 $GOPATH，即使用go env命令显示的GOPATH）

**三、GoLand设置GOPATH**

![img](https://img2020.cnblogs.com/blog/907091/202011/907091-20201102150212911-986971053.png)

图中的 Global GOPATH 代表全局 GOPATH，一般来源于系统环境变量中的 GOPATH；

Project GOPATH 代表项目所使用的 GOPATH，该设置会被保存在工作目录的 **.idea**目录下，不会被设置到环境变量的 GOPATH 中，但会在编译时使用到这个目录。

建议在开发时填写项目 GOPATH，**每一个项目尽量只设置一个 GOPATH，不使用多个 GOPATH 和全局的 GOPATH**。

否则可能会出现如下麻烦：

```
将某项目代码保存在 /home/davy/projectA 目录下，将该目录设置为 GOPATH。
随着开发进行，需要再次获取一份工程项目的源码，此时源码保存在 /home/davy/projectB 目录下，
如果此时需要编译 projectB 目录的项目，但开发者忘记设置 GOPATH 而直接使用命令行编译，
则当前的 GOPATH 指向的是 /home/davy/projectA 目录，而不是开发者编译时期望的 projectB 目录。
编译完成后，开发者就会将错误的工程版本发布到外网。
```