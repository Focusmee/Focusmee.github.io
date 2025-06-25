# 【Java语言学习】类加载机制

## 前置知识

### 🧠 1. **懒加载（Lazy Loading）**

**概念**：懒加载是指**延迟加载类或对象，直到真正需要用到时才加载或初始化**，以节省资源、加快启动速度。

**在类加载中体现**：

- Java 中，类的加载是按需触发的。
- **静态内部类实现单例模式**就用到了懒加载：

```java
public class Singleton {
    private Singleton() {}
    private static class Holder {
        private static final Singleton INSTANCE = new Singleton();
    }
    public static Singleton getInstance() {
        return Holder.INSTANCE; // 第一次调用才会加载 Holder 类
    }
}

```

比如Launcher就是懒加载



### 🔒 2. **重入锁（ReentrantLock）**

**概念**：Java 中的 `ReentrantLock` 是 `java.util.concurrent.locks` 包中的一种**可重入的显式锁**，用于代替 `synchronized` 实现更灵活的线程同步控制。

**特点**：

- **可重入**：同一线程可以多次获取锁而不会死锁。
- 提供可中断、超时、公平锁、非公平锁等高级功能。

```
ReentrantLock lock = new ReentrantLock();
lock.lock(); // 加锁
try {
    // 临界区
} finally {
    lock.unlock(); // 解锁
}
```

### 🧵 3. **ParallelCapableClassLoader / Parallel 类加载器**

 **Parallel Capable ClassLoader**。这是为了让**类加载器并发加载类**而设计的。

#### 为什么需要它？

传统的类加载器结构是树形的，多个线程同时加载类时可能会争用同一个类加载器的锁，导致性能下降。

#### Java 7 引入：

- `ClassLoader.registerAsParallelCapable()` 静态方法。
- 它允许自定义类加载器并发加载多个类，而不需要锁住整个加载器。

#### 类加载过程中的“只加载一次”：

- JVM 保证：**一个类在一个类加载器中只会被加载一次**。
- JVM 会用一个 `defineClass()` 方法来定义类，如果已经加载过就不再重复定义。
- 加载时使用了锁和一些并发策略（如上面的 ParallelCapable）来保证线程安全和效率。

### 📌 总结

| 名称                           | 作用                       | 关键词                     |
| ------------------------------ | -------------------------- | -------------------------- |
| **懒加载**                     | 延迟类或对象初始化         | 节省资源                   |
| **重入锁**                     | 可控制的线程同步工具       | `ReentrantLock`            |
| **ParallelCapableClassLoader** | 允许类加载器并发加载多个类 | 提高加载效率，避免同步阻塞 |



## LoadClass流程

### URLClassLoader的findClass（决定自定义类加载器加载方法）

你正在看的是 Java 类加载器中的核心方法 `findClass` 的一种实现（比如在 `URLClassLoader` 中）。这个方法是当类没有在缓存中，也没被父加载器加载成功时，由**当前类加载器“自己”负责加载类**的逻辑。

我们来**逐行拆解讲解**这段代码的作用和原理。

------

#### 🔍 方法签名

```java
protected Class<?> findClass(final String name) throws ClassNotFoundException
```

- 子类可以重写该方法，自定义类的加载方式。
- 接收类的全限定名，比如：`com.example.MyClass`。
- 若找不到类，则抛出 `ClassNotFoundException`。

------

#### 1️⃣ `AccessController.doPrivileged(...)`

```java
result = AccessController.doPrivileged(
```

🔐 **为什么要这么写？**

- 在 Java 安全沙箱模型中，如果加载类的路径是受限的（如读取文件、Jar、网络资源），必须使用 `doPrivileged()` 执行操作，避免权限被限制。
- `doPrivileged()` 会在一个受信任的权限上下文中执行代码。

------

#### 2️⃣ 内部 PrivilegedExceptionAction 的实现

```java
new PrivilegedExceptionAction<Class<?>>() {
    public Class<?> run() throws ClassNotFoundException {
        ...
    }
}
```

这是一个**匿名内部类**，是 `doPrivileged()` 所需的任务体。核心逻辑都在 `run()` 方法中。

------

#### 3️⃣ 构建类文件路径

```java
String path = name.replace('.', '/').concat(".class");
```

- 把类名转换成文件路径。
- 比如 `java.lang.String` → `java/lang/String.class`

------

#### 4️⃣ 尝试获取资源

```java
Resource res = ucp.getResource(path, false);
```

- `ucp` 通常是 `URLClassPath` 类型，负责根据类路径（classpath/jar/url）去找资源。
- `getResource(path, false)` 会尝试加载 `.class` 文件资源。

如果找到了，就进入定义流程；否则返回 `null`。

------

#### 5️⃣ 读取并定义类

```java
return defineClass(name, res);
```

- `defineClass(...)` 是 `ClassLoader` 的方法：
  - 会从 `.class` 文件中读取字节数组，进行校验，最终转换为 JVM 中的 `Class<?>` 对象。
- 如果 `IOException` 或 `ClassFormatError`，说明类文件损坏或非法。

```java
} catch (IOException e) {
    throw new ClassNotFoundException(name, e);
}
```

- 将 I/O 异常包装为 `ClassNotFoundException` 抛出。

```java
} catch (ClassFormatError e2) {
    if (res.getDataError() != null) {
        e2.addSuppressed(res.getDataError());
    }
    throw e2;
}
```

- `ClassFormatError` 是格式非法的字节码；
- 如果 `Resource` 记录了额外的数据异常，也一起附加到异常中（Java 7 的 suppressed 异常机制）。

------

#### 6️⃣ 外层异常处理

```java
} catch (java.security.PrivilegedActionException pae) {
    throw (ClassNotFoundException) pae.getException();
}
```

- `doPrivileged()` 包裹的是可能抛出异常的动作，所以用 `PrivilegedActionException` 捕获；
- 解包后抛出原始的 `ClassNotFoundException`。

------

#### 7️⃣ 判断返回结果

```java
if (result == null) {
    throw new ClassNotFoundException(name);
}
```

- 如果资源压根没找到，`ucp.getResource` 返回 null，那么最终也要抛出找不到类。

------

#### ✅ 最终返回

```java
return result;
```

------

#### 🔚 总结：整个流程如下：

| 步骤 | 内容                                             |
| ---- | ------------------------------------------------ |
| 1️⃣    | 转换类名为路径 `com.A.B` → `com/A/B.class`       |
| 2️⃣    | 通过 `ucp` 查找资源（可能是 jar 或本地路径）     |
| 3️⃣    | 找到后读取字节码，调用 `defineClass` 定义类      |
| 4️⃣    | 设置线程上下文类加载器（不在这里，但常常在外层） |
| 5️⃣    | 用 `doPrivileged()` 保证加载过程不受权限限制     |
| 6️⃣    | 如果找不到或格式错误，则抛出异常                 |

------

#### 🔥 举个例子（假设是 URLClassLoader）

你给它一个类名 `com.abc.HelloWorld`，它会：

1. 查找 `/com/abc/HelloWorld.class` 对应的 URL；
2. 读取字节码；
3. 转换为 `Class<?>` 对象；
4. 缓存到类加载器中。

------



### URLClassLoader的defineClass（把字节码变成 JVM 中的类对象）

你这段代码是 Java 类加载过程中最终“**把字节码变成 JVM 中的类对象**”的实现之一，也就是 `defineClass(String name, Resource res)` 方法的详细过程。

它通常出现在 `URLClassLoader` 或类似类加载器中，用于把 `.class` 文件内容读取后，**定义成 JVM 可识别的 `Class<?>` 对象**。

下面我们**逐行详细拆解**它的意义：

------

#### 🔐 方法签名

```java
private Class<?> defineClass(String name, Resource res) throws IOException
```

- `name`: 类的全限定名，比如 `"com.example.MyClass"`
- `res`: `Resource` 是一个封装了 `.class` 文件字节码、来源 URL、签名、Manifest 等元数据的对象。

------

#### ⏱️ 记录开始时间

```java
long t0 = System.nanoTime();
```

- 用于统计性能开销（后面用 `sun.misc.PerfCounter` 记录耗时）。

------

#### 📦 获取包名并尝试定义 package

```java
int i = name.lastIndexOf('.');
URL url = res.getCodeSourceURL();
if (i != -1) {
    String pkgname = name.substring(0, i);
    Manifest man = res.getManifest();
    definePackageInternal(pkgname, man, url);
}
```

##### 🧠 这部分的意义：

- 如果类有包名（即不是默认包），就提取包名。
- 从 `res` 获取 `Manifest`（通常是 jar 包中的 `META-INF/MANIFEST.MF` 文件）。
- 使用 `definePackageInternal()` 方法定义包信息（版本、作者、签名等）。
- 如果该包已存在于 JVM，则跳过；否则为包设置相关元信息。

这样做是为了让包级别的信息（如 `Package.getImplementationVersion()`）生效。

------

#### 📄 获取字节码数据（两种方式）

```java
java.nio.ByteBuffer bb = res.getByteBuffer();
if (bb != null) {
    // 使用 ByteBuffer
    CodeSigner[] signers = res.getCodeSigners();
    CodeSource cs = new CodeSource(url, signers);
    ...
    return defineClass(name, bb, cs);
} else {
    byte[] b = res.getBytes();
    CodeSigner[] signers = res.getCodeSigners();
    CodeSource cs = new CodeSource(url, signers);
    ...
    return defineClass(name, b, 0, b.length, cs);
}
```

#### 👇 两种方式分别是：

| 方式                       | 优点                                        |
| -------------------------- | ------------------------------------------- |
| `ByteBuffer`（直接缓冲区） | 更高效、避免复制开销，常用于大类或 I/O 映射 |
| `byte[]`（普通字节数组）   | 更通用，兼容性更强，资源小时常用            |

------

#### 📄 什么是 `CodeSource`？

```java
CodeSource cs = new CodeSource(url, signers);
```

- 表示类的来源及签名信息；
- JVM 在加载类时，使用这个信息进行**安全验证与权限控制**（比如 SecurityManager、沙箱机制）；
- `signers` 是类的签名者（如果 jar 是 signed jar）。

------

#### 💡 关键一步：defineClass

```java
return defineClass(name, bb, cs);
// 或
return defineClass(name, b, 0, b.length, cs);
```

- 这是 `ClassLoader` 提供的方法，最终会调用底层 native 方法（`defineClass0`）完成以下工作：
  1. 校验 class 文件格式是否合法（魔数、版本、常量池等）；
  2. 在 JVM 方法区或元空间中注册类元信息；
  3. 返回 Java 层的 `Class<?>` 对象。

------

#### 📊 性能记录

```java
sun.misc.PerfCounter.getReadClassBytesTime().addElapsedTimeFrom(t0);
```

- 用于记录**读取类字节码所花的时间**，这是 JVM 性能监控的一部分（不影响功能，只有 debug 或 profiling 时会用到）。

------

#### ✅ 总结核心流程

| 步骤 | 描述                                                |
| ---- | --------------------------------------------------- |
| 1️⃣    | 获取类的包名，并定义包（可选的 Manifest 信息）      |
| 2️⃣    | 获取 `.class` 的字节码（ByteBuffer 或 byte[]）      |
| 3️⃣    | 构造 CodeSource（来源和签名信息）                   |
| 4️⃣    | 调用 `defineClass()` 将字节码转换为 `Class<?>` 对象 |
| 5️⃣    | 记录加载耗时供性能分析                              |

------

#### 💬 延伸知识

##### 🚀 defineClass 和 defineClass0 区别

- `defineClass(...)` 是 Java 层的 API；
- 它最终会调用 native 的 `defineClass0(...)`，这是 JVM 实现的一部分（通常用 C/C++ 实现）；
- 它才是真正把字节码“变成类”的地方。

------

#### 🧪 实战用途（你可以这样写自己的类加载器）

```java
public class MyClassLoader extends ClassLoader {
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] classBytes = ...; // 从磁盘/网络/加密中获取
        return defineClass(name, classBytes, 0, classBytes.length);
    }
}
```

------



### 总结：URLClassLoader到底做了什么

你的理解整体已经很接近核心，下面我将**逐一验证、澄清和补充**你的理解，同时讲清楚 `URLClassLoader` 的作用和 `defineClass` 的真正含义。

------

## ✅ 一、你当前的理解验证

> **你说：**“自定义类加载器找到 parent（一般是 AppClassLoader），然后 AppClassLoader 找到 ExtClassLoader，最后委托到 BootstrapClassLoader 加载类”

这是 ✅ **基本正确的**，但我稍作补充让它更准确：

### ✅ 正确版本应是：

1. 自定义类加载器调用 `loadClass(name)`；
2. 它会 **先委托给 parent（默认 AppClassLoader）**；
3. AppClassLoader 再委托给其 parent，即 ExtClassLoader；
4. ExtClassLoader 最终委托给 BootstrapClassLoader（用 `null` 表示）；
5. 如果每一层都加载失败（即抛出 `ClassNotFoundException`），**才回到当前类加载器自己的 `findClass(name)` 来加载**。

这就是 Java 的**双亲委派模型**（Parent Delegation Model）：

> **“总是先委托父加载器加载类，除非父加载器找不到，才由当前加载器尝试加载。”**

------

## 🔍 二、那 `URLClassLoader` 是干什么的？

### 👉 简答：

**`URLClassLoader` 是一种可以从 URL（文件、jar 包、网络）加载类和资源的类加载器。**

它是 JDK 提供的最常用的类加载器之一，特别适用于 **动态加载 jar 文件**，例如：

```java
URL[] urls = new URL[] { new URL("file:/path/to/my-lib.jar") };
URLClassLoader loader = new URLClassLoader(urls);
Class<?> clazz = loader.loadClass("com.example.MyClass");
```

------

### 📦 常见应用场景：

| 场景                         | 说明                                       |
| ---------------------------- | ------------------------------------------ |
| Java 应用服务器（如 Tomcat） | 为每个 Web 应用分配不同的 `URLClassLoader` |
| 插件系统                     | 动态加载第三方 jar 包                      |
| 运行时扩展                   | 脚本引擎、编译器、热更新、Java SPI         |

------

## 🧠 三、真正加载类的是不是 `defineClass()`？

### ✅ 是的，但注意区分两种方法：

#### 🚩 `loadClass(name)`（在 `ClassLoader` 中）

- 是外部调用入口（比如 `Class.forName(...)` 也是用它）；
- 它遵循 **双亲委派模型**，会先委托给 `parent.loadClass(...)`；
- 如果父加载器都没找到，再调用 `findClass(name)`。

#### 🚩 `findClass(name)`（你自己实现的）

- 如果父加载器失败，就走到这里；
- 在这里，你可以使用 `defineClass(...)` 把二进制字节码转换成 JVM 识别的 `Class<?>`。

#### 🚩 `defineClass(...)`（最终实现加载的核心方法）

- 它是 JVM 提供的 native 方法，真正完成：
  1. **验证**：校验 class 文件格式；
  2. **准备**：为类分配内存、生成方法表、字段表；
  3. **连接**：解析依赖、准备静态变量；
  4. **返回**：`Class<?>` 对象。

------

### 📘 总结：URLClassLoader 与类加载流程的关系图

```
        ClassLoader.loadClass(name)
               ↓
   ┌──────────双亲委派──────────┐
   ↓                           ↓
自定义类加载器              parent.loadClass(name)
     ↓                          ↓
findClass(name)         ExtClassLoader → BootstrapClassLoader
     ↓
读取URL中的class文件
     ↓
defineClass(name, bytes, ...)
     ↓
返回Class对象
```

------

### ✅ 关键要点总结

| 问题                               | 答案                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| `URLClassLoader` 作用是什么？      | 可以从本地或网络的 URL（目录、jar 包）中加载类和资源。       |
| 它是否使用双亲委派模型？           | 是的，它继承自 `ClassLoader`，遵循双亲委派模型。             |
| `defineClass` 是什么时候调用的？   | 当 `loadClass` 中父类加载失败后，调用 `findClass()`，你才会调用 `defineClass()` 来真正加载字节码。 |
| 是否所有类都走到 `defineClass()`？ | 否，只有父加载器加载失败时才会走到你自定义的 `findClass()`，进而调用 `defineClass()`。 |

------

### ✅ 简答：什么时候会用到 `URLClassLoader`？

**`URLClassLoader` 是在你需要** *“从指定路径或 jar 包中动态加载类”* 的时候才会被主动创建和调用。

#### 🔍 常见使用场景

| 场景                                 | 是否默认调用                                                 |
| ------------------------------------ | ------------------------------------------------------------ |
| **Java 命令行运行应用（java xxx）**  | ✅ JVM 默认用 `AppClassLoader`，就是一个 `URLClassLoader`     |
| **类路径下 jar 加载**                | ✅ 默认走 `URLClassLoader`                                    |
| **自定义加载 jar 插件**              | ✅ 你手动 new 出 `URLClassLoader`                             |
| **Tomcat/Web服务器**                 | ✅ 为每个 Web 应用创建独立的 `URLClassLoader`                 |
| **IDE（如 IntelliJ）运行 Java 程序** | ✅ 使用 `AppClassLoader`，本质就是 `URLClassLoader`           |
| **Java SPI**                         | ✅ `ServiceLoader` 默认使用 `Thread.currentThread().getContextClassLoader()`，往往是 `URLClassLoader` |

### ✅ JVM 启动时的实际类加载器链

```java
public class LoaderTest {
    public static void main(String[] args) {
        ClassLoader cl = LoaderTest.class.getClassLoader();
        System.out.println("ClassLoader: " + cl);
        System.out.println("Parent: " + cl.getParent());
        System.out.println("Grandparent: " + cl.getParent().getParent());
    }
}

```

输出类似：

```
ClassLoader: sun.misc.Launcher$AppClassLoader@...
Parent: sun.misc.Launcher$ExtClassLoader@...
Grandparent: null
```

而 `AppClassLoader` 就是 `URLClassLoader` 的子类。

| 问题                                         | 回答                                                         |
| -------------------------------------------- | ------------------------------------------------------------ |
| 📌 URLClassLoader 是什么时候用到的？          | JVM 启动时作为 `AppClassLoader` 加载类路径下的所有类；也常用于手动加载 jar、动态插件、SPI 等。 |
| 📌 源码中哪里可以找到 URLClassLoader 的使用？ | 见 `sun.misc.Launcher$AppClassLoader`、`ClassLoader.getSystemClassLoader()`，实际就是 URLClassLoader。 |
| 📌 为什么你没在核心逻辑里直接看到它？         | 因为 JVM 启动时通过 `sun.misc.Launcher` 创建，非标准公开 API，所以隐藏在内部实现。 |
| 📌 它是否默认存在？                           | 是的！你运行 Java 应用时默认就使用了 URLClassLoader。        |



## 问题：试图用自定义类加载器加载JDK的基础类

现在遇到的这个错误：

```
java.lang.NoClassDefFoundError: java/lang/Object
```

意味着你的自定义类加载器 `MyClassLoader` 试图加载 JDK 的基础类 `java.lang.Object`，而 **根本就不该由你这个类加载器去加载**。

一般来说使用双亲委派，只加载你需要的类

你可以进一步限制你的类加载器只处理某些特定包，比如：

```java
if (!name.startsWith("tech.insight")) {
    return super.loadClass(name, resolve); // 用父类加载
}
```

比如：

```
@Override
protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
    synchronized (getClassLoadingLock(name)) {
        Class<?> c = findLoadedClass(name);
        if (c == null) {
            // 打破双亲委派，只加载 tech.insight 包下的类
            if (name.startsWith("tech.insight")) {
                try {
                    c = findClass(name);
                } catch (ClassNotFoundException e) {
                    // 可以选择不处理或 fallback 给父加载器
                    throw e;
                }
            } else {
                // JDK类或第三方库依然委托父加载器
                c = getParent().loadClass(name);
            }
        }

        if (resolve) {
            resolveClass(c);
        }

        return c;
    }
}

```

记住这和-Djava.system.class.loader=tech.insight.MyClassLoader直接配置到虚拟机参数有区别。

## 自定义类加载器和JVM参数设置有区别

这是个非常核心的问题，**自定义类加载器**和 `-Djava.system.class.loader=...` 指定**系统类加载器**，它们之间在 JVM 初始化阶段的行为、权限、影响范围上有本质区别。

------

### ✅ 简单区别表

| 项目       | `new MyClassLoader()`      | `-Djava.system.class.loader=tech.insight.MyClassLoader`      |
| ---------- | -------------------------- | ------------------------------------------------------------ |
| 加载时机   | 程序运行时由你手动实例化   | JVM 启动时初始化，替换整个 SystemClassLoader                 |
| 影响范围   | 只影响你手动使用它加载的类 | 影响所有通过 `ClassLoader.getSystemClassLoader()` 的类加载   |
| 加载优先级 | 不会影响其他类的加载       | 会参与 JVM 自身的类加载流程，优先于默认 AppClassLoader       |
| 安全限制   | 限于应用代码范围           | JVM 要求必须有合法构造函数：`MyClassLoader(ClassLoader parent)` |
| 容错风险   | 安全，不影响 JVM 启动      | 一旦出错（如构造函数不对），JVM 启动直接失败（你就见过了）   |

------

### ✅ `-Djava.system.class.loader=...` 是什么？

JVM 启动时，会加载一个**系统类加载器（SystemClassLoader）**，默认是：

```
sun.misc.Launcher$AppClassLoader
```

你可以通过 JVM 参数手动替换这个加载器，比如：

```bash
java -Djava.system.class.loader=tech.insight.MyClassLoader ...
```

这会让 JVM 在初始化时：

```java
ClassLoader scl = (ClassLoader) Class.forName("tech.insight.MyClassLoader")
    .getDeclaredConstructor(ClassLoader.class)
    .newInstance(parentLoader);
```

这就是你看到的报错的来源：

```
NoSuchMethodException: tech.insight.MyClassLoader.<init>(java.lang.ClassLoader)
```

------

### ✅ 使用该参数时要满足的条件

1. 类必须能被 Bootstrap 或 Extension 类加载器加载（通常要求该类在 `classpath` 中）；
2. 必须定义如下构造函数：

```java
public MyClassLoader(ClassLoader parent) {
    super(parent);
}
```

1. 必须不能抛出异常，出错 JVM 就启动失败；

------

### ✅ 什么时候用 `-Djava.system.class.loader` 更合适？

适用于：

- 想要**拦截/控制所有类加载**行为，比如实现安全隔离、加密 class 文件、动态 patch；
- 想写类似 Java Agent、Sandbox、插件容器等底层框架；
- 想接管 `Class.forName()`、SPI、`Thread.getContextClassLoader()` 行为的场景；

------

### ✅ 相对地，手动 new 更安全灵活

你用：

```java
MyClassLoader cl = new MyClassLoader();
cl.loadClass(...);
```

优点：

- 不影响其他类的加载；
- 容错性强；
- 可控粒度细；

缺点：

- 不会影响 `Class.forName`、反射加载、SPI 等行为；
- 需要手动加载类并调用（像 pluginLoader 的形式）；

------

### ✅ 总结类比

| 类比                             | 意思                                      |
| -------------------------------- | ----------------------------------------- |
| `new MyClassLoader()`            | 就像你写了个工具类，专门干自己事          |
| `-Djava.system.class.loader=...` | 像你**换了整个操作系统的 class 加载机制** |

------

### ✅ 实战建议

- 想研究类加载机制、做插件隔离：先用 `new MyClassLoader()` 安全练手；
- 想 hook 整个应用加载流程或加密保护 class 文件，再考虑 `-Djava.system.class.loader`；
- **绝不要盲目替换系统类加载器**，除非你**100%知道你在干什么**。

------

需要我写一个 `-Djava.system.class.loader` 的完整例子，包含启动脚本、构造器实现、示例类加载行为对比吗？



## 问题：设置JVM参数指定系统类加载器没生效

在 IDEA 中设置 `-Djava.system.class.loader=tech.insight.MyClassLoader` 没生效，可能是由于 **系统类加载器设置有严格的时机要求和类路径限制**。以下是常见原因和解决方法：

------

### ✅ 正确设置的前提

#### 1. **设置位置**

必须在 **JVM 启动参数**中设置，而不是程序运行时动态设置。

##### IDEA 设置方式：

打开 `Run | Edit Configurations`，在 VM options 中加入：

```bash
-Djava.system.class.loader=tech.insight.MyClassLoader
```

------

#### 2. **你的 ClassLoader 必须能被 Bootstrap ClassLoader 加载**

系统类加载器的替代类（你的 `tech.insight.MyClassLoader`）**必须在 bootstrap classpath 或 extension classpath 中**，否则 JVM 根本加载不到。

也就是说：`MyClassLoader` **不能通过 AppClassLoader 加载自己**，否则就陷入死循环。

##### 解决方案：

将 `MyClassLoader` 所在的 jar 放到启动类路径里：

##### 方法一：使用 `-Xbootclasspath/a` （Java 8 及以前）

```bash
-Xbootclasspath/a:/path/to/myclassloader.jar
```

##### 方法二：Java 9+ 使用模块方式启动，必须加 `--patch-module` 或其他方式注入。

------

#### 3. **你的类加载器必须有一个标准的构造函数**

系统会用反射调用如下构造方法：

```java
public MyClassLoader(ClassLoader parent)
```

你必须提供这个构造函数。

------

#### 4. **确保主类不在被你加载的范围内**

如果你自己加载了主类，有可能造成类加载冲突或双重加载（类加载器隔离）。

------

#### 5. **有些 IDE 行为不同于直接命令行**

IDEA 在调试/运行配置中，可能会额外插入自己的类加载逻辑，导致 `-Djava.system.class.loader` 被绕过或干扰。

------

### ✅ 示例

比如你有个自定义类加载器：

```java
package tech.insight;

public class MyClassLoader extends ClassLoader {
    public MyClassLoader(ClassLoader parent) {
        super(parent);
        System.out.println("MyClassLoader initialized");
    }

    @Override
    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        // 加载逻辑 ...
        return super.loadClass(name, resolve);
    }
}
```

你需要：

1. 编译并打包成 JAR；
2. 使用如下 JVM 参数：

```bash
-Djava.system.class.loader=tech.insight.MyClassLoader -Xbootclasspath/a:/path/to/myclassloader.jar
```

------

### ✅ 验证是否生效

你可以在 `MyClassLoader` 构造函数中加一条日志，或者打印当前类加载器：

```java
System.out.println("SystemClassLoader: " + ClassLoader.getSystemClassLoader());
```

如果不是你的类，则说明设置失败。

------

### 🔍 总结排查 checklist：

| 检查项                                                      | 是否正确 |
| ----------------------------------------------------------- | -------- |
| JVM 参数 `-Djava.system.class.loader` 设置在 VM options 中  | ✅        |
| 自定义类加载器打包并通过 `-Xbootclasspath/a` 加入启动类路径 | ✅        |
| `MyClassLoader` 有 `(ClassLoader parent)` 构造函数          | ✅        |
| IDEA 没有修改类路径或类加载器（可以尝试命令行运行验证）     | ✅        |

------



## 什么叫native函数

`native` 函数是 Java 中的一种**本地方法（Native Method）**，指的是：

> 使用 Java 语言声明、但在 **非 Java 语言（通常是 C 或 C++）中实现** 的方法。

------

### 🧠 为什么要用 `native` 方法？

Java 虚拟机（JVM）虽然平台无关，但有些底层操作必须依赖操作系统或本地硬件，比如：

| 功能                                  | 依赖 native 方法 |
| ------------------------------------- | ---------------- |
| 操作系统调用（如文件、网络、线程）    | 是               |
| 系统时间、对象内存布局                | 是               |
| 和 C/C++ 共享内存或调用 DLL           | 是               |
| 调用第三方本地库（如 OpenCV、FFmpeg） | 是               |

------

### ✅ 语法示例

在 Java 中声明一个 native 方法：

```java
public class NativeExample {
    // native 方法声明
    public native void sayHello();

    static {
        // 加载本地库，比如 libnative.so / native.dll
        System.loadLibrary("native");
    }
}
```

然后你需要用 C/C++ 来实现：

```c
#include <jni.h>
#include <stdio.h>
#include "NativeExample.h"

JNIEXPORT void JNICALL Java_NativeExample_sayHello(JNIEnv *env, jobject obj) {
    printf("Hello from native C code!\n");
}
```

------

### 🚀 如何使用 native 方法（流程概览）

1. 在 Java 中声明 `native` 方法；
2. 使用 `javac` 编译 Java 文件；
3. 使用 `javah`（或 `javac -h`）生成 C 头文件；
4. 编写对应的 C/C++ 实现代码；
5. 编译生成共享库（如 `.dll` / `.so` / `.dylib`）；
6. 在 Java 中使用 `System.loadLibrary` 加载；
7. 运行 Java 程序，调用 native 方法。

------

### ⚠️ 注意事项

- `native` 方法本身没有方法体，方法体在 C/C++ 中实现；
- native 方法是 Java 和底层系统之间的桥梁，但 **不安全、不跨平台、难调试**；
- 在 Java 里调用 native 方法时，如果参数或指针处理出错，可能导致 **崩溃（JVM core dump）**。

------

### ✅ 常见的 native 方法例子

Java 标准库中有很多 native 方法，比如：

```java
public final class System {
    public static native long currentTimeMillis(); // 获取系统时间
}
```

------

### 总结一句话：

> `native` 方法 = Java 声明 + C/C++ 实现，用来做 Java 做不了的底层事。

