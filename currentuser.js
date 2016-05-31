// call the method currentUserDetails.init() in the master script
//of your file and you will be able to access the variables through out
// application where the master script is referred.
//eg: currentUserDetails.GetEmpId();


//for simplicity i've called it in the page ready

$(function (){
currentUserDetails.init();
});


//Get the cookie by its key
var GetCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].split('=');
        if (c[0].toLowerCase().trim() == cname.toLowerCase().trim()) {
            return decodeURIComponent(c[1]).replaceAll('+', " ");
        }

    }
    return "";
};

//Set the cookie value by it's key
function SetCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + encodeURI(cvalue) + ";" + expires;
}

//check if the cookie is present or not
function CheckCookie(cname) {
    var cookieValue = GetCookie(cname);
    if (cookieValue != '' && cookieValue != null) {
        return true;
    }
    else {
        return false;
    }
}

//currentuser object
function CurrentUser() {
    this.EmpId;
    this.EmpName;
    this.EmpLogin;
    this.EmpDeptName;
    this.EmpGender;
}

//fuction that encapsulates the current user details by fetching it from the cookie
var currentUserDetails = (function () {
    var _outPutValue = true;
    var _currentUserId;
    var _cookieKey;
    var _userDetails = new CurrentUser();
    var _setcookieKey = function (currentUserId) {
        this._currentUserId = currentUserId;
        this._cookieKey = "userDetails" + this._currentUserId;
    };



    var _checkCookies = function (currentUserId) {
        var cookieValue;
        _setcookieKey(currentUserId);
        if (!CheckCookie(this._cookieKey)) {
            _setUserDetailsToCookie();
        }

        cookieValue = GetCookie(this._cookieKey);
        if (cookieValue.length > 0) {
            var parsedData = JSON.parse(cookieValue);
            if (parsedData != null) {
                _userDetails.EmpId = parsedData.ID_NO;
                _userDetails.EmpName = parsedData.NAME;
                _userDetails.EmpADLogin = parsedData.DOMAIN_USER;
                _userDetails.EmpGenderCode = parsedData.GENDER_CODE;
                _userDetails.EmpDeptName = parsedData.DEPT;
            }
        }
        return this._userDetails;
    };

    var _setUserDetailsToCookie = function () {
        try {

            $.ajax({
                type: "POST", /*method type*/
                contentType: "application/json; charset=utf-8",
                url: '/WebAPI/UserInfo.asmx/GetCurrentUserInfo', /*Target function that will be return result*/
                data: JSON.stringify({ currentUserId: this._currentUserId }),
                dataType: "json",
                success: function (data) {
                    //var parsedData = JSON.parse(data.d);
                    SetCookie(this._cookieKey, data.d);
                },
                error: function (result) {

                }
            });
        } catch (e) {

        }
    };

    var _initializeControls = function () {
      //pass the current username to fetch the details
        this._userDetails = _checkCookies('testuser');
        if (this._userDetails == undefined || this._userDetails == null) {
            return;
        }
    };

    var _loadValues = function (userProperty) {
        return userProperty
    };

    return {
        init: function () { _initializeControls() },
        GetEmpId: function () {
            return _loadValues(_userDetails.EmpId);

        },
        GetEmpName: function () {
            return (_userDetails.EmpName);
        },

        GetEmpADLogin: function () {
            return (_userDetails.EmpADLogin);
        },
        GetEmpGenderCode: function () {
            return (_userDetails.EmpGenderCode);
        },
        GetEmpDeptName: function () { return (_userDetails.EmpDeptName); }
    };
})();
