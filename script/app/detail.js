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



// 以下是放大镜

$(function(){
	
	// 鼠标在原图中移入事件
	$(".item_pic_left").mouseenter(function(){
		// 右边放大的图出现
		$(".item_pic_right").css({
			display:"block"
		})
		// 左边放大镜小块出现
		$(".pic_cover").css({
			display:"block"
		})
		// 鼠标在原图中移动事件
		$(".item_pic_left").mousemove(function(event){
			// 鼠标横向边缘检测，150为放大镜小块的一半，450是左边原图减去 放大镜小块的一半
			if(event.offsetX > 150 && event.offsetX < 450){
				$(".pic_cover").css({
					left: event.offsetX - 150 +"px"
				})
				$(".pic_right").css({
					left: -2*(event.offsetX - 150)+"px"
				})
			}else if(event.offsetX < 150){
				$(".pic_cover").css({
					left: "0"
				})
				$(".pic_right").css({
					left: "0"
				})
			}else{
				$(".pic_cover").css({
					// 300是放大镜原图宽度减去放大镜小块的宽度
					left: "300px"
				})
				$(".pic_right").css({
					// -600是右边放大图的横向定位
					left: "-600px"
				})
			}
			// Y轴方向边缘检测    同上
			if(event.offsetY > 150 && event.offsetY < 450){
				$(".pic_cover").css({
					top: event.offsetY - 150 +"px"
				})
				$(".pic_right").css({
					top: -2*(event.offsetY - 150)+"px"
				})
			}else if(event.offsetY < 150){
				$(".pic_cover").css({
					top: "0"
				})
				$(".pic_right").css({
					top: "0"
				})
			}else{
				$(".pic_cover").css({
					top: "300px"
				})
				$(".pic_right").css({
					top: "-600px"
				})
			}
			
			
		})
	})
	// 鼠标离开时   放大镜小块和右边放大图均消失
	$(".item_pic_left").mouseleave(function(){
		$(".item_pic_right").css({
			display:"none"
		})
		$(".pic_cover").css({
			display:"none"
		})
    })
    

    // 获取购物车
    renderCart()
    $("#minicart_wrap").on("mouseenter",function(){
        $(".minicart-cont").show();
    
        // console.log(getCart())
       $(".minicart-cont").html(renderCart());
    
    })
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


    // list传来的信息
    

	
})
var msg = JSON.parse(localStorage.detail);
    $("#pic_left").attr({"src" : msg.show.img});
    $(".pic_right").attr({"src" : msg.show.img});
    $(".item_describe h2").html(msg.title);
    $(".price").html(msg.price);