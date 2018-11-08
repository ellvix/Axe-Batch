# aXe-Batch

## Batch run Axe 

This is a script that uses Axe-Cli to run an accessibility compatibility test on a number of URLs in a csv. The URLs are scored, and the scores are appended to the csv file. 

Score is based on tests passed vs total tests (passed / (passed + violations), as a percentage. 

Useful for getting a quick rating of a site. VERY useful if run regularly to track a sites accessibility compliance over time. Extra triggers can also be added to the script to, say, send an email if sites drop below a certain score.

## Setup

Install Axe-Cli (requries Node 6+)
https://github.com/dequelabs/axe-cli

Clone / download aXe Batch
Set up directories: There should be a blank 'source' folder and 'outputjson' folder. The scripts should generate these on first time run, but to avoid permission issues it's recommended to just create them manually. 
Create a csv file called "listofsites.csv" and put it in the /source folder.
Modify main csv file: listofsites.csv should have 2 columns at the start: Name and Url, capitalized just like that. Put your sites as rows, with a name and url.

## Powershell build

Install Powershell (already installed for Windows 7+)
If you haven't run powershell before, you'll need to set the execution policy to actually be able to run stuff. 
Run Powershell as admin, and run: Set-ExecutionPolicy RemoteSigned
http://powershelltutorial.net/Home/powershell-execution-policy


## Python build
Install Python. This has been tested with python 3.3, but various 3.x versions may be fine. 

## Run it!

That's it! Run the main python or powershell file! Takes about 5 sec per URL, though that depends on the size of the site obviously. Compliance will be checked by aXe for each site in the csv, given as a percentage score as a new column with a timestamp.

