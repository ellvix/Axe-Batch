# Axe-Batch
##Batch run Axe through Powershell

This is a script that uses Axe-Cli to run an accessibility compatibility test on a number of URLs in a csv. The URLs are scored, and the scores are appended to the csv file. 

Score is based on tests passed vs total tests (passed / (passed + violations), as a percentage. 

Useful for getting a quick rating of a site. VERY useful if run regularly to track a sites accessibility compliance over time. Extra triggers can also be added to the script to, say, send an email if sites drop below a certain score.

Setup: 

(For windows)
Install Axe-Cli (requries Node 6+)
https://github.com/dequelabs/axe-cli

Install Powershell (already installed for Windows 7+)

Clone / download this project
Create a csv file called "listofsites.csv" and put it in the /source folder.
listofsites.csv should have 2 columns at the start: Name and Url, capitalized just like that. Put your sites as rows, with a name and url. 

That's it! Run the main ps1 file in powershell. Takes about 5 sec per URL, though that depends on the size of the site obviously. Results will be returned to the listofsites.csv file as new columns with a timestamp.

