//hide or show the control base on the permission and current logged in user.
// just add the tag set-perm='permissionKey' to the controls you want to hide/show
// the following code will pick the current user and the permission key and get the
// value from api service either true/false and sets the control visibility.

//can extend this functionality to make readonly or other visual effects.

//for simplicity i've called it in the page ready

$(function (){
userPermission.init();
});


//Get the cookie by its key
var GetCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].split('=');
        if (c[0].toLowerCase().trim() == cname.toLowerCase().trim()) {
            return decodeURIComponent(c[1]);
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


var userPermission = (function () {
    var _outPutValue = true;
    var _permissionKey;
    var _currentUserId;
    var _cookieKey;
    var _checkPermissionKey = function (currentUserId) {
        if (currentUserId.length == 0) {
            return;
        }
        else {
            this._currentUserId = currentUserId;
            this._cookieKey = "userPermissions" + this._currentUserId;
        }
    };

    var _checkCookiesForPermission = function (permissionKey, currentUserId) {
        _checkPermissionKey(permissionKey, currentUserId);
        var userPermissions;
        if (!CheckCookie(this._cookieKey)) {
            _setPermissionsToCookie();
        }
        userPermissions = GetCookie(this._cookieKey);
        if (userPermissions.length > 0) {
            var parsedData = JSON.parse(userPermissions);
            if (parsedData != null) {
                var outPutData = parsedData[this._permissionKey];
                var cookieUser = parsedData.DomianUser;
                if (outPutData != undefined && cookieUser != undefined && cookieUser == this._currentUserId) {
                    this._outPutValue = Boolean(outPutData);
                }
            }
        }
        return this._outPutValue;
    };

    var _setPermissionsToCookie = function () {
        try {

            $.ajax({
                type: "POST", /*method type*/
                contentType: "application/json; charset=utf-8",
                url: '/WebAPI/permissons.asmx/GetUserPermissions', /*Target function that will be return result*/
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
        $('[set-perm]').each(function (item, index) {
            var permissionKey = $(this).attr('set-perm');
            if (permissionKey.length > 0) {
                var permissionKeyValue = _checkCookiesForPermission(permissionKey, 'testuser');
                if (permissionKeyValue != undefined) {
                    if (Boolean(permissionKeyValue)) {
                        $(this).show();
                    }
                    else {
                        $(this).hide();
                    }
                }
                else {
                    $(this).show();
                }
            }
        });
    };

    return {
        init: function () { _initializeControls() }
    };
})();
