# 使用 Sa-Token 的全局过滤器解决跨域问题（三种方式全版）

在 web 开发中，跨域绝对是比较折磨新同学的一个问题，本文将讲解三种常见的跨域情形，并讲解如何使用 Sa-Token 框架解决跨域问题。

### 什么情况下会发生跨域

简单理解，就是你在 A 域名下的页面，去调用 B 域名的接口，浏览器感觉你这次调用可能是不安全的请求行为，于是它需要用 cors 安全策略来确认一下这个请求是由用户真实的意愿发出的，而不是被 csrf 伪造请求攻击偷偷发送的。（这么说只是为了方便大家理解，不是特别严谨，实际上同域名下部分情形也会出现跨域问题）

请仔细理解上面这段话，因为它说明了两点：

- 跨域不是后端接口对前端浏览器的限制，而是前端浏览器对用户的限制。
- 跨域不是在保护后端接口免受攻击，而是浏览器在保护用户，避免用户发送自己不想发送的请求。

请一定要记住上面跨域的本质，明白了症状和原因，我们才能对症下药。



https://blog.csdn.net/qq_34905631/article/details/140277487