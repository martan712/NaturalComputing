@echo off
for /L %%i in (0,1,1) do (
    mkdir "..\node\output\img\tracknoobstacles-track100%%i"
    node "..\node\run-tracknoobjects-track100.js" %%i"
)
