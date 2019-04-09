# This is the script to run the aXe accessibility checker on a set of urls in the listed csv file
# Created by Sean McCurry Oct 2018
# Created with Python v3.3

import csv
import re
import subprocess
import shlex
import os
import shutil
import json
import pandas as pd
import datetime

print("Starting script")

filePaths = []
scoreData = {}
fileData = []
runAxe = True

slashyslash = "/" # not sure if this makes a difference, but let's separate it out in case we need to swap when we move to linux
jsonFolder = "outputjson" + slashyslash
csvFilePath = "source" + slashyslash + "listofsites.csv"

# change working directory to this file's directory
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

# do a pre wipe on folder
if runAxe:
    for the_file in os.listdir(jsonFolder):
        file_path = os.path.join(jsonFolder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            #elif os.path.isdir(file_path): shutil.rmtree(file_path) # also delete subfolders
        except Exception as e:
            print(e)

#for each row in csv, run aXe, create json
if runAxe:
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
                print("Saved " + noSpaceName)
            else: 
                print("File " + noSpaceName + " failed to save")

# Read in all files currently in jsonFolder to array (rather than relying on them being created)
filePaths = os.listdir(jsonFolder)

# for each file, parse the json
print("Compiling score data")
for thisFilePath in filePaths:
    with open(jsonFolder + thisFilePath, "r", encoding="utf-8") as thisFile:
        data = json.load(thisFile)

        passes = len(data[0]["passes"])
        violations = len(data[0]["violations"])
        thisScore = round((passes / (violations + passes))  * 100)

        scoreData[thisFilePath] = thisScore

#write to file
print("Writing results to csv")

# reparse the scores to match the csv data directly
df = pd.read_csv(csvFilePath)
scoreCol = []
for index, row in df.iterrows():
    if type(row["Name"]) == str:
        noSpaceName = re.sub("[\W_]+", "", row['Name']) + ".json"

        print ("this noSpaceName: " + noSpaceName)

        if noSpaceName in scoreData:
            scoreCol.append(scoreData[noSpaceName])
        else:
            scoreCol.append(0)
            print(noSpaceName + " not found in scoreData")
    else:
        scoreCol.append(0)
        print("not a string (empty)")

rightNow = datetime.datetime.now().strftime("%m/%d/%Y %H:%M")
df[rightNow] = scoreCol
df.to_csv(csvFilePath, mode='w', index=False)

print("Script complete, new data in column in  " + csvFilePath)

