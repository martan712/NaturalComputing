@echo off
for /L %%i in (0,1,1) do (
    mkdir "..\node\output\img\trackobstacles15by15-track100%%i"
    node "..\node\run-trackobjects15x15-track100.js" %%i"
)
