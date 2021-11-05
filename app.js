function getPitchTypeRate(pitcherId, jsonFile) {
    let thePitchInfo = jsonFile.filter((playByPlay) => {
        return playByPlay["PitcherId"] === pitcherId;
    })
    // thePitchInfo["PitchType"]
    let total = thePitchInfo.map(info => {
        let obj = {};
        obj["PitchType"] = info["PitchType"];
        obj["ReleaseSpeed"] = info["ReleaseSpeed"];
        return obj;
    }).filter(aa => aa["PitchType"] !== "NULL");

    let totalInfo = {};
    thePitchInfo.forEach(pitch => {
        let pitchType = pitch["PitchType"];
        if (pitchType !== "NULL") {
            if (!totalInfo[pitchType]) {
                totalInfo[pitchType] = [];
            }
            totalInfo[pitchType].push(pitch["ReleaseSpeed"])
        }
    });
    let typeRate = {}
    Object.keys(totalInfo).forEach(key => {
        typeRate[key] = (totalInfo[key].length / total.length);
    })
    return typeRate;
}

function getAvgSpeed(pitcherId, jsonFile, key1 ) {
    let thePitchInfo = jsonFile.filter((playByPlay) => {
        return playByPlay["PitcherId"] === pitcherId;
    })
    let total = thePitchInfo.map(info => {
        let obj = {};
        obj["PitchType"] = info["PitchType"];
        obj[key1] = info[key1];
        return obj;
    }).filter(aa => aa["PitchType"] !== "NULL");

    let totalInfo = {};
    thePitchInfo.forEach(pitch => {
        let pitchType = pitch["PitchType"];
        if (pitchType !== "NULL") {
            if (!totalInfo[pitchType]) {
                totalInfo[pitchType] = [];
            }
            totalInfo[pitchType].push(pitch[key1])
        }
    });
    let avgs = {}
    Object.keys(totalInfo).forEach(pitchType => {
        let total = 0;
        totalInfo[pitchType].forEach(speed => {
            total += Number(speed);
        })
        avgs[pitchType] = total / totalInfo[pitchType].length;
    })
    return avgs;
}


function getTrajectoryBreak(pitcherId, jsonFile) {
    let thePitchInfo = jsonFile.filter((playByPlay) => {
        return playByPlay["PitcherId"] === pitcherId;
    })
    // thePitchInfo["PitchType"]
    let total = thePitchInfo.map(info => {
        let obj = {};
        obj["PitchType"] = info["PitchType"];

        obj["TrajectoryHorizontalBreak"] = info["TrajectoryHorizontalBreak"];
        obj["TrajectoryVerticalBreakInduced"] = info["TrajectoryVerticalBreakInduced"];
        return obj;
    }).filter(aa => aa["PitchType"] !== "NULL");

    return total;
}


router.get('/csvTest', async function (req, res) {
    let jsonFile = await csvfile();

    let json1 = {};
    jsonFile.forEach(playByPlay => {
        let pitcher = playByPlay["PitcherId"];
        if (!json1[pitcher]) {
            json1[pitcher] = true;
        }
    });
    let listData = [];
    Object.keys(json1).forEach(pitcherId => {
        let jsonData = {};
        jsonData["PitcherId"] = pitcherId;
        jsonData["IsHome"] = ((jsonFile.filter(data => data["PitcherId"] === pitcherId)).map(row => { return row["IsTop"] })[0]) === "0";
        jsonData["PitchInfo"] = [];
        jsonFile.forEach(playByPlay => {
            if (playByPlay["PitcherId"] === pitcherId && playByPlay["PitchType"] !== "NULL") {
                let obj = {};
                obj["PitchType"] = playByPlay["PitchType"];
                obj["ReleaseSpeed"] = playByPlay["ReleaseSpeed"];
                obj["ReleaseSpinRate"] = playByPlay["ReleaseSpinRate"];
                jsonData["PitchInfo"].push(obj);
            }
        })
        jsonData["PitchTypeRate"] = getPitchTypeRate(pitcherId, jsonFile);
        jsonData["AvgSpeed"] = getAvgSpeed(pitcherId, jsonFile, "ReleaseSpeed");
        jsonData["AvgSpin"] = getAvgSpeed(pitcherId, jsonFile, "ReleaseSpinRate");
        jsonData["TrajectoryBreak"] = getTrajectoryBreak(pitcherId, jsonFile);

        listData.push(jsonData);
    })
    
    res.render("tigers", { listData });
});



