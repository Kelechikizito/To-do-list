const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const port = 3000;

const app = express();

// const items = ['Work-out', 'Work on my projects', 'Read'];
// const workItems = [];
// const gymItems = ['10X push-ups', '50x squats'];

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemsSchema = new mongoose.Schema({
    name: String
  });


const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item ({
    name: 'Welcome to your to-do list'
})

const item2 = new Item ({
    name: 'Hit the + button to add a new item'
})

const item3 = new Item ({
    name: '<--- Hit this to delete an item'
})

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model('List', listSchema);



app.set('view engine', 'ejs');

app.get('/', function(req, res) {

    Item.find({})
    .then(function(items) {

        if (items.length === 0) {
            Item.insertMany(defaultItems)
                .then(function() {
                    console.log('Successfully saved to database');
                })
                .catch(function (err) {
                    console.log(err);
                }); 
                res.redirect('/');
        }else{
            res.render('list', {listTitle: 'Today', newListItems: items})
        }

    })
    .catch((err) => {
        console.log(err);
    })
    
})

app.get('/:customListName', function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName})
        .then(function(foundList) {
            res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
        })
        .catch(function (err) {

            const list = new List({
                name: customListName,
                items: defaultItems
            })

            list.save();
            res.redirect('/' + customListName);
        }); 

   


    
  });


app.post('/', function(req, res) {

    let itemName = req.body.newItem;
    let listName = req.body.list;

    const item4 = new Item ({
        name : itemName
    });


    if (listName === 'Today') {
        item4.save();
        res.redirect('/');
    }else{
        List.findOne({name: listName})
        .then(function(foundList) {
            foundList.items.push(item4);
            foundList.save();
            res.redirect('/' + listName);
        })
        .catch(function(err) {

        })
    }

  
})

app.post('/delete', function(req, res) {
    let deletedId = req.body.checkbox;
    let listName = req.body.listName;

    if (listName === 'Today') {
        Item.findByIdAndRemove(deletedId)
        .then(function() {

            console.log('Successfully deleted checked item.');
            res.redirect('/');
        })
        .catch(function (err) {
            console.log(err);
        });

    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deletedId}}})
        .then(function(foundList) {
            res.redirect('/' + listName);
        }) 
        .catch(function(err) {
            console.log(err);
        });
    }


})

// app.get('/work', function(req, res) {
//     res.render('list', {listTitle: 'Work List', newListItems: workItems});
// });


// app.get('/gym', function(req, res) {
//     res.render('list', {listTitle: 'Gym List', newListItems: gymItems});
// });

// app.get('/about', function(req, res) {
//     res.render('about');
// })


app.listen(port , function(){
    console.log('SERVER IS RUNNING AT PORT', port);
})