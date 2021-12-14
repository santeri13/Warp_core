var prompt = require('prompt-sync')();
console.log("Hello new Enginer");
var Name = prompt("Please enter your name ","");
var Email = prompt("Please enter your e-mail ", "");
Start(Name,Email,function(Auth_Code){
    setInterval(Check_Status, 1000,Auth_Code,function(Flow_Rate,Intermix){
        let Matter_Formula=(0.5*10-(Intermix)*10)/10;
        let AntiMatter_Formula=(Intermix*10-0.5*10)/10;
        if(Flow_Rate=="OPTIMAL"){
            if(Intermix>0.5){
                if(AntiMatter_Formula>0.2){
                    Add_AntiMatter(Auth_Code,0.2);
                    Add_Matter(Auth_Code,0);
                }
                else if(AntiMatter_Formula<-0.2){
                    Add_AntiMatter(Auth_Code,-0.2);
                    Add_Matter(Auth_Code,0);
                }
                else{
                    Add_AntiMatter(Auth_Code,AntiMatter_Formula);
                    Add_Matter(Auth_Code,0);
                }
            }else if(Intermix<0.5){
                if(Matter_Formula>0.2){
                    Add_Matter(Auth_Code,0.2);
                    Add_AntiMatter(Auth_Code,0);
                }
                else if(Matter_Formula<-0.2){
                    Add_Matter(Auth_Code,-0.2);
                    Add_AntiMatter(Auth_Code,0);
                }
                else{
                    Add_Matter(Auth_Code,Matter_Formula);
                    Add_AntiMatter(Auth_Code,0);
                }
            }
        }else if(Flow_Rate=="HIGH"){
            Add_Matter(Auth_Code,0);
            Add_AntiMatter(Auth_Code,0);
        }else if(Flow_Rate=="LOW"){
            Add_Matter(Auth_Code,0);
            Add_AntiMatter(Auth_Code,0);
        }
    });
});
function Start(Name, Email,callback) {
    var XMLHttpRequest = require('xhr2');
    var request = new XMLHttpRequest();
    request.open('POST','https://warp-regulator-bd7q33crqa-lz.a.run.app/api/start');
    request.setRequestHeader("accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            var Data=request.responseText;
            var jsonResponse = JSON.parse(Data);
            console.log("Engine:",jsonResponse["message"]);
            console.log("Status:",jsonResponse["status"]);
            console.log("Authorization Code:",jsonResponse["authorizationCode"]);
            if(callback) callback(jsonResponse["authorizationCode"]);
        }};
    var data = `{"name":"${Name}","email":"${Email}"}`;
request.send(data);
}
function Check_Status(Authorization_Code,callback) {
    var XMLHttpRequest = require('xhr2');
    var request = new XMLHttpRequest();
    request.open('GET',`https://warp-regulator-bd7q33crqa-lz.a.run.app/api/status?authorizationCode=${Authorization_Code}`);
    request.setRequestHeader("accept", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            var Data=request.responseText;
            var jsonResponse = JSON.parse(Data);
            console.log("Flow Rate:",jsonResponse["flowRate"]);
            console.log("Intermix:",jsonResponse["intermix"]);
            if(callback) callback(jsonResponse["flowRate"],jsonResponse["intermix"]);
        }};
    request.send();
}
function Add_Matter(Authorization_Code,Matter) {
    var XMLHttpRequest = require('xhr2');
    var request = new XMLHttpRequest();
    request.open('POST','https://warp-regulator-bd7q33crqa-lz.a.run.app/api/adjust/matter');
    request.setRequestHeader("accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json");
    var data = `{"authorizationCode":"${Authorization_Code}","value":${Matter}}`;
    request.send(data);
}
function Add_AntiMatter(Authorization_Code,AntiMatter) {
    var XMLHttpRequest = require('xhr2');
    var request = new XMLHttpRequest();
    request.open('POST','https://warp-regulator-bd7q33crqa-lz.a.run.app/api/adjust/antimatter');
    request.setRequestHeader("accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json");
    var data = `{"authorizationCode":"${Authorization_Code}","value":${AntiMatter}`;
    request.send(data);
}