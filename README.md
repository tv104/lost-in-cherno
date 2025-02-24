# Lost in Cherno

A front-end prototype for a DayZ GeoGuessr.

## Development

```bash
npm install
npm run dev
```

### Generating map tiles

Depends on [GDAL](https://gdal.org/)

```bash
# Generate tiles:
gdal2tiles -p raster -z 0-6 -w none --xyz input.png output_folder
```

### Compressing images

Depends on [ImageMagick](https://imagemagick.org/)

```powershell
# Convert all PNGs to WebP:
Get-ChildItem -Path . -Filter *.png -Recurse | ForEach-Object { magick convert $_.FullName -quality 90 "$($_.DirectoryName)\$($_.BaseName).webp" }
# Remove PNGs:
Get-ChildItem -Path . -Filter *.png -Recurse | Remove-Item -Force
```

### Generating a panorma image

Use [Hugin - Panoramo editor](https://hugin.sourceforge.io/)

## Credits

This project would not have been possible without the following resources:

- [DayZ](https://dayz.com/) by Bohemia Interactive
- [Satellite map](https://dayz.ginfo.gg/) by iZurvive
- [iZurvive map downloader](https://github.com/Samg381/DayZ-Map-DL) by Samg381
- [Hugin](https://hugin.sourceforge.io/) for panorama stitching
- [ImageMagick](https://imagemagick.org/) for image compression
- [GDAL](https://gdal.org/) for tile generation
- [Leaflet.js](https://leafletjs.com/) for map library
- [Suno](https://suno.com/) for music generation
