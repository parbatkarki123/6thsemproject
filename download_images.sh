#!/bin/bash
# Robust shell script to download images, bypassing SSL/DNS issues
mkdir -p frontend/public/images

echo "Downloading images from Unsplash (with SSL/DNS bypass)..."

# Use -k to ignore SSL errors and --retry for DNS issues
DOWNLOAD_CMD="curl -Lk --retry 3 --retry-delay 2 --compressed"

$DOWNLOAD_CMD "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1600&q=80" -o frontend/public/images/college-hero.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/event-auditorium.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/workshop-event.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/group-photo.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/conference-event.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/sports-event.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1454165833767-02a9e406f0a5?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/registration.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/team-collab.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80" -o frontend/public/images/campus-icon.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80" -o frontend/public/images/event-icon.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80" -o frontend/public/images/student-icon.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1524178232363-1fb28f74b0cd?auto=format&fit=crop&w=400&q=80" -o frontend/public/images/teacher-icon.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80" -o frontend/public/images/admin-icon.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/event-celebration.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/gallery-1.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1523050853051-be991f85a6ad?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/gallery-2.jpg
$DOWNLOAD_CMD "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80" -o frontend/public/images/gallery-3.jpg

echo "Images downloaded successfully to frontend/public/images/"

