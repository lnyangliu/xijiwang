const express = require('express');
const router = express.Router();  //=>(1)
const mongoClient = require("mongodb").MongoClient; //=>(5) 获取数据库之中的数据;

const ObjectId = require("mongodb").ObjectID

router.get("/movie/:type",(req,res)=>{  //=>(2)
    // res.send(req.params);
    // res.send(req.query);
    //获取数据库之中的内容; =>(3)

    let start = req.query.start ? req.query.start : 0 ;
    let count = req.query.count ? req.query.count : 10 ;
   
    if(req.params.type == "data"){
        getDatas(start , count)
        .then((arr)=>{
            res.send({
                count : arr.length,
                start : start,
                subjects : arr
            });
        },(err)=>{
            res.send(err,"不对");
        })
    }else if(req.params.type == "page"){
        getDatas(start , count)
        .then((arr)=>{
            res.render("douban",{list:arr})
        },(err)=>{
            res.send(err,"c不对")
        })
    }else{
        res.send("什么错误");
    }
    
    
})
let dbname = "douban";
let url ="mongodb://localhost:27017";
 
// 封装的getDatas函数 =>(4)  //   //.limit(count)
function getDatas(start , count){
    start = Number(start);
    count = Number(count);


    return new Promise((resolve , reject)=>{

        // =>(4=>5)
        mongoClient.connect(url,(err,client)=>{
            if(err)return reject(err);

            // 连接数据库;
            let db = client.db(dbname);
            let collection = db.collection("TOP250");
            collection.find({},{_id:0}).skip(start).limit(count).toArray((err , data)=>{
                if(err) return reject(err);
                //成功了;
                resolve(data);
            })
        })
    })
}
router.get("/changeData",(req,res)=>{
    // res.send("niyadehaoa");
    let sYear = req.query.year;
    let sName = req.query.name;
    let sId = req.query.id;
    if(!(sYear && sName && sId)) return res.send({ status:"error",statuCode:2});
    searchData({
        year:sYear ,
        name : sName,
        id : sId
    })
    .then((obj)=>{
        console.log("成功",obj.result);
        res.send({ status : "success", statusCode : 1})
    },(status)=>{
        console.log(status)
    })
})
router.get("/delete",(req,res)=>{
    // res.send("niyadehaoa");
 
    let sId = req.query.id;
    console.log(sId);
    deleteData({       
        id : sId
    })
    .then((obj)=>{
        res.send({ status : "success"})
    },(status)=>{
        res.send({ status : "error"})
    })
})
router.get("/addData",(req,res)=>{
    // res.send("niyade喊sha")
    let sTitle = req.query.title;
    let sDirector = req.query.director;
    let sCasts = req.query.casts
    let sYear = req.query.year;
    let sRating = req.query.rating;
    console.log(sTitle , sDirector , sCasts , sYear , sRating);
    if(!(sTitle && sDirector && sCasts && sYear && sRating)) return res.send({status:"error",statuCode:2});
    addData({
        title:sTitle,
        director:sDirector,
        casts:sCasts,
        year:sYear,
        rating:sRating
    })
    .then((obj)=>{
        // 
        // console.log("成功",obj.result);
        res.send({status : "success", statusCode : 1})
     },(status)=>{
        res.send({ status : "error"})
    })
    
})
function searchData(options){
    // console.log(1);
    return new Promise((resolve,reject)=>{
        mongoClient.connect(url,(err,client)=>{
            if(err) return reject(3);

            const db =client.db(dbname);
            const collection =db.collection("TOP250");
            collection.update({"_id":ObjectId(options.id)},{
                $set:{
                    year:options.year,
                    title:options.name
                }
            },{},(err,result)=>{
                if(err) return reject(3.1);
                resolve(result)
            });
        })
    })
}
function addData(options){
    console.log(options);
    return new Promise((resolve , reject)=>{
        mongoClient.connect(url,(err,client)=>{
            if(err) return reject(3.4);            
            const db = client.db(dbname);
            const collection = db.collection("TOP250");

            collection.find({title : options.title}).toArray((err,data)=>{
                if(data.length == 0 ){
                    collection.insertOne({
                        title:options.title,
                        director:{"name":options.director},
                        casts:{"name":options.casts},
                        year:options.year,
                        rating:{"average":options.rating}
                    })
                    // res.send()
                    resolve(1);
                }else{
                    reject(3);
                    client.close();
                }
            })

            
        })
    })
}
function deleteData(options){
    return new Promise((resolve , reject)=>{
        mongoClient.connect(url,(err,client)=>{
            if(err) return reject(3);
            const db = client.db(dbname);
            const collection = db.collection("TOP250");
    
            collection.deleteOne({"_id":ObjectId(options.id)},(err,result)=>{
                if(err) return reject(3.1);
                console.log(options.id);
                resolve(result)
            });
        })
    })
        
}

module.exports = router;