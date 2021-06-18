$(document).ready(function () {

    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;
    var current = 1;
    var steps = $("fieldset").length;

    setProgressBar(current);

    $(".next").click(function () {

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //Add Class Active
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
        $("#progressbar strong").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({'opacity': opacity});
            },
            duration: 500
        });
        setProgressBar(++current);
    });

    $(".previous").click(function () {

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
        $("#progressbar strong").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();

        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({'opacity': opacity});
            },
            duration: 500
        });
        setProgressBar(--current);
    });

    function setProgressBar(curStep) {
        var percent = parseFloat(100 / steps) * curStep;
        percent = percent.toFixed();
        $(".progress-bar")
            .css("width", percent + "%")
    }

    $('#msform').on('submit', function(e) {
        e.preventDefault();
        var data = $("#msform :input").serializeArray();
        console.log(data);
        postData(data);
        $("h2").html("<b>Offerte is verstuurd!</b><br> Bedankt voor het gebruiken van Colours Match");
    });

    function convertStelling(stelling)
    {
        switch(stelling)
        {
            case "1": "Positief en kennen elkaar";break;
            case "2": "Veel discussie, gepaard met hevige emoties";break;
            case "3": "Teamleden vullen elkaaar aan en er wordt goed samengewerkt";break;
            case "4": "Komen dichter bij elkaar, nieuwe regels en normen worden vastgesteld.";break;
        }
    }

    function postData(form)
    {
        ZOHO.CREATOR.init()
            .then(function(data) {
                //https://www.zoho.com/creator/help/api/v2/add-records.html for signiature
                formData =
                {"data" :
                    {   "Training":form[0].value,
                        "Samenstelling": form[1].value,
                        "Training_methode": form[2].value,
                        "Stelling": convertStelling(form[3].value),
                        "Beschikbare_tijd": form[4].value,
                        "Deelnemers": Number(form[5].value),
                        "Contactpersoon": form[6].value,
                        "Organisatie_naam": form[7].value,
                        "Telefoonnummer": form[8].value,
                        "Email": form[9].value,
                    }
                }
                var config = {
                    formName : "Customer",
                    data : formData
                }
                console.log("PostingData");
                console.log(formData)

                ZOHO.CREATOR.API.addRecord(config)
                .then(function(response){
                    console.log("Response: ");
                    console.log(response);

                }).catch(function(data) {
                    console.log(data);
                });
    //get all records API
        });
    }
    $(':input[required]').on('keyup', function() {

        var currentIndex = $("fieldset").index(current_fs)
        var requiredClassName = '.required' + currentIndex
        var buttonNextID = '#next' + currentIndex
        var requiredFields = $(requiredClassName)
        var noEmptyFields = true;
        var red = '#msform input' + requiredFields;

        requiredFields.each(function() {
          if($(this).val().length == 0) {
              noEmptyFields = false;
          }
        });

        if(noEmptyFields){
            // $(buttonNextID).attr('disabled', false); //knop uit
            // $(buttonNextID).click(function() {
              $(buttonNextID).attr('disabled', false); //knop uit
              $(red).css('border-color','#ff0000');

            // });
        }else{
            $(buttonNextID).attr('disabled', 'disabled');
        }
    });
});
