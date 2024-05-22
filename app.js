//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//To establish the connection between the server and our wikiDB.


mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};


const Article = mongoose.model("Article", articleSchema);




//To Do 

/////////////////////////All Articles///////////////////////////////////

app.route("/articles")    // Using chained route method from express  app.route("/articles").get().post().put().delete(); 

//To fetch all the articles (Read All) using the promises .then and .catch.


.get(function(req, res){
    Article.find()
        .then(foundArticles => {
            res.send(foundArticles);
        })
        .catch(err => {
            res.send(err);
        });
})

// To post or create a new article on jack bauer which just a new document the articles collection .


.post(function(req, res){

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
  });
  
  newArticle.save()
          .then(() => {
              res.send("Successfully added a new article.");
          })
          .catch((err) => {
              res.send("Failed to add new article.");
          });
  });
  
  
  // // To delete all the items in the collection or clear out we use the delteMany method.

  
// .delete(function(req, res) {
//     Article.deleteMany({})
//         .then(() => {
//             res.send("Successfully deleted all the articles.");
//         })
//         .catch((err) => {
//             res.send("Failed to delete articles.");
//         });
// });



/////////////////////////Individual Articles///////////////////////////////////

// Route parameters in Express

// localhost:3000/articles/DOM

// app.route("/articles/:articleTitle")

// req.params.articleTitle = "DOM"


//    :   =   parameters or parms  =    :articleTitle



//To fetch a specific article using the title parameter.

app.route("/articles/:articleTitle")

.get(function(req, res){

    Article.findOne({ title: req.params.articleTitle })
            .then((foundArticle) => {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("No articles matching that title was found");
                }
            })
            .catch((err) => {
                res.send("Failed to find article.");
            });
})



// To update the whole document / replace it with new one 

.put( async (req, res) => {
  try {
      const articleTitle = req.params.articleTitle;
      const updatedArticle = await Article.findOneAndReplace(
          { title: articleTitle },
          req.body,
          { new: true }
      );

      res.send(updatedArticle);
  } catch (err) {
      res.status(500).send(err);
    }
})


// to patch up a single field entry without disturbing the whole document. 

 .patch(async(req, res) => {
    
  try{ 

      const articleTitle = req.params.articleTitle;
      const updateArticles = await  Article.findOneAndUpdate(  { title: articleTitle }, req.body, {new : true} );

            res.send(updateArticles);
     }  catch (err)  {
             res.send(err);
      
                      }
 });


// delete a specific article sss


  app.delete("/articles/:articleTitle", (req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.deleteOne({ title: articleTitle })
        .then((result) => {
            if (result.deletedCount > 0) {
                res.send("Successfully deleted selected article.");
            } else {
                res.send("No article found with the specified title.");
            }
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
  });
  


app.listen(3000, function() {
  console.log("Server started on port 3000");
});







