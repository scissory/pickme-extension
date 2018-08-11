let token, userId;

const twitch = window.Twitch.ext;

twitch.onContext((context) => {
  twitch.rig.log(context);
});

twitch.onAuthorized((auth) => {
  token = auth.token;
  userId = auth.userId;
});

function updateBlock(partyList) {
    // Add /invite before each line to make it easier for broadcaster to cut/past
    let i;
    var newList = [];
    twitch.rig.log('party list ' + partyList);
    var testForString = partyList.toString();
    var listValues = testForString.split("\n");
    twitch.rig.log('list length ' + listValues.length);
    
    for (i = 0; i < listValues.length -1; i++) {
        newList.push("/invite " + listValues[i].toString() + "\n");
    }

    $('#txtPlayers').text(newList.toString().replace(/,/g, ""));
    
}

$(function () {

   
    // listen for incoming broadcast message from our EBS
    twitch.listen('broadcast', function (target, contentType, partyList) {
        twitch.rig.log('Config received party list' + " " + partyList);
        updateBlock(partyList);
    });
});