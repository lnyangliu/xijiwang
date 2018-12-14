function Login(){
    var oUser = $("#dom_el_01").val();
    var oPwd = $("#dom_el_02").val();

    $(".submit").click(function(){
        $.ajax({
            type:'POST',
            url: "http://localhost:8080/api/huausr/login",
            data:`username=${oUser}&password=${oPwd}`
        })
        .then(function(res){
            console.log(res);
           if(res){
            location.href="index.html";

            var prevLink = document.referrer;
            if($.trim(prevLink)==''){
                location.href = 'index.html';
            }else{
                if(prevLink.indexOf('list.html')!==-1){	//来自其它站点
                    location.href = 'list.html';
                }
                if(prevLink.indexOf('register.html')!=-1){		//来自注册页面
                    location.href = 'index.html';
                } 
                if(prevLink.indexOf('detail.html') !==-1){	//来自其它站点
                    location.href = 'detail.html';
                }

            }
           }
        })
    })
}

Login();