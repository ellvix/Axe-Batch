
# This is a trigger to run the batch job via python instead of powershell. Will switch over to this at some point. Python implementation will be useful for linux and other online platforms as python is easier to get running than powershell :) 

Clear-Host

Start-Transcript -Path "C:\scripts\logs.txt"

# Note: must have python set up in PATH
python "C:\Users\smm48\Documents\Projects\Axe-Batch\aXe_batch.py"

