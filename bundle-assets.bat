@echo off

cls

set ASSETS_FOLDER_NAME=\assets
set INDEX_FILENAME=index.html
set TARGET_BASE_DIR=.\.build
set TARGET_ASSETS_DIR=%TARGET_BASE_DIR%%ASSETS_FOLDER_NAME%
set SOURCE_BASE_DIR=.
set SOURCE_ASSETS_DIR=%SOURCE_BASE_DIR%%ASSETS_FOLDER_NAME%

if exist %TARGET_ASSETS_DIR% (
  echo removing target assets directory "%TARGET_ASSETS_DIR%"...
  rd /s /q "%TARGET_ASSETS_DIR%"
)

echo copying assets folder %SOURCE_ASSETS_DIR% to %TARGET_ASSETS_DIR%...
xcopy /e /i /y /exclude:bundleExcludedFilesList.txt "%SOURCE_ASSETS_DIR%" "%TARGET_ASSETS_DIR%"
if %ERRORLEVEL% neq 0 goto ErrorHappened

echo copying index file "%INDEX_FILENAME%"...
copy /y "%SOURCE_BASE_DIR%\%INDEX_FILENAME%" "%TARGET_BASE_DIR%\%INDEX_FILENAME%"
if %ERRORLEVEL% neq 0 goto ErrorHappened

echo Boom. Done.
pause
goto:eof

:ErrorHappened
echo An error occurred...
pause