--@name Basic Include
--@author Vurv

-- You don't need to provide an include directive, if the include is a literal string.
local MyLibrary = require("included.txt")
print( MyLibrary.add(2, 3) )