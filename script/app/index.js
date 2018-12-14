var swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    
    autoplay: {
          disableOnInteraction: false,
          autoplay:true
      },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  for(i=0;i<swiper.pagination.bullets.length;i++){
      swiper.pagination.bullets[i].onmouseover=function(){
          this.click();
          console.log(1)
      };
  } 
  swiper.el.onmouseover = function(){
      swiper.autoplay.stop()
  }
  swiper.el.onmouseout = function(){
      swiper.autoplay.start()
  }



  $(function(){
      var index = 0;
      for(var i = 0 ; i < 2 ;i ++){
        index = i;
        $(".xj_tab")[i].index = i;
          $($(".xj_tab")[index]).on("mouseover",function(){
            $(this).children().css({
                color:"#ED5831",
                borderBottom:"1px solid #ED5831"
            })
            $(this).siblings().children().css({
                color:"#333",
                borderBottom:"none"
            })
            $($(".content-box")[this.index]).css({
                display:"block"
            })
            $($(".content-box")[this.index]).siblings().css({
                display:"none"
            })
            // console.log(this.index)
          })
      }

      $(".groupBuy").on("mouseenter",function(){
        //   console.log(1)
          $(".newuser-qrcode").css({
              opacity:"1",

          })
      })
      $(".groupBuy").on("mouseleave",function(){
        //   console.log(1)
          $(".newuser-qrcode").css({
              opacity:"0",

          })
      })


        var time = setInterval(function(){
        var end = new Date("2018/12/11 00:00:00")
        var endMs = end.getTime();
        var now = new Date();
        var nowMs = now.getTime();
        var a = (endMs - nowMs) / 1000;
        if(a <= 0){
        clearInterval(time);
        return 0 ;
        }
        var nHour = parseInt((a /(60*60))%24);
        var nMinute = parseInt((a / 60) % 60);
        var nSecond = parseInt(a % 60);
        if(nHour < 10){
        nHour = "0" + nHour;
        }
        if(nMinute < 10){
        nMinute = "0" + nMinute;
        }
        if(nSecond < 10){
        nSecond = "0" + nSecond;
        }
        $(".hour-surplus").html(nHour);
        $(".minute-surplus").html(nMinute);
        $(".second-surplus").html(nSecond);
        },1000)




        var indexNow = 0;
        var imgs = $(".goods-list li")
        // var points = $("#points span")
        $(".left").on("click",prev)
        $(".right").on("click",next)

        function next(){
            // indexNow ++;
            if(indexNow == imgs.length - 1){
                indexNow = 0;
            }else{
                indexNow ++;
            }
            changeClass()
        }

        function prev(){
            // indexNow ++;
            if(indexNow == 0){
                indexNow = imgs.length - 1;
                
            }else{
                indexNow --;
            }
            changeClass()
        }

        function changeClass(){
            
            $(imgs[indexNow]).addClass("liActive")
            .siblings("li")
            .removeClass("liActive")

        }




// 大选项卡
        var indexB = 0;
        for(var i = 0 ; i < 9 ;i ++){
            indexB = i;
          $(".tab_btn")[i].indexB = i;
            $($(".tab_btn")[indexB]).on("mouseover",function(){
              $(this).addClass("tab_btn_active")
              $(this).siblings().removeClass("tab_btn_active")
              
              $($(".contents-box-inner")[this.indexB]).addClass("box_active");
              $($(".contents-box-inner")[this.indexB]).siblings().removeClass("box_active");
              
            })
        }

//右侧小选项卡
        var indexS = 0;
        for(var i = 0 ; i < 9 ;i ++){
            indexS = i;
        $(".store_item")[i].indexS = i;
            $($(".store_item")[indexS]).on("mouseover",function(){
            $(this).addClass("rightActive")
            $(this).siblings().removeClass("rightActive")
            
            $($(".shop-content")[this.indexS]).addClass("shop_active");
            $($(".shop-content")[this.indexS]).siblings().removeClass("shop_active");
            
            })
        }
        

        var indexM = 0;
        function next(){
            if(indexM == 2 ){
                indexM = 0 ;
                $(".float_item").css({
                    left:0
                })    
            }
                indexM ++;
                
            
            $(".float_item").css({
                left:-indexM*921
            })
            
        }
        setInterval(function(){
            
            next()
        },3000)
        $(".control_next").on("click",function(){

            next()
        })
        
  })

  


