# Title：Channel的一系列思考

------

## 自动关闭or手动关闭（close）？	

​	学习goroutine和channel的时候发现deadlock，deadlock出现的原因基本就是通道有人生产放入但无取出的操作，就像田径比赛中的4x100接力赛，想要完成交棒必须有一个能够接棒的运动员，否则只能等待。简单来说就是无缓冲的通道必须有至少一个接收方才能发送成功。

​	修复好后就对channel通道的关闭产生疑问，什么时候通道会自动关闭，或者需要手动关闭（close）？

经过查阅资料，得知：**一个通道值是可以被垃圾回收掉的。通道通常由发送方执行关闭操作，并且只有在接收方明确等待通道关闭的信号时才需要执行关闭操作。**它和**关闭文件**不一样，通常在结束操作之后关闭文件是必须要做的，**但关闭通道不是必须的。**

关闭后的通道有以下特点：

1. 对一个关闭的通道再发送值就会导致 panic。
2. 对一个关闭的通道进行接收会一直获取值直到通道为空。
3. 对一个关闭的并且没有值的通道执行接收操作会得到对应类型的零值。
4. 关闭一个已经关闭的通道会导致 panic。

也就是说close在go中是立即执行， 立即关闭通道。

**close(ch) 不会清空通道，也不会等待通道中的值被取完。**
**关闭后，通道仍然可以被读取，但不能再写入，**否则会导致panic（向已关闭的通道发送数据）。
读取者可以继续从已关闭的通道读取剩余的值，**当通道为空时，ok 变量会变为 false**（即 v, ok := <-ch，ok为false写退出逻辑）。

那么我通过观察测试，得出来的初步推论满足取出的次数等于小于存入的次数，那么就不需要自己用close，否则就要在存入后直接close是吗，还有就是如果close之后还能开启吗？

不过后面考虑到这几种情况产生：

1. **生产者** 关闭通道，以通知消费者 **不再有新数据**，避免消费者一直阻塞等待的情况，

   - ```
     package main
     
     import "fmt"
     
     func main() {
         ch := make(chan int)
     
         // 生产者 goroutine
         go func() {
             for i := 0; i < 5; i++ {
                 ch <- i
             }
             close(ch) // 关闭通道，通知消费者
         }()
     
         // 消费者读取数据
         for v := range ch {
             fmt.Println(v)
         }
     }
     
     ```

     

2. **多个消费者时，避免 `panic: send on closed channel`**

   - 如果一个生产者向通道发送数据，而多个消费者读取数据，关闭通道可以确保所有消费者都能正确退出。

     ```
     package main
     
     import (
         "fmt"
         "sync"
     )
     
     func main() {
         ch := make(chan int)
         var wg sync.WaitGroup
     
         // 启动 3 个消费者
         for i := 0; i < 3; i++ {
             wg.Add(1)
             go func(id int) {
                 defer wg.Done()
                 for v := range ch {
                     fmt.Printf("Worker %d received %d\n", id, v)
                 }
             }(i)
         }
     
         // 生产者发送数据
         for i := 0; i < 10; i++ {
             ch <- i
         }
         close(ch) // 关闭通道，通知所有消费者
     
         wg.Wait() // 等待所有消费者完成
     }
     
     ```

同时 关闭通道的注意事项告诉我们不能向已关闭的通道发送数据，在关闭 nil 通道会 `panic`，以及`close` 只能由发送方调用，那么就明晰了，只要我们能确保从channel中取数据的次数是有限并小于或等于存的次数，而不是for range或无限循环就可以

这里要**注意：**目前Go语言中并没有提供一个不对通道进行读取操作就能判断通道是否被关闭的方法。不能简单的通过`len(ch)`操作来判断通道是否被关闭。

## **`range` 遍历通道的底层逻辑**

​	对于 `range ch`：

1. **从 `ch` 取出数据**。
2. **如果 `ch` 关闭且取完数据，退出循环**。
3. **如果 `ch` 仍然有数据，继续遍历**。

```
package main

import "fmt"

func main() {
    ch := make(chan int, 3)

    go func() {
        ch <- 10
        ch <- 20
        ch <- 30
        close(ch) // 关闭通道,这里不close会无限阻塞！！！
    }()

    for v := range ch { // 直到 ch 关闭后，才退出循环
        fmt.Println(v)
    }
}

```

底层逻辑就像：

```go
for {
    v, ok := <-ch
    if !ok { // 通道关闭，退出循环
        break
    }
    // 继续处理数据
    fmt.Println(v)
}

```

`len(ch)` 只适用于 **缓冲通道（buffered channel）**，表示当前通道的元素个数，但：

- **`len(ch)` 不能用于 `range`**，因为 `range` 需要不断读取新数据。
- **`len(ch)` 不能检测通道是否关闭**，所以 `range` 依赖 `close(ch)` 退出。

### **示例：**

```
go复制编辑ch := make(chan int, 3)
ch <- 1
ch <- 2
fmt.Println(len(ch)) // ✅ 2，通道里有两个数据
```

但：

```
go复制编辑for i := 0; i < len(ch); i++ { // ❌ 不能这样遍历通道！
    fmt.Println(<-ch)
}
```

这种方式**不适用于通道**，因为 `len(ch)` 可能在 `receive` 时动态变化。

提一嘴：

在`range` 遍历`slice/map` 的底层,`range` **是基于 `len()` 计算的**

```
arr := []int{1, 2, 3}
for i := 0; i < len(arr); i++ { // ✅ 等价于 `range`
    fmt.Println(arr[i])
}
```



## 总结：

🔹 **`range` 遍历通道不会使用 `len(ch)`，而是依赖 `close(ch)` 退出**。
🔹 **如果 `ch` 没有 `close()`，`range` 会阻塞**。
🔹 **通道不能像 `slice/map` 那样用 `len()` 遍历**。
🔹 **如果 `range` 不能用，手动 `ok := <-ch` 方式检测通道是否关闭**。

### **`range` 遍历通道的正确用法**

✅ **方式 1：必须 `close(ch)`**

```go
go复制编辑go func() {
    for i := 0; i < 5; i++ {
        ch <- i
    }
    close(ch) // 关闭通道，保证 `range` 能退出
}()

for v := range ch { // `range` 依赖 `close` 才能结束
    fmt.Println(v)
}
```

✅ **方式 2：手动检查 `ok`**

```go
go复制编辑for {
    v, ok := <-ch
    if !ok {
        break
    }
    fmt.Println(v)
}
```

🚫 **错误方式：用 `len(ch)` 遍历**

```go
go复制编辑for i := 0; i < len(ch); i++ { // ❌ 错误，`len(ch)` 不能用来遍历通道
    fmt.Println(<-ch)
}
```





## close总结：

### **1. 何时不需要 `close`？**

只要 **接收次数**（`receive`） **等于小于** **发送次数**（`send`），就**不需要手动 `close`**，因为：

- `receive` 取数据后不会再阻塞。
- `receive` 没有使用 `range` 依赖 `close` 才能退出。

**示例：**

```go
package main

import "fmt"

func main() {
    ch := make(chan int)

    go func() {
        for i := 0; i < 5; i++ {
            ch <- i // 发送 5 次
        }
    }()

    for i := 0; i < 5; i++ {
        fmt.Println(<-ch) // 接收 5 次，匹配
    }
}
```

**✅ 这里不需要 `close(ch)`，程序不会死锁。**

------

### **2. 何时必须 `close`？**

如果 `receive` 的次数**不固定**，或者使用了 `range` 读取通道，就必须 `close`，否则：

- `range ch` 会**无限等待**，导致死锁。
- 其他 goroutine 可能无法正确退出。

**示例（必须 `close`）：**

```go
package main

import "fmt"

func main() {
    ch := make(chan int)

    go func() {
        for i := 0; i < 5; i++ {
            ch <- i
        }
        close(ch) // 生产者完成后关闭通道
    }()

    for v := range ch { // 依赖 close(ch) 才能退出
        fmt.Println(v)
    }
}
```

**✅ `close(ch)` 让 `range` 退出，防止死锁。**

------

### **3. `close` 之后还能开启吗？**

🚫 **不能！关闭通道后不能重新开启！**

- 关闭通道后，任何写入 (`ch <- x`) 都会 **panic**。
- 但仍然可以**继续读取** **已缓冲的数据**（如果是缓冲通道）。

#### **示例：**

```go
package main

import "fmt"

func main() {
    ch := make(chan int, 2)

    ch <- 10
    ch <- 20
    close(ch) // 关闭通道

    fmt.Println(<-ch) // ✅ 还能取数据：10
    fmt.Println(<-ch) // ✅ 还能取数据：20
    fmt.Println(<-ch) // ❌ 取不到新数据，返回零值 0
}
```

**⚠️ `ch <- 30` 这种写入会 `panic`！**

```go
ch <- 30  // ❌ panic: send on closed channel
```

------

### **4. `close` 后的 `receive` 规则**

- 关闭后**仍然可以接收** **已发送但未取走的数据**（只有带缓存的通道）。
- 取完后，**继续取会返回通道类型的零值**（`int` 类型返回 `0`，`string` 返回 `""`）。
- `ok := <-ch` 方式可以**检查通道是否关闭**。

**示例：**

```go
package main

import "fmt"

func main() {
    ch := make(chan int, 2)

    ch <- 10
    ch <- 20
    close(ch) // 关闭通道

    v, ok := <-ch
    fmt.Println(v, ok) // ✅ 10, true

    v, ok = <-ch
    fmt.Println(v, ok) // ✅ 20, true

    v, ok = <-ch
    fmt.Println(v, ok) // ❌ 0, false（通道已关闭）
}
```

------

### **5. `close` 的最佳实践**

- **单个 `sender`，多个 `receiver`**：**必须 `close(ch)`**。
- **多个 `sender`，单个 `receiver`**：**不能随便 `close(ch)`**，否则会 `panic`。
- **多个 `sender`，多个 `receiver`**：**需要 `sync.WaitGroup` 或 `sync.Once` 控制 `close(ch)`。

------

### **结论**

✅ **不需要 `close`：**

- `send` 次数 = `receive` 次数。
- 只用 `<-ch` 读取 **固定次数**。

✅ **必须 `close`：**

- `range ch` 读取通道。
- `receive` 需要判断何时退出。
- `多个 goroutine` 需要通知通道已结束。

🚫 **不能 `close` 之后再打开**

- 关闭后**还能读取**，但**不能写入**，否则 `panic`。





## Channal中阻塞行为

### **1. 发送操作 (`ch <- "job result"`) 的阻塞行为**

Go 语言的通道（channel）有两种：

- **无缓冲通道**（`ch := make(chan string)`）：发送操作 `ch <- value` **必须等到有接收者**，否则阻塞。
- **带缓冲通道**（`ch := make(chan string, 1)`）：如果缓冲区未满，发送不会阻塞；如果缓冲区满了，发送仍然会阻塞。

```
go复制编辑ch := make(chan string) // 无缓冲通道
go func() {
    time.Sleep(3 * time.Second)
    ch <- "job result" // 没有接收者，阻塞！
}()
```

- `ch <- "job result"` 这行代码会尝试把 `"job result"` 放入通道。
- **因为 `ch` 是无缓冲通道**，它**必须**等到有 `<- ch` 取出数据，才能完成发送操作，否则**goroutine 卡在这里，不会往下执行**。
- 如果 `demo2()` 的 `select` 语句选择了超时 `case <-time.After(1 * time.Second)` 并 `return`，那么 `ch` **再也没有接收者**，`ch <- "job result"` **永远不会成功，导致 goroutine 永远阻塞**。

------

### **2. 为什么 `ch <- "job result"` 不能先执行，再等待消费？**

很多人误以为 `ch <- "job result"` **会先放入通道，然后阻塞等待消费**，但事实并非如此！

在 Go 语言中，**无缓冲通道的本质是同步的**：

- 发送者和接收者必须匹配

  ，否则发送/接收操作会阻塞：

  - `ch <- value` **必须等到 `value := <-ch` 发生时，才能完成发送**。
  - `<-ch` **必须等到 `ch <- value` 发生时，才能完成接收**。

**示例代码演示这个特性：**

```
func main() {
    ch := make(chan int) // 无缓冲通道
    go func() {
        fmt.Println("准备发送数据")
        ch <- 42 // 这里会阻塞，直到 main goroutine 读取数据
        fmt.Println("发送完成") // 这行不会执行，除非 main 读取通道
    }()
    
    time.Sleep(2 * time.Second) // 故意延迟 2 秒
    fmt.Println("准备接收数据")
    value := <-ch // 这里 main goroutine 接收数据
    fmt.Println("接收到数据:", value)
}
```

**输出：**

```
准备发送数据
（等待2秒）
准备接收数据
接收到数据: 42
发送完成
```

- **"准备发送数据" 先打印**，但 `ch <- 42` **阻塞住了 goroutine**，直到 `value := <-ch` 执行，发送才完成。
- `ch <- 42` **不会提前放到通道里，而是等到接收者出现才一起执行**。

------

### **3. `ch <- value` 为什么没有存入无缓冲通道？**

Go 语言的 **无缓冲通道就是同步通信机制**，不像队列或者消息队列那样**存值**：

- **通道并不存数据**，它只是一个传输机制。
- `ch <- value` 只有当 `value := <-ch` 同时发生时，数据才能被真正传递。
- 如果接收者不存在，`ch <- value` **会一直阻塞，而不是先存进去再等待消费**。



### **总结**

1. **无缓冲通道的 `ch <- value` 必须有 `<-ch` 同时执行，否则会阻塞**。

2. **阻塞不是等待消费，而是直接阻塞在 `ch <-` 这一行**，直到有接收者。

3. **如果 `select` 选择超时分支，goroutine 仍然执行 `ch <- value`，但没有接收者，导致永久阻塞**。

4. 解决方案

   ：

   - 用 **带缓冲通道**
   - 在 `select` 中使用 `default`
   - 用 `context.WithTimeout` 避免超时阻塞