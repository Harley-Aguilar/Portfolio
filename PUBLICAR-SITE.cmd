@echo off
setlocal
title Publicar portfolio no GitHub
set "PORTFOLIO_GIT=C:\Users\Pichau\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
set "PORTFOLIO_AUTH=C:\Users\Pichau\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\mingw64\bin\git-credential-manager.exe"
set "PORTFOLIO_REPO=C:\Users\Pichau\Documents\Codex\2026-10-01\c\work\github-d"
if not exist "%PORTFOLIO_GIT%" goto missing
if not exist "%PORTFOLIO_AUTH%" goto missing
if not exist "%PORTFOLIO_REPO%\.git" goto missing
echo.
echo CORRIGIR E PUBLICAR O PORTFOLIO
echo Repositorio: https://github.com/Harley-Aguilar/d
echo.
echo A correcao das pastas ja esta preparada e conferida.
echo Entre na conta Harley-Aguilar na janela do GitHub que abrir.
echo Suas imagens serao preservadas, sem reenviar arquivos manualmente.
echo.
"%PORTFOLIO_AUTH%" github login --browser --username Harley-Aguilar
if errorlevel 1 goto authfailed
"%PORTFOLIO_GIT%" -C "%PORTFOLIO_REPO%" -c http.sslBackend=openssl push origin main
if errorlevel 1 goto pushfailed
echo.
echo ENVIO CONCLUIDO.
echo O GitHub Pages vai publicar a atualizacao automaticamente.
echo Site: https://harley-aguilar.github.io/d/
echo Aguarde alguns minutos e atualize a pagina com Ctrl+F5.
echo.
pause
exit /b 0
:authfailed
echo.
echo O login nao foi concluido. Nenhuma publicacao foi realizada.
echo Entre na conta Harley-Aguilar e execute este arquivo novamente.
echo Se continuar falhando, copie a mensagem acima para o chat.
pause
exit /b 1
:pushfailed
echo.
echo O GitHub nao confirmou o envio. Nenhuma alteracao foi forcada.
echo Copie a mensagem acima para o chat para eu resolver.
pause
exit /b 1
:missing
echo.
echo Um arquivo local necessario foi movido ou removido.
echo Volte ao chat para eu ajustar o publicador.
pause
exit /b 1
