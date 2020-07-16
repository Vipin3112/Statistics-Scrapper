//npm install require
//npm install cheerio
// require as import
let request=require("request");
let fs=require("fs");
let cheerio=require("cheerio");
let xlsx=require("xlsx");
let path=require("path");
const { parse } = require("path");
//let url= "https://www.espncricinfo.com/series/8039/scorecard/656495/australia-vs-new-zealand-final-icc-cricket-world-cup-2014-15";
function matchHandler(url)
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
        //console.log('--------------------------------------------------------------');
        console.log(header);
    }
}
function parseHtml(html){
    let $ = cheerio.load(html);
    let venue = $(".desc.text-truncate");
    venue=venue.text().trim();
    let result = $(".summary span");
    result=result.text().trim();
    console.log(venue+"\n\n"+result+"\n\n");
    let bothInnings = $(".card.content-block.match-scorecard-table .Collapsible");
    //console.log(bothInnings.length);
    for(let i=0;i<bothInnings.length;i++)
    {
        let teamElem = $(bothInnings[i]).find("h5");
        let teamName=teamElem.text().split("Innings");
        teamName=teamName[0].trim();
        console.log("----"+teamName+"----");
        let AllRows=$(bothInnings[i]).find(".table.batsman tbody tr");
        //fs.writeFileSync("table"+i+".html",elem);
        for(let j=0;j<AllRows.length;j++)
        {
            let allcols= $(AllRows[j]).find("td");
            let isPlayer= $(allcols[0]).hasClass("batsman-cell text-truncate out");
            //console.log(isPlayer);
            if(isPlayer)
            {  //playes's Row
                let pName=$(allcols[0]).text().trim();
                let runs=$(allcols[2]).text().trim();
                let balls=$(allcols[3]).text().trim();
                let sixes=$(allcols[5]).text().trim();
                let fours=$(allcols[6]).text().trim();
                let sr=$(allcols[7]).text().trim();
                console.log(pName+"\t"+runs+"\t"+balls+"\t"+sixes+"\t"+fours+"\t"+sr);
                //console.log(teamName+" "+venue);
                processPlayer(teamName,pName,result,venue,runs,balls,sixes,fours,sr);

            }
        }
        console.log("\n");
    }
    console.log("--------------------------------------------------------------------------");
}
function excelReader(filePath, name) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    // workbook 
    let wt = xlsx.readFile(filePath);
    let excelData = wt.Sheets[name];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

function excelWriter(filePath, json, name) {
    // console.log(xlsx.readFile(filePath));
    var newWB = xlsx.utils.book_new();
    // console.log(json);
    var newWS = xlsx.utils.json_to_sheet(json)
    xlsx.utils.book_append_sheet(newWB, newWS, name)//workbook name as param
    xlsx.writeFile(newWB, filePath);
}
function processPlayer(team, name, result, venue, runs, balls, sixes, fours, sr) {
    //    directory exist
    let obj = {
        venue,runs, balls, fours, sixes, sr, team, result
    };
    let teamPath = team;
    if (!fs.existsSync(teamPath)) {
        fs.mkdirSync(teamPath);
    }
    let playerFile = path.join(teamPath, name) + '.xlsx';
    let fileData = excelReader(playerFile, name);
    let json = fileData;
    if (fileData == null) {
        json = [];
    }
    json.push(obj);

    excelWriter(playerFile, json, name);

}
module.exports.matchHandler=matchHandler;