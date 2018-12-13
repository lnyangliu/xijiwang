





$(".submit").on("click",function(){
    // console.log($(".caution-content").attr("style") == "display:block")
    // if($(".caution-content").attr("style") == "display: block") return false;
    let username = $("#dom_el_01").val()
    let password = $("#dom_el_02").val()
    console.log(checkPhone())
    if(!checkPhone())return false;


    $.ajax({
        type:"POST",
        url:"http://localhost:8080/api/huaUsr/register",
        data:`username=${username}&password=${password}`
    }).then(function(res){
        // console.log(res)
    })
    location.href = "http://localhost:8080/login.html"
})
$("#dom_el_01").on("blur",checkPhone)



function checkPhone(){ 
    let username = $("#dom_el_01").val()
    if(!(/^1[34578]\d{9}$/.test(username))){ 
        $(".caution-content").css({
            display:"block"
        })  
        return false; 
    }else{
        $(".caution-content").css({
            display:"none"
        }) 
        return true
    }
}

