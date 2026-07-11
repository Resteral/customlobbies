# RegisterStartupTask.ps1
# Registers or unregisters the ClipchampWatcher.ps1 script as a Windows Startup Task.

param (
    [string]$WatchFolder,
    [switch]$Unregister
)

$TaskName = "ClipchampWatcher"

if ($Unregister) {
    if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "Startup task '$TaskName' removed successfully."
    } else {
        Write-Host "Startup task '$TaskName' was not registered."
    }
    exit
}

$ScriptPath = Join-Path $PSScriptRoot "ClipchampWatcher.ps1"
if (-not (Test-Path $ScriptPath)) {
    Write-Error "Could not find ClipchampWatcher.ps1 at $ScriptPath"
    exit 1
}

Write-Host "Registering background startup task..."

# Define Action, Trigger, and Settings
$args = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$ScriptPath`""
if ($WatchFolder) {
    $args += " -WatchFolder `"$WatchFolder`""
}
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $args
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

try {
    # Register under the current user's security context (no admin rights needed)
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
    
    Write-Host "--------------------------------------------------------"
    Write-Host "Startup task '$TaskName' registered successfully!"
    Write-Host "It will run silently in the background when you log in."
    Write-Host ""
    Write-Host "To start it immediately, run:"
    Write-Host "  Start-ScheduledTask -TaskName '$TaskName'"
    Write-Host ""
    Write-Host "To remove it later, run:"
    Write-Host "  .\RegisterStartupTask.ps1 -Unregister"
    Write-Host "--------------------------------------------------------"
}
catch {
    Write-Error "Failed to register scheduled task: $_"
}
