# title:关于Gin框架中间件的执行顺序问题

代码如下：

```go
package main

// lesson18 中间件

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// 属于handlerFunc类型
func indexHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"msg": "index",
	})
}

// 定义一个中间件m1 用来计时
func m1(c *gin.Context) {
	fmt.Println("m1 in")
	start := time.Now()
	c.Next() // 继续执行后续的函数
	fmt.Println("m1 out", time.Since(start))
}

// 定义一个中间件m2 用来测试c.Abort()
func m2(c *gin.Context) {
	fmt.Println("m2 in")
	c.Abort() // 终止执行后续的函数,但是m2和m1的out还是会执行的
	fmt.Println("m2 out")
}

func m3(c *gin.Context) {
	fmt.Println("m3 in")
	c.JSON(http.StatusOK, gin.H{
		"msg": "m3",
	})
}

func main() {
	r := gin.Default()

	r.Use(m1, m2)
	r.GET("/index", indexHandler)
	// 遇到全局都需要m1中间件,则使用Use方法,这样不需要每个路由都写m1,m1只作用后面的函数，且执行顺序在最前，如果改变执行顺序

	// r.GET("/index", m1, indexHandler)
	r.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"msg": "hello",
		})
	})
	r.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"msg": "test",
		})
	})
	r.Run(":8080")
}

```



在 Gin 中（以及大多数类似框架中），中间件的执行顺序是根据**注册的顺序**来确定的，具体来说：

1. **全局中间件**
   使用 `r.Use()` 注册的中间件会被添加到所有路由的处理链中。无论你在后续注册哪条路由，只要是在全局中间件之后注册的，这些路由都会在进入具体的路由处理函数之前先执行全局中间件。
   **注意**：如果你在调用 `r.Use()` 之后再注册路由，那么这些路由会包含该全局中间件；反之，之前注册的路由可能不包含后续添加的全局中间件。
2. **路由组中间件**
   当你为某个路由组（例如通过 `r.Group("/path")` 得到的组）调用 `group.Use()` 时，这些中间件会在全局中间件执行之后，再依照它们的注册顺序加入到该组的处理链中。
   最终的执行链顺序是：
   **全局中间件（按照注册顺序） → 路由组中间件（按照注册顺序） → 具体的路由处理函数**
3. **如何改变这种顺序？**
   由于全局中间件始终会在路由组中间件之前执行，这是 Gin 的设计决定，无法直接通过简单的 API 调用改变。如果你希望局部（路由组）中间件的逻辑在某些全局中间件之前执行，有以下几种思路：
   - **调整中间件注册的位置**：可以将原本全局中间件的逻辑提取出来，放在一个单独的中间件中，然后在需要特定顺序的路由组中单独使用，而不是作为全局中间件。这样你可以完全控制顺序。
   - **组合中间件**：将需要前置执行的逻辑与局部中间件组合到一起，统一在路由组内注册，从而覆盖全局中间件默认的顺序。

总之，默认情况下，全局中间件的顺序是固定在所有路由之前，无法直接与路由组中间件进行“交叉排序”。如果业务上确实需要特定的执行顺序，就需要在设计时将相关中间件统一注册到同一个级别中，或者调整注册的时机与位置。