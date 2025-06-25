@echo off
chcp 65001 >nul

echo 🚀 开始部署博客...

REM 1. 清理并生成博客
echo 📝 生成博客文件...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 博客生成失败
    pause
    exit /b 1
)

REM 2. 添加所有更改到 Git
echo 📦 添加文件到 Git...
git add .

REM 3. 检查是否有更改
git diff --staged --quiet
if %errorlevel% equ 0 (
    echo ℹ️  没有新的更改需要提交
    pause
    exit /b 0
)

REM 4. 提交更改
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
set COMMIT_MSG=博客更新: %mydate% %mytime%
echo 💾 提交更改: %COMMIT_MSG%
git commit -m "%COMMIT_MSG%"

REM 5. 推送到远程仓库
echo 📤 推送到 GitHub...
git push origin master

if %errorlevel% equ 0 (
    echo ✅ 部署成功！
    echo 🌐 博客已更新到: https://focusmee.github.io
) else (
    echo ❌ 推送失败，请检查网络连接和权限
    pause
    exit /b 1
)

pause 