   



          function changeStatus(btn, newStatus) {
    // find the card for this order
     
	 let card = btn.closest(".order-card");
    
	 
	   let statusSpan = card.querySelector(".order-status span");
    let pill = card.querySelector(".status-pill");

    // update text
    statusSpan.innerText = newStatus;
    pill.innerText = newStatus;

    // update data
    card.setAttribute("data-status", newStatus);

    // reset classes
    card.classList.remove("accepted"); 
	
	
     
	card.classList.remove("completed");
    card.classList.remove("cancelled");          

    // apply colors for statuse
    if (newStatus === "Accepted") {
        statusSpan.style.color = "green";
        pill.className = "badge bg-success status-pill";
        card.classList.add("accepted");

        // show the completed buttons 
        
		
		
		 btn.parentElement.innerHTML =
            "<button class='emu-btn emu-btn-main me-1' onclick=\"changeStatus(this,'Completed')\">Mark Completed</button>" +
            "<button class='emu-btn emu-btn-danger' onclick=\"changeStatus(this,'Cancelled')\">Cancel</button>";

        // feedbacks 
		
        alert("Order accepted! 🦅 Time to cook!");
    }
    else if (newStatus === "Completed") {
        statusSpan.style.color = "#0d6efd";
        pill.className = "badge bg-primary status-pill";
        card.classList.add("completed");

        btn.parentElement.innerHTML = "";
        alert("Order completed! Student will love this one.");
    }
    else if (newStatus === "Cancelled") {
        statusSpan.style.color = "red";
        pill.className = "badge bg-danger status-pill";
        card.classList.add("cancelled");

        btn.parentElement.innerHTML = "";
    }
    else {
        //pending
        statusSpan.style.color = "orange";
        pill.className = "badge bg-warning status-pill";
    }
}


function filterOrders(filterType) {
    let cards = document.querySelectorAll(".order-card");

    cards.forEach(function(card) {
        let status = card.getAttribute("data-status");

        if (filterType === "all") {
            card.style.display = "block";
        } else {
            if (status === filterType) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        }
    });
}
