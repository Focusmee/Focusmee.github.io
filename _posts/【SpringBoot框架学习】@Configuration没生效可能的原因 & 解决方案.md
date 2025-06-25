title: SpringBoot中@Configuration没有生效

- `@Configuration` 没有生效，可能的原因如下：

  ### **🔍 可能的原因 & 解决方案**

  ------

  ### **1️⃣ `@Configuration` 所在的包不在 Spring Boot 扫描范围内**

  **问题**：
   Spring Boot 只会自动扫描**启动类**所在包及其**子包**，如果你的 `@Configuration` 类在其他包中，就不会被加载。

  **解决方案**：

  - **方法 1：** 把 `@Configuration` 类放在 `@SpringBootApplication` 类的**同级或子包**内。

  - 方法 2：

     在 

    ```
    @SpringBootApplication
    ```

     上添加 

    ```
    @ComponentScan
    ```

     指定包路径：

    ```java
    @SpringBootApplication
    @ComponentScan(basePackages = {"com.example.config"}) // 指定你的 @Configuration 类所在包
    public class Application {
        public static void main(String[] args) {
            SpringApplication.run(Application.class, args);
        }
    }
    ```

  ------

  ### **2️⃣ `@Configuration` 类没有被 Spring 管理**

  **问题**：
   `@Configuration` 需要被 Spring 容器管理，否则不会生效。

  **解决方案**：

  - 确保 **没有** 用 `new` 手动创建 `@Configuration` 类对象。
  - 确保 `@ComponentScan` 的扫描路径**包含** `@Configuration` 类的包。

  **错误示例 ❌：**

  ```java
  public static void main(String[] args) {
      ThreadPoolConfig config = new ThreadPoolConfig(); // ❌ 这样不会交给 Spring 管理
      ExecutorService executorService = config.taskExecutor();
  }
  ```

  **正确示例 ✅：**

  ```java
  @SpringBootApplication
  public class Application {
      public static void main(String[] args) {
          SpringApplication.run(Application.class, args);
      }
  }
  ```

  ------

  ### **3️⃣ 你使用的是 `@Bean` 但 `@Configuration` 没有生效**

  如果 `@Configuration` 失效，`@Bean` 方法不会被调用。

  **测试是否生效的方法**：

  ```java
  @Component
  public class TestService {
      @Autowired
      private ExecutorService executorService;
  
      public void test() {
          System.out.println(executorService); // 如果是 null，说明 @Configuration 没生效
      }
  }
  ```

  如果 `executorService` 为 `null`，请检查是否符合 **第 1 条 和 第 2 条** 规则。

  ------

  ### **4️⃣ 可能是 `@EnableXXX` 相关的 Spring 组件未开启**

  如果你的 `@Configuration` 里使用了 `@EnableXXX`（比如 `@EnableTransactionManagement`、`@EnableScheduling` 等），可能需要手动开启：

  ```java
  @SpringBootApplication
  @EnableTransactionManagement // 开启事务管理
  @EnableScheduling // 开启定时任务
  public class Application { ... }
  ```

  ------

  ### **5️⃣ `@Configuration` 可能被 Spring Boot 禁用了**

  如果 `spring.main.allow-bean-definition-overriding` 设为 `false`，可能会影响 `@Configuration` 的生效。
   **解决方案**：在 `application.yml` 中添加：

  ```yaml
  spring:
    main:
      allow-bean-definition-overriding: true
  ```

  ------

  ### **🚀 结论**

  如果 `@Configuration` 没生效，先按顺序检查： ✅ **包扫描范围** (`@ComponentScan`)
   ✅ **不要用 `new` 手动创建**
   ✅ **检查 `@Bean` 方法是否返回 null**
   ✅ **是否需要 `@EnableXXX`**
   ✅ **检查 `application.yml` 配置**