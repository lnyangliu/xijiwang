const jwt = require("jwt-simple");
const fs = require("fs");


//jwt 规范分成三个部分;
// head => 头部部分 ; jwt-simple 已经定义好了;

// payload => 核心内容部分;
// 自定义的内容;

const payload = {
    iss : "hu",
    usr : "hu",
    admin : true,
    exp : Date.now() + 1000*60*60*4
}

// sinature =>签名部分; jwt-simple 已经定义好了;

const secret = fs.readFileSync("./server.pem");
const tocken = jwt.encode(payload,secret);

console.log(tocken);

console.log(jwt.decode(tocken,secret));