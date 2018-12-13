const express = require('express');
const router = express.Router();  //=>(1)
const mongoClient = require("mongodb").MongoClient; //=>(5) 获取数据库之中的数据;

const ObjectId = require("mongodb").ObjectID;

router.get("/watch/:type",(req,res)=>{
    // res.send(req.params);

    let start = req.query.start ? req.query.start : 0 ;
    let count = req.query.count ? req.query.count : 25 ;
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
            res.render("xbiao",{list:arr})
        },(err)=>{
            res.send(err,"c不对")
        })
    }else{
        res.send("什么错误");
    }

})
let dbname = "xbiao";
let url ="mongodb://localhost:27017";
function getDatas(start , count){
    start = Number(start);
    count = Number(count);

    return new Promise((resolve , reject)=>{
        mongoClient.connect(url,(err,client)=>{
            if(err) return reject(err);

            //链接数据库;
            let db = client.db(dbname);
            let collection = db.collection("watch75");
            collection.find({},{_id:0}).skip(start).limit(count).toArray((err , data)=>{
                if(err) return reject(err);
                //成功了;
                resolve(data);
            })
        })
    })
}

module.exports = router;