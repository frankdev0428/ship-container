#!/bin/bash

# A tag name must be valid ASCII and may contain lowercase and uppercase
# letters, digits, underscores, periods and dashes. A tag name may not start
# with a period or a dash and may contain a maximum of 128 characters.

VAR=$1
echo ${VAR//[^a-zA-Z0-9_]/-}
