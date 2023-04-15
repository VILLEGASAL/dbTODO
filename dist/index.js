"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const date_1 = require("./date");
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = __importDefault(require("lodash"));
let app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
let port = process.env.PORT || 5000;
// ToDo Schema
let todoSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    }
});
let listSchema = new mongoose_1.default.Schema({
    name: String,
    items: [todoSchema]
});
let LIST = mongoose_1.default.model("List", listSchema);
let TODO = mongoose_1.default.model("Todo", todoSchema);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB");
        let data = yield TODO.find();
        mongoose_1.default.connection.close();
        res.render("index.ejs", {
            listTitle: (0, date_1.getDate)(),
            todoList: data
        });
    }
    catch (error) {
        console.log(`Hey! There is an error : ${error}`);
    }
}));
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let listName = req.body.list;
        let aTodo = new TODO({
            name: req.body.todo
        });
        if (listName === (0, date_1.getDate)()) {
            yield mongoose_1.default.connect("mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB");
            yield aTodo.save();
            res.redirect("/");
            mongoose_1.default.connection.close();
        }
        else {
            yield mongoose_1.default.connect("mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB");
            let list = yield LIST.find({ name: listName });
            list[0].items.push(aTodo);
            yield list[0].save();
            mongoose_1.default.connection.close();
            res.redirect("/" + listName);
        }
    }
    catch (error) {
        console.log(`Hey! There is an error : ${error}`);
    }
}));
app.post("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let listName = req.body.listName;
        yield mongoose_1.default.connect("mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB");
        if (listName === (0, date_1.getDate)()) {
            yield TODO.deleteOne({ _id: `${req.params.id}` });
            res.redirect("/");
        }
        else {
            try {
                yield LIST.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: req.params.id } } });
                res.redirect("/" + listName);
            }
            catch (error) {
                console.log(`Error: ${error}`);
            }
        }
    }
    catch (error) {
        console.log(`Hey! There is an error : ${error}`);
    }
}));
app.get("/:customListName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect('mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB');
        let customListName = lodash_1.default.capitalize(req.params.customListName);
        let findDuplicate = yield LIST.findOne({ name: customListName });
        if (!findDuplicate) {
            yield mongoose_1.default.connect('mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB');
            let newList = new LIST({
                name: customListName,
                items: []
            });
            yield newList.save();
            mongoose_1.default.connection.close();
            res.redirect("/" + customListName);
        }
        else {
            yield mongoose_1.default.connect('mongodb+srv://villegasalrandolph:ViLLEGAS_AR2846@cluster0.owih4qv.mongodb.net/todoDB');
            res.render("index.ejs", {
                listTitle: findDuplicate.name,
                todoList: findDuplicate.items
            });
            mongoose_1.default.connection.close();
        }
    }
    catch (error) {
        console.log(`Hey! There is an error : ${error}`);
    }
}));
app.listen(port, () => {
    console.error(`Server is running on port ${port}`);
});
