@echo off
for /L %%i in (0,1,20) do (
    mkdir "..\node\output\img\tracksingleobstacle15by15%%i"
    node "..\node\run-trackobject15x15.js" %%i"
)