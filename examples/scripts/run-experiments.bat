@echo off
for /L %%i in (0,1,20) do (
    mkdir "..\node\output\img\trackobstacles%%i"
    node "..\node\run-trackobjects.js" %%i"
)
