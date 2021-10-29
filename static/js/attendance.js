const url = window.location.href.split('/');
const protocol = url[0];
const domain = url[2];

// attendance camera
function start_video(){

}
Webcam.set({
    width: 600,
    height: 400,
    image_format: "jpg",
    jpeg_quality: 90
})

Webcam.attach("#camera_attendance")

// mark attendance
$("#mark_attendance").on("click", function () {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    var subject = $('#subject').val();

    console.log(subject)
    // call mark_attendance function
    mark_attendance(subject, token);

});

function mark_attendance(subject, token) {

    Webcam.snap(function (data_uri) {
        let payload = {
            "url": `${$(location).attr('protocol')}//${domain}/mark_attendance/`,
            "method": "POST",
            "timeout": 0,
            "dataType": "json",
            "data": {
                "csrfmiddlewaretoken": token,
                'subject': subject,
                'image': data_uri
            }
        };
        // console.log(payload)
        $.ajax(payload)
            .done(function (response) {
                console.log(response);

                // add new attendance record to attendance table
                if (response['success'] === true) {
                    console.log('here')
                    // add attendance to table
                    $('#attendance_table').find('tbody').append(
                        `<tr>
                      <th scope="row">${response['attendance']['student']}</th>
                      <td>${response['attendance']['subject']}</td>
                      <td>${response['attendance']['timestamp']}</td>
                    </tr>`
                    );
                    // success alert
                    $('#notifications').empty().append(
                        `<div class="alert alert-success" role="alert">
                         Student <b> ${response['attendance']['student']}</b> Recognized!<br>
                         <small>${response['message']}</small>
                     </div>`
                    );
                } else {
                    // failed alert
                    $('#notifications').empty().append(
                        `
                     <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                          <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                          </symbol>
                    </svg>

                     <div class="alert alert-danger d-flex align-items-center" role="alert">
                      <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                      <div>
                         ${response['message']}
                      </div>
                    </div>`
                    );
                }
            })
            .error(function () {
                console.log('Error')
            });
    })
}

// get video element
video = document.getElementById('camera_attendance').getElementsByTagName("video")[0];

Promise.all([
    faceapi.net.tinyFaceDetector.loadFromUri('/models'),
    faceapi.net.faceLandmark68Net.loadFromUri('/models'),
    faceapi.net.faceRecognitionNet.loadFromUri('/models'),
]).then;

video.addEventListener('play', () => {
    console.log('its playing');
  // //create the canvas from video element as we have created above
  // const canvas = faceapi.createCanvasFromMedia(video);
  // //append canvas to body or the dom element where you want to append it
  // document.body.append(canvas)
  // // displaySize will help us to match the dimension with video screen and accordingly it will draw our detections
  // // on the streaming video screen
  // const displaySize = { width: video.width, height: video.height }
  // faceapi.matchDimensions(canvas, displaySize)
  // setInterval(async () => {
  //   const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
  //   const resizedDetections = faceapi.resizeResults(detections, displaySize)
  //   canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  //   faceapi.draw.drawDetections(canvas, resizedDetections)
  //   faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
  //   faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  // }, 100)
})
