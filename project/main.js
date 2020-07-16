let request=require("request");
let fs=require("fs");
let cheerio=require("cheerio");
let matchFile=require("./allmatch.js");
const { parse } = require("path");
let url= "https://www.espncricinfo.com/series/_/id/8039/season/2015/icc-cricket-world-cup";
request(url,cb);
function cb(err,header,html){
    if(err==null && header.statusCode==200)
    {
        //console.log(html);
        console.log("HTML Receive");
        console.log('--------------------------------------------------------------');
        //fs.writeFileSync("index.html",html);
        parseHtml(html);
    }
    else if(header.statusCode==404)
    {
        console.log("Page Not Found");
    }
    else
    {
        console.log(err);
        console.log(header);
    }
}
function parseHtml(html)
{
    let $=cheerio.load(html);
    let nextPage= $("a[data-hover='View All Results']");
    let link=nextPage.attr("href");
    console.log(link);
    clink="https://www.espncricinfo.com"+link;
    matchFile.allmatchHandler(clink);
}
