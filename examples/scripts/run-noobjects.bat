@echo off
for /L %%i in (18,1,20) do (
    mkdir "..\node\output\img\tracknoobstacles%%i"
    node "..\node\run-tracknoobjects.js" %%i"
)
