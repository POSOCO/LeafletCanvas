# LeafletCanvas
Data Visualization with Leaflet Library

The link for the app demo is [here](https://posoco.github.io/LeafletCanvas)

## Todos
1. Label layer that displays the names of cities and substations should be above the visualization layer. So the layers order should be map tiles, visualization layer, label layer, marker layer
2. Load different tiles that can load various useful information like real time weather data onto the map --done with openweathermaps(OWM)
3. Store the tiles offline and use them
4. Calculate source boundaries till voltage error is as less as 1kV and then find the pixel intensities around the source to save computation time and processing
5. Create a slider that acts as a playback seeker for the Cached Images playback -- done
6. Update PU voltages also in the sources table while doing the cached image playback
7. Dismiss all currently running renderer workers if a new renderer worker is initiated --DONE BY USING A SINGLE GLOBAL WORKER
8. Get the render worker status from worker itself instead of getting from a global variable
9. Solve Canvas placement problem if a renderer worker is already working a new renderer is initiated
