# 代理

在学习设计模式的过程中，代理模式绕不开，本次文章的任务是先学习代理模式，然后以此为衍生学习动态代理和静态代理。

首先要了解以下基础概念：

1. 反射
2. 代理

## 反射

### **1. 什么是反射调用？**

反射（Reflection）是一种 **运行时** 机制，它允许 Java 程序在 **不知道类的情况下**，动态地获取类的信息，并调用它的方法。
 换句话说：你可以**在程序运行时**，通过类名的字符串找到类，并执行其中的方法，而不是写死 `new` 一个对象再调用方法。

### **2. 反射调用方法的基本流程**

假设我们有一个 `Test` 类：

```
class Test {
    public void hello() {
        System.out.println("Hello, Reflection!");
    }
}
```

如果 **不使用反射**，我们一般这样调用：

```
Test obj = new Test(); // 直接创建对象
obj.hello(); // 直接调用方法
```

但是 **使用反射**，可以这样：

```
import java.lang.reflect.Method;

public class ReflectionExample {
    public static void main(String[] args) throws Exception {
        Class<?> cls = Class.forName("Test"); // 通过类名找到类
        Object obj = cls.getDeclaredConstructor().newInstance(); // 通过反射创建对象
        Method method = cls.getMethod("hello"); // 获取方法对象
        method.invoke(obj); // 通过反射调用方法
    }
}
```

**输出：**

```

Hello, Reflection!
```

反射的 `invoke()` 方法**到底怎么调用的**呢？这就涉及到底层原理。

------

### **3. `Method.invoke()` 的底层调用方式**

当 `invoke()` 被调用时，Java 的 **反射 API** 会做如下几步：

1. 检查访问权限

   - 例如 `private` 方法是不能随便调用的，需要 `setAccessible(true)`.

2. 调用 `MethodAccessor` 的 `invoke()`

   - `Method.invoke()` 其实内部调用了一个 `MethodAccessor` 对象。

   - ```
     MethodAccessor
     ```

      具体实现由 JVM 选择，通常有两种方式：

     1. **通过 `native` 方法调用 C 语言逻辑**（JVM 自带的方式）
     2. **通过 ASM 生成字节码并优化调用**（JVM 可能为了提高性能会采用）

------

### **4. 方式一：通过 `native` 方法调用 C 逻辑**

在 `Method.java` 源码里，你会发现：

```
@CallerSensitive
public Object invoke(Object obj, Object... args) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
    return methodAccessor.invoke(obj, args);
}
```

这里的 `methodAccessor.invoke(obj, args)` 可能调用的是 **Native Method（C 语言实现）**。

Java 通过 JNI（Java Native Interface）调用 `native` 方法：

```
cJNIEXPORT jobject JNICALL Java_java_lang_reflect_Method_invoke
  (JNIEnv *env, jobject method, jobject obj, jobjectArray args) {
    // 这里会用 C 语言的方式解析方法，并调用
}
```

**总结**：
 在 **传统实现** 中，Java 通过 `Method.invoke()` 走 `native` 方法，最终调用 C 语言的 **JNI 接口**，找到方法在内存中的地址并执行。

------

### **5. 方式二：通过 ASM 生成字节码**

为了提高反射的调用速度，JVM 可能会采用 **动态生成字节码** 的方式（ASM 技术），让 `invoke()` **更快**。
 具体来说：

- Java 可能会**动态创建一个子类**，这个子类会**直接调用目标方法**，避免了 `native` 方法的开销。
- 这种方式在 Java 1.8 之后越来越常见。

例如，JVM 可能会**自动生成类似这样的 Java 代码**：

```
class MethodAccessorImpl extends MethodAccessor {
    public Object invoke(Object obj, Object... args) {
        ((Test) obj).hello(); // 直接调用目标方法
        return null;
    }
}
```

然后再通过 **ASM 或者 `Unsafe`** 在运行时**动态生成字节码**，让这个 `invoke()` 速度更快。

------

### **6. 总结**

1. 早期的 JVM（或者某些情况）
   - `Method.invoke()` 走 `native` 方法，通过 JNI 调用 C 语言的逻辑。
2. 现代的 JVM（优化后）
   - 可能会使用 ASM **动态创建字节码**，让 `invoke()` 直接调用目标方法，提高效率。

**简单理解：**

- **普通 `invoke()`（默认）：慢一点，调用 `native` 方法（C 语言逻辑）。**
- **JVM 优化后（可能）：更快，动态生成字节码（ASM）。**



## 代理模式

以下是针对代理模式（Proxy Pattern）的详细说明，包含 **生活案例** 和 **Java/Go 代码示例**：

---

### 代理模式 (Proxy)
**核心思想**：通过中间人（代理）控制对真实对象的访问，类似「代购」或「经纪人」

1. **代理对象**：代替原始对象执行操作的对象，通常会在调用前后添加额外逻辑（如日志、权限校验）。
2. **被代理对象（目标对象）**：实际执行业务逻辑的对象，代理对象会调用它的方法。

---

#### 生活案例
**场景**：网购时快递代收点  
- **真实对象**：你购买的物品  
- **代理对象**：快递代收点
- **作用**：代收点帮你暂存快递（控制你对快递的直接访问）  

---

### 三大代理类型及代码实现

---

#### 1. 虚拟代理 (延迟初始化)
**场景**：网页加载时先显示缩略图，点击后才加载高清图  
```java
// Java 实现
interface Image {
    void display();
}

class RealImage implements Image { // 真实对象（耗资源）
    private String filename;
    public RealImage(String name) {
        this.filename = name;
        loadFromDisk(); // 模拟耗时加载
    }
    private void loadFromDisk() {
        System.out.println("加载高清图片：" + filename);
    }
    public void display() {
        System.out.println("显示图片：" + filename);
    }
}

class ProxyImage implements Image { // 代理对象
    private RealImage realImage;
    private String filename;
    
    public ProxyImage(String name) {
        this.filename = name;
    }
    
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(filename); // 延迟初始化
        }
        realImage.display();
    }
}

// 使用示例
Image image = new ProxyImage("photo.jpg");
image.display(); // 第一次调用时才真正加载
```

```go
// Go 实现
type Image interface {
    Display()
}

type RealImage struct { filename string }
func (ri *RealImage) Display() {
    fmt.Printf("显示图片：%s\n", ri.filename)
}
func NewRealImage(name string) *RealImage {
    fmt.Printf("加载高清图片：%s\n", name)
    return &RealImage{name}
}

type ProxyImage struct {
    realImage *RealImage
    filename  string
}
func (pi *ProxyImage) Display() {
    if pi.realImage == nil {
        pi.realImage = NewRealImage(pi.filename) // 延迟初始化
    }
    pi.realImage.Display()
}

// 使用示例
image := &ProxyImage{filename: "photo.jpg"}
image.Display() // 第一次调用时才真正加载
```

---

#### 2. 保护代理 (访问控制)
**场景**：公司文件系统，普通员工只能读文件，经理可以修改  
```java
// Java 实现
interface FileSystem {
    void read();
    void write();
}

class RealFileSystem implements FileSystem {
    public void read() {
        System.out.println("读取文件内容");
    }
    public void write() {
        System.out.println("修改文件内容");
    }
}

class ProtectedProxy implements FileSystem { // 保护代理
    private RealFileSystem realFS = new RealFileSystem();
    private boolean isManager;
    
    public ProtectedProxy(boolean isManager) {
        this.isManager = isManager;
    }
    
    public void read() {
        realFS.read(); // 所有人可读
    }
    
    public void write() {
        if (isManager) {
            realFS.write();
        } else {
            System.out.println("权限不足，无法修改");
        }
    }
}

// 使用示例
FileSystem empFs = new ProtectedProxy(false);
empFs.write(); // 输出：权限不足，无法修改
```

```go
// Go 实现
type FileSystem interface {
    Read()
    Write()
}

type RealFileSystem struct{}
func (rfs RealFileSystem) Read()  { fmt.Println("读取文件内容") }
func (rfs RealFileSystem) Write() { fmt.Println("修改文件内容") }

type ProtectedProxy struct {
    realFS    RealFileSystem
    isManager bool
}
func (pp ProtectedProxy) Read() {
    pp.realFS.Read()
}
func (pp ProtectedProxy) Write() {
    if pp.isManager {
        pp.realFS.Write()
    } else {
        fmt.Println("权限不足，无法修改")
    }
}

// 使用示例
empFs := ProtectedProxy{isManager: false}
empFs.Write() // 输出：权限不足，无法修改
```

---

#### 3. 远程代理 (网络调用封装)
**场景**：手机App访问云服务器数据（用户无需关心网络细节）  
```java
// Java 伪代码（演示概念）
interface CloudService {
    String getData();
}

class RemoteCloud implements CloudService { // 真实对象在云端
    public String getData() {
        // 实际会通过网络请求获取数据
        return "云端数据";
    }
}

class CloudProxy implements CloudService { // 本地代理
    public String getData() {
        // 1. 建立网络连接
        // 2. 发送请求
        // 3. 接收返回数据
        RemoteCloud cloud = new RemoteCloud();
        return cloud.getData();
    }
}
```

```go
// Go 伪代码（演示概念）
type CloudService interface {
    GetData() string
}

type RemoteCloud struct{} // 真实对象在云端
func (rc RemoteCloud) GetData() string {
    return "云端数据"
}

type CloudProxy struct{} // 本地代理
func (cp CloudProxy) GetData() string {
    // 模拟网络请求过程
    cloud := RemoteCloud{}
    return cloud.GetData()
}
```

---

### 代理模式核心总结

| 维度         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| **优点**     | 1. 控制对象访问<br>2. 增强安全性<br>3. 实现懒加载/延迟初始化<br>4. 降低系统耦合度 |
| **缺点**     | 1. 增加代码复杂度<br>2. 可能降低请求速度（如远程代理）       |
| **使用场景** | 1. 权限控制<br>2. 虚拟代理（延迟加载）<br>3. 日志记录/监控<br>4. 缓存代理 |

---

### 与装饰者模式的区别
| 模式           | 核心目的                                   | 控制权                   |
| -------------- | ------------------------------------------ | ------------------------ |
| **代理模式**   | **控制访问**（是否允许调用）               | 代理决定是否调用真实对象 |
| **装饰者模式** | **增强功能**（在原有功能基础上添加新功能） | 必须调用被装饰对象       |

**示例对比**：  
- 代理：代收点决定是否给你快递（控制访问）  
- 装饰者：给咖啡加糖（增强原有咖啡的功能）

### 常见误区澄清

| 误区                     | 正解                                                         |
| :----------------------- | :----------------------------------------------------------- |
| **代理就是多加一层类**   | 必须实现和原对象相同的接口，客户端无需知道用的是代理还是真实对象 |
| **代理只是为了延迟加载** | 代理可以实现：权限控制、日志记录、缓存、防火墙等多种功能     |
| **代理和装饰者一样**     | 装饰者模式重点在「增强功能」，代理模式重点在「控制访问」     |

### 什么时候该用代理模式？

1. **需要控制对象访问**（如权限验证）
2. **需要增强非业务功能**（如日志、监控）
3. **需要延迟消耗资源的操作**（如大文件加载）
4. **需要本地代理远程服务**（如RPC调用）



综上，可以看出来

代理模式简单来说就是在原来的类的基础上又封装了一层，使其在需要使用原来的类上的时候通过调用封装的方法来创建对象，或者进行管理，一句话：**「用一个中间层（代理）代替真实对象出面，在访问真实对象前后插入控制逻辑」**。

**记住一个原则**：当你发现某些操作必须在主逻辑之前/之后执行，且这些操作与业务无关时，就可以考虑使用代理模式。



## 静态代理与动态代理

接下来我将用代码说明静态代理和动态代理，

✅ **动态代理**——“在代码运行的过程中动态生成一个灵活的对象（可以在过程中组装它）并执行使用它。”
 ✅ **静态代理**——“通过一个静态的文件或者代码生成一个固定的对象。”

### **静态代理（Static Proxy）**

- **代理类在编译期就已经确定**，需要手写代理类，每个代理类只能为一个目标类提供代理。
- **代理逻辑是固定的**，如果需要修改代理逻辑，必须**修改源码**并重新编译。

### **动态代理（Dynamic Proxy）**

- **代理对象在运行时生成，而不是编译期就写死**。
- **可以灵活修改代理逻辑**，无需修改源码或重新编译。
- 代理对象**不需要手写具体的类**，而是用**反射**或其他方法**动态生成代理类**。
- **代理的方法可以根据上下文调整，比如日志、权限控制等**，可以**拦截方法调用**并执行额外逻辑。
- 我采用手写 `MyInterfaceFactory` **自己实现了一个动态代理机制**，和 Java 原生 `Proxy.newProxyInstance()` 类似。

### 手写步骤

总体一句话说明白：**将逻辑看成类，看成字符串拼接然后通过编译加载到jvm中组装成类，并通过反射获取到对象**。

静态代理是编译期确定的，动态代理是运行时生成的。我就

把一个字符串写在文件里

java编译器，动态编译文件（使用java封装的Compiler.compile(javaFile)）：可以在java运行时候动态编译java文件，编译文件放在class path里面

java虚拟机在执行的时候所有的虚拟资源都是通过class path获取，而在maven下class path是在target classes

然后通过编译这个文件加载到jvm中然后反射拿到实例对象之后可以运行，后面通过代理模式，对目标对象（这个文件生成的对象）进行代理（实际上就是相当于对这个文件再添加了字符串进去）然后编译文件加载反射拿到实例对象（代理对象），这个代理对象里面被注入了目标对象，就可以使用目标对象的方法。

这个代码存在与实际Java提供的动态代理还有一定区别：

1. 首先在代理类的生成方式上：
   - 通过手动拼接Java源码字符串生成代理类，并调用`JavaCompiler`进行编译。这种方式依赖文件系统和JDK环境，生成的是物理存在的`.java`和`.class`文件。
   - **JDK动态代理**：而在JDK中在内存中直接生成字节码（通过`ProxyGenerator`），无需源码文件和编译过程，性能更高且不依赖文件系统。

2. 在接口灵活动态性上：
   - 代理类硬编码实现了固定的`MyInterface`接口（见`createJavaFile`中的`implements MyInterface`）。若要代理其他接口，必须修改生成代码的逻辑。（用反射构造器获取具体类）
   - **JDK动态代理**：通过`Proxy.newProxyInstance(ClassLoader, Class<?>[] interfaces, InvocationHandler)`动态传入接口数组，支持任意接口的代理。（是通过类加载器，必须是接口）
3. **方法调用的处理**
   - 为每个接口方法生成固定代码（如`func1`、`func2`），通过`MyHandler.functionBody`返回方法体字符串。需要为每个方法单独处理，扩展性差。
   - **JDK动态代理**：所有方法调用统一转发到`InvocationHandler.invoke`方法，通过反射动态处理，无需为每个方法单独编码。
4. **依赖注入方式**
   - 通过反射手动注入成员变量（如`LogHandler`中的`myInterface`），需要显式操作字段，代码复杂且易出错。
   - **JDK动态代理**：通过`InvocationHandler`持有目标对象（即被代理的实例），在`invoke`方法中直接调用目标对象的方法，无需手动注入。

| 特性         | 动态代理 (`Proxy`)          | 反射构造器实例化       |
| ------------ | --------------------------- | ---------------------- |
| 目标类型     | 必须是接口                  | 必须是具体类（非接口） |
| 方法调用行为 | 通过`InvocationHandler`拦截 | 直接调用真实方法       |
| 生成对象类型 | 运行时生成的代理类          | 普通类的实例           |
| 典型应用场景 | AOP、远程调用、日志拦截     | 反射创建普通对象       |

### 代码流程说明

这段代码通过动态生成代理类的方式实现了方法调用的增强（如日志功能），其核心流程如下：

---

#### **1. 核心组件说明**
- **`MyInterface`**: 定义业务方法 (`func1`, `func2`, `func3`)。
- **`MyHandler`**: 定义如何生成代理类的方法体代码（`functionBody`）和设置代理的方法（`setProxy`）。
- **`MyInterfaceFactory`**: 负责动态生成代理类的源码、编译并实例化代理对象。
- **`Main` 类**:
  - `PrintFunctionName`/`PrintFunctionName1`: 直接打印方法名或添加额外逻辑。
  - `LogHandler`: 为方法调用添加日志（`before`/`after`），实现装饰器模式。

---

#### **2. 运行流程分析**

##### **步骤 1：创建基础代理对象**
```java
proxyObject = MyInterfaceFactory.createProxyObject(new PrintFunctionName());
proxyObject.func1();
```
- **生成代理类**:
  - 工厂生成类名 `MyInterface$proxy1`。
  - `PrintFunctionName` 的 `functionBody` 返回 `System.out.println("func1");`。
  - 生成的代理类代码直接打印方法名。
- **输出**:
  ```
  func1
  func2
  func3
  ```

##### **步骤 2：增强代理对象逻辑**
```java
proxyObject = MyInterfaceFactory.createProxyObject(new PrintFunctionName1());
proxyObject.func1();
```
- **生成代理类**:
  - 类名变为 `MyInterface$proxy2`。
  - `PrintFunctionName1` 生成的代码会先打印 `1`，再打印方法名。
- **输出**:
  ```
  1
  func1
  1
  func2
  1
  func3
  ```

##### **步骤 3：添加日志功能（装饰器模式）**
```java
proxyObject = MyInterfaceFactory.createProxyObject(new LogHandler(proxyObject));
proxyObject.func1();
```
- **生成代理类**:
  
  - 类名变为 `MyInterface$proxy3`。
  - `LogHandler` 的 `functionBody` 生成代码：
    ```java
    System.out.println("before");
    myInterface.func1(); // 调用前一个代理对象的方法
    System.out.println("after");
    ```
- **注入依赖**:
  - `LogHandler` 通过反射将前一个代理对象（`MyInterface$proxy2`）注入到新代理对象（`MyInterface$proxy3`）的 `myInterface` 字段。
- **输出**:
  ```
  before
  1         // 来自 MyInterface$proxy2 的逻辑
  func1
  after
  before
  1
  func2
  after
  before
  1
  func3
  after
  ```

---

#### **3. 关键机制解析**
- **动态代码生成**:
  - `MyInterfaceFactory` 拼接 Java 源码字符串，生成代理类文件（如 `MyInterface$proxy1.java`）。
  - 编译生成的源码，加载类并实例化代理对象。
- **反射注入**:
  - `LogHandler` 通过反射将前一个代理对象注入新代理类的 `myInterface` 字段，实现链式调用。
- **装饰器模式**:
  - 通过嵌套代理对象，逐层增强功能（如日志）。

---

#### **4. 代码学习建议**
1. **调试生成的文件**:
   - 检查 `target/classes/com/jinju/proxyTest` 下生成的 `MyInterface$proxy*.java` 文件，观察方法体如何被动态生成。
2. **反射操作**:
   - 理解 `LogHandler.setProxy()` 如何通过反射修改私有字段，思考其潜在风险（如安全限制）。
3. **动态编译**:
   - 研究 `JavaCompiler` 的 API，了解如何实现内存编译（避免写入临时文件）。
4. **设计模式**:
   - 对比 JDK 动态代理（`InvocationHandler`），理解手动实现代理的优缺点。

---

通过动态生成代理类，这段代码展示了如何在不修改原始类的情况下增强方法逻辑，是理解代理和装饰器模式的典型案例。

![mermaid-diagram-2025-03-15-180834](C:\Users\Jinju\images\mermaid-diagram-2025-03-15-180834.png)

### 后续改进

很明显缺陷在于无法**不能动态传递接口**，

生成的代理类强制实现了固定的`MyInterface`接口：

```
// 生成的代理类代码（硬编码接口）
public class MyInterface$proxy1 implements MyInterface { ... }
```

这意味着：

1. **仅支持单一接口**：代理类只能实现`MyInterface`，无法在运行时动态指定其他接口（如`AnotherInterface`）。
2. **方法名硬编码**：`func1`、`func2`等方法名在代码生成逻辑中固定，若接口方法变更（如新增`func4`），必须修改`createJavaFile`的拼接逻辑。

**对比JDK动态代理**：

```java
// JDK动态代理支持任意接口
MyInterface proxy = (MyInterface) Proxy.newProxyInstance(
    MyInterface.class.getClassLoader(),
    new Class[]{MyInterface.class, AnotherInterface.class}, // 可传入多个接口
    invocationHandler
);
```



若希望代码支持动态接口，可以做以下改进：

1. **动态传入接口类型**：

   - 修改`createJavaFile`方法，接受接口的`Class`对象，生成`implements`语句。

   ```java
   String implementsClause = "implements " + interfaceClass.getName();
   ```

2. **动态处理方法签名**：

   - 通过反射获取接口的所有方法，遍历生成每个方法的具体实现，而不是硬编码`func1`、`func2`。

   ```java
   for (Method method : interfaceClass.getMethods()) {
       String methodName = method.getName();
       String methodBody = handler.functionBody(methodName);
       // 拼接方法代码...
   }
   ```

3. **避免硬编码包名和路径**：

   - 根据接口的包名动态生成代理类的包路径，确保生成的类在正确的目录下。





