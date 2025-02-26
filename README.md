# Lost in Cherno | DayZ GeoGuessr

[gameplay.webm](https://github.com/user-attachments/assets/3cfe999a-ff12-4e2c-ba0d-55d09971afc1)

- A frontend prototype
- Over 30 Chernarus locations
- Lacks touch/mobile support
- Deployed on [GitHub Pages](https://tv104.github.io/lost-in-cherno/)
- Under development until I get bored

## Development

Mainly built with react, typescript, and theme-ui

```bash
npm install
npm run dev
```

### Generating map tiles

Source image was `15161px x 15161px` (after cropping) originally downloaded via [DayZ-Map-DL](https://github.com/Samg381/DayZ-Map-DL) by Samg381.

[GDAL](https://gdal.org/) was used to generate tiles:

```bash
gdal2tiles -p raster -z 0-6 -w none --xyz input.png output_folder
```

### Compressing images

`webp` format at 90% compression seems to give best quality vs size. Use any compression you like, I used [ImageMagick](https://imagemagick.org/)

```powershell
# Convert all PNGs to WebP:
Get-ChildItem -Path . -Filter *.png -Recurse | ForEach-Object { magick convert $_.FullName -quality 90 "$($_.DirectoryName)\$($_.BaseName).webp" }
# Remove PNGs:
Get-ChildItem -Path . -Filter *.png -Recurse | Remove-Item -Force
```

### Stitching a panorma image

Screenshots taken ingame - best to use freecam mode to avoid character movements and shadows.
I used [Hugin - Panoramo editor](https://hugin.sourceforge.io/) to stitch them together.

## Contributions & License

Contributions in the form of enhancements, new locations, and maps are welcomed. This project is open source and you're free to modify it, but for any commercial applications please reach out (see [LICENSE.md](LICENSE.md)).

This project would not have been possible without the following things and [more](./package.json)

- [DayZ](https://dayz.com) by Bohemia Interactive
- [DayZ Satellite map](https://dayz.ginfo.gg/) by iZurvive
- [iZurvive map downloader](https://github.com/Samg381/DayZ-Map-DL) by Samg381
- [Suno](https://suno.com/) for generated background music
