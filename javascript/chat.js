const form=document.querySelector(".typing-area"),
inputField=form.querySelector(".input-field"),
sendBtn = form.querySelector("button"),
chatBox = document.querySelector(".chat-box");

let back=0;

form.onsubmit=(e)=>{
    e.preventDefault();//preventing form from submitting
}

sendBtn.onclick=()=>{
    let xhr=new XMLHttpRequest();
    xhr.open("POST","php/insert-chat.php",true);
    xhr.onload=()=>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            if(xhr.status===200){
                inputField.value="";//once message inserted into database then leave blank the the input field
                scrollToBottom();
            }
        }
    }
    //we have to send the form data though ajax to php
    let formData=new FormData(form);//creating new formData Object
    xhr.send(formData);//sending the form data to php
}

chatBox.onmouseenter = ()=>{
    chatBox.classList.add("active");
}
chatBox.onmouseleave = ()=>{
    chatBox.classList.remove("active");
}

setInterval(()=>{
    let xhr=new XMLHttpRequest();
    xhr.open("POST","php/get-chat.php",true);
    xhr.onload = ()=>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            if(xhr.status===200){
                let data=xhr.response;
                chatBox.innerHTML = data;
                if(!chatBox.classList.contains("active")){//if active class not contains in chatBox the scroll to bottom
                    scrollToBottom();
                }
            }
        }
    }

    //we have to send the form data though ajax to php
    let formData=new FormData(form);//creating new formData Object
    xhr.send(formData);//sending the form data to php    
},500);

function scrollToBottom(){
    chatBox.scrollTop = chatBox.scrollHeight;
}

function display(){
    if(back===0)
    {
    document.getElementsByClassName("wrapper")[0].style.backgroundImage = "url('back1.jpg')";
    back=back+1;
    }
    else{
        if(back===1)
    {
    document.getElementsByClassName("wrapper")[0].style.backgroundImage = "url('back2.jpg')";
    back=back+1;
    }
    else{
        if(back===2)
    {
    document.getElementsByClassName("wrapper")[0].style.backgroundImage = "url('back3.jpg')";
    back=back+1;
    }
    else{
        if(back===3)
    {
    document.getElementsByClassName("wrapper")[0].style.background = "white";
    back=0;
    }
}
    }
    }
}