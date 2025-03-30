--@name Include
--@author Vurv

-- This part is only necessary because we pass a variable instead.
--@include included.txt

local filesWantToInclude = { "included.txt" }

for _, file in ipairs(filesWantToInclude) do
    local ret = require(file)
    print(ret)
end

-- You can also do this via requiredir and includedir instead.

-- You can also import specific files over http, giving them a name to pass to require..
--@include https://raw.githubusercontent.com/neostarfall/neostarfall/master/lua/starfall/examples/included.lua as anotherinclude.txt

local ret = require("anotherinclude.txt")