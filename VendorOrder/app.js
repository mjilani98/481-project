function changeStatus(btn, newStatus){
    // get the order card
    let box = btn.parentElement;
    let statusText = box.querySelector(".order-status span");
       
    // update the text
    statusText.innerText = newStatus;
 
    // add some basic color change
                  if(newStatus === "Accepted"){
        statusText.style.color = "green"
    }
    else if(newStatus === "Cancelled"){
                statusText.style.color = "red" 
    }
          else{
        statusText.style.color = "orange"
    }

    // remove buttons when done
          if(newStatus === "Accepted"){
        
        btn.parentElement.innerHTML = "<button class='btn btn-primary btn-sm' onclick=\"changeStatus(this,'Completed')\">Complete</button>"
    }

    if(newStatus == "Completed"){ 
        btn.parentElement.innerHTML = "" 
    }

  
}
