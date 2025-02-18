@echo off
for /L %%i in (6,1,20) do (
    mkdir "..\node\output\img\trackobstacles5by5%%i"
    node "..\node\run-trackobjects5x5.js" %%i"
)
