# title:Status

`Status` 是一个自定义的枚举类型，而 `String()` 是一个方法，用于实现 `fmt.Stringer` 接口，从而为 `Status` 类型提供字符串表示。这是 Go 语言中非常常见的模式。

接下来，将详细解释枚举类型、`String()` 方法的作用，以及其他常见的接口和方法。

---

### **1. 枚举类型与 `String()` 方法**
在 Go 中，枚举类型通常通过自定义类型和常量来实现。例如：
```go
type Status int

const (
    Pending Status = iota // 0
    Active                // 1
    Completed             // 2
)
```

为了实现枚举值的字符串表示，可以为枚举类型实现 `String()` 方法：
```go
func (s Status) String() string {
    return [...]string{"Pending", "Active", "Completed"}[s]
}
```

这样，`Status` 类型就实现了 `fmt.Stringer` 接口，可以在 `fmt.Println` 等函数中自动调用：
```go
fmt.Println(Pending) // 输出: Pending
```

---

### **2. 其他常见的接口和方法**
除了 `fmt.Stringer` 接口，Go 语言中还有许多其他常见的接口和方法，适用于不同的场景。以下是一些典型的例子：

---

#### **（1）`error` 接口**
`error` 是 Go 语言中用于表示错误的接口，定义如下：
```go
type error interface {
    Error() string
}
```
你可以为自定义类型实现 `Error()` 方法，使其满足 `error` 接口：
```go
type MyError struct {
    Code    int
    Message string
}

func (e MyError) Error() string {
    return fmt.Sprintf("Error %d: %s", e.Code, e.Message)
}

func main() {
    err := MyError{Code: 404, Message: "Not Found"}
    fmt.Println(err) // 输出: Error 404: Not Found
}
```

---

#### **（2）`sort.Interface` 接口**
`sort.Interface` 是用于排序的接口，定义如下：
```go
type Interface interface {
    Len() int
    Less(i, j int) bool
    Swap(i, j int)
}
```
你可以为自定义类型实现 `sort.Interface`，从而使用 `sort.Sort` 进行排序：
```go
type ByAge []Person

type Person struct {
    Name string
    Age  int
}

func (a ByAge) Len() int           { return len(a) }
func (a ByAge) Less(i, j int) bool { return a[i].Age < a[j].Age }
func (a ByAge) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

func main() {
    people := []Person{
        {"Alice", 25},
        {"Bob", 20},
        {"Charlie", 30},
    }
    sort.Sort(ByAge(people))
    fmt.Println(people) // 输出: [{Bob 20} {Alice 25} {Charlie 30}]
}
```

---

#### **（3）`io.Reader` 和 `io.Writer` 接口**
`io.Reader` 和 `io.Writer` 是用于输入输出的接口，定义如下：
```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}
```
你可以为自定义类型实现这些接口，从而支持文件、网络等操作：
```go
type MyBuffer struct {
    data []byte
}

func (b *MyBuffer) Write(p []byte) (n int, err error) {
    b.data = append(b.data, p...)
    return len(p), nil
}

func (b *MyBuffer) String() string {
    return string(b.data)
}

func main() {
    var buf MyBuffer
    fmt.Fprintf(&buf, "Hello, %s!", "Go")
    fmt.Println(buf.String()) // 输出: Hello, Go!
}
```

---

#### **（4）`json.Marshaler` 和 `json.Unmarshaler` 接口**
`json.Marshaler` 和 `json.Unmarshaler` 是用于 JSON 序列化和反序列化的接口，定义如下：
```go
type Marshaler interface {
    MarshalJSON() ([]byte, error)
}

type Unmarshaler interface {
    UnmarshalJSON([]byte) error
}
```
你可以为自定义类型实现这些接口，从而自定义 JSON 的编码和解码行为：
```go
type Person struct {
    Name string
    Age  int
}

func (p Person) MarshalJSON() ([]byte, error) {
    return []byte(fmt.Sprintf(`{"name":"%s","age":%d}`, p.Name, p.Age)), nil
}

func main() {
    p := Person{Name: "Alice", Age: 25}
    jsonData, _ := json.Marshal(p)
    fmt.Println(string(jsonData)) // 输出: {"name":"Alice","age":25}
}
```

---

#### **（5）`http.Handler` 接口**
`http.Handler` 是用于处理 HTTP 请求的接口，定义如下：
```go
type Handler interface {
    ServeHTTP(ResponseWriter, *Request)
}
```
你可以为自定义类型实现 `ServeHTTP` 方法，从而创建自定义的 HTTP 处理器：
```go
type MyHandler struct{}

func (h MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    handler := MyHandler{}
    http.Handle("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

---

### **3. 总结**
- **枚举类型**：通过自定义类型和常量实现。
- **`String()` 方法**：用于实现 `fmt.Stringer` 接口，提供字符串表示。
- **其他常见接口**：
  - `error`：用于错误处理。
  - `sort.Interface`：用于排序。
  - `io.Reader` 和 `io.Writer`：用于输入输出。
  - `json.Marshaler` 和 `json.Unmarshaler`：用于 JSON 序列化和反序列化。
  - `http.Handler`：用于处理 HTTP 请求。

