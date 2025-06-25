---

title:如何使用 VSCode 中的 Code Runner 插件执行 golang 代码

---



project 的文档结如下

mylab
   |—- main.go
   |—- test.go

main.go

```go
package main

func main() {
	test()
}
```

test.go

```go
package main

func test() {
	println("in test")
}
```

在[Code Runner 插件的 Doc 地址](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)中
找到如下 Configuration 的配置说明

> Configuration
> Make sure the executor PATH of each language is set in the environment variable. You could also add entry into code-runner.executorMap to set the executor PATH. e.g. To set the executor PATH for ruby, php and html:

```json
{
  "code-runner.executorMap": {
    "javascript": "node",
    "php": "C:\\php\\php.exe",
    "python": "python",
    "perl": "perl",
    "ruby": "C:\\Ruby23-x64\\bin\\ruby.exe",
    "go": "go run",
    "html": "\"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe\"",
    "java": "cd $dir && javac $fileName && java $fileNameWithoutExt",
    "c": "cd $dir && gcc $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt"
  }
}
```

> Supported customized parameters
>
> - $workspaceRoot: The path of the folder opened in VS Code
> - $dir: The directory of the code file being run
> - $dirWithoutTrailingSlash: The directory of the code file being run without a trailing slash
> - $fullFileName: The full name of the code file being run
> - $fileName: The base name of the code file being run, that is the file without the directory
> - $fileNameWithoutExt: The base name of the code file being run without its extension
> - $driveLetter: The drive letter of the code file being run (Windows only)
> - $pythonPath: The path of Python interpreter (set by Python: Select Interpreter command)

> Please take care of the back slash and the space in file path of the executor
>
> Back slash: please use \
> If there ares spaces in file path, please use " to surround your file path

> You could set the executor per filename glob:

```json
{
  "code-runner.executorMapByGlob": {
    "pom.xml": "cd $dir && mvn clean package",
    "*.test.js": "tap",
    "*.js": "node"
  }
}
```

可以看到 go 的执行命令默认配置成了 go run, 并且默认执行当前打开的文件。 所以需要利用$dir 这个变量 run 整个 main 包所涉及到的所有文件。并且可以正则匹配文件名。

查看一下 go run 这个命令的参数解释，由于众所周知的原因，我们只能上国内的[替代官网](https://golang.google.cn/cmd/go/#hdr-Compile_and_run_Go_program)。

> Compile and run Go program Usage:
>
> go run [build flags][-exec xprog] package [arguments…] Run compiles and runs the named main Go package. Typically the package is specified as a list of .go source files, but it may also be an import path, file system path, or pattern matching a single known package, as in **‘go run .'** or ‘go run my/cmd’.
>
> By default, ‘go run’ runs the compiled binary directly: ‘a.out arguments…'. If the -exec flag is given, ‘go run’ invokes the binary using xprog:
>
> ‘xprog a.out arguments…'. If the -exec flag is not given, GOOS or GOARCH is different from the system default, and a program named go*$GOOS*$GOARCH_exec can be found on the current search path, ‘go run’ invokes the binary using that program, for example ‘go_nacl_386_exec a.out arguments…'. This allows execution of cross-compiled programs when a simulator or other execution method is available.
>
> The exit status of Run is not the exit status of the compiled binary.
>
> For more about build flags, see ‘go help build’. For more about specifying packages, see ‘go help packages’.

找到了，使用`go run .` 来跑整个 package 的。

在 VSCode 的.vscode 目录下创建 settings.json 文件

自定义这个 project 的用户配置如下

```json
{
  "code-runner.executorMap": {
    "go": "cd $dir && go run ."
  },
  "code-runner.executorMapByGlob": {
    "$dir\\*.go": "go"
  }
}
```

点击 Cdoe Runner 在 VSCode GUI 界面提供的 RUN 按钮

```
[Running] cd "d:\Users\polar\go\src\mylab\" && go run .
in test

[Done] exited with code=0 in 3.564 seconds
```

OK!

当然也可以用 VSCode Debug 的 launch.json 来配置，但是那是 debug 模式，并不是 go run。