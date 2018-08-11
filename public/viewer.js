var token = "";
var tuid = "";
var ebs = "";

// because who wants to type this every time?
var twitch = window.Twitch.ext;

// create the request options for our Twitch API calls
var requests = {
    set: createRequest('POST', 'add'),
    get: createRequest('GET', 'get')
};

function createRequest(type, method) {

    return {
        type: type,
        url: 'https://localhost:8081/party/' + method,
        success: updateBlock,
        error: logError
    }
}

function setAuth(token) {
    Object.keys(requests).forEach((req) => {
        twitch.rig.log('Setting auth headers');
        requests[req].headers = { 'Authorization': 'Bearer ' + token }
    });
}

twitch.onContext(function(context) {
    twitch.rig.log(context);
});

twitch.onAuthorized(function(auth) {
    // save our credentials
    token = auth.token;
    tuid = auth.userId;

    // enable the button
    $('#addbt').removeAttr('disabled');

    setAuth(token);
    $.ajax(requests.get);
});

function updateBlock(partyList) {
    twitch.rig.log('Updating party list');
    $('#txtPlayers').text(partyList);
}

function logError(_, error, status) {
  twitch.rig.log('EBS request returned '+status+' ('+error+')');
}

function logSuccess(hex, status) {
  // we could also use the output to update the block synchronously here,
  // but we want all views to get the same broadcast response at the same time.
  twitch.rig.log('EBS request returned '+hex+' ('+status+')');
}

$(function() {

    // when we click the Add button
    $('#addbt').click(function() {
        if(!token) { return twitch.rig.log('Not authorized'); }
        twitch.rig.log('Requesting to add BattleTag' + $("#battletag").val());
        requests.set.data = {"btName": $("#battletag").val() }
        $.ajax(requests.set);
    });

    // listen for incoming broadcast message from our EBS
    twitch.listen('broadcast', function (target, contentType, partyList) {
        twitch.rig.log('Received party list' + " " + partyList  );
        updateBlock(partyList);
    });
});
