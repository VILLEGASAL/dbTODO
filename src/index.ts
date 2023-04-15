import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser'
import { getDate } from './date' 
import mongoose from "mongoose";
import axios from "axios";
import lodash from "lodash"
import { isTemplateExpression } from 'typescript';

let app:express.Application = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));

let port = process.env.PORT || 5000;

// ToDo Schema
let todoSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    }
});

let listSchema = new mongoose.Schema({

    name:String,
    items: [todoSchema]
})

let LIST = mongoose.model("List", listSchema)
let TODO = mongoose.model("Todo", todoSchema);



app.get("/", async (req:express.Request, res:express.Response) => {

    try{

        await mongoose.connect("mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB");

        let data = await TODO.find();

        mongoose.connection.close();

        res.render("index.ejs", {

            listTitle: getDate(),
            todoList: data
        })

    }catch(error){

        console.log(`Hey! There is an error : ${error}`);
    }
    
})

app.post("/", async(req:express.Request, res:express.Response) => {

    try{

        let listName = req.body.list

        let aTodo = new TODO({

            name: req.body.todo
        })

        if(listName === getDate()){

            await mongoose.connect("mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB");

            await aTodo.save();
            res.redirect("/");
            mongoose.connection.close()

        }else{

            await mongoose.connect("mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB");

            let list = await LIST.find({name: listName})

            list[0].items.push(aTodo);
            await list[0].save()

            mongoose.connection.close()

            res.redirect("/" + listName)
        }

    }catch(error){

        console.log(`Hey! There is an error : ${error}`);
        
    }
})

app.post("/:id", async (req:express.Request, res:express.Response) => {

    try {
        
        let listName = req.body.listName

        await mongoose.connect("mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB")

        if(listName === getDate()){

            await TODO.deleteOne({_id: `${req.params.id}`})
            
            res.redirect("/")

        }else{

            try{

                await LIST.findOneAndUpdate({name: listName}, {$pull:{items: {_id: req.params.id}}});

                res.redirect("/" + listName)

            }catch(error){

                console.log(`Error: ${error}`)
            }
            
        }
        
    } catch (error) {
        
        console.log(`Hey! There is an error : ${error}`);
    }
})


app.get("/:customListName", async (req:express.Request, res:express.Response) => {

    try{

        await mongoose.connect('mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB');

        let customListName = lodash.capitalize(req.params.customListName);

        let findDuplicate = await LIST.findOne({name: customListName})

        if (!findDuplicate) {

            await mongoose.connect('mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB');

            let newList = new LIST({
    
                name: customListName,
                items: []
            })

            await newList.save()

            mongoose.connection.close()

            res.redirect("/" + customListName)

        }else{

            await mongoose.connect('mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB');

            res.render("index.ejs", {

                listTitle: findDuplicate.name,
                todoList: findDuplicate.items
            })

            mongoose.connection.close()
            
        }

    }catch(error){

        console.log(`Hey! There is an error : ${error}`);
    }
   
})

app.listen(port, () => {

    console.error(`Server is running on port ${port}`);
})