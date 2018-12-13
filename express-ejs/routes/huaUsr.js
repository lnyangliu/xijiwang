const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const event = require("events");
const fs = require("fs");


const jwt = require("jwt-simple");

// nodejs 加密模块;
const crypto = require('crypto');

class MyEvent extends event{};
const me = new MyEvent();


// 加密; (加密的明文, 秘钥);
let Encrypt = (data, key) => {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
// 解密密; (加密后的密文, 秘钥);
let Decrypt = (encrypted, key) => {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

let url = "mongodb://localhost:27017";
let dbName = "users";

router.post('/:type',dis , login);
router.post('/:type',(req,res,next)=>{
  //  res.send(req.cookies);
  let secret = fs.readFileSync("./server.pem");
  let token = req.cookies["user.id"];

  if(!token) return res.send({status:"error",statuCode : 0});
  let payload = jwt.decode(token ,secret);
  // console.log(payload);
  if(payload.exp <= Date.now){
    res.clearCookie("user.id");
    res.send({status:"error",statuCode : 0})
  }else{
    res.send(Object.assign(payload,{status:"success",statuCode : 0})); ////cuowu?????????
  }  
});

//分配需求
function dis(req , res , next){
    if(req.params.type == "login") return next();
  
    // 注册逻辑;
    if(req.params.type != "register") return next("route");
    // res.send("欢迎注册")
    let usr = req.body.username;
    let pwd = req.body.password;
    console.log(usr)
   
    //用户名的重复查询；
  const params = {
    usr : usr,
    pwd : pwd,
    req : req ,
    res : res 
  }
    // console.log(params);
    me.emit("searchUsers" , params);
    
  }
  
  me.on("searchUsers" ,(e)=>{
      // e.res.send(e.usr);
      mongoClient.connect(url , (err , client)=>{
            if(err) return e.res.send(err+":"+"数据库错误");
  
            // 选择数据库
            const db = client.db(dbName);
  
            //选中集合
            const collection = db.collection("user_collection");
  
            // 查询;
            collection.find({username : e.usr}).toArray((err,data)=>{
              //通过数据的数量的判断是否重名;
              if(data.length == 0 ){
                //没有重名
                // e.res.send("没有重名")
  
                //用户名放入数据库之中;
                me.emit("insertUser" , Object.assign(e,{collection:collection,client:client}));
              }else{
                e.res.send("用户名重复")
                client.close();
              }
            })
  
      })
  })
  me.on("insertUser" ,(e)=>{
    // e.res.send("hello world");
    let pemKey = fs.readFileSync("./server.pem")
    var cryPwd = Encrypt(e.pwd ,pemKey);
    // var pwd = Decrypt(cryPwd , pemKey);
    // console.log("密文"+cryPwd , "解密"+pwd);
    e.collection.insert({
        username : e.usr,
        password : cryPwd,
        admin : true
    })
    //关闭数据库
    e.client.close();
    e.res.json({
      type :"register",
      statu : "success"
    })
    // console.log(e);
  })
  
  //登录逻辑;
  function login(req,res,next){
    // res.send("hello");
    let usr = req.body.username;
    let pwd = req.body.password;
    // res.send(usr+pwd);
  
     let validePromise = valideUser(usr,pwd)//promise
     
     validePromise.then((user)=>{
        //登录成功
        //加密并设置token;
        let secret = fs.readFileSync("./server.pem");
        
        let payload = {
          username : user.username,
          admin : user.admin,
          exp : Date.now() +1000*60*60*1
        }
        let token = jwt.encode(payload ,secret);
  
        res.cookie("user.id",token);
  
  
        res.send(Object.assign(user,{status: "success" ,statuCode : 1}));
     },(err)=>{
      //  res.send(err);
        if( err == 1){
          res.send({status: "error" ,statuCode : 5})
        }else if( err == 2){
          res.send({status: "error" ,statuCode : 4})
        } else{
          res.send({status: "error" ,statuCode : 2})
        }
     }) 
  }
  function valideUser(usr,pwd){
  
    //加密密码
    let pemKey = fs.readFileSync("./server.pem")
    var cryPwd = Encrypt(pwd ,pemKey);
    return new Promise((resolve , reject)=>{
      // 链接数据库
      mongoClient.connect(url , (err , client)=>{
       if(err) return reject("数据库连接错误");
       //链接数据库
       const db = client.db(dbName);
       //链接集合;
       const collection = db.collection("user_collection");
        //查询用户名;
       collection.find({username:usr}).toArray((err,data)=>{
          if(err) return reject("数据库解析错误"+err);
          if(data.length == 0 ) return reject(1);
  
          let valide = false;
          //比对密码;
          data.forEach((user,index)=>{
            if(user.password == cryPwd ){
              valide = true;
              resolve(user);
            }
          })
          if(!valide){
            reject(2)
          }
       })
  
      })
    })
  }
  
  module.exports = router;