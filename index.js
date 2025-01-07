const express=require('express');
const { v4: uuidv4 } = require('uuid');
const app=express();
const port=5000;
const path=require('path')
const methodOverride=require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const posts = [
       { name: "Alice Brown", content: "Had an amazing time hiking today! The views were breathtaking. 🌄", likes: 120, comments: 15 ,id:uuidv4()},
       { name: "John Smith", content: "Finally tried that new restaurant downtown. The food was incredible! 🍝", likes: 98, comments: 22,id:uuidv4() },
       { name: "Emma Davis", content: "Learning JavaScript has been such a fun experience. Can't wait to build more projects! 💻", likes: 134, comments: 9 ,id:uuidv4()},
       { name: "Michael Johnson", content: "Just finished my first marathon! Feeling proud and exhausted. 🏃‍♂️", likes: 250, comments: 30 ,id:uuidv4()},
       { name: "Sophia Garcia", content: "Adopted a puppy today. Say hello to Max! 🐶", likes: 345, comments: 40 ,id:uuidv4()},
       { name: "James Martinez", content: "Exploring photography lately. Captured some great shots of the sunset! 📸", likes: 87, comments: 11 ,id:uuidv4()},
       { name: "Olivia Wilson", content: "Spent the weekend gardening. Nature therapy is the best therapy! 🌱", likes: 156, comments: 20 ,id:uuidv4()},
       { name: "Liam Thompson", content: "Started reading a new book series. Highly recommend it to fantasy lovers! 📚", likes: 110, comments: 8,id:uuidv4() },
       { name: "Mia Anderson", content: "Visited the art gallery today. The creativity on display was inspiring! 🎨", likes: 175, comments: 18,id:uuidv4() },
       { name: "Ethan Moore", content: "Weekend camping trip was a success! Great friends, food, and stories by the fire. 🔥", likes: 220, comments: 25 ,id:uuidv4()}
];
app.get('/posts',(req,res)=>{
       res.render('first/post',{posts});
})
app.get('/posts/:id',(req,res)=>{
       const {id}=req.params;
       let post= posts.find((p)=> id===p.id);
       res.render('first/viewPost.ejs',{post});
})
app.get('/posts/new',(req,res)=>{
       res.render('first/newpost');
})
app.post('/posts',(req,res)=>{
       const {name,content,likes,comments}=req.body;
       let newdata={
              name:name,
              content:content,
              likes:28,
              comments:12,
              id:uuidv4(),
       }
       posts.push(newdata);
       res.redirect("/posts");
})
app.get('/posts/:id/delete',(req,res)=>{
       const {id}=req.params;
       const index = posts.findIndex((p) => p.id === id);
       if (index !== -1) {
       posts.splice(index, 1);
       }
       res.redirect('/posts');
})
app.patch('/posts/:id',(req,res)=>{
       let {id}=req.params;
       let post=posts.find((p)=> id===p.id);
       let newcontent=req.body.content;
       post.content=newcontent;
       res.redirect('/posts');
})

app.get('/posts/:id/edit',(req,res)=>{
       const {id}=req.params;
       let post= posts.find((p)=> id===p.id);
       if(post){
              res.render('first/edit',{post})
       }else{
              console.log('not found');
              res.render('/posts');              
       }
})
app.listen(port,()=>{
       console.log(`App listening at ${port}`);
})