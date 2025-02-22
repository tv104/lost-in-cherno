import image1 from './panoramas/1.webp'
import image6 from './panoramas/6.webp' // iconic
import image7 from './panoramas/7.webp' // coast view
import image8 from './panoramas/8.webp'
import image9 from './panoramas/9.webp'
import image11 from './panoramas/11.webp'
import image12 from './panoramas/12.webp' // on haystack
import image14 from './panoramas/14.webp'
import image15 from './panoramas/15.webp'
import image16 from './panoramas/16.webp' // railroad
import image17 from './panoramas/17.webp'
import image18 from './panoramas/18.webp' // I guss
import image19 from './panoramas/19.webp'
import image20 from './panoramas/20.webp' // nice from forest
import image21 from './panoramas/21.webp' // nice forest road
import image22 from './panoramas/22.webp'
import image23 from './panoramas/23.webp'
import image25 from './panoramas/25.webp' 
import image26 from './panoramas/26.webp'
import image27 from './panoramas/27.webp' // long road in forest with mil
import image28 from './panoramas/28.webp'
import image32 from './panoramas/32.webp' // nice rooftop
import image33 from './panoramas/33.webp'
import { LatLngTuple } from 'leaflet'

export type ScreenshotLocationConfig = {
    id: string;
    image: string;
    location: LatLngTuple;
}

export const locations: ScreenshotLocationConfig[] = [
    { id: "1", image: image1, location: [0, 0] },
    { id: "6", image: image6, location: [0, 0] },
    { id: "7", image: image7, location: [0, 0] },
    { id: "8", image: image8, location: [0, 0] },
    { id: "9", image: image9, location: [0, 0] },
    { id: "11", image: image11, location: [0, 0] },
    { id: "12", image: image12, location: [0, 0] },
    { id: "14", image: image14, location: [0, 0] },
    { id: "15", image: image15, location: [0, 0] },
    { id: "16", image: image16, location: [0, 0] },
    { id: "17", image: image17, location: [0, 0] },
    { id: "18", image: image18, location: [0, 0] },
    { id: "19", image: image19, location: [0, 0] }, 
    { id: "20", image: image20, location: [0, 0] },
    { id: "21", image: image21, location: [0, 0] }, 
    { id: "22", image: image22, location: [0, 0] },
    { id: "23", image: image23, location: [0, 0] },
    { id: "25", image: image25, location: [0, 0] },
    { id: "26", image: image26, location: [0, 0] },
    { id: "27", image: image27, location: [0, 0] },
    { id: "28", image: image28, location: [0, 0] },
    { id: "32", image: image32, location: [0, 0] },
    { id: "33", image: image33, location: [0, 0] }
]
