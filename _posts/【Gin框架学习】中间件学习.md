## title：中间件学习

Go 中的 **中间件（Middleware）** 本质上是 **在请求到达处理函数（Handler）之前或之后执行的一系列封装好的逻辑**，可以拦截、修改或增强请求和响应的行为。

在 **Web 框架（如 Gin、Echo、net/http）** 中，中间件常用于 **日志记录、权限校验、错误处理、请求限流等**。

------

## **💡 能不能理解为“在某个函数执行时调用其他封装好的函数”？**

**✅ 部分正确，但不够全面！**
 可以理解为 **在处理主逻辑（如 HTTP 处理函数）之前、之后或替代时，自动调用封装好的函数**。

中间件通常是 **一个函数，它接受并返回一个新的处理函数**，形成 **嵌套执行** 的模式。

------

## **📌 Go 中间件的基本实现**

在 `net/http` 里，Handler 是 `func(http.ResponseWriter, *http.Request)`，中间件通常是一个 **高阶函数**，它接受一个 `http.Handler` 并返回一个新的 `http.Handler`。

### **📝 示例：日志中间件**

```go
package main

import (
	"fmt"
	"net/http"
	"time"
)

// 日志中间件
func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		// 调用下一个处理器
		next.ServeHTTP(w, r)
		fmt.Printf("[%s] %s %s %v\n", time.Now().Format(time.RFC3339), r.Method, r.URL.Path, time.Since(start))
	})
}

// 业务处理函数
func HelloHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello, Go Middleware!"))
}

func main() {
	mux := http.NewServeMux()
	mux.Handle("/", Logger(http.HandlerFunc(HelloHandler)))

	http.ListenAndServe(":8080", mux)
}
```

✅ **执行顺序**：

1. `Logger` 先执行（**前置逻辑**）
2. `HelloHandler` 执行
3. `Logger` 记录请求信息（**后置逻辑**）

------

## **📌 在 Gin 框架中的中间件**

Gin 的中间件是 `func(c *gin.Context)` 类型：

```go
package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

// Gin 中间件
func LoggerMiddleware(c *gin.Context) {
	start := time.Now()
	c.Next() // 执行后续处理（下一个中间件或路由处理函数）
	fmt.Printf("[%s] %s %s %v\n", time.Now().Format(time.RFC3339), c.Request.Method, c.Request.URL.Path, time.Since(start))
}

func main() {
	r := gin.Default()
	r.Use(LoggerMiddleware) // 应用中间件

	r.GET("/", func(c *gin.Context) {
		c.String(200, "Hello, Gin Middleware!")
	})

	r.Run(":8080")
}
```

✅ **`c.Next()` 让请求进入下一个中间件或处理函数**

------

## **📌 适用场景**

- **日志记录**
- **身份认证**
- **请求限流**
- **错误恢复**
- **CORS 处理**
- **请求/响应修改**

------

## **📌 总结**

🔹 **中间件 ≠ 直接调用一个封装好的函数**，而是 **封装逻辑 + 传递控制权** 的函数，**拦截并增强** 原有的处理流程。
 🔹 通过 **嵌套调用** 形成责任链，**前置处理 → 目标函数 → 后置处理**。
 🔹 Go 的 `net/http` 使用 `http.Handler`，Gin 使用 `c.Next()` 传递控制权。

👉 **如果你面试被问“Go 的中间件是什么？”**，你可以回答：

> **中间件是一种在请求处理前后执行逻辑的封装，通常是一个高阶函数，它接收并返回新的处理函数，形成嵌套调用，以增强 HTTP 请求的处理能力。** 🚀