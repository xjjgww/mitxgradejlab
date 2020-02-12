#!/bin/bash

python3 usertoname.py

sed -i '1s/^/var usertoname = /g' namelist.js
echo ";" >> namelist.js
