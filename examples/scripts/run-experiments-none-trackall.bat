@echo off
for /L %%i in (0,1,1) do (
    mkdir "..\node\output\img\tracknoobstacles-trackall%%i"
    node "..\node\run-tracknoobjects-trackall.js" %%i"
)
