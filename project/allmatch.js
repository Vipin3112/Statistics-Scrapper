let request=require("request");
let fs=require("fs");
let cheerio=require("cheerio");
let matchFile=require("./match.js");
const { parse } = require("path");
//let url= "https://www.espncricinfo.com/scores/series/8039/season/2015/icc-cricket-world-cup?view=results";
function allmatchHandler(url)
{
    request(url,cb);
}
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
    let allMatches= $(".col-md-8.col-16");
    console.log("Toatal Matches Played: "+allMatches.length+'\n');
    for(let i=0;i<allMatches.length;i++)
    {
        let allAnchors=$(allMatches[i]).find(".match-cta-container a");
        let scorecard = allAnchors[0];
        let link=$(scorecard).attr("href");
        let clink="https://www.espncricinfo.com"+link;
        //console.log(clink);
        matchFile.matchHandler(clink);
    }
}
module.exports.allmatchHandler=allmatchHandler;