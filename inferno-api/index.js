//config--------------------------------
const express = require('express')
const app = express()
const port = 3001
var algoliasearch = require('algoliasearch');
var fs = require('fs');
var client = algoliasearch('N2K83PZDUD', 'f0ef21e4688fd0d4b417e283981c8c12');
var index = client.initIndex('inferno');
var appJSON = require('./data.json');


//routing--------------------------------
//check if everything is fine
app.get('/', function (req, res) {
    res.send('Hello, welcome to the test api, use POST/DELETE to /api/1/apps to add/remove an app')
})

//Post a new app
app.post('/api/1/apps', function (req, res) {
    if (req.query.newApp) {
        var newApp = JSON.parse(req.query.newApp);
        if (newApp.name && newApp.image && newApp.link && newApp.category && newApp.rank) {
            readData2(addData, newApp);
            res.send('Adding the app ' + appId);
        } else {
            res.send('You miss one of the following parameters: name, image, link, category, rank');
        }
    } else {
        res.send('Your app should have the following structure: newApp: {name: "name of my app", image: "url of the image", link: "link to the app", category: "main category of your app", rank: "rank of your app}');
    }


})

//Search for a specific term
app.get('/api/1/search/:term', function (req, res) {
    index.search(req.params.term, function (err, content) {
        res.send(content.hits);
    });
})

//Delete an existing app by id
app.delete('/api/1/apps', function (req, res) {
    console.log("hé")
    if (req.query.appId) {
        var appId = req.query.appId;
        readData2(removeData(removeData, appId))
    } else {
        res.send("You miss the appId parameter")
    }
})

//launch server
app.listen((process.env.PORT || 3001), () => console.log(`Inferno api listening on port ${port}!`))


//functions--------------------------------
function indexData(jsonFile) {
    index.addObjects(jsonFile, function (err, content) {
        if (err) {
            console.error(err);
        }
        console.log("The apps have been indexed");
    });
}

//function readData() {
//    fs.readFile('./data.json', 'utf8', function (err, data) {
//        if (err) {
//            return console.log(err);
//        }
//        data = JSON.parse(data);
//        console.log(data[0]);
//        return data;
//    });
//}

function readData2(callback, newData) {
    fs.readFile('./data.json', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = JSON.parse(data);
        callback(data, newData);
    });

}

function addData(data, newData) {
    //add data to the json
    data.push(newData);
    fs.writeFile('./data.json', JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The app has been added to the local database");
    });
    //update the index
    index.addObjects([newData], function (err, content) {
        console.log("The app has been indexed");
        console.log(content);
        return (content.objectIDs[0]);
    });
}


function removeData(id) {
    //removed data from the json
    //TODO
    //update the index
    index.deleteObjects([id], function (err, content) {
        if (err) throw err;
        console.log(content);
        console.log("The app has been removed from index");
    });
}
