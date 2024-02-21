require(["esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/support/ImageElement", "esri/layers/support/ExtentAndRotationGeoreference", "esri/geometry/Extent", "esri/layers/MediaLayer", "esri/geometry/Point", "esri/geometry/Polyline", "esri/symbols/SimpleLineSymbol", "esri/geometry/geometryEngine"], (Map, MapView, Graphic, ImageElement, ExtentAndRotationGeoreference, Extent, MediaLayer, Point, Polyline, SimpleLineSymbol) => {


    const createTrack = () => {
        return fetch('https://api.openf1.org/v1/location?session_key=9161&driver_number=81&date>2023-09-16T13:03:35.200&date<2023-09-16T13:05:35.800')
            .then(response => response.json())
            .then(jsonContent => {
                let paths = [];

                jsonContent.forEach(element => {
                    paths.push([element.x, element.y]);
                });

                let polyline = new Polyline({
                    paths: paths,
                    spatialReference: spatialReference
                });

                let lineSymbol = new SimpleLineSymbol({
                    color: [255, 255, 255],
                    width: 6
                });

                let polylineGraphic = new Graphic({
                    geometry: polyline,
                    symbol: lineSymbol
                });

                view.graphics.add(polylineGraphic);

                // Get the extent of the polyline graphic's geometry
                let polygonExtent = polylineGraphic.geometry.extent;
                return polygonExtent;
            });
    };

    const spatialReference = {
        wkid: 3857
    };

    const map = new Map({
        basemap: "dark-gray-vector"
    });

    const view = new MapView({
        center: [0, 0],
        container: "map-race",
        map: map,
        constraints: {
            rotationEnabled: false
        },
        spatialReference: spatialReference
    });

    view.when(() => {
        createTrack().then(extent => {
            view.goTo({
                target: extent,
            }, {
                duration: 0
            });
        });
        map.basemap.baseLayers.getItemAt(0).opacity = 0;
    });


    view.when(disableZooming);



/**
 * Disables all zoom gestures on the given view instance.
 *
 * @param {esri/views/MapView} view - The MapView instance on which to
 *                                  disable zooming gestures.
 */
    function disableZooming(view) {
        // Removes the zoom action on the popup
        view.popup.actions = [];

        // stops propagation of default behavior when an event fires
        function stopEvtPropagation(event) {
            event.stopPropagation();
        }

        // exlude the zoom widget from the default UI
        view.ui.components = ["attribution"];

        // disable mouse wheel scroll zooming on the view
        view.on("mouse-wheel", stopEvtPropagation);

        // disable zooming via double-click on the view
        view.on("double-click", stopEvtPropagation);

        // disable zooming out via double-click + Control on the view
        view.on("double-click", ["Control"], stopEvtPropagation);

        // disables pinch-zoom and panning on the view
        view.on("drag", stopEvtPropagation);

        // disable the view's zoom box to prevent the Shift + drag
        // and Shift + Control + drag zoom gestures.
        view.on("drag", ["Shift"], stopEvtPropagation);
        view.on("drag", ["Shift", "Control"], stopEvtPropagation);

        // prevents zooming with the + and - keys
        view.on("key-down", (event) => {
            const prohibitedKeys = ["+", "-", "Shift", "_", "=", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];
            const keyPressed = event.key;
            if (prohibitedKeys.indexOf(keyPressed) !== -1) {
                event.stopPropagation();
            }
        });

        return view;
    }




    // const extent = new Extent({
    //     xmin: view.center.x - xVal,
    //     ymin: view.center.y - yVal,
    //     xmax: view.center.x + xVal,
    //     ymax: view.center.y + yVal,
    //     spatialReference: spatialReference
    // });

    const extent = new Extent({
        xmin: -15400,
        ymin: -5000,
        xmax: 2850,
        ymax: 4700,
        spatialReference: spatialReference
    });

    /*************************
     * Create a point graphic
     *************************/

    // First create a point geometry (this is the location of the Titanic)


    // Create a symbol for drawing the point
    const markerSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [226, 119, 40],
        outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
        }
    };

    const imageElement = new ImageElement({
        image: "https://www.sportmonks.com/wp-content/uploads/2022/07/Marina-Bay-Street-Circuit.png",
        georeference: new ExtentAndRotationGeoreference({
            extent: extent
        })
    });

    const layer = new MediaLayer({
        source: imageElement,
        opacity: 1,
    });
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
});