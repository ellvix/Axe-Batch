#Write-Host "this is how to write console logs"

Clear-Host

New-Item -Path ".\outputjson\" -Force -ItemType Directory
New-Item -Path ".\source\" -Force -ItemType Directory

$names = @()
$urls = @()
$fileNames = @()
$scores = @()
$jsonPath = ".\outputjson\"
$csvPath = ".\source\listofsites.csv"

# get data from csv
$csv = Import-Csv $csvPath -delimiter ","
ForEach ($row in $csv) {
    $names += $row.Name
    $urls += $row.URL
}
$num = $urls.Length

# for each row in csv, 
# compact the name to a file format friendly thing,
# run the axe command on the url and save the file locally
For ( $i = 0 ; $i -lt $num ; $i++ ) {
    $thisFileName = $names[$i] -replace "[\W_]+",""
    $thisFileName = $jsonPath + $thisFileName + ".json"
    $fileNames += $thisFileName
    axe $urls[$i] --load-delay=2000 --tags wcag2a --save $thisFileName
}


# for each file, 
# parse the JSON,
# and do an a11y score (simple passed vs violations atm)
For ( $i = 0 ; $i -lt $num ; $i++ ) {
    $content = Get-Content $fileNames[$i] -Raw
    $json = ConvertFrom-Json -inputObject $content
    $passes = $json.passes.Length
    $violations = $json.violations.Length

    $scores += [math]::Round(($passes / ($violations + $passes)) * 100)
}

# save all the scores to the csv 
$newCol = Get-Date -Format g
$i = 0
$out = @()
ForEach ($row in $csv) {
    #todo: maybe put in a check here if $url[$i] == $row.Url
    $item = New-Object PSObject -ArgumentList $row
    $item | Add-Member -MemberType NoteProperty $newCol -Value $scores[$i]
    $out += $item
    $i++
}

$out | Export-Csv -Force -NoTypeInformation $csvPath

Write-Host "Exported csv for $num sites"

