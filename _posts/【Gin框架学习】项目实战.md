## 购物外部开发进阶实战笔记



本文介绍了购物外部开发进阶实战的相关内容，包括框架源码解析、数据库连接、脚手架搭建及项目实战等。



### 知识点1：框架源码解析



- 深入解析购物框架源码，理解其内部机制。 > 原文引用：第一部分就是正框架的一个源码解析。



### 知识点2：数据库连接



- 使用database/sql标准库或ready-go库连接MySQL，支持哨兵、主从模式。
- 使用标准库或第三方库连接Redis。 > 原文引用：连接my和red is啊，这些我们常见的模块。第一个就是我们连接my的话呢，我们通常会用到呃构语言内置的database SQL这个标准库啊，当然呢，我们在这个课程中呢，还会向大家介绍功能啊，比我们常见的ready go啊，可能更稍微强大一点，它支持我们的哨兵模式，还有我们的主从模式啊等等等。



### 知识点3：脚手架搭建



- 搭建现代购物语言web项目通用脚手架，包括日志库、配置管理、优雅关机与平滑重启方案。 > 原文引用：搭建购物外部开发脚手架啊，就是带领大家手把手的。带你搭建一套现代购物语言，在企业中开发web项目的话，一个一套比较通用的脚手架。日志库的一个使用由Uber啊开源的一个非常优秀的一个高性能的日志库啊，这样的一个使用呃，第二个部分呢就是viper啊，一个比较出名的购物语言配置管理的一个神器啊就是。viper这个库我们要学习一下，第三个呢。就是我们购外部项目，我们做外部项目肯定会遇到一些呃升级呀呃或者一些。那么我们怎么样去实现优雅关机和平滑重启呢。



### 知识点4：项目实战



- 实现仿Reddit论坛项目，涉及分布式ID生成、JWT认证、业务逻辑及投票功能。
- 使用Docker及Docker Compose搭建开发环境，讲解代码发布与项目部署。 > 原文引用：我们实现的是一个仿reddit论坛的这样一个项目啊，在这个项目中呢，我们将学到哪些东西呢。呃，分布式ID生成啊，基于水化算法的一个实现，还有前后端分类项目里面用应用比较广泛的一个gwt认证啊，我们会讲解一下gwt是什么，它的原理是什么，以及我们怎么样去编写。一个比较通用的一个gwt认证的一个中间件呃，第三部分呢，就是基于my我们实现一个主要的业务逻辑，第四个呢，就是基于red is实现一个投票的一个。当然呢，我们在开发中呢，可能会涉及到啊，基于docker去开发一个搭建开发环境的这样一个呃场景啊，以及docker compose的一些使用。以及代码开发完了之后呢，我们可能会去需要去发布到线上，对吧。







## HTTP请求方法与路由树结构学习笔记

本文介绍了在Gin框架中，如何根据HTTP请求方法查找对应的路由处理函数，并详细解析了相关结构体和字段。

### 知识点1：请求方法查找机制
- Gin框架通过for循环遍历trees切片，查找与请求方法相同的元素，并获取其root字段（树结构的根节点）。
&gt; 原文引用：通过for循环遍历去查找到当前的这个元素的请求方法和method相同的那个元素，我把它它的root字段是不是给拿出来了。

### 知识点2：通过_ IRouter = &Engine{}来确保Engine结构体实现了接口，把问题暴露到编译阶段 

### 知识点3：engineer结构体与trees字段
- engineer结构体包含trees字段，类型为method trees切片，每个元素对应一个请求方法及其树结构。
- trees字段在初始化时一次性申请内存，减少内存申请和扩容的频率。
&gt; 原文引用：engineer引擎的这个结构体，那找到最后的这个trees trees，它这个字段是什么类型呢...初始化这个结构体的时候，一次性的把内存申请到位了。

### 知识点4：HTTP请求方法与树结构
- HTTP请求方法数量固定且较少（HTTP/1.1协议中九个方法），因此采用for循环遍历slice切片的方式查找，节省内存。
- 每个请求方法对应一个树结构，树的节点为node类型，包含路径、子节点、处理函数链条等字段。
&gt; 原文引用：这个请求方法对应一个...是一个请求方法对应的一个什么。请求方法一个树结构...它其实就是一个节点啊，一个节点的指针...这个node其实就是这个框架里面，我们刚才说的那个构造那个路由树的那个节点的这样一个结构体。



## 框架中通过请求方法找到对应的路由并注册到框架中

### 1. **Gin 路由的注册过程**

在 Gin 中，路由注册的核心流程如下：

先从默认引擎进去可以看到

```go
// GET is a shortcut for router.Handle("GET", path, handlers).
func (group *RouterGroup) GET(relativePath string, handlers ...HandlerFunc) IRoutes {
    return group.handle(http.MethodGet, relativePath, handlers)
}
```

因为![image-20250224144839816](C:\Users\Jinju\blog\source\images\image-20250224144839816.png)可以看到Engine包含了RouterGroup

所以能够调用![image-20250224144919692](C:\Users\Jinju\blog\source\images\image-20250224144919692.png)

以下我用router来说明，RouterGroup除了先要 先计算路径，

#### **（1）调用 `router.Handle()` 方法**

所有的 `GET`、`POST`、`PUT`、`DELETE` 方法最终都会调用 `router.Handle()`，它负责将路由注册到 `Engine` 中：

```
func (engine *Engine) GET(relativePath string, handlers ...HandlerFunc) IRoutes {
    return engine.addRoute("GET", relativePath, handlers)
}

func (engine *Engine) POST(relativePath string, handlers ...HandlerFunc) IRoutes {
    return engine.addRoute("POST", relativePath, handlers)
}
```

这些方法都会调用 `addRoute()`，用于存储路由信息。

------

#### **（2）核心路由注册方法 `addRoute()`**

```
func (engine *Engine) addRoute(method, path string, handlers HandlersChain) {
    engine.router.addRoute(method, path, handlers)
}
```

这里的 `engine.router` 是 `routerGroup` 类型，最终调用 `engine.router.addRoute()`。

------

#### **（3）将路由存入前缀树**

```
func (r *router) addRoute(method, path string, handlers HandlersChain) {
    root := r.trees[method]
    if root == nil {
        root = new(node)
        r.trees[method] = root
    }
    root.addRoute(path, handlers)
}
```

- `r.trees` 是一个 `map[string]*node`，存储不同 HTTP 方法的路由树。
- `addRoute(path, handlers)` 会将路径存入前缀树（Trie 树）。

------

### 2. **Gin 路由的查找过程**

当客户端发送 HTTP 请求时，Gin 会根据请求方法（如 `GET`、`POST`）查找匹配的路由。

#### **（1）请求到来时调用 `ServeHTTP()`**

`gin.Engine` 继承了 `http.Handler`，所以 `ServeHTTP()` 处理所有 HTTP 请求：

```
go复制编辑func (engine *Engine) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    c := engine.pool.Get().(*Context)
    c.reset()
    c.Request = req
    engine.router.handleHTTPRequest(c)
}
```

- 这里 `engine.router.handleHTTPRequest(c)` 负责查找路由。

------

#### **（2）查找对应方法的路由树**

```
func (r *router) handleHTTPRequest(c *Context) {
    t := r.trees[c.Request.Method]
    if t != nil {
        value := t.getValue(c.Request.URL.Path)
        if value.handlers != nil {
            c.handlers = value.handlers
            c.Next()
            return
        }
    }
    c.handlers = r.allNoRoute
    c.Next()
}
```

- `r.trees` 里存储不同 HTTP 方法的前缀树。
- 通过 `t.getValue(c.Request.URL.Path)` 在前缀树中查找对应的 `handlers`，如果找到，就执行 `handlers`。
- 如果找不到，执行 `c.handlers = r.allNoRoute`（404 处理）。

------

### 3. **总结**

- **注册时**：Gin 通过 `addRoute()` 方法将 `path` 存入 **Trie 树**（`r.trees[method]`）。
- **查找时**：`handleHTTPRequest()` 通过 `method` 找到对应的 `Trie 树`，然后匹配 `path`，执行相应的 `handlers`。
- **Trie 树** 结构优化了路由匹配效率，支持动态参数 `:param` 和通配符 `*path`。