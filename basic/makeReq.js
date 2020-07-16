//npm install require
// require as import
let request=require("request");
let fs=require("fs");
let url= "https://www.espncricinfo.com/series/_/id/8039/season/2015/icc-cricket-world-cup";
function cb(err,header,html){
    if(err==null && header.statusCode==200)
    {
        //console.log(html);
        console.log("HTML Receive");
        fs.writeFileSync("index.html",html);
    }
    else if(header.statusCode==404)
    {
        console.log("Page Not Found");
    }
    else
    {
        console.log(err);
        //console.log('--------------------------------------------------------------');
        console.log(header);
    }
}
request(url,cb);