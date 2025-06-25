---
title:const和itoa
---

**const 用于定义常量，定义之后不能修改，不能再次赋值，在程序运行期间不会改变。**

# 定义一个常量

```go
const pi = 3.1415926
```

# 批量声明常量

```go
const (
   statusOk = 200
   notFound = 404
   serverError = 500
)
```

# 批量声明常量时，如果某一行没有写=，那么就和上一行一致

```go
const (
   n1 = 100
   n2
   n3
)
```

打印结果：n1 n2 n3 都是100

# iota

1. 在const关键字出现时将被重置为0；
2. const中每增加一行常量声明，将使 iota 计数一次
3. 我iota的理解就是类似枚举

```go
 const (
   a1 = iota //0
   a2
   a3
)
```

打印结果：a1:0 a2:1 a3:2

## iota面试题1

```go
go  const (
   b1 = iota //0
   b2        //1
   _         //2
   b3        //3
)
```

**分析：_也占了一行，所以_的值相当于是2，打印b3的值为3**

## iota面试题2：插队情况(1)

```go
go  const (
   c1 = iota //0
   c2 = 100  //100
   c3        //100
   c4        //100
)
```

**分析：c1=iota，所以c1的值为0很好理解；因为c2=100，而c3、c4没有=，所以和c2的值保持一致都是100**

## iota面试题3：插队情况(2)

```go
 const (
   d1 = iota //0
   d2 = 100  //100
   d3 = iota //2
   d4        //3
)
```

**分析：d3的值为2可能出乎有些同学的意料，有的同学可能觉得d3的值为0，其实不是的。这道题其实就是为了让d3继续使用iota的方式设置值。 或者这么讲：在面试题2中怎么设置让c3不为100，而是继续按照iota赋值，让c3=2呢？面试题3就给出了答案。**

## 多个常量声明在一行

```go
 const (
   d1, d2 = iota + 1, iota + 2 //1 2
   d3, d4 = iota + 1, iota + 2 //2 3
)
```

**分析：其实很好理解，第一行的iota值为0，第二行的iota值为1，再执行加法运算就是注释中标注的结果了**

# iota应用实例

### **1. 基本枚举**

定义一组自增的枚举常量：

```
const (
    Pending = iota // 0
    Active         // 1
    Done           // 2
)
```



### **2. 结合表达式**

生成带有偏移或运算的常量：

```go
const (
    A = iota + 1   // 1
    B              // 2
    C              // 3
)

// 结合位运算（权限控制）
const (
    Read  = 1 << iota // 1 (0b001)
    Write             // 2 (0b010)
    Exec              // 4 (0b100)
)
```



### **3. 跳过特定值**

使用`_`忽略某些值：

```go
const (
    Apple = iota // 0
    Banana       // 1
    _            // 2（跳过）
    Cherry       // 3
)
```



### **4. 文件大小单位**

生成按指数增长的常量（如KB、MB）：

定义数量级

```go
  const (
   _  = iota
   KB = 1 << (10 * iota)
   MB = 1 << (10 * iota)
   GB = 1 << (10 * iota)
   TB = 1 << (10 * iota)
   PB = 1 << (10 * iota)
)
```

输出结果

```go
KB: 1024
MB: 1048576
GB: 1073741824
TB: 1099511627776
PB: 1125899906842624
```

##### 更进一步

猜一下下面代码段的输出结果是什么？

```go
  const (
   _  = iota
   KB = 1 << (10 * iota)
   MB
   GB
   TB
   PB
)
```

打印结果和上面是一样的：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08f340a4fef847949e36c1c2997fae35~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)



### **5. 索引常量**

为数组或结构体字段生成索引：

```go
const (
    Name = iota // 0
    Age         // 1
    Email       // 2
    NumFields   // 3（字段总数）
)

var user [NumFields]string
```



### **6. 多常量分组**

不同`const`块中的`iota`独立计数：

```go
const ( // 分组1
    GroupA = iota // 0
    GroupB        // 1
)

const ( // 分组2
    GroupX = iota // 0
    GroupY        // 1
)

```



### **7. 字符串枚举**

结合字符串方法生成可读枚举：

```go
type Status int

const (
    Pending Status = iota
    Active
    Completed
)

func (s Status) String() string {
    return [...]string{"Pending", "Active", "Completed"}[s]
}
```



### **8. 复杂表达式**

同一行声明多个常量：

```go
const (
    A, B = iota, iota * 2 // A=0, B=0
    C, D                  // C=1, D=2
)
```

### **注意事项**

- `iota`在`const`块中从0开始，每行递增，**无论是否显式使用**。

- 中断`iota`后需显式恢复：

  ```go
  const (
      A = iota    // 0
      B           // 1
      C = 100     // 100（显式赋值）
      D = iota    // 3（继续递增）
  )
  ```



# 总结

定义常量使用`const`关键字，定义之后不能修改，不能再次赋值，在程序运行期间不会改变。

`iota`是go语言中很特殊的设定，`iota`主要用于简化自增常量的声明，适合枚举、位掩码、索引等场景。使用时需注意其递增规则，避免因中断或复杂表达式导致意外结果。

