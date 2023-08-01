const emailScript = {
SendComplianceEmailsAUTO:`<#
---------------------------------------------------
IMPORTANT
---------------------------------------------------
- You MUST run the script as NON-Admin (do not open PowerShell as Admin). This is a 
  limitation of Microsoft Outlook.

-------------------------------------------------
DESCRIPTION
-------------------------------------------------
- This script is used for full automation of email sending.
- First it runs an Excel Macro (Run-ExcelComplianceMacros.ps1) to update the CSV file.
- Using the updated CSV files, it then runs the powershell script (Send-ComplianceEmails.ps1) for each email category.
- Logs are saved to the .\\LOGs folder. Check the logs if there are any issues. They will display a notification message if an email template is missing.
- NOTE: To prevent a user from receiving an email, add their machine name to .\\CSVs\\EXCLUDED.CSV. For example, if user is working with IT but their machine continues to show up on the report.
#>

# get the current directory
$CurrentDirectory = Resolve-Path ".\\" | Select -ExpandProperty Path

# create string of UNC path to log file
$FileNameTimeStamp = ('{0:MM-dd-yyyy}' <#month-day-year#> -f (Get-Date)).ToString()
$LogFileName = "LOG_Send-ComplianceEmailsAUTO_$FileNameTimeStamp.log"

# if log file doesn't exist, create a new one
# if log file already exists, new lines will be appended to bottom of the file
If ($LogFile -eq $null){
    $LogFile = New-Item -ItemType "file" -Path "$CurrentDirectory\\LOGS\\$LogFileName"
}

# start creating logs
Start-Transcript -path $LogFile -append

    Write-Host ""
    Write-Host "----------------------------------------------------------------------------"
    Write-Host "[STARTING CSV UPDATES] -"('[{0:MM/dd/yyyy hh:mm:ss tt}]' -f (Get-Date))
    Write-Host "----------------------------------------------------------------------------"
    # update CSV files through excel macro
    .\\Run-ExcelComplianceMacros.ps1
    
    # send emails for each cateogry by running "Send-ComplianceEmails.ps1" file with appropriate parameters.
    Write-Host ""
    Write-Host "----------------------------------------------------------------------------"
    Write-Host "[STARTING SCCM INACTIVE EMAILS] -"('[{0:MM/dd/yyyy hh:mm:ss tt}]' -f (Get-Date))
    .\\Send-ComplianceEmails.ps1 -CSVFile .\\CSVs\\SCCMinactive.csv -EmailChoice "1" -Confirm "Y" -SkipMissingTemplateConfirm "Y" -TemplateNameString "* SCCM * INACTIVE *"
    Write-Host ""
    Write-Host "----------------------------------------------------------------------------"
    Write-Host "[STARTING SCCM NON-COMPLIANCE EMAILS] -"('[{0:MM/dd/yyyy hh:mm:ss tt}]' -f (Get-Date))
    .\\Send-ComplianceEmails.ps1 -CSVFile .\\CSVs\\SCCMblank.csv -EmailChoice "2" -Confirm "Y" -SkipMissingTemplateConfirm "Y" -TemplateNameString "* SCCM Non-Compliance *"
    Write-Host ""
    Write-Host "----------------------------------------------------------------------------"
    Write-Host "[STARTING BITLOCKER EMAILS] -"('[{0:MM/dd/yyyy hh:mm:ss tt}]' -f (Get-Date))
    .\\Send-ComplianceEmails.ps1 -CSVFile .\\CSVs\\BitLocker.csv -EmailChoice "4" -Confirm "Y" -SkipMissingTemplateConfirm "Y" -TemplateNameString "* BitLocker Non-Compliance *"
    Write-Host ""
    Write-Host "----------------------------------------------------------------------------"
    Write-Host "[DONE SENDING EMAILS] -"('[{0:MM/dd/yyyy hh:mm:ss tt}]' -f (Get-Date))
    Write-Host "----------------------------------------------------------------------------"
    Write-Host "[SCRIPT COMPLETE]"
    Write-Host ""`,
RunExcelComplianceMacros:`<#
-------------------------------------------------
DESCRIPTION
-------------------------------------------------
This script launches Excel to update CSV files and SNAPSHOT spreadsheet via VBA Excel Macros. 
#>

# -------------------------------------------------------------------------------------------------------
# create strings of UNC paths (set path of $CurrentDirectory, then set paths of spreadsheets/macro)
# -------------------------------------------------------------------------------------------------------
$CurrentDirectory = Resolve-Path ".\\" | Select -ExpandProperty Path
$SpreadsheetFilePath = $CurrentDirectory | Get-ChildItem | Where-Object { $_.Name -ilike "*SCCM*Remediation*.xlsx"} | Select-Object -First 1 -ExpandProperty FullName
$MacroFilePath = $CurrentDirectory | Get-ChildItem | Where-Object { $_.Name -ilike "Comp*Macro*.xlsm" } | Select-Object -First 1 -ExpandProperty FullName
$SnapshotNewFilePath = "$CurrentDirectory\\SNAPSHOT" | Get-ChildItem | Where-Object { $_.Name -eq "SNAPSHOT-NEW.xlsx" } | Select-Object -First 1 -ExpandProperty FullName
$SnapshotOldFilePath = "$CurrentDirectory\\SNAPSHOT" | Get-ChildItem | Where-Object { $_.Name -eq "SNAPSHOT-OLD.xlsx" } | Select-Object -First 1 -ExpandProperty FullName

# delete current OLD snapshot, copy the last NEW one, rename NEW copy to OLD
Remove-Item -Path $SnapshotOldFilePath
Copy-Item $SnapshotNewFilepath -Destination $SnapshotOldFilePath

# -------------------------------------------------------------------------------------------------------
# open excel, run macros, then close excel
# -------------------------------------------------------------------------------------------------------
Write-Host "* Opening Excel as a new ComObject."
$objExcel = New-Object -comObject Excel.Application
Write-Host "* Opening Spreadsheets/Macros file."
$SpreadsheetFile = $objExcel.Workbooks.Open($SpreadsheetFilePath)
$MacroFile = $objExcel.Workbooks.Open($MacroFilePath)
Write-Host "* Running Macro: UpdateEmailCSVs."
$objExcel.Application.Run('ComplianceMacros.xlsm!UpdateEmailCSVs')
Write-Host "* Running Macro: CreateSnapshotSpreadsheet."
$objExcel.Application.Run('ComplianceMacros.xlsm!CreateSnapshotSpreadsheet')
Write-Host "* Done running macros."
Write-Host "* Closing Spreadsheet/Macros file."
$SpreadsheetFile.Close($false) # save? false
$MacroFile.Close($false) # save? false
Write-Host "* Closing Excel and releasing the ComObject."
$objExcel.Application.Quit
[System.Runtime.Interopservices.Marshal]::FinalReleaseComObject($objExcel)`,
SendComplianceEmails:`# Redaction - In Progress`,
ComplianceMacros:`' Redaction - In Progress`
};
export default emailScript;