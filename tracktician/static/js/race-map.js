require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/symbols/SimpleLineSymbol",
  "esri/layers/GraphicsLayer",
], (
  Map,
  MapView,
  Graphic,
  Point,
  Polyline,
  SimpleLineSymbol,
  GraphicsLayer,
) => {
  const trackLayer = new GraphicsLayer()
  const createTrack = (start, finish, sessionID, driverNumber) => {
    return fetch(
      `https://api.openf1.org/v1/location?session_key=${sessionID}&driver_number=${driverNumber}&date>${start}&date<${finish}`
    )
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

        trackLayer.graphics.add(polylineGraphic);
        map.layers.add(trackLayer)
        // Get the extent of the polyline graphic's geometry
        let polygonExtent = polylineGraphic.geometry.extent;
        trackExtent = polygonExtent;
        return polygonExtent;
      });
  };

  async function getSessionData() {
    try {
      let queryString = window.location.search;
      let params = new URLSearchParams(queryString);

      let sessionID = params.get('sessionID');
      if (sessionID) {
        console.log(sessionID);

        let response = await $.ajax({
          url: '/get-session',
          type: 'GET',
          data: {
            sessionID: sessionID
          }
        });

        console.log('Session data:', response);

        return response;
      } else {
        return false;
      }

    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

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
  let trackExtent;
  let intervalMiliseconds = 500;
  view.when(() => {
    getSessionData()
      .then(function (response) {
        if (response) {
          response.date_start = new Date(response.date_start);
          let endTime = new Date(response.date_start.getTime() + 30 * 60000);

          let isoStartTime = response.date_start.toISOString().slice(0, -5);
          let isoEndTime = endTime.toISOString().slice(0, -5);

          createTrack(isoStartTime, isoEndTime, response.session_key, response.drivers[0].driver_number).then(extent => {
            view.goTo(
              {
                target: extent
              },
              {
                duration: 0
              }
            );
            const mapRace = $("#map-race")[0];
            const observer = new ResizeObserver(entries => {
              entries.forEach(entry => {
                setTimeout(function () {
                  view.goTo(
                    {
                      target: trackExtent
                    },
                    {
                      duration: 0
                    }
                  );
                }, 500);
              });
            });

            let drivers = response.drivers;
            // Iterate over each driver in the drivers array
            drivers.forEach(driver => {
              // Create a point geometry at coordinates (0, 0)
              const point = new Point({
                x: 0,
                y: 0,
                spatialReference: spatialReference
              });

              const pointGraphic = new Graphic({
                geometry: point,
                attributes: {
                  driverNumber: driver.driver_number,
                  teamColor: driver.team_colour
                },
                symbol: {
                  type: "simple-marker",
                  color: `#${driver.team_colour}`,
                  size: 10
                }
              });
              // Add the point graphic to the map
              view.graphics.add(pointGraphic);
            });
            console.log(view.graphics)
            let isoStartTime = new Date(response.date_start);
            let isoCurrentTime = new Date(isoStartTime);
            let isoHalfSecondAhead = new Date(isoStartTime.getTime() + (intervalMiliseconds / 2));
            const updateDriverLocations = () => {
              isoCurrentTime.setMilliseconds(isoCurrentTime.getMilliseconds() + intervalMiliseconds);

              isoHalfSecondAhead.setTime(isoCurrentTime.getTime() + (intervalMiliseconds / 2)); // Half the increment

              const isoCurrentTimeString = isoCurrentTime.toISOString();
              const isoHalfSecondAheadString = isoHalfSecondAhead.toISOString();
              drivers.forEach(driver => {
                const pointGraphic = view.graphics.find(graphic => graphic.attributes && graphic.attributes.driverNumber === driver.driver_number);
                fetch(`https://api.openf1.org/v1/location?session_key=${response.session_key}&driver_number=${driver.driver_number}&date>${isoCurrentTimeString}&date<${isoHalfSecondAheadString}`)
                  .then(response => {
                    if (!response.ok) {
                      throw new Error('Network response was not ok');
                    }
                    return response.json();
                  })
                  .then(data => {
                    if (data.length !== 0) {
                      const x = data[0].x;
                      const y = data[0].y;
                      pointGraphic.geometry = new Point({
                        x: x,
                        y: y,
                        spatialReference: spatialReference
                      });
                    }
                  })
              });
            }

            setInterval(updateDriverLocations, intervalMiliseconds);
            observer.observe(mapRace);
          });
        }
        map.basemap.baseLayers.getItemAt(0).opacity = 0;

      })
      .catch(function (error) {
        console.error('Error in .catch():', error);
      });
  });

  view.when(disableZooming);

  $('.follow-driver').click(function () {
    driverNumber = $(this).attr("id")
    console.log(driverNumber)
    view.graphics.items.forEach(function (graphic) {
      console.log(graphic)
      if (graphic.attributes.driverNumber == driverNumber) {
        graphic.symbol.outline.width = 2
        graphic.symbol.size = 20;
      } else {
        graphic.symbol.outline.width = 0.75
        graphic.symbol.size = 10;
      }
    });
  });

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
    view.on("key-down", event => {
      const prohibitedKeys = [
        "+",
        "-",
        "Shift",
        "_",
        "=",
        "ArrowUp",
        "ArrowDown",
        "ArrowRight",
        "ArrowLeft"
      ];
      const keyPressed = event.key;
      if (prohibitedKeys.indexOf(keyPressed) !== -1) {
        event.stopPropagation();
      }
    });

    return view;
  }

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
});
