---
title:数值常量的类型转换和二进制需要注意的坑
---

## 数值常量

数值常量是高精度的 **值**。

一个未指定类型的常量由上下文来决定其类型。

源代码是这样的

```go
package main

import "fmt"

const (
	// 将 1 左移 100 位来创建一个非常大的数字
	// 即这个数的二进制是 1 后面跟着 100 个 0
	Big = 1 << 100
	// 再往右移 99 位，即 Small = 1 << 1，或者说 Small = 2
	Small = Big >> 99
)

func needInt(x int) int { return x*10 + 1 }
func needFloat(x float64) float64 {
	return x * 0.1
}

func main() {
	fmt.Println(needInt(Small))
	fmt.Println(needFloat(Small))
	fmt.Println(needFloat(Big))
}

```

然后突发奇想试试63测试边界，但是直接报错

```
./prog.go:19:15: cannot use Big (untyped int constant 9223372036854775808) as int value in argument to fmt.Println (overflows)
```

```go
package main

import "fmt"

const (
	Big = 1 << 63
	Small = Big >> 99
)

func needInt(x int) int { return x*10 + 1 }
func needFloat(x float64) float64 {
	return x * 0.1
}

func main() {
	fmt.Println(needInt(Small))
	fmt.Println(needFloat(Small))
	fmt.Println(needFloat(Big))
	 fmt.Println(Big)
}

```

这是因为Go 中的常量是 **无类型的**（untyped），会根据使用的上下文来推断类型。在 `1 << 63` 这种表达式中，由于它是一个非常大的数字，Go 会推导它为 `untyped int constant`，这会导致溢出错误。当你尝试将其赋给 `int64` 时，编译器会认为它超出了 `int64` 类型的范围，导致错误。

而如果想要得到-9223372036854775808，也就是1作为符号位，就要

```go
var Big2 int64 = -(1<<63)
```

手动添加符号