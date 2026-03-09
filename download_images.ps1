# Robust PowerShell script to download images, bypassing SSL/DNS issues
if (!(Test-Path -Path "frontend/public/images")) {
    New-Item -ItemType Directory -Path "frontend/public/images"
}

Write-Host "Downloading images from Unsplash (with SSL/DNS bypass)..."

# Skip certificate check for the session
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }

$images = @{
    "college-hero.jpg" = "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1600&q=80"
    "event-auditorium.jpg" = "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"
    "workshop-event.jpg" = "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
    "group-photo.jpg" = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
    "conference-event.jpg" = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
    "sports-event.jpg" = "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80"
    "registration.jpg" = "https://images.unsplash.com/photo-1454165833767-02a9e406f0a5?auto=format&fit=crop&w=1200&q=80"
    "team-collab.jpg" = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
    "campus-icon.jpg" = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80"
    "event-icon.jpg" = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80"
    "student-icon.jpg" = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80"
    "teacher-icon.jpg" = "https://images.unsplash.com/photo-1524178232363-1fb28f74b0cd?auto=format&fit=crop&w=400&q=80"
    "admin-icon.jpg" = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80"
    "event-celebration.jpg" = "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80"
    "gallery-1.jpg" = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80"
    "gallery-2.jpg" = "https://images.unsplash.com/photo-1523050853051-be991f85a6ad?auto=format&fit=crop&w=1200&q=80"
    "gallery-3.jpg" = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80"
}

foreach ($filename in $images.Keys) {
    $url = $images[$filename]
    $outPath = "frontend/public/images/$filename"
    Write-Host "Downloading $filename..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outPath -ErrorAction Stop
    } catch {
        Write-Warning "Failed to download $filename. Error: $($_.Exception.Message)"
    }
}

Write-Host "Download process finished. Check frontend/public/images/ for files."

