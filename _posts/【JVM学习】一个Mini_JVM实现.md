## **类加载系统（ClassLoader）**：

让我们看看BootstrapClassLoader的实现：

Read file: src/main/java/club/shengsheng/jvm/BootstrapClassLoader.java
类加载器的工作原理：
1. 接收类路径列表（classpath）
2. 根据全限定类名（如：java.lang.String）在类路径中查找.class文件
3. 读取类文件的字节码
4. 解析字节码生成ClassFile对象

## **栈帧（StackFrame）**：

让我们看看栈帧的实现：

Read file: src/main/java/club/shengsheng/jvm/StackFrame.java
栈帧的关键组成：
1. 局部变量表（localVariable）：存储方法的参数和局部变量
2. 操作数栈（operandStack）：用于存储指令操作的临时数据
3. 字节码指令列表（codes）：方法的执行指令
4. 常量池引用（constantPool）：用于访问类的常量信息

## **JVM栈（JvmStack）**：

Read file: src/main/java/club/shengsheng/jvm/JvmStack.java
JVM栈的特点：
1. 使用双端队列存储栈帧
2. 支持基本的栈操作：压栈（push）、出栈（pop）、查看栈顶（peek）
3. 每个线程都有自己的JVM栈

## **用一个生动的例子来全面理解JVM**：

想象JVM就像一个工厂，这个工厂是这样运作的：

1. **类加载就像原料入库**：
   - 工厂（JVM）需要先把生产图纸（.class文件）从仓库（硬盘）运到车间（内存）
   - 类加载器就像叉车，负责这个搬运和整理的工作
   - 图纸被整理好后放在固定的架子上（方法区）

2. **栈帧就像工作台**：
   - 每个工人（线程）都有自己的工作台（JVM栈）
   - 工作台上有工具盒（局部变量表）和临时放置工件的托盘（操作数栈）
   - 还有一份生产指令（字节码）和参考手册（常量池）

3. **执行过程就像流水线**：
   - 工人（线程）按照指令一步步操作
   - 需要零件时从工具盒（局部变量表）拿
   - 加工过程中用托盘（操作数栈）暂存
   - 完成一个产品（方法调用）就清理工作台（栈帧出栈）
   - 开始下一个产品的制作（新的方法调用）

所以，JVM的核心就是：一个能够加载Java字节码（类加载），为每个任务分配工作空间（栈帧），并按照特定规则（字节码）执行程序的软件系统。它让Java代码能够在不同的硬件平台上运行，就像一个标准化的工厂，能在世界各地用相同的图纸生产出相同的产品。