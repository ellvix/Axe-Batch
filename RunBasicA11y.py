# This is the script to run the aXe accessibility checker on a set of urls in the listed csv file
# Created by Sean McCurry Oct 2018
# Created with Python v3.3

import csv
import re
import subprocess
import shlex
import os
import json
import pandas as pd
import datetime

print("Starting script")

filePaths = []
scores = []
fileData = []

slashyslash = "/" # not sure if this makes a difference, but let's separate it out in case we need to swap when we move to linux
jsonFolder = "outputjson" + slashyslash
csvFilePath = "source" + slashyslash + "listofsites.csv"

#thisFilePath = jsonFolder + "testing.json"
#thisCommand = "axe " + shlex.quote("http://www.psu.edu") + " --load-delay=2000" + " --tags wcag2a" + " --save " + thisFilePath
#thisSub = subprocess.run(thisCommand, shell=True) 

#for each row in csv, run aXe, create json
with open(csvFilePath, "r") as csvFile:
    reader = csv.DictReader(csvFile, delimiter=',')
    print("Running aXe on URL set from csv")
    for row in reader:
        noSpaceName = re.sub("[\W_]+", "", row['Name'])
        thisFilePath = jsonFolder + noSpaceName + ".json"

        # critical part: run aXe. 
        thisCommand = "axe " + shlex.quote(row["URL"]) + " --load-delay=2000" + " --tags wcag2a" + " --save " + thisFilePath
        thisSub = subprocess.run(thisCommand, shell=True) 
        if thisSub.returncode == 0:
            filePaths.append(thisFilePath)
            print("Saved " + noSpaceName)
        else: 
            print("File " + noSpaceName + " failed to save")

#temp, replaces above for (in testing)
#filePaths = [jsonFolder + "PennStateAPublicResearchUniversityServingPennsylvaniaandtheGlobalCommunity.json", jsonFolder + "PennStateOnlineHowOnlineLearningWorks.json", jsonFolder + "PennStateOnlineStudentServices.json", jsonFolder + "PennStateTuitionandFinancialAid.json"]

# for each file, parse the json
print("Compiling score data")
for thisFilePath in filePaths:
    with open(thisFilePath, "r") as thisFile:
        data = json.load(thisFile)

        passes = len(data[0]["passes"])
        violations = len(data[0]["violations"])

        scores.append(round((passes / (violations + passes))  * 100))

#write to file
print("Writing results to csv")
df = pd.read_csv(csvFilePath)
rightNow = datetime.datetime.now().strftime("%m/%d/%Y %H:%M")
df[rightNow] = scores
df.to_csv(csvFilePath)

print("Script complete, new data in column in  " + csvFilePath)

