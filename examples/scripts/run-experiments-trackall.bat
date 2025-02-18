@echo off
for /L %%i in (0,1,1) do (
    mkdir "..\node\output\img\trackobstacles-trackall%%i"
    node "..\node\run-trackobjects-trackall.js" %%i"
)
