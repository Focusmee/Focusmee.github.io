Flask 是一个轻量级的 Python Web 框架，它被广泛用于构建 Web 应用程序和 API。Flask 简单易用，具有灵活性和可扩展性，是许多开发者喜欢用其构建项目的原因。本文将介绍 Flask 是什么以及如何使用它来构建 Web 应用程序，同时提供一个实践案例，让你能够在 IDE 编辑器中运行代码。


Flask 官网地址：https://flask.palletsprojects.com/en/2.3.x/quickstart/

![Flask 是什么？怎么使用](http://apifox.com/apiskills/content/images/2023/07/image-887.png)Flask 官网

## Flask 的基本使用

首先，确保你已经安装了 Flask。你可以通过以下命令使用 pip 安装 Flask：

```python
pip install flask
```


接下来，我们将创建一个简单的 Flask 应用程序并运行它。请在你的 IDE 编辑器中创建一个名为 `app.py` 的文件，并将以下代码粘贴到其中：

```python
from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello():
    return 'Hello, Flask!'


if __name__ == '__main__':
    app.run()
```

在上面的代码中，我们导入了 Flask 类并创建了一个应用程序实例。然后，我们定义了一个根路由 `/`，并在该路由上定义了一个简单的处理函数 `hello()`。该处理函数返回一个字符串 "Hello, Flask!"。


最后，我们使用 `app.run()` 方法运行应用程序。这将在本地主机上的默认端口（通常是 5000）上启动应用程序。你可以在浏览器中访问 `http://localhost:5000/`，你将看到 "Hello, Flask!" 的输出。

![Flask 是什么？怎么使用？](http://apifox.com/apiskills/content/images/2023/07/image-892.png)

## 进阶案例

现在，我们将展示一个稍微复杂一点的实践案例，其中涉及到一个动态路由和模板渲染。在你的 `app.py` 文件中添加以下代码：

```python
from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello():
    return 'Hello, Flask!'


@app.route('/user/<username>')
def show_user(username):
    return render_template('user.html', name=username)


if __name__ == '__main__':
    app.run()
```

在上面的代码中，我们定义了一个新的路由 `/user/<username>`，其中 `<username>` 是一个动态参数。在处理函数 `show_user()` 中，我们使用 `render_template()` 方法来渲染一个名为 `user.html` 的模板，并将参数 `name` 设置为动态参数 `username`。


为了使这个案例能够运行，我们需要创建一个名为 `user.html` 的模板文件。在你的项目目录中创建一个名为 `templates` 的文件夹，并在其中创建 `user.html` 文件。将以下代码粘贴到 `user.html` 文件中：

```python
<!DOCTYPE html>
<html>
<head>
    <title>User Profile</title>
</head>
<body>
    <h1>Welcome, {{ name }}!</h1>
</body>
</html>
```


现在，运行 `app.py`，并访问 `http://localhost:5000/user/liziqi`，你将看到 "Welcome, liziqi!" 的输出。

![Flask 是什么？怎么使用？](http://apifox.com/apiskills/content/images/2023/07/image-894.png)

## 使用 Apifox 调试 Flask 接口

如果你是 Flask 开发者，你经常需要与 API 打交道，确保你的应用程序能够正常工作。这时，一个强大的接口测试工具就会派上用场。



[Apifox](https://apifox.com/) 是一个集 API 文档、API 调试、API Mock和API 自动化测试于一体的 API 协作平台，支持 http(s)、gRPC、WebSocket 等协议，我们可以通过 [Apifox ](https://apifox.com/)来更方便的调试 Flask 接口。


如果想快速的调试一条接口，新建一个项目后，在项目中选择**“调试模式”**，填写请求地址后即可快速发送请求，并获得响应结果，上文的实践案例如图所示：

[立即体验 Apifox](https://app.apifox.com/)

![Flask 是什么？怎么使用？](http://apifox.com/apiskills/content/images/2023/07/image-895.png)Apifox 调试

## 总结

本文介绍了 Flask 是什么以及如何使用它来构建 Web 应用程序。Flask 是一个轻量级的 Python Web 框架，提供了简单易用的 API，并具有灵活性和可扩展性。


Flask 提供了更多功能和扩展，可以帮助你构建出强大的 Web 应用程序，开始使用 Flask，构建出出色的 Web 应用程序吧！