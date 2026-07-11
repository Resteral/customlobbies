<#
.SYNOPSIS
    Cleans up unused build artifacts, package dependencies, and caches in the workspace.
.DESCRIPTION
    Scans the current workspace for common heavy directories (node_modules, .next, bin, obj, .vs, dist),
    calculates their sizes, and deletes them to free up disk space.
.PARAMETER Clean
    If specified, performs the deletion of identified directories after confirmation.
.PARAMETER Force
    If specified along with -Clean, skips the user confirmation prompt.
.PARAMETER DryRun
    Scans and shows target directories and sizes without deleting anything (default behavior).
.EXAMPLE
    .\clean-workspace.ps1
    Scans and shows what would be deleted.
.EXAMPLE
    .\clean-workspace.ps1 -Clean
    Scans and asks for confirmation before deleting.
.EXAMPLE
    .\clean-workspace.ps1 -Clean -Force
    Scans and deletes folders immediately without prompting.
#>

[CmdletBinding(DefaultParameterSetName = "DryRun")]
param(
    [Parameter(ParameterSetName = "Clean")]
    [Switch]$Clean,

    [Parameter(ParameterSetName = "Clean")]
    [Switch]$Force,

    [Parameter(ParameterSetName = "DryRun")]
    [Switch]$DryRun
)

$ErrorActionPreference = "SilentlyContinue"

# List of target directory names to clean
$TargetNames = @("node_modules", ".next", "bin", "obj", ".vs", "dist")

function Get-CleanTargets {
    param(
        [string]$Path,
        [string[]]$Targets
    )
    
    try {
        $items = Get-ChildItem -Path $Path -Directory -Force
    } catch {
        return
    }

    foreach ($item in $items) {
        # Skip certain system/hidden folders to be safe
        if ($item.Name -eq ".git" -or $item.Name -eq ".github" -or $item.Name -eq ".agents" -or $item.Name -eq ".gemini") {
            continue
        }

        if ($Targets -contains $item.Name) {
            # Target matched. Return it and stop recursing in this branch.
            $item
        } else {
            # Recurse further down
            Get-CleanTargets -Path $item.FullName -Targets $Targets
        }
    }
}

function Get-DirectorySize {
    param([string]$Path)
    
    $files = Get-ChildItem -Path $Path -File -Recurse -Force
    $size = 0
    if ($files) {
        $size = ($files | Measure-Object -Property Length -Sum).Sum
    }
    return [long]$size
}

function Format-Size {
    param([long]$Bytes)
    
    if ($Bytes -ge 1GB) {
        "{0:N2} GB" -f ($Bytes / 1GB)
    } elseif ($Bytes -ge 1MB) {
        "{0:N2} MB" -f ($Bytes / 1MB)
    } elseif ($Bytes -ge 1KB) {
        "{0:N2} KB" -f ($Bytes / 1KB)
    } else {
        "$Bytes Bytes"
    }
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "       Workspace Storage Cleanup         " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Scanning workspace starting from: $PSScriptRoot`n" -ForegroundColor Gray

$foundTargets = Get-CleanTargets -Path $PSScriptRoot -Targets $TargetNames

if ($null -eq $foundTargets -or $foundTargets.Count -eq 0) {
    Write-Host "No build, cache, or dependency folders found to clean." -ForegroundColor Green
    return
}

# Collect directory details and calculate sizes
$totalBytes = 0
$targetData = @()

Write-Host "Calculating folder sizes..." -ForegroundColor Yellow

foreach ($target in $foundTargets) {
    $size = Get-DirectorySize -Path $target.FullName
    $totalBytes += $size
    
    $targetData += [PSCustomObject]@{
        Path = $target.FullName.Replace($PSScriptRoot, ".")
        FullPath = $target.FullName
        Type = $target.Name
        SizeBytes = $size
        FormattedSize = Format-Size -Bytes $size
    }
}

# Sort by size descending
$targetData = $targetData | Sort-Object SizeBytes -Descending

# Print results table
Write-Host "`nTarget Directories Found:" -ForegroundColor Cyan
$targetData | Format-Table -Property Path, Type, FormattedSize

Write-Host "Total space occupied: $(Format-Size -Bytes $totalBytes)`n" -ForegroundColor Yellow

# Decide action
if ($Clean) {
    if (-not $Force) {
        $title = "Confirm Cleanup"
        $message = "Do you want to permanently delete the folders listed above? (This will delete node_modules, build directories, and caches)"
        $choices = [System.Management.Automation.Host.ChoiceDescription[]]@(
            (New-Object System.Management.Automation.Host.ChoiceDescription "&Yes", "Delete all listed folders"),
            (New-Object System.Management.Automation.Host.ChoiceDescription "&No", "Cancel operations")
        )
        
        $decision = $host.ui.PromptForChoice($title, $message, $choices, 1)
        if ($decision -ne 0) {
            Write-Host "Cleanup cancelled." -ForegroundColor Yellow
            return
        }
    }

    Write-Host "Starting deletion..." -ForegroundColor Cyan
    $deletedCount = 0
    $freedBytes = 0

    foreach ($item in $targetData) {
        Write-Host "Deleting: $($item.Path)... " -NoNewline -ForegroundColor Gray
        try {
            Remove-Item -Path $item.FullPath -Recurse -Force -ErrorAction Stop
            Write-Host "DONE" -ForegroundColor Green
            $deletedCount++
            $freedBytes += $item.SizeBytes
        } catch {
            Write-Host "ERROR: $_" -ForegroundColor Red
        }
    }

    Write-Host "`nCleanup Complete!" -ForegroundColor Green
    Write-Host "Deleted $deletedCount of $($targetData.Count) folders." -ForegroundColor Green
    Write-Host "Freed $(Format-Size -Bytes $freedBytes) of disk space." -ForegroundColor Green
} else {
    Write-Host "To execute the deletion and clean these folders, run the script with the -Clean switch:" -ForegroundColor Gray
    Write-Host "  .\clean-workspace.ps1 -Clean" -ForegroundColor Green
}
