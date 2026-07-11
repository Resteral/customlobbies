# ClipchampWatcher.ps1
# Monitors a folder for new media files and automatically opens them in Microsoft Clipchamp.

param (
    [string]$WatchFolder
)

# Set up default watch folder path if not provided
if (-not $WatchFolder) {
    # Check custom Syncthing path
    $syncthingPath = "S:\Videos"
    # Check OneDrive Pictures path
    $oneDrivePics = Join-Path $HOME "OneDrive\Pictures\Meta View"
    $localPics = Join-Path $HOME "Pictures\Meta View"
    
    if (Test-Path $syncthingPath) {
        $WatchFolder = $syncthingPath
    } elseif (Test-Path $oneDrivePics) {
        $WatchFolder = $oneDrivePics
    } elseif (Test-Path (Split-Path $oneDrivePics)) {
        # Create 'Meta View' folder inside OneDrive Pictures if OneDrive exists
        $WatchFolder = New-Item -ItemType Directory -Force -Path $oneDrivePics -ErrorAction SilentlyContinue
        if (-not $WatchFolder) { $WatchFolder = $oneDrivePics }
    } else {
        # Fall back to local Pictures folder
        if (-not (Test-Path $localPics)) {
            New-Item -ItemType Directory -Force -Path $localPics | Out-Null
        }
        $WatchFolder = $localPics
    }
}

# Resolve to absolute path
$WatchFolder = Resolve-Path $WatchFolder
Write-Host "--------------------------------------------------------"
Write-Host "Clipchamp Watcher Service Started"
Write-Host "Monitoring folder: $WatchFolder"
Write-Host "To stop the watcher, press Ctrl+C or close this window."
Write-Host "--------------------------------------------------------"

# Ensure the folder exists
if (-not (Test-Path $WatchFolder)) {
    New-Item -ItemType Directory -Force -Path $WatchFolder | Out-Null
}

# Helper: Wait for file to finish copying/downloading
function Wait-FileReady {
    param (
        [string]$Path,
        [int]$TimeoutSeconds = 60
    )
    $startTime = [DateTime]::Now
    $ready = $false
    while (-not $ready) {
        if (([DateTime]::Now - $startTime).TotalSeconds -gt $TimeoutSeconds) {
            Write-Host "[Watcher] Timeout waiting for file to download/copy: $Path"
            return $false
        }
        try {
            # Attempt to open file with exclusive access (fails if locked/copying)
            $fileStream = [System.IO.File]::Open($Path, 'Open', 'ReadWrite', 'None')
            $fileStream.Close()
            $ready = $true
        }
        catch {
            # File is locked, sleep and try again
            Start-Sleep -Milliseconds 500
        }
    }
    return $true
}

# Helper: Invoke "Edit with Clipchamp" verb
function Invoke-Clipchamp {
    param (
        [string]$Path
    )
    Write-Host "[Watcher] Sending file to Clipchamp: $(Split-Path $Path -Leaf)"
    try {
        $shell = New-Object -ComObject Shell.Application
        $folderPath = Split-Path $Path
        $fileName = Split-Path $Path -Leaf
        
        $folder = $shell.Namespace($folderPath)
        $item = $folder.ParseName($fileName)
        
        if ($item) {
            $verb = $item.Verbs() | Where-Object { $_.Name -eq "Edit with Clipchamp" }
            if ($verb) {
                $verb.DoIt()
                Write-Host "[Watcher] Clipchamp launched for: $fileName"
            } else {
                Write-Warning "[Watcher] 'Edit with Clipchamp' option not found. Please verify Clipchamp installation."
            }
        } else {
            Write-Error "[Watcher] Shell namespace failed to resolve file: $Path"
        }
    }
    catch {
        Write-Error "[Watcher] Shell COM invocation error: $_"
    }
}

# Supported video/image extensions
$allowedExtensions = @(".mp4", ".mov", ".jpg", ".jpeg", ".png")

# Set up the FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $WatchFolder
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

# Register file creation event
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $ext = [System.IO.Path]::GetExtension($path).ToLower()
    
    if ($allowedExtensions -contains $ext) {
        Write-Host "[Watcher] New file detected: $(Split-Path $path -Leaf)"
        # Wait for file lock to release
        if (Wait-FileReady -Path $path) {
            Invoke-Clipchamp -Path $path
        }
    }
}

$createdEvent = Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action

# Run loop to keep the process alive
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    # Clean up event registration on exit
    Unregister-Event -SourceIdentifier $createdEvent.Name -ErrorAction SilentlyContinue
    $watcher.Dispose()
    Write-Host "[Watcher] Watcher service stopped."
}
