# Image Replacement Project

This project replaces the original SVG illustrations with high-quality real images to enhance the site's aesthetic appeal.

## Instructions

Due to environment restrictions, the images could not be downloaded automatically. Please run the following script from the project root to download the optimized images:

```bash
# For Linux/macOS/Git Bash
chmod +x download_images.sh
./download_images.sh

# For Windows (PowerShell)
./download_images.ps1
```

## Troubleshooting

If the automatic download scripts fail with `Could not resolve host`, it means your terminal environment has restricted internet or DNS issues. 

### Option 1: Manual Download (Recommended)
Open your web browser and download each image manually into `frontend/public/images/` using the names below:

1.  **College Hero**: [Download](https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1600&q=80) -> `college-hero.jpg`
2.  **Auditorium**: [Download](https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80) -> `event-auditorium.jpg`
3.  **Workshop**: [Download](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80) -> `workshop-event.jpg`
4.  **Group Photo**: [Download](https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80) -> `group-photo.jpg`
5.  **Conference**: [Download](https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80) -> `conference-event.jpg`
6.  **Sports**: [Download](https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80) -> `sports-event.jpg`
7.  **Registration**: [Download](https://images.unsplash.com/photo-1454165833767-02a9e406f0a5?auto=format&fit=crop&w=1200&q=80) -> `registration.jpg`
8.  **Team Collab**: [Download](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80) -> `team-collab.jpg`
9.  **Celebration**: [Download](https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80) -> `event-celebration.jpg`
10. **Gallery 1**: [Download](https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80) -> `gallery-1.jpg`
11. **Gallery 2**: [Download](https://images.unsplash.com/photo-1523050853051-be991f85a6ad?auto=format&fit=crop&w=1200&q=80) -> `gallery-2.jpg`
12. **Gallery 3**: [Download](https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80) -> `gallery-3.jpg`

### Option 2: Check DNS
Try adding `8.8.8.8` to your DNS settings or run:
```bash
# In Git Bash
export CURL_CA_BUNDLE=""
```
(Note: This is not recommended for production but can bypass some local certificate issues).

## Fallback System
I have implemented a fallback system in the code. If the high-quality images are missing, the site will automatically revert to the original SVG illustrations, ensuring it remains fully functional and looks good even without the new photos.
