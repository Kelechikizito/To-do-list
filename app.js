const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js')
const port = 3000;

const app = express();

const items = ['Work-out', 'Go to church', 'Buy food'];
const workItems = [];
const gymItems = ['10X push-ups', '50x squats'];

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    
    let day = date.getDay();
    
    res.render('list', {listTitle: day, newListItems: items});

})

app.post('/', function(req, res) {
    let item = req.body.newItem;
    
    if (req.body.list === 'Work') {
        workItems.push(item);
        res.redirect('/work');
    }else if (req.body.list === 'Gym') {
        gymItems.push(item);
        res.redirect('/gym');
    }
    else {
        items.push(item);
        res.redirect('/');
    }
})

app.get('/work', function(req, res) {
    res.render('list', {listTitle: 'Work List', newListItems: workItems});
});


app.get('/gym', function(req, res) {
    res.render('list', {listTitle: 'Gym List', newListItems: gymItems});
});

app.get('/about', function(req, res) {
    res.render('about');
})


app.listen(port , function(){
    console.log('SERVER IS RUNNING AT PORT', port);
})