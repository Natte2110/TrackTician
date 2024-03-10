$(document).ready(function () {
  $('.toggle').click(function () {
    let card = $(this).parent().parent();
    let remToPixel = parseFloat(getComputedStyle(document.documentElement).fontSize);
    let remainingHeight = $('.dashboard-wrapper').height() - (2 * remToPixel);

    if (Math.abs(parseInt(card.css('height')) - 32) < 2) {
      card.css('height', '50%');
      $(this).children().removeClass('fa-chevron-down').addClass('fa-chevron-up');
    } else {
      card.css('height', '2rem');
      $(this).children().removeClass('fa-chevron-up').addClass('fa-chevron-down');
    }

    const changeSibling = (siblingCard) => {
      if (Math.abs(parseInt(siblingCard.css('height')) - remainingHeight) < 2) {
        siblingCard.css('height', '50%');
      } else {
        siblingCard.css('height', remainingHeight + 'px');
      }
    };

    if (card.hasClass('map-card')) {
      changeSibling(card.siblings('.car-card'));
    } else if (card.hasClass('car-card')) {
      changeSibling(card.siblings('.map-card'));
    }
  });



  const pedalChartDiv = document.getElementById('pedal-chart').getContext('2d');
  const pedalChart = new Chart(pedalChartDiv, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Throttle',
        data: [],
        backgroundColor: 'rgba(55, 195, 55, 0.8)',
        borderWidth: 1,
        fill: true
      }, {
        label: 'Brake',
        data: [],
        backgroundColor: 'rgba(195, 55, 55, 0.8)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          suggestedMax: 100,
          suggestedMin: -100,
          beginAtZero: false,
          title: {
            display: true,
            text: 'Percentage'
          },
          stacked: true
        },
        x: {
          title: {
            display: true,
            text: 'Time'
          }
        }
      }
    }
  });

  const speedChartDiv = document.getElementById('speed-chart').getContext('2d');
  const speedChart = new Chart(speedChartDiv, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'RPM',
        data: [],
        borderColor: 'rgba(226, 191, 35, 1)',
        backgroundColor: 'rgba(226, 191, 35, 0.8)',
        yAxisID: 'rpmAxis',
        borderWidth: 1
      }, {
        label: 'Speed',
        data: [],
        borderColor: 'rgba(35, 130, 226, 1)',
        backgroundColor: 'rgba(35, 130, 226, 0.8)',
        yAxisID: 'speedAxis',
        borderWidth: 1,
      }]
    },
    options: {
      scales: {
        rpmAxis: {
          suggestedMax: 14000,
          position: 'left',
          title: {
            display: true,
            text: 'RPM'
          },
          ticks: {
            beginAtZero: true
          }
        },
        speedAxis: {
          suggestedMax: 350,
          position: 'right',
          title: {
            display: true,
            text: 'Speed (km/h)'
          },
          ticks: {
            beginAtZero: true
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time'
          }
        }
      }
    }
  });

  const clearCharts = () => {
    /** 
    * Clears the data on the two charts under car tracking.
    */
    pedalChart.data.labels = [];
    pedalChart.data.datasets[0].data = [];
    pedalChart.data.datasets[1].data = [];

    speedChart.data.labels = [];
    speedChart.data.datasets[0].data = [];
    speedChart.data.datasets[1].data = [];
  }
  let driverNumber;

  $('.follow-driver').click(function () {
    $('.follow-driver').prop("checked", false);
    $(this).prop("checked", true);
    driverNumber = $(this).attr("id")
    clearCharts();
    let parentDriver = $(this).closest('.driver').clone();
    parentDriver.find('.follow-button').remove();
    $('#charts').find('.driver').remove();
    $('#charts').prepend(parentDriver);
  });

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

  let intervalMiliseconds = 500;

  getSessionData()
    .then(function (response) {

      if (response) {
        response.date_start = new Date(response.date_start);
        let endTime = new Date(response.date_start.getTime() + 30 * 60000);

        let isoStartTime = response.date_start.toISOString().slice(0, -5);
        let isoEndTime = endTime.toISOString().slice(0, -5);
        isoStartTime = new Date(response.date_start);
        let isoCurrentTime = new Date(isoStartTime);
        let isoHalfSecondAhead = new Date(isoStartTime.getTime() + (intervalMiliseconds / 2));
        const updateDriverData = () => {
          isoCurrentTime.setMilliseconds(isoCurrentTime.getMilliseconds() + intervalMiliseconds);

          isoHalfSecondAhead.setTime(isoCurrentTime.getTime() + (intervalMiliseconds / 2));

          const isoCurrentTimeString = isoCurrentTime.toISOString();
          const isoHalfSecondAheadString = isoHalfSecondAhead.toISOString();
          if (driverNumber) {
            fetch(`https://api.openf1.org/v1/car_data?session_key=${response.session_key}&driver_number=${driverNumber}&date>${isoCurrentTimeString}&date<${isoHalfSecondAheadString}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                if (data.length !== 0) {
                  fetch(`https://api.openf1.org/v1/stints?session_key=${response.session_key}&driver_number=${driverNumber}&lap_start=1`)
                    .then(response => {
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                      }
                      return response.json();
                    }).then(result => {
                      $('#tyre-tracking').text(result[0].compound)
                    })
                  //
                  // console.log(data[0])
                  $('#gear-tracking').text(data[0].n_gear)
                  const throttle = data[0].throttle;
                  const brake = data[0].brake;
                  const speed = data[0].speed;
                  const rpm = data[0].rpm;
                  const date = new Date(data[0].date);
                  const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

                  // Update the chart with the new speed data
                  pedalChart.data.labels.push(time);
                  pedalChart.data.datasets[0].data.push(throttle);
                  pedalChart.data.datasets[1].data.push(-brake);

                  speedChart.data.labels.push(time);
                  speedChart.data.datasets[0].data.push(rpm);
                  speedChart.data.datasets[1].data.push(speed);

                  // Check if the number of data points exceeds 20
                  if (pedalChart.data.labels.length > 30) {
                    // Remove the oldest 5 data points from both datasets and labels
                    for (let i = 0; i < 5; i++) {
                      pedalChart.data.labels.shift();
                      pedalChart.data.datasets[0].data.shift();
                      pedalChart.data.datasets[1].data.shift();

                      speedChart.data.labels.shift();
                      speedChart.data.datasets[0].data.shift();
                      speedChart.data.datasets[1].data.shift();
                    }
                  }

                  // Update the chart
                  pedalChart.update();
                  speedChart.update();
                }
              })
          }
        }

        setInterval(updateDriverData, intervalMiliseconds);

      }
    })
    .catch(function (error) {
      // Handle any errors
      console.error('Error in .catch():', error);
    });
});



let handler = document.querySelector('.handler');
let wrapper = handler.closest('.dashboard-wrapper');
let boxA = wrapper.querySelector('.info-container');
let isHandlerDragging = false;

document.addEventListener('mousedown', function (e) {
  if (e.target === handler) {
    isHandlerDragging = true;
  }
});

document.addEventListener('mousemove', function (e) {
  if (!isHandlerDragging) {
    return false;
  }

  let containerOffsetLeft = wrapper.offsetLeft;

  let pointerRelativeXpos = e.clientX - containerOffsetLeft;

  let boxAminWidth = 200;

  boxA.style.width = (Math.max(boxAminWidth, pointerRelativeXpos - 8)) + 'px';
  boxA.style.flexGrow = 0;
});

document.addEventListener('mouseup', function (e) {
  isHandlerDragging = false;
});