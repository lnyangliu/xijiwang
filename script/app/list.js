$(".category-list").on("mouseenter",function(){
    $(".CFList").css({
        height:"390px",
        overflow: "visible"
    })
})
$(".category-list").on("mouseleave",function(){
    $(".CFList").css({
        height:"0",
        overflow: "hidden"
    })
})






/** 
 * 
 * 1. 渲染页面;
 * 1.1 发送ajax : jsonp 请求
 * 1.2 拼接字符串渲染页面;
 * 2. 无限加载;
 * 
 * */ 
// 选择元素;
var container = _(".container-inner");
// 发送ajax : jsonp 请求
var GLOBAL = {
      // 可视区的高度;
      ch : document.documentElement.clientHeight,
      // 是否在加载过程之中
      loading_flag : false,
      count:1

}

_jsonp("https://list.mogujie.com/search")
.then(function(res){
      var goodsJSON = res.result.wall.list;
      randomPage(goodsJSON);
})

// 渲染页面函数;
var goodsJson = [];
function randomPage(json){
    goodsJson = goodsJson.concat(json);
      var html = "";
      json.forEach(function(ele){
        //   console.log(ele)
            html += `   <li>
                            <img item-id="${ele.iid}" src="${ele.show.img}" alt="">
                            <div class="price">${ele.price}</div>
                            <div class="title">${ele.title}</div>
                            <div class="pushCart" data-iid="${ele.iid}">加入购物车</div>
                        </li>`
      });
      container.innerHTML += html;
      return html;
}



onscroll = function(){
    //   console.log(isLoad());
    //     this.console.log(GLOBAL.loading_flag)
      // 如果需要加载, 发起ajax请求;

      if( !isLoad() || GLOBAL.loading_flag ) return false;
      // 开始加载数据;
      GLOBAL.loading_flag  = true;
      _jsonp("https://list.mogujie.com/search")
      .then(function(res){
            GLOBAL.loading_flag  = false;
            var goodsJSON = res.result.wall.list;
            randomPage(goodsJSON);
            GLOBAL.count += 1;
      })


}

// 决定要不要加载;
function isLoad(){
    
      var st = document.body.scrollTop || document.documentElement.scrollTop;
      console.log(GLOBAL.count);

      if(GLOBAL.ch + st >= 4800 * GLOBAL.count - 1000 ) {
            return true;
      }else{
            return false;
      }
}




// 购物车
$(".container-inner").on("click",".pushCart",handleCarClick);
$(".container-inner").on("click","img",handleDetailClick);

function handleCarClick(event){
      var e = event || window.event;
      var target = e.target || e.srcElement;
      var iid = $(target).attr("data-iid");
      var nowMsg = findJson(iid)[0];
      addCar(nowMsg,iid);
      renderCart()
}
function handleDetailClick(event){
      var e = event || window.event;
      var target = e.target || e.srcElement;
      var iid = $(target).attr("item-id");
      var nowMsg = findJson(iid)[0];
    //   console.log(nowMsg)
      localStorage.setItem("detail",JSON.stringify(nowMsg));
      location.href = "http://localhost:8080/detail.html"
}
// localStroage =>

// 1. 增删改查 ; setItem getItem length key() clear();
// 2. 遵循同源策略; 
// 3. 只能存储纯字符;


function addCar(nowMsg , iid){
      // 存数据;
      // 1. 因为我们要存的数据是对象,但是localstroage可以存储的数据只有字符;
      // object => string;
      $.extend(nowMsg , {count : 1});
      var sNowMsg = JSON.stringify(nowMsg);
      // console.log(sNowMsg);
      // 2. 如果直接进行存储的话会导致购物车里只有一个数据。如果要储存多个，那么购物车里的数据应该以数组为数据类型;
      
      // 3. 还是覆盖是为什么，因为如果已经有了数据,那么这时候我们会覆盖之前的数据;
      // 先把结构取出来 查看一下是否存在，如果存在，我就向里面拼接,如果不存在我再建立结构;

      if(!localStorage.cart){
            localStorage.setItem("cart",`[${sNowMsg}]`);
            return false;
      }
      // 如果存在对结构进行插入;

      // aMsg 变成数组了; localStorage 字符串转换成数组的数据;
      var aMsg = JSON.parse(localStorage.cart);

      // 如果存在数据就不push ， 而是增加 count 值;
      if(!hasIid(aMsg,iid)){
            aMsg.push(nowMsg);
      }

      //localStorage 重新设置；
      localStorage.setItem("cart",JSON.stringify(aMsg));

      console.log(JSON.parse(localStorage.cart));
}



function hasIid(aMsg,iid){
      for(var i = 0 ; i < aMsg.length ; i ++){
            if(aMsg[i].iid === iid){
                  aMsg[i].count ++;
                  return true;
            }
      }
      return false;
}
function findJson(iid){
      return  goodsJson.filter(function(item){
            return  item.iid === iid
      })
}



// 购物车获取;;

$("#minicart_wrap").on("mouseenter",function(){
    $(".minicart-cont").show();

    // console.log(getCart())
   $(".cartContaint").html(renderCart());

})
renderCart()
$("#minicart_wrap").on("mouseleave",function(){
    $(".minicart-cont").hide();
})

function getCart(){
      if(!localStorage.cart) return 0;
      var aMsg = JSON.parse(localStorage.cart);
      return aMsg;
}

function renderCart(){
      var html = "";
      var cart_json = getCart();
      var num = 0;
      if(!cart_json) return 0;
      for(var i = 0 ; i < cart_json.length ; i ++){
            html += `<li><img src="${cart_json[i].show.img}"> <span>${cart_json[i].price}</span> <span>${cart_json[i].count}</span></li>`;
            num += cart_json[i].count;
      }
      $(".op-cart-number").html(num)
      return html;
}

$(".clearCart").on("click",function(){
      localStorage.clear("cart");
      $(".cartContaint").html("");
      $(".op-cart-number").html("0")

})


