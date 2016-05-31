//this piece of code does the errorloggin in the javascript

//there are two kind of events that result in error
//1. error that occurs due to the javascript sytanx this is captured by registering
//the window.onerror event.

//2. error that occurs during the ajax calls
//i,e if the url is incorrect or the api that is called throws a Exception
// at server side and is propogated to the client for this ajaxError event
//registered.


//following code involves custom error logging as well feel free to change is as
//per your needs.


window.onerror = function (errorMsg, url, lineNumber) {
    var errorMessage = "";
    errorMessage = "Message : " + errorMsg;
    errorMessage = errorMessage + "URL : " + url;
    errorMessage = errorMessage + "Line Number : " + lineNumber;
    console.log(errorMessage);
    if (appEnvironment() == "prod") {
        //ShowAlert('Oops Something went wrong', 'Kindly Contact IT Team');
        alert('Oops Something went wrong', 'Kindly Contact IT Team');
    }
    else {
        alert('Oops Something went wrong', 'Kindly Contact IT Team' + errorMessage);
    }

};

$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
    var errorMessage = "";
    if (event && event != undefined && event.type != undefined) {
      //event.type='error' if there are issues like url incorrect,method not found
        if (event.type.toLowerCase() == "error") {
            if (jqxhr && jqxhr != undefined) {
                if (jqxhr.responseText.indexOf('<title>') > 0) {
                    errorMessage = "Message :" + jqxhr.responseText.split('<title>')[0].split('</title>')[0].toString();
                }
            }
        }
        //this type if there is any code error in the server
        else if (event.type.toLowerCase() == "ajaxerror") {
            if (jqxhr && jqxhr != undefined) {
                var parsedError = JSON.parse(jqxhr.responseText);

                if (parsedError.ExceptionType) {
                    errorMessage = errorMessage + "Exception Type : " + parsedError.ExceptionType;
                }
                if (parsedError.ExceptionType) {
                    errorMessage = errorMessage + " Message : " + parsedError.Message;
                }
                if (parsedError.StackTrace) {
                    errorMessage = errorMessage + " Stack Trace : " + parsedError.StackTrace;
                }
            }
        }
        else {
            errorMessage = errorMessage + " Message : " + jqxhr.responseText;

        }
    }

    if (settings && settings != undefined && settings.url) {

        errorMessage = errorMessage + " URL : " + settings.url;
    }

    if (settings && settings != undefined && settings.data) {

        errorMessage = errorMessage + " Data : " + settings.data;
    }

    if (thrownError && thrownError != undefined) {
        errorMessage = errorMessage + " Error : " + thrownError;
    }
    // alert(errorMessage);
    ErrorLogging(errorMessage);
});

function ErrorLogging(errorMessage) {
    try {

        $.ajax({
            type: "POST", /*method type*/
            contentType: "application/json; charset=utf-8",
            url: '/WebAPI/services.asmx/TraceLog', /*Target function that will be return result*/
            data: JSON.stringify({ errorMessage: errorMessage }),
            dataType: "json",
            success: function (data) {
                //  console.log(data.d);
            },
            error: function (result) {
                // console.log(e);
            }
        });
    } catch (e) {
        //  console.log(e);
    }
}
