@echo off
for /L %%i in (4,1,20) do (
    mkdir "..\node\output\img\trackobstacles15by15%%i"
    node "..\node\run-trackobjects15x15.js" %%i"
)