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
SendComplianceEmails:`<#
---------------------------------------------------
IMPORTANT
---------------------------------------------------
!- You MUST run the script as NON-Admin (do not open PowerShell as Admin). This is a 
\tlimitation of Microsoft Outlook.
\t
!- The email template FROM field is defined via the template MSG file. The script will attempt to
\tset it to a specific shared mailbox, but if the template MSG file is saved with a personal email
\tin the FROM field, there's a chance it will send with the personal email. To prevent this,
\tmake sure template MSG files are saved with the desired mailbox in the FROM field.
\t
!- To prevent a user from receiving an email, add their machineName to .\\CSVs\\EXCLUDED.CSV. This 
\tmight be necessary if user is actively working with IT to correct the issue but continues to 
\tshow up on the report.

---------------------------------------------------
DESCRIPTION
---------------------------------------------------
This script creates & sends emails based on the UNC path assigned to the email template 
variables $[Type]EmailTemplate. It pulls the email address and creates a subject line based 
on the variables ($emailAddress, $machineName, $noticeNumber) which it can get from a 
CSV file. If no CSV file is specified it will prompt the user.

- CSV files should be comma delimited.
- CSV files should include 3 headers: machineName,emailAddress,noticeNumber

---------------------------------------------------
EXAMPLE COMMANDS TO RUN THE SCRIPT WITH POWERSHELL
---------------------------------------------------
.\\Send-ComplianceEmails.ps1\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(NOTE: will be prompted for all variables)
.\\Send-ComplianceEmails.ps1 -CSVFile .\\CSVs\\BitLocker.csv\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(NOTE: will be prompted to make MAIN MENU selection)
.\\Send-ComplianceEmails.ps1 -CSVFile .\\CSVs\\BitLocker.csv -EmailChoice "4"\t\t\t\t\t\t\t\t\t\t\t\t(NOTE: will be prompted for confirmation before sending emails)
.\\Send-ComplianceEmails.ps1 -CSVFile .\\CSVs\\BitLocker.csv -EmailChoice "4" -Confirm "Y"\t\t\t\t\t\t\t\t\t(NOTE: will be prompted if a missing template is detected)
.\\Send-ComplianceEmails.ps1 -CSVFile .\\CSVs\\BitLocker.csv -EmailChoice "4" -Confirm "Y" -SkipMissingTemplateConfirm "Y"\t(NOTE: no template string name will be logged if there's a missing template)
.\\Send-ComplianceEmails.ps1 -CSVFile .\\CSVs\\BitLocker.csv -EmailChoice "4" -Confirm "Y" -SkipMissingTemplateConfirm "Y" -TemplateNameString "* BitLocker Non-Compliance *"
#>

# ---------------------------------------------------------------------------------------------------------
# PARAMETERS (All are optional. Using all allows for fully-automated sending. See EXAMPLES above)
# ---------------------------------------------------------------------------------------------------------
# PARAMETER DESCRIPTIONS:
# * $CSVFile\t\t\t\t\t= Passed to Send-Email($csv). If not pre-defined, user will be prompted for input: emailAddress, machineName, noticeNumber.
# * $EmailChoice\t\t\t\t= Passed to Send-Email($choiceNum). Determines the email subject line. If not pre-defined, user will be prompted to choose from MAIN MENU.
# * $Confirm\t\t\t\t\t= Passed to Send-Email($confirmation). If not pre-defined as "Y", user will be prompted for confirmation before sending emails.
# * $SkipMissingTemplateConfirm\t= Used for automation. "Y" skips the initial confirmation prompt if any email templates are missing. Instead notifications will get passed to the shell (for logging).
# * $TemplateNameString\t\t\t= Passed to Send-Email($templateNameString). A string of the email template file name. Added for logging, in event that the template file can't be found.
# ---------------------------------------------------------------------------------------------------------
Param ([string] $CSVFile, [string] $EmailChoice, [string] $Confirm, [string] $SkipMissingTemplateConfirm, [string] $TemplateNameString)

# ---------------------------------------------------------------------------------------------------------
# EMAIL TEMPLATE VARIABLES (Set the variables and test to see if any are missing)
# ---------------------------------------------------------------------------------------------------------
#Define Email Template Variables
$MainPath = Resolve-Path ".\\EMAIL-TEMPLATES" | Select -ExpandProperty Path

$SCCMInactiveEmailTemplate = $MainPath | Get-ChildItem | Where-Object { $_.Name -ilike '*SCCM*INACTIVE*.msg' } | Select-Object -First 1 -ExpandProperty FullName
$SCCMNonCompEmailTemplate = $MainPath | Get-ChildItem | Where-Object { $_.Name -ilike '*SCCM*NON-COMP*.msg' } | Select-Object -First 1 -ExpandProperty FullName
$BitLockerEmailTemplate = $MainPath | Get-ChildItem | Where-Object { $_.Name -ilike '*BIT*NON-COMP*.msg' } | Select-Object -First 1 -ExpandProperty FullName
$RefreshEmailTemplate = $MainPath | Get-ChildItem | Where-Object { $_.Name -ilike '*REFRESH*.msg' }  | Select-Object -First 1 -ExpandProperty FullName

#Check if email templates exist, if not: add string $name to $templateArray.
$templateArray = @()
function Resolve-EmailTemplate ($template, $name){
\tIf ($template -eq $null) {
\t\t$script:templateArray += $name
\t}
}
Resolve-EmailTemplate -template $SCCMInactiveEmailTemplate -name "(menu opt 1) SCCM flagged as INACTIVE"
Resolve-EmailTemplate -template $SCCMNonCompEmailTemplate -name "(menu opt 2) SCCM Non-Compliance"
Resolve-EmailTemplate -template $BitLockerEmailTemplate -name "(menu opt 3) BitLocker Non-Compliance"
Resolve-EmailTemplate -template $RefreshEmailTemplate -name "(menu opt 4) Laptop Refresh Email"

# If any templates are missing, produce a warning message for each one.
If ($SkipMissingTemplateConfirm -ne "Y"){
\tIf ($templateArray.length -ne 0){
\t\tWrite-Host "---------------------------------------------"
\t\tWrite-Host "WARNING! MISSING EMAIL TEMPLATES DETECTED"
\t\tWrite-Host "---------------------------------------------"
\t\tWrite-Host "The following emails will fail to send:"
\t\tforeach ($item in $templateArray){
\t\t\tWrite-Host "* $item"
\t\t}
\t\tWrite-Host ""
\t\tWrite-Host "---------------------------------------------"
\t\t$SkipMissingTemplateConfirm = Read-Host "Continue? (Y) for Yes, (N) for No."
\t\tIf ($SkipMissingTemplateConfirm -eq "Y") {
\t\t\tWrite-Host ""
\t\t} Else {
\t\t\tBreak
\t\t}
\t}
}

# ---------------------------------------------------------------------------------------------------------
# SEND EMAIL FUNCTION (OPTIONAL parameters: $csv, $confirmation, $templateNameString)
# ---------------------------------------------------------------------------------------------------------
# Description of PARAMETERS:
# * $csv\t\t\t\t= $CSVFile(from MAIN PARAMETERS). If not pre-defined, user will be prompted for input.
# * $choiceNum\t\t\t= $EmailChoice(from MAIN PARAMETERS). Determines the email subject line. If not pre-defined, user will be prompted to choose from MAIN MENU.
# * $template\t\t\t= The email template variable. Chosen automatically based on $choiceNum/$EmailChoice.
# * $confirmation\t\t= $Confirm(from MAIN PARAMETERS). If not pre-defined, user will be prompted for confirmation.
# * $templateNameString\t= A string of UNC path to the email template file. Chosen automatically based on $choiceNum/$EmailChoice. Added for logs, in event that the template file can't be found.
# ---------------------------------------------------------------------------------------------------------
Function Send-Email ($csv, $choiceNum, $template, $confirmation, $templateNameString) {
\t#----------------------------
\t# MANUAL OPERATION
\t#----------------------------
\t# * No parameters defined.
\t# * Prompt user for input.
\tIf ($csv -eq "$null"){
\t\tWrite-Host ""
\t\tWrite-Host ""
\t\tWrite-Host "-----------------------------------------------"
\t\tWrite-Host "Enter email address. EX: jdoe@example.com"
\t\tWrite-Host "-----------------------------------------------"
        $emailAddress = Read-Host
        Write-Host ""
\t\tWrite-Host "-------------------------------------"
\t\tWrite-Host "Enter machine name. EX: johnscomputer123"
\t\tWrite-Host "-------------------------------------"
        $machineName = Read-Host
\t\tWrite-Host ""
\t\tWrite-Host "-----------------------"
\t\tWrite-Host "Enter the notice number"
\t\tWrite-Host "-----------------------"
\t\tWrite-Host "1 - If first email"
\t\tWrite-Host "2 - If second email"
\t\tWrite-Host "3 - Etc."
\t\tWrite-Host "-----------------------"
        $noticeNumber = Read-Host
\t\tWrite-Host ""
        Write-Host "You have selected to send the following email:"
        Write-Host "$template"
        Write-Host ""
        Write-Host "To the following recipient"
        Write-Host "$emailAddress | $machineName | Notice: $noticeNumber"
        Write-Host ""
\t\t$confirmation = Read-host "Is that correct? (Y) for Yes, (N) for No."
\t\tIf ($confirmation -eq "Y") {
            $emailAddress = $emailAddress -replace "\`t|\`n|\`r"
\t\t\t$machineName = $machineName -replace "\`t|\`n|\`r"
\t\t\t$noticeNumber = $noticeNumber -replace "\`t|\`n|\`r"
            #----------------------------
\t\t\t# OUTLOOK SEND EMAIL
\t\t\t#----------------------------
\t\t\t$ol = New-Object -comObject Outlook.Application #opens outlook as a new comObject
\t\t\t$mail = $ol.CreateItemFromTemplate($template) #pulls template
\t\t\t$mail.SentOnBehalfOfName = "IT.notifications@example.com" #attempts to set the FROM field.
\t\t\t$mail.To = " " #replaces all items on TO field with a space.
\t\t\t$mail.CC = " " #replaces all items on CC field with a space.
\t\t\t$mail.BCC = " " #replaces all items on BCC field with a space.
\t\t\t$mail.Recipients.Add($emailAddress) #adds recipient to the TO field (NOTE: can't add to CC, BCC easily).
\t\t\t$mail.Recipients.ResolveAll #if can't resolve address, email will just return to inbox as undeliverable
\t\t\t
\t\t\t#decides the email subject line
\t\t\tIf ($choiceNum -eq '1'){
\t\t\t\t$subject = "(Action Required) SCCM flagged as INACTIVE on your machine: $machineName - Notice: $noticeNumber"
\t\t\t} ElseIf ($choiceNum -eq '2'){
\t\t\t\t$subject = "(Action Required) SCCM Non-Compliance detected on your machine: $machineName - Notice: $noticeNumber"
\t\t\t} ElseIf ($choiceNum -eq '3'){
\t\t\t\t$subject = "(Action Required) BITLOCKER Non-Compliance detected on your machine: $machineName - Notice: $noticeNumber"
\t\t\t} ElseIf ($choiceNum -eq '4'){
\t\t\t\t$subject = "(Action Required) Laptop Refresh required for your machine: $machineName - Notice: $noticeNumber"
\t\t\t}
\t\t\t$mail.Subject = $subject #sets the email subject line.
\t\t\t$mail.send() #sends the email
\t\t\t[System.Runtime.Interopservices.Marshal]::FinalReleaseComObject($objOutlook) #release ComObject so it doesn't stay open in background
        } else {
            break
        }
\t} else {
\t\t#----------------------------
\t\t# PARTIAL AUTOMATIC OPERATION
\t\t#----------------------------
\t\t# * CSV file was pre-defined.
\t\t# * User selected $choiceNum/$template through param or MAIN MENU.
\t\t# * Now ask for confirmation.
\t\tIf ($confirmation -ne "Y"){
\t\t\tWrite-Host "You have selected to send the following email:"
\t\t\tWrite-Host "$template"
\t\t\tWrite-Host ""
\t\t\tWrite-Host "To the following recipient(s):"
\t\t\tImport-Csv $csv | ForEach-Object {
\t\t\t\tWrite-Host $_.EmailAddress" | "$_.MachineName" | Week Count: "$_.WeekCount
\t\t\t}
\t\t\tWrite-Host "Note that the first notice is sent on Week Count 2."
\t\t\tWrite-Host "(Notice Number = Week Count - 1)"
\t\t\tWrite-Host ""
\t\t\t$confirmation = Read-host "Do you want to send these emails? (Y) for Yes, (N) for No."
\t\t}
\t\t#----------------------------
\t\t# AUTOMATIC OPERATION
\t\t#----------------------------
\t\t# * CSV file was pre-defined.
\t\t# * Confirmation "Y" was pre-defined.
\t\t# * Attempt to autosend emails.
\t\t# * NOTE: if $choiceNum/$template is not pre-defined, MAIN MENU will still run, halting automation.
        If ($confirmation -eq "Y") {
\t\t\t$ImportCSV = Import-Csv $csv
\t\t\t# test to see if CSV file is empty
\t\t\tTry {
\t\t\t\t$testIfEmpty = $ImportCSV.machineName[0]
\t\t\t} Catch {
\t\t\t\tWrite-Host "-------------------------------------------------------------------------------"
\t\t\t\tWrite-Host "NO MACHINES DETECTED ON FILE: $csv"
\t\t\t\tWrite-Host "* Skipping 'Send-Email' function for this section."
\t\t\t\tWrite-Host ""
\t\t\t}
\t\t\tIf ($testIfEmpty -ne $null){
\t\t\t\t# test to see if email template is missing
\t\t\t\tIf ($template -eq $null) {
\t\t\t\t\tWrite-Host "-------------------------------------------------------------------------------"
\t\t\t\t\tWrite-Host "EMAIL TEMPLATE MISSING."
\t\t\t\t\tWrite-Host "* Skipping 'Send-Email' function for this section."
\t\t\t\t\tWrite-Host "* Check for the missing MSG file at $templateNameString"
\t\t\t\t\tWrite-Host ""
\t\t\t\t} Else {
\t\t\t\t\t$ImportCSV | ForEach-Object {
\t\t\t\t\t\t#Set the email variables.
\t\t\t\t\t\t$emailAddress = $_.EmailAddress -replace "\`t|\`n|\`r"
\t\t\t\t\t\t$machineName = $_.MachineName -replace "\`t|\`n|\`r"
\t\t\t\t\t\t$weekCount = $_.WeekCount -replace "\`t|\`n|\`r"
\t\t\t\t\t\t$noticeNumber = 0
\t\t\t\t\t\tIf ($weekCount -gt 1){
\t\t\t\t\t\t\t#Create $noticeNumber automatically from CSV $WeekCount.
\t\t\t\t\t\t\t$noticeNumber = $weekCount - 1
\t\t\t\t\t\t\t$noticeNumber = $noticeNumber -replace "\`t|\`n|\`r"
\t\t\t\t\t\t\tWrite-Host "-------------------------------------------------------------------------------"
\t\t\t\t\t\t\tWrite-Host "SENDING EMAIL: $emailAddress | $machineName | Notice: $noticeNumber"
\t\t\t\t\t\t\tWrite-Host "-------------------------------------------------------------------------------"
\t\t\t\t\t\t\tWrite-Host ""
\t\t\t\t\t\t\t#----------------------------
\t\t\t\t\t\t\t# OUTLOOK SEND EMAIL
\t\t\t\t\t\t\t#----------------------------
\t\t\t\t\t\t\t$objOutlook = New-Object -comObject Outlook.Application #opens outlook as a new comObject
\t\t\t\t\t\t\t$mail = $objOutlook.CreateItemFromTemplate($template) #pulls template
\t\t\t\t\t\t\t$mail.SentOnBehalfOfName = "IT.notifications@example.com" #attempts to set the FROM field.
\t\t\t\t\t\t\t$mail.To = " " #replaces all items on TO field with a space.
\t\t\t\t\t\t\t$mail.CC = " " #replaces all items on CC field with a space.
\t\t\t\t\t\t\t$mail.BCC = " " #replaces all items on BCC field with a space.
\t\t\t\t\t\t\t$mail.Recipients.Add($emailAddress) #adds recipient to the TO field (NOTE: can't add to CC, BCC easily).
\t\t\t\t\t\t\t$mail.Recipients.ResolveAll #if can't resolve address, email will just return to inbox as undeliverable
\t\t\t\t\t\t\t#CC a security admin if weekCount > 3 and user is not complying
\t\t\t\t\t\t\tIf ($weekCount -gt 3){
\t\t\t\t\t\t\t\t$mail.CC = "security.admin@example.com"
\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t#define the email subject lines
\t\t\t\t\t\t\tIf ($choiceNum -eq '1'){
\t\t\t\t\t\t\t\t$subject = "(Action Required) SCCM flagged as INACTIVE on your machine: $machineName - Notice: $noticeNumber"
\t\t\t\t\t\t\t} ElseIf ($choiceNum -eq '2'){
\t\t\t\t\t\t\t\t$subject = "(Action Required) SCCM Non-Compliance detected on your machine: $machineName - Notice: $noticeNumber"
\t\t\t\t\t\t\t} ElseIf ($choiceNum -eq '3'){
\t\t\t\t\t\t\t\t$subject = "(Action Required) BITLOCKER Non-Compliance detected on your machine: $machineName - Notice: $noticeNumber"
\t\t\t\t\t\t\t} ElseIf ($choiceNum -eq '4'){
\t\t\t\t\t\t\t\t$subject = "(Action Required) Laptop Refresh required for your machine: $machineName - Notice: $noticeNumber"
\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t$mail.Subject = $subject #sets the email subject line.
\t\t\t\t\t\t\t$mail.send() #sends the email.
\t\t\t\t\t\t\t[System.Runtime.Interopservices.Marshal]::FinalReleaseComObject($objOutlook) #release ComObject so it doesn't stay open in background
\t\t\t\t\t\t} ElseIf ($weekCount -eq 1){
\t\t\t\t\t\t\tWrite-Host "-------------------------------------------------------------------------------"
\t\t\t\t\t\t\tWrite-Host "NO EMAIL YET: $emailAddress | $machineName | Week Count: $weekCount"
\t\t\t\t\t\t\tWrite-Host "-------------------------------------------------------------------------------"
\t\t\t\t\t\t\tWrite-Host "User has been on the report for 7 days. Week counter set to 1."
\t\t\t\t\t\t\tWrite-Host "The first notice will be sent on week 2 (14 days)."
\t\t\t\t\t\t\tWrite-Host ""
\t\t\t\t\t\t} Else {
\t\t\t\t\t\t\tWrite-Host "-------------------------------------------------------------------------------"
\t\t\t\t\t\t\tWrite-Host "NO EMAIL YET: $emailAddress | $machineName | Week Count: $weekCount"
\t\t\t\t\t\t\tWrite-Host "-------------------------------------------------------------------------------"
\t\t\t\t\t\t\tWrite-Host "User just appeared on the report. Week counter set to 0."
\t\t\t\t\t\t\tWrite-Host "The first notice will be sent on week 2 (14 days)."
\t\t\t\t\t\t\tWrite-Host ""
\t\t\t\t\t\t}
\t\t\t\t\t}
\t\t\t\t}
\t\t\t}
        } Else {
            Break
        }
    }
}

# ---------------------------------------------------------------------------------------------------------
# MAIN MENU FUNCTION
# ---------------------------------------------------------------------------------------------------------
function Get-SelectEmail {
    Write-Host "---------------------------------------------"
    If ($CSVFile -ne "$null") {
        Write-Host "AUTOMATIC OPERATION"
\t\tWrite-Host "---------------------------------------------"
\t\tWrite-Host " * The following CSV file was selected: $CSVFile"
\t\tWrite-Host " * The script will attempt to pull emailAddress,"
\t\tWrite-Host "   machineName, and noticeNumber from the CSV file."
    } else {
        Write-Host "MANUAL OPERATION"
\t\tWrite-Host "---------------------------------------------"
\t\tWrite-Host " * No CSV file selected."
\t\tWrite-Host " * The script will prompt for emailAddress,"
\t\tWrite-Host "   machineName, and noticeNumber to send one"
\t\tWrite-Host "   email at a time."
    }
\tWrite-Host ""
\tWrite-Host "---------------------------------------------"
\tWrite-Host "Please select an email to send."
\tWrite-Host "---------------------------------------------"
\tWrite-Host "(1) SCCM flagged as INACTIVE"
\tWrite-Host "(2) SCCM Non-Compliance"
\tWrite-Host "(3) BitLocker Non-Compliance"
\tWrite-Host "(4) Laptop Refresh Email"
    Write-Host ""
    $EmailChoice = Read-Host "Enter a number corresponding to the options above. (Ctrl-C to cancel)"
    Return $EmailChoice
}

# ---------------------------------------------------------------------------------------------------------
# CALL MAIN MENU FUNCTION AND ASSIGN SELECTION TO $EmailChoice (ONLY happens if $EmailChoice is NOT pre-defined)
# ---------------------------------------------------------------------------------------------------------
If ($EmailChoice -eq "$null"){
\t$EmailChoice = Get-SelectEmail
}

# ---------------------------------------------------------------------------------------------------------
# MAIN MENU CONDITIONAL (calls Send-Email function w/different params depending on menu selection)
# ---------------------------------------------------------------------------------------------------------
If ($EmailChoice -eq '1'){
\tSend-Email -csv $CSVFile -choiceNum '1' -template $SCCMInactiveEmailTemplate -confirmation $Confirm -templateNameString "$MainPath\\$TemplateNameString.msg"
} ElseIf ($EmailChoice -eq '2'){
\tSend-Email -csv $CSVFile -choiceNum '2' -template $SCCMNonCompEmailTemplate -confirmation $Confirm -templateNameString "$MainPath\\$TemplateNameString.msg"
} ElseIf ($EmailChoice -eq '3'){
\tSend-Email -csv $CSVFile -choiceNum '3' -template $BitLockerEmailTemplate -confirmation $Confirm -templateNameString "$MainPath\\$TemplateNameString.msg"
} ElseIf ($EmailChoice -eq '4'){
\tSend-Email -csv $CSVFile -choiceNum '4' -template $RefreshEmailTemplate -confirmation $Confirm -templateNameString "$MainPath\\$TemplateNameString.msg"
} Else {
\t#if menu selection doesn't exist, start over
\tWrite-Host ""
\tWrite-Host "---------------------------------------------"
\tWrite-Host "Sorry, menu selection doesn't exist."
\tWrite-Host "---------------------------------------------"
\tWrite-Host " ! Please enter a valid number from the menu."
\tWrite-Host ""
\tPause
\tCls
\t.\\Send-ComplianceEmails -CSVFile $CSVFile
}`,
ComplianceMacros:`Sub UpdateEmailCSVs()
' Macro to pull all useful info from SCCM Remediation spreadsheet
' and store each section in separate CSV files for email automation.

' Run silently
Application.ScreenUpdating = False
Application.DisplayAlerts = False

' Remediation Spreadsheet Variable
    Dim RemediationSpreadsheet As String
    RemediationSpreadsheet = "Windows Workstations - SCCM - Remediation.xlsx"

' Open EXCLUDED.CSV for duration of macro
    Call OpenCSV("EXCLUDED", RemediationSpreadsheet)
    
' SCCM Inactive CSV
    Range("C1").Select ' start at C1 for this loop
    Call OpenCSV("SCCMinactive", RemediationSpreadsheet)
    Call SetAllRowsRemoveValueTrue("SCCMinactive", RemediationSpreadsheet)
    Do While Not (ActiveCell.Value Like "Inactive*")
        Selection.End(xlDown).Select
    Loop
    ActiveCell.Offset(2, 0).Select
    Do While Not IsEmpty(ActiveCell.Value)
        Call LoopCSVinactiveSCCM(RemediationSpreadsheet)
    Loop
    Call DeleteRowsOnRemoveTrue("SCCMinactive")
    Call SortByMachineName(RemediationSpreadsheet)
    Call CloseSaveCSV("SCCMinactive", RemediationSpreadsheet)
    
' SCCM Blank CSV
    Range("C1").Select ' start at C1 for this loop
    Call OpenCSV("SCCMblank", RemediationSpreadsheet)
    Call SetAllRowsRemoveValueTrue("SCCMblank", RemediationSpreadsheet)
    Do While Not (ActiveCell.Value Like "Inactive*")
        Selection.End(xlDown).Select
    Loop
    ActiveCell.Offset(2, 0).Select
    Do While Not IsEmpty(ActiveCell.Value)
        Call LoopCSVblankSCCM(RemediationSpreadsheet)
    Loop
    Call DeleteRowsOnRemoveTrue("SCCMblank")
    Call SortByMachineName(RemediationSpreadsheet)
    Call CloseSaveCSV("SCCMblank", RemediationSpreadsheet)
    
' BitLocker CSV
    Call OpenCSV("BitLocker", RemediationSpreadsheet)
    Call SetAllRowsRemoveValueTrue("BitLocker", RemediationSpreadsheet)
    Do While Not (ActiveCell.Value Like "BitLocker*")
        Selection.End(xlDown).Select
    Loop
    ActiveCell.Offset(2, 0).Select
    Do While Not IsEmpty(ActiveCell.Value)
        Call LoopCSVothers("BitLocker", RemediationSpreadsheet)
    Loop
    Call DeleteRowsOnRemoveTrue("BitLocker")
    Call SortByMachineName(RemediationSpreadsheet)
    Call CloseSaveCSV("BitLocker", RemediationSpreadsheet)
    
' Finish
    Call CloseSaveCSV("EXCLUDED", RemediationSpreadsheet)
    Range("A1").Select
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    
End Sub

' Open CSV file
Function OpenCSV(category As String, RemSpreadsheet As String)
    Workbooks.Open ActiveWorkbook.Path & "\\CSVs\\" & category & ".CSV"
    Workbooks(RemSpreadsheet).Activate
End Function

' Close and Save CSV file
Function CloseSaveCSV(category As String, RemSpreadsheet As String)
    Workbooks(category & ".CSV").Activate
    Workbooks(category & ".CSV").Close Savechanges:=True
    Workbooks(RemSpreadsheet).Activate
End Function

' Set "Remove" value of all machines on CSV file to "TRUE".
' If the computer is still Non-Compliant, the "Remove" value will change to "FALSE".
Function SetAllRowsRemoveValueTrue(category As String, RemSpreadsheet As String)
    Workbooks(category & ".CSV").Activate
    Range("D2").Select
    If Not IsEmpty(ActiveCell.Value) Then ' check if D2 is empty, if not, set value to "TRUE"
        ActiveCell.Value = "TRUE"
        ActiveCell.Offset(1, 0).Select
        If Not IsEmpty(ActiveCell.Value) Then ' check if D3 is empty, if not, set value of entire column to "TRUE"
            Range("D2", Range("D2").End(xlDown)).Value = "TRUE"
        End If
    End If
    Workbooks(RemSpreadsheet).Activate
End Function

' Delete machines from the CSV file if their "Remove" value is still "TRUE" at the end of macro.
Function DeleteRowsOnRemoveTrue(category As String)
    Workbooks(category & ".CSV").Activate
    Range("D2").Select
    Do While Not IsEmpty(ActiveCell.Value)
        If ActiveCell.Value = "TRUE" Then
            ActiveCell.EntireRow.Delete Shift:=xlUp
        Else
            ActiveCell.Offset(1, 0).Select
        End If
    Loop
End Function

' Sort all rows by machine name before saving CSV (so there's no loop issues next time the report runs).
Function SortByMachineName(RemSpreadsheet As String)
    With ActiveSheet.sort
        .SortFields.Add Key:=Range("A1"), Order:=xlAscending
        .SetRange Range("A1", Range("D1").End(xlDown))
        .Header = xlYes
        .Apply
    End With
    Workbooks(RemSpreadsheet).Activate
End Function

' SCCM Inactive Loop
Function LoopCSVinactiveSCCM(RemSpreadsheet As String)
    If ActiveCell.Value Like "OfficeLoc1-*" Or _
    ActiveCell.Value Like "OfficeLoc2-*" Or _
    ActiveCell.Value Like "OfficeLoc3-*" Then
        ' Check if machine status is (Empty) or (Exempted)
        ' NOTE: we want (non-Empty & non-Exempt) for this CSV file
        ActiveCell.Offset(0, 6).Select
        If IsEmpty(ActiveCell.Value) Then
            ActiveCell.Offset(1, -6).Select ' if Empty skip to next row
        Else
            ActiveCell.Offset(0, -1).Select ' if not Empty, select Exempt cell and check that
            If ActiveCell.Value Like "Exempted" Then
                ActiveCell.Offset(1, -5).Select ' if Exempt skip to next row
            Else ' This is a potential machine (non-Empty & non-Exempt), now check the rest
                ActiveCell.Offset(0, -5).Select
                ' remember machine name for making comparisons later
                Dim machineName As String
                machineName = ActiveCell.Value
                '-----------------------------
                ' CHECK machineName AGAINST EXCLUDED.CSV
                Workbooks("EXCLUDED.CSV").Activate
                Range("A2").Select
                Do While Not IsEmpty(ActiveCell.Value)
                    If ActiveCell.Value = machineName Then
                        ' Go back to Remediation Worksheet and move down a row
                        Workbooks(RemSpreadsheet).Activate
                        ActiveCell.Offset(1, 0).Select
                        Exit Function
                    Else
                        ActiveCell.Offset(1, 0).Select
                    End If
                Loop
                Workbooks(RemSpreadsheet).Activate
                '-----------------------------
                ' copy row and move to CSV file
                ActiveCell.Range("A1:C1").Copy
                Workbooks("SCCMinactive.CSV").Activate
                Range("A2").Select
                ' CHECK machineName AGAINST <CATEGORY>.CSV, if found, increase WeekCount & change "Remove" value
                Do While Not IsEmpty(ActiveCell.Value)
                    If ActiveCell.Value = machineName Then
                        ' Increase WeekCount
                        ActiveCell.Offset(0, 2).Select
                        ActiveCell.Value = ActiveCell.Value + 1
                        ' Set "Remove" value to "FALSE" (the machine is still Non-Compliant and shouldn't be removed)
                        ActiveCell.Offset(0, 1).Select
                        ActiveCell.Value = "FALSE"
                        ' Go back to Remediation Worksheet and move down a row
                        Workbooks(RemSpreadsheet).Activate
                        ActiveCell.Offset(1, 0).Select
                        Exit Function
                    Else
                        ' move down a row (check all rows for machineName)
                        ActiveCell.Offset(1, 0).Select
                    End If
                Loop
                ' machineName wasn't found, paste on a new row
                ActiveCell.PasteSpecial xlPasteValuesAndNumberFormats
                ' reposition email address
                ActiveCell.Offset(0, 2).Select
                Selection.Cut
                ActiveCell.Offset(0, -1).Select
                ActiveSheet.Paste
                ' add WeekCount (first time machine is Non-Compliant is week 0, user will receive email on week 2 (14 days))
                ActiveCell.Offset(0, 1).Select
                ActiveCell.Value = 0
                ' Set "Remove" value to "FALSE" (the machine is Non-Compliant and shouldn't be removed from the list)
                ActiveCell.Offset(0, 1).Select
                ActiveCell.Value = "FALSE"
                ' go back to Remediation Worksheet and move down a row
                Workbooks(RemSpreadsheet).Activate
                ActiveCell.Offset(1, 0).Select
            End If
        End If
    Else
        ActiveCell.Offset(1, 0).Select
    End If
End Function

' SCCM Blank Loop (SCCM Non-Compliant)
Function LoopCSVblankSCCM(RemSpreadsheet As String)
    If ActiveCell.Value Like "OfficeLoc1-*" Or _
    ActiveCell.Value Like "OfficeLoc2-*" Or _
    ActiveCell.Value Like "OfficeLoc3-*" Then
        ' Check if machine status is (NOT Empty) or (Exempted)
        ' NOTE: we want (Empty & non-Exempt) for this CSV file
        ActiveCell.Offset(0, 6).Select
        If Not IsEmpty(ActiveCell.Value) Then
            ActiveCell.Offset(1, -6).Select ' if NOT Empty skip to next row
        Else
            ActiveCell.Offset(0, -1).Select ' if Empty, select Exempt cell and check that
            If ActiveCell.Value Like "Exempted" Then
                ActiveCell.Offset(1, -5).Select ' if Exempt skip to next row
            Else ' This is a potential machine (Empty & non-Exempt), now check the rest
                ActiveCell.Offset(0, -5).Select
                ' remember machine name for making comparisons later
                Dim machineName As String
                machineName = ActiveCell.Value
                '-----------------------------
                ' CHECK machineName AGAINST EXCLUDED.CSV
                Workbooks("EXCLUDED.CSV").Activate
                Range("A2").Select
                Do While Not IsEmpty(ActiveCell.Value)
                    If ActiveCell.Value = machineName Then
                        ' Go back to Remediation Worksheet and move down a row
                        Workbooks(RemSpreadsheet).Activate
                        ActiveCell.Offset(1, 0).Select
                        Exit Function
                    Else
                        ActiveCell.Offset(1, 0).Select
                    End If
                Loop
                Workbooks(RemSpreadsheet).Activate
                '-----------------------------
                ' copy row and move to CSV file
                ActiveCell.Range("A1:C1").Copy
                Workbooks("SCCMblank.CSV").Activate
                Range("A2").Select
                ' CHECK machineName AGAINST <CATEGORY>.CSV, if found, increase WeekCount & change "Remove" value
                Do While Not IsEmpty(ActiveCell.Value)
                    If ActiveCell.Value = machineName Then
                        ' increase WeekCount
                        ActiveCell.Offset(0, 2).Select
                        ActiveCell.Value = ActiveCell.Value + 1
                        ' Set "Remove" value to "FALSE" (the machine is Non-Compliant and shouldn't be removed from the list)
                        ActiveCell.Offset(0, 1).Select
                        ActiveCell.Value = "FALSE"
                        ' go back to Remediation Worksheet and move down a row
                        Workbooks(RemSpreadsheet).Activate
                        ActiveCell.Offset(1, 0).Select
                        Exit Function
                    Else
                        ' move down a row
                        ActiveCell.Offset(1, 0).Select
                    End If
                Loop
                ' machineName wasn't found, paste on a new row
                ActiveCell.PasteSpecial xlPasteValuesAndNumberFormats
                ' reposition email address
                ActiveCell.Offset(0, 2).Select
                Selection.Cut
                ActiveCell.Offset(0, -1).Select
                ActiveSheet.Paste
                ' add WeekCount (first time machine is Non-Compliant is week 0, user will receive email on week 2 (14 days))
                ActiveCell.Offset(0, 1).Select
                ActiveCell.Value = 0
                ' Set "Remove" value to "FALSE" (the machine is Non-Compliant and shouldn't be removed from the list)
                ActiveCell.Offset(0, 1).Select
                ActiveCell.Value = "FALSE"
                ' go back to Remediation Worksheet and move down a row
                Workbooks(RemSpreadsheet).Activate
                ActiveCell.Offset(1, 0).Select
            End If
        End If
    Else
        ActiveCell.Offset(1, 0).Select
    End If
End Function

' All Other Loops (BitLocker, SecSoftware, Etc)
Function LoopCSVothers(category As String, RemSpreadsheet As String)
    If ActiveCell.Value Like "OfficeLoc1-*" Or _
    ActiveCell.Value Like "OfficeLoc2-*" Or _
    ActiveCell.Value Like "OfficeLoc3-*" Then
        ' check if Exempt (if so, skip to next row)
        ActiveCell.Offset(0, 5).Select
        If ActiveCell.Value Like "Exempted" Then
            ActiveCell.Offset(1, -5).Select
        Else
            ActiveCell.Offset(0, -5).Select
            ' remember machine name for making comparisons later
            Dim machineName As String
            machineName = ActiveCell.Value
            '-----------------------------
            ' CHECK machineName AGAINST EXCLUDED.CSV
            Workbooks("EXCLUDED.CSV").Activate
            Range("A2").Select
            Do While Not IsEmpty(ActiveCell.Value)
                If ActiveCell.Value = machineName Then
                    ' Go back to Remediation Worksheet and move down a row
                    Workbooks(RemSpreadsheet).Activate
                    ActiveCell.Offset(1, 0).Select
                    Exit Function
                Else
                    ActiveCell.Offset(1, 0).Select
                End If
            Loop
            Workbooks(RemSpreadsheet).Activate
            '-----------------------------
            ' copy row and move to CSV file
            ActiveCell.Range("A1:C1").Copy
            Workbooks(category & ".CSV").Activate
            Range("A2").Select
            ' CHECK machineName AGAINST <CATEGORY>.CSV, if found, increase WeekCount & change "Remove" value
            Do While Not IsEmpty(ActiveCell.Value)
                If ActiveCell.Value = machineName Then
                    ' increase WeekCount
                    ActiveCell.Offset(0, 2).Select
                    ActiveCell.Value = ActiveCell.Value + 1
                    ' Set "Remove" value to "FALSE" (the machine is Non-Compliant and shouldn't be removed from the list)
                    ActiveCell.Offset(0, 1).Select
                    ActiveCell.Value = "FALSE"
                    ' go back to Remediation Worksheet and move down a row
                    Workbooks(RemSpreadsheet).Activate
                    ActiveCell.Offset(1, 0).Select
                    Exit Function
                Else
                    ' move down a row
                    ActiveCell.Offset(1, 0).Select
                End If
            Loop
            ' machineName wasn't found, paste on a new row
            ActiveCell.PasteSpecial xlPasteValues
            ' reposition email address
            ActiveCell.Offset(0, 2).Select
            Selection.Cut
            ActiveCell.Offset(0, -1).Select
            ActiveSheet.Paste
            ' add WeekCount (first time machine is Non-Compliant is week 0, user will receive email on week 2 (14 days))
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = 0
            ' Set "Remove" value to "FALSE" (the machine is Non-Compliant and shouldn't be removed from the list)
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = "FALSE"
            ' go back to Remediation Worksheet and move down a row
            Workbooks(RemSpreadsheet).Activate
            ActiveCell.Offset(1, 0).Select
        End If
    Else
        ActiveCell.Offset(1, 0).Select
    End If
End Function

Sub CreateSnapshotSpreadsheet()
' Macro to pull all useful info from SCCM Remediation spreadsheet
' and store it in a easy to read report.

' Run silently
    Application.ScreenUpdating = False
    Application.DisplayAlerts = False

' Remediation Spreadsheet Variable
    Dim RemediationSpreadsheet As String
    RemediationSpreadsheet = "Windows Workstations - SCCM - Remediation.xlsx"
    
' Open SNAPSHOT-NEW.xlsx and delete the sheet to start fresh
    Workbooks.Open ActiveWorkbook.Path & "\\CSVs\\EXCLUDED.CSV"
    Workbooks(RemediationSpreadsheet).Activate
    Workbooks.Open ActiveWorkbook.Path & "\\SNAPSHOT\\SNAPSHOT-NEW.xlsx"
    Workbooks("SNAPSHOT-NEW.xlsx").Activate
    ActiveWorkbook.Sheets.Add(After:=Worksheets(1)).Name = "temp"
    Sheets(1).Delete
    Sheets("temp").Name = "Compliance Snapshot"
    Workbooks(RemediationSpreadsheet).Activate

' SCCM Inactive & SCCM Blank (Non-Compliant) categories (start on RemediationSpreadsheet:C1 for these categories)
    Range("C1").Select
    Do While Not (ActiveCell.Value Like "Inactive*")
        Selection.End(xlDown).Select
    Loop
    ActiveCell.Offset(1, 0).Select
    Workbooks.Open ActiveWorkbook.Path & "\\CSVs\\SCCMinactive.csv"
    Workbooks(RemediationSpreadsheet).Activate
    Workbooks.Open ActiveWorkbook.Path & "\\CSVs\\SCCMblank.csv"
    Workbooks(RemediationSpreadsheet).Activate
    Do While Not IsEmpty(ActiveCell.Value)
        Call LoopSCCM(RemediationSpreadsheet)
    Loop
    Workbooks("SCCMinactive.csv").Activate
    Workbooks("SCCMinactive.csv").Close Savechanges:=False
    Workbooks("SCCMblank.csv").Activate
    Workbooks("SCCMblank.csv").Close Savechanges:=False
    
' BitLocker category
    Do While Not (ActiveCell.Value Like "BitLocker*")
        Selection.End(xlDown).Select
    Loop
    ActiveCell.Offset(1, 0).Select
    Workbooks.Open ActiveWorkbook.Path & "\\CSVs\\BitLocker.csv"
    Workbooks(RemediationSpreadsheet).Activate
    Do While Not IsEmpty(ActiveCell.Value)
        Call LoopOTHERS("BitLocker", RemediationSpreadsheet)
    Loop
    Workbooks("BitLocker.csv").Activate
    Workbooks("BitLocker.csv").Close Savechanges:=False
    
' Finish
    Workbooks("EXCLUDED.CSV").Activate
    Workbooks("EXCLUDED.CSV").Close Savechanges:=False
    Workbooks("SNAPSHOT-NEW.xlsx").Activate
    Range("A1").Select
    Workbooks("SNAPSHOT-NEW.xlsx").Close Savechanges:=True
    Workbooks(RemediationSpreadsheet).Activate
    Range("A1").Select
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
End Sub

Function LoopSCCM(RemSpreadsheet As String)
    If ActiveCell.Value Like "Server*" Or _
    ActiveCell.Value Like "OfficeLoc1-*" Or _
    ActiveCell.Value Like "OfficeLoc2-*" Or _
    ActiveCell.Value Like "OfficeLoc3-*" Then
        ' copy row and move to sheet(2)
        ActiveCell.Range("A1:J1").Copy
        Workbooks("SNAPSHOT-NEW.xlsx").Activate
        Range("A1").Select
        ' check if first 2 rows have data already
        If Not IsEmpty(ActiveCell.Value) Then
            ActiveCell.Offset(1, 0).Select
            If Not IsEmpty(ActiveCell.Value) Then
                ActiveCell.Offset(-1, 0).Select
                Selection.End(xlDown).Select
                ActiveCell.Offset(1, 0).Select
            End If
        End If
        ActiveCell.PasteSpecial xlPasteValuesAndNumberFormats
        ' reposition column (email address)
        ActiveCell.Offset(0, 2).Select
        Selection.Cut
        ActiveCell.Offset(0, -1).Select
        ActiveSheet.Paste
        ' reposition column (exemption)
        ActiveCell.Offset(0, 5).Select
        Selection.Cut
        ActiveCell.Offset(0, -3).Select
        ActiveSheet.Paste
        ' reposition column (status)
        ActiveCell.Offset(0, 4).Select
        Selection.Cut
        ActiveCell.Offset(0, -3).Select
        ActiveSheet.Paste
        ' reposition column (last logon)
        ActiveCell.Offset(0, 4).Select
        Selection.Cut
        ActiveCell.Offset(0, -3).Select
        ActiveSheet.Paste
        Columns("A:F").AutoFit
        ' extra formatting for Server row
        Application.Goto Cells(ActiveCell.Row, 1), 0
        If ActiveCell.Value Like "Server*" Then
            ActiveCell.Value = "Machine Name"
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = "Email Address"
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = "Week Count"
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = "Exemption"
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = "SCCM Status"
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = "Last Logon"
            ActiveCell.Offset(0, -5).Range("A1:F1").Select
            Selection.Font.Bold = True
        Else
            Dim machineName As String
            machineName = ActiveCell.Value
            ' add WeekCount from SCCMinactive.CSV file, if it exists
            Workbooks("SCCMinactive.CSV").Activate
            Range("A2").Select
            Do While Not IsEmpty(ActiveCell.Value)
                If ActiveCell.Value = machineName Then
                    ' Copy WeekCount and Paste in SNAPSHOT-NEW
                    ActiveCell.Offset(0, 2).Select
                    ActiveCell.Copy
                    Workbooks("SNAPSHOT-NEW.xlsx").Activate
                    Application.Goto Cells(ActiveCell.Row, 1), 0
                    ActiveCell.Offset(0, 2).Select
                    ActiveCell.PasteSpecial xlPasteValuesAndNumberFormats
                    Exit Do
                Else
                    ActiveCell.Offset(1, 0).Select
                End If
            Loop
            ' add WeekCount from SCCMblank.CSV file, if it exists
            Workbooks("SCCMblank.CSV").Activate
            Range("A2").Select
            Do While Not IsEmpty(ActiveCell.Value)
                If ActiveCell.Value = machineName Then
                    ' Copy WeekCount and Paste in SNAPSHOT-NEW
                    ActiveCell.Offset(0, 2).Select
                    ActiveCell.Copy
                    Workbooks("SNAPSHOT-NEW.xlsx").Activate
                    Application.Goto Cells(ActiveCell.Row, 1), 0
                    ActiveCell.Offset(0, 2).Select
                    ActiveCell.PasteSpecial xlPasteValuesAndNumberFormats
                    Exit Do
                Else
                    ActiveCell.Offset(1, 0).Select
                End If
            Loop
            ' add note "EXCLUDED.CSV" if machine exists on the EXCLUDED.CSV file
            Workbooks("EXCLUDED.CSV").Activate
            Range("A2").Select
            Do While Not IsEmpty(ActiveCell.Value)
                If ActiveCell.Value = machineName Then
                    ' Add EXCLUDED.CSV notation in SNAPSHOT-NEW
                    Workbooks("SNAPSHOT-NEW.xlsx").Activate
                    Application.Goto Cells(ActiveCell.Row, 1), 0
                    ActiveCell.Offset(0, 3).Select
                    ActiveCell.Value = "EXCLUDED.CSV"
                    Exit Do
                Else
                    ActiveCell.Offset(1, 0).Select
                End If
            Loop
        End If
        ' go back to Remediation Spreadsheet and move down a row
        Workbooks(RemSpreadsheet).Activate
        ActiveCell.Offset(1, 0).Select
    Else
        ActiveCell.Offset(1, 0).Select
    End If
End Function

Function LoopOTHERS(category As String, RemSpreadsheet As String)
    If ActiveCell.Value Like "Server*" Or _
    ActiveCell.Value Like "OfficeLoc1-*" Or _
    ActiveCell.Value Like "OfficeLoc2-*" Or _
    ActiveCell.Value Like "OfficeLoc3-*" Then
        ' copy row and move to sheet(2)
        ActiveCell.Range("A1:I1").Copy
        Workbooks("SNAPSHOT-NEW.xlsx").Activate
        Range("A1").Select
        ' check if first 2 rows have data already
        If Not IsEmpty(ActiveCell.Value) Then
            ActiveCell.Offset(1, 0).Select
            If Not IsEmpty(ActiveCell.Value) Then
                ActiveCell.Offset(-1, 0).Select
                Selection.End(xlDown).Select
                ActiveCell.Offset(1, 0).Select
            End If
        End If
        ActiveCell.PasteSpecial xlPasteValuesAndNumberFormats
        ' reposition column (email address)
        ActiveCell.Offset(0, 2).Select
        Selection.Cut
        ActiveCell.Offset(0, -1).Select
        ActiveSheet.Paste
        ' reposition column (exemption)
        ActiveCell.Offset(0, 5).Select
        Selection.Cut
        ActiveCell.Offset(0, -3).Select
        ActiveSheet.Paste
        ' reposition column (status)
        ActiveCell.Offset(0, 4).Select
        Selection.Cut
        ActiveCell.Offset(0, -3).Select
        ActiveSheet.Paste
        Columns("A:F").AutoFit
        ' extra formatting for category row
        Application.Goto Cells(ActiveCell.Row, 1), 0
        If ActiveCell.Value Like "Server*" Then
            ActiveCell.Value = "Machine Name"
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = "Email Address"
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = "Week Count"
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = "Exemption"
            ActiveCell.Offset(0, 1).Select
            ActiveCell.Value = category & " Status"
            ActiveCell.Offset(0, -4).Range("A1:E1").Select
            Selection.Font.Bold = True
        Else
            Dim machineName As String
            machineName = ActiveCell.Value
            ' add WeekCount from CSV file, if it exists
            Workbooks(category & ".CSV").Activate
            Range("A2").Select
            Do While Not IsEmpty(ActiveCell.Value)
                If ActiveCell.Value = machineName Then
                    ' Copy WeekCount and Paste in SNAPSHOT-NEW
                    ActiveCell.Offset(0, 2).Select
                    ActiveCell.Copy
                    Workbooks("SNAPSHOT-NEW.xlsx").Activate
                    Application.Goto Cells(ActiveCell.Row, 1), 0
                    ActiveCell.Offset(0, 2).Select
                    ActiveCell.PasteSpecial xlPasteValuesAndNumberFormats
                    Exit Do
                Else
                    ActiveCell.Offset(1, 0).Select
                End If
            Loop
            ' add EXCLUDED.CSV if machine exists on the EXCLUDED.CSV file
            Workbooks("EXCLUDED.CSV").Activate
            Range("A2").Select
            Do While Not IsEmpty(ActiveCell.Value)
                If ActiveCell.Value = machineName Then
                    ' Add EXCLUDED.CSV notation in SNAPSHOT-NEW
                    Workbooks("SNAPSHOT-NEW.xlsx").Activate
                    Application.Goto Cells(ActiveCell.Row, 1), 0
                    ActiveCell.Offset(0, 3).Select
                    ActiveCell.Value = "EXCLUDED.CSV"
                    Exit Do
                Else
                    ActiveCell.Offset(1, 0).Select
                End If
            Loop
        End If
        ' go back to Remediation Spreadsheet and move down a row
        Workbooks(RemSpreadsheet).Activate
        ActiveCell.Offset(1, 0).Select
    Else
        ActiveCell.Offset(1, 0).Select
    End If
End Function`
};
export default emailScript;