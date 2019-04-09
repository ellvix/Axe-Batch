
# This script will run on all json files in ./outputjson and compile a list of violations, sorted by count

import os
import json
import operator

print("starting issues script")

jsonFolder = "outputjson/"
targetNodeTypes = ["all", "any", "none"]
resultsGrand = dict()
results1PerSite = dict()
dupIds = ["duplicate-id-active", "aria-valid-attr-value", "duplicate-id-aria"] # ids that give us nonunique messages, and hence duplicates in our results. We'll deal with them below

# Read in all files currently in jsonFolder, for each file, parse the json
print("Compiling issue data")
filePaths = os.listdir(jsonFolder)
for thisFilePath in filePaths:
    resultsThisSite = dict()
    with open(jsonFolder + thisFilePath, "r", encoding="utf-8") as thisFile:
        data = json.load(thisFile)
        violations = data[0]["violations"]

        #data[0]["violations"][each]["nodes"][each][all or any or none]["message"]

        for violation in violations:
            for node in violation["nodes"]:
                for targetNodeType in targetNodeTypes:
                    if len(node[targetNodeType]) > 0:
                        message = node[targetNodeType][0]["message"]
                        # if this is a dup ID, remove its data attribute (making it match the others of this id)
                        for dupId in dupIds:
                            if node[targetNodeType][0]["id"] in dupId:
                                dataStr = node[targetNodeType][0]["data"]
                                if isinstance(dataStr, list):
                                    dataStr = dataStr[0]
                                dataStr = str(dataStr)
                                message = message.replace(dataStr, "")

                        # here we can insert some code to identify dups and correct this code
                        #if "multiple elements referenced with ARIA with the same id" in message:
                            #print("got a possible dup")
                            #print(thisFilePath)
                            #print(node[targetNodeType][0]["id"])

                        # add this issue message to our list for this site, and count em up
                        if len(message) > 0:
                            if message in resultsThisSite:
                                resultsThisSite[message] = resultsThisSite[message] + 1
                            else:
                                resultsThisSite[message] = 1

    # add the issues for this site to the totals, 1 per site and grand total
    for key, val in resultsThisSite.items():
        if key in results1PerSite:
            results1PerSite[key] = results1PerSite[key] + 1
        else:
            results1PerSite[key] = 1
        if key in resultsGrand:
            resultsGrand[key] = resultsGrand[key] + resultsThisSite[key]
        else:
            resultsGrand[key] = resultsThisSite[key]






sortedGrand = sorted(resultsGrand.items(), key=operator.itemgetter(1), reverse=True)
sortedPer = sorted(results1PerSite.items(), key=operator.itemgetter(1), reverse=True)

print("\n\n\nRESULTS\n\n")
print("Total across all sites")
for thing in sortedGrand:
    print(str(thing[1]) + ": " + str(thing[0]))
print("\n1 issue from each site")
for thing in sortedPer:
    print(str(thing[1]) + ": " + str(thing[0]))




