const url = window.location.href.split('/');
const protocol = url[0];
const domain = url[2];

// camera register
Webcam.set({
    width: 600,
    height: 400,
    image_format: "jpg",
    jpeg_quality: 90
})

Webcam.attach("#camera")


// register
$("#take_images").on("click", function () {
    var reg_no = $("#reg_no").val();
    var name = $("#std_name").val();
    var token = $('input[name="csrfmiddlewaretoken"]').val();

    let payload = {
        "url": `${$(location).attr('protocol')}//${domain}/register/`,
        "method": "POST",
        "timeout": 0,
        "dataType": "json",
        "data": {
            "csrfmiddlewaretoken": token,
            'reg_no': reg_no,
            'name': name
        }
    };

    // console.log('BTN CLICKED!');
    $.ajax(payload)
        .done(function (response) {
            var id = response['id'];
            // get 30 pics
            for (i = 0; i < 30; i++) {
                take_snapshot(id, token);
            }
            // image takien alert
            $('#notifications').empty().append(
                `<div class="alert alert-success d-flex align-items-center" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
                        <use xlink:href="#check-circle-fill"/>
                    </svg>
                    <div>
                        Pictures taken successfully.
                    </div>
                </div>`
            )
        })
        .error(function () {
            console.log('Error')
            // failed alert
            $('#notifications').empty().append(
                `<div class="alert alert-danger d-flex align-items-center" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                        <div>
                            Failed to take image! Please fill the details!
                        </div>
                 </div>`
            )
        });
});

// snap shot taking
function take_snapshot(id, token) {

    Webcam.snap(function (data_uri) {
        let payload = {
            "url": `${$(location).attr('protocol')}//${domain}/student_image/`,
            "method": "POST",
            "timeout": 0,
            "dataType": "json",
            "data": {
                "csrfmiddlewaretoken": token,
                'student': id,
                'image': data_uri
            }
        };

        $.ajax(payload)
            .done(function (response) {
                console.log(response);
            })
            .error(function () {
                console.log('Error')
            });
    })
}
