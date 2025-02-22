# Lost in Cherno

A front-end prototype for a DayZ based GeoGuesser game.

Published to \_\_\_

## Development

### Generating map tiles

Depends on GDAL

```bash
# Generate tiles:
gdal2tiles -p raster -z 0-6 -w none --xyz input.png output_folder
```

### Generating a panorma image

Depends on Hugin

```bash
# Generate panorma:
hugin --stitching "C:\path\to\images" --output "C:\path\to\output.jpg"
```

### Compressing images

Depends on ImageMagick

```powershell
# Convert all PNGs to WebP:
Get-ChildItem -Path . -Filter *.png -Recurse | ForEach-Object { magick convert $_.FullName -quality 90 "$($_.DirectoryName)\$($_.BaseName).webp" }
# Remove PNGs:
Get-ChildItem -Path . -Filter *.png -Recurse | Remove-Item -Force
```

## Credits

This project would not have been possible without the following resources:

- ...
