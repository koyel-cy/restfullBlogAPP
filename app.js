var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var express = require("express");
var app = express();
var expressSanitizer = require("express-sanitizer");

//app config

mongoose.connect("mongodb://localhost/blog_app", {
   useNewUrlParser: true,
   useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
useFindAndModify = false;
//mongoose config/model
var Schema = mongoose.Schema;
var blogSchema = new Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var blog = mongoose.model("blog",blogSchema);


//restful routes

app.get("/", function(req,res){
	res.redirect("/blogs");
});
//index
app.get("/blogs", function(req,res){
	blog.find({}, function(err,blogs){
		if(err){
			console.log(err);
		} else{
				res.render("index", {blogs: blogs});
		}
	})

});
//new post
app.get("/blogs/new", function(req,res){
	res.render("new");
});
//create
app.post("/blogs", function(req,res){
	//create a new blog
	//as we already gave blog[title] hence we cangroup them together
	    req.body.blog.body = req.sanitize(req.body.blog.body)
	blog.create(req.body.blog, function(err,newBlog){
		if(err){
			res.render("new");
		} else{
			//then redirect
			res.redirect("/blogs");
		}
	})
	
	
});
//show
app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("show", {blog:foundBlog});
		}
	})
});
//edit 
app.get("/blogs/:id/edit", function(req,res){
	blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			cosole.log(err);
			res.redirect("/blogs");
		} else{
			res.render("edit", {blog:foundBlog});
		}
	})
	
});

//UPDATE
app.put("/blogs/:id", function(req,res){
	    req.body.blog.body = req.sanitize(req.body.blog.body)
	blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,updatedBlog){
		if(err){
			res.redirect("/blogs");
			console.log(err);
		} else{
			res.redirect("/blogs/" + req.params.id);
		}
	})
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	//DESTROY updatedBlog
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		    res.redirect("/blogs");
		} else{
			//redirect 
			res.redirect("/blogs");
		}	
	})
});

		
		



app.listen(3000, function(){
	console.log("YOUR BLOG SITE SERVER IS STARTING AT PORT 3000!");
});

