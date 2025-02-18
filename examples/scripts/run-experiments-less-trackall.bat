@echo off
for /L %%i in (0,1,1) do (
    mkdir "..\node\output\img\trackobstacles5by5-trackall%%i"
    node "..\node\run-trackobjects5x5-trackkall.js" %%i"
)
