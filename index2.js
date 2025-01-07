const express=require('express');
const { v4: uuidv4 } = require('uuid');
const app=express();
const mysql=require('mysql2');
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const connection=mysql.createConnection({
       host:'localhost',
       user:'root',
       database:'first_db',
       password:'kishu45',
});
const { faker } = require('@faker-js/faker');

function createRandomUser() {
  return [
       faker.string.uuid(),
       faker.internet.username(),
       faker.internet.email(),
       faker.internet.password(),
];
}
app.get('/users',(req,res)=>{
       let q="select * from user";
       try{
              connection.query(q,(err,result)=>{
                     if(err) throw err;
                     let data=result;
                     // console.log(data[0]);
                     res.render('second/users',{data});
              })
       }catch(err){
              console.log(err);
       }
       
})
app.patch('/users/:id',(req,res)=>{
       const {userName,formpass}=req.body
       const {id}=req.params; 
       let q2=`select password from user where id=?`;
       try{
              connection.query(q2,id,(err,result)=>{
                     let passkey=result[0].password;
                     console.log(passkey);
                     console.log(formpass);
                     if(err){
                            throw err;
                     }
                     if(passkey!=formpass){
                            res.send("soory try entering correct password");
                     }else{
                            let q=`update user set userName=? where id=?`
                            try{
                                   connection.query(q,[userName,id],(err,result)=>{
                                          if(err) throw err;
                                          console.log(result);
                                          res.redirect('/users');
                                   })
                            }catch(err){
                                   console.log(err);
                            }
                     }
              })
       }catch(err){
              console.log(err);
              
       }
       
})
app.post('/users/add',(req,res)=>{
       let randomid=uuidv4();
       let {userName,email,password}=req.body;
       // console.log(userName,email,password);
       let q=`insert into user (id,userName,email,password) values (?,?,?,?)`;
       connection.query(q,[randomid,userName,email,password],(err,result)=>{
              // console.log(result);
              res.redirect('/users');
       })
})
app.get('/users/add',(req,res)=>{
       res.render('second/addnew');
})
app.get('/users/:id/delete',(req,res)=>{
       
       const {id}=req.params;
       res.render('second/deleting',{id});
})
app.delete('/users/:id/delete',(req,res)=>{
       const {formemail,formpassword}=req.body;
       const {id}=req.params;
       let q2=`select email,password from user where id=?`;
       connection.query(q2,[id],(err,result)=>{
              const data=result[0];
              if(err){
                     res.status(500).send('error occur while verifiying');
              }
              if(result.length==0){
                     res.status(404).send("can't find data");
              }else{
                     if(data.email==formemail && data.password==formpassword){
                            let q=`delete from user where id=?`;
                            connection.query(q,[id],(err,result)=>{
                                   if(err){
                                          res.status(500).send('erro while deleting data');
                                   }
                                   if(result.affectedRows>0){
                                          res.redirect('/users');
                                   }else{
                                          res.status(404).send(" can't find the data");
                                   }
                            })
                     }else{
                            res.send('sorry,try entering correct data');
                     }
              }
              
       })
})
app.get('/users/:id/edit',(req,res)=>{
       const {id}=req.params;
       let q=`select * from user where id=${mysql.escape(id)}`;
       try{
              connection.query(q,(err,result)=>{
                     if(err) throw err;
                     let data=result[0];
                     console.log(data);
                     res.render("second/useredit",{data});
              })
       }catch(err){
              console.log(err);    
       }
})
app.get('/',(req,res)=>{
       let q="select count(*) from user";
       try{
              connection.query(q,(err,result)=>{
                     if(err) throw err;
                     const data=result[0]['count(*)'];
                     res.render("second/home",{data});
              })
       
       }catch(err){
              console.log(err);
       }
})
app.listen('8000',()=>{
       console.log('app is listening ');
})