let newTask = document.querySelector(".add");
let body = document.querySelector("body");

let grid = document.querySelector(".grid");

let colors = ["pink", "blue", "green", "black"];

let allFilterChildren=document.querySelectorAll(".filter div")

for(let i=0;i<allFilterChildren.length;i++){
    allFilterChildren[i].addEventListener("click",function(e){
        let filterColor=e.currentTarget.classList[0]
        loadTasks(filterColor)
    })
}
//delete buton
let deleteBtn =document.querySelector(".delete");
//delete button mode
let deleteMode=false;
//data storage
if(localStorage.getItem("AllTickets")==undefined){
    let allTickets={}

    allTickets=JSON.stringify(allTickets);

    localStorage.setItem("AllTickets",allTickets)
}

loadTasks()
//delete click
deleteBtn.addEventListener("click",function(e){
    if(e.currentTarget.classList.contains("delete-selected")){
    //click one time,select
    e.currentTarget.classList.remove("delete-selected")
     deleteMode=false;

    }
    else{
        e.currentTarget.classList.add("delete-selected")
         deleteMode=true;

    }
})

newTask.addEventListener("click", function () {
    
    //delete button ko band krna hai
    deleteBtn.classList.remove("delete-selected")
    deleteMode=false;

    let preModal = document.querySelector(".modal");
    if (preModal != null) return;

    let div = document.createElement("div");
    div.classList.add("modal");
    div.innerHTML = `<div class='task-section'>
    <div class='task-inner-container' contenteditable='true'>
        <div class='task-text'></div></div></div>
        <div class='modal-priority-section'><div class='modal-inner-container'>
            <div class='modal-priority pink'></div>
            <div class='modal-priority blue'></div>
            <div class='modal-priority green'></div>
            <div class='modal-priority black selected'></div>
        </div>
    </div>`

    let priorityTask = div.querySelectorAll(".modal-priority");
    let ticketColor = "black";
    for (let i = 0; i < priorityTask.length; i++) {

        priorityTask[i].addEventListener("click", function (e) {
            console.log(13)
            for (let j = 0; j < priorityTask.length; j++) {
                priorityTask[j].classList.remove("selected")
            }
            e.currentTarget.classList.add("selected");
            ticketColor = e.currentTarget.classList[1];
        });
    }

    let taskInner = div.querySelector(".task-inner-container");
    let uid = new ShortUniqueId();
    let id= uid();
    taskInner.addEventListener("keydown", function (e) {
        if (e.key == "Enter") {
        let task=e.currentTarget.innerText
            //step 1=>jo bhi data hai local storage k andr hai usse lekr aao
           let allTickets=JSON.parse(localStorage.getItem("AllTickets"))
           // step 2=> uppdate kro usse
                console.log(allTickets);
            let ticketObj = {
                color:ticketColor,
               taskValue : task
             };
           allTickets[id]=ticketObj;
         //   step3 =>wapis obhject mei loal storage mei save krado
          localStorage.setItem("AllTickets",JSON.stringify(allTickets));

            
            let ticketDiv = document.createElement("div");
            ticketDiv.setAttribute("data-id",id)
            ticketDiv.classList.add("ticket")
            ticketDiv.innerHTML = `<div data-id="${id}" class='ticket-color ${ticketColor}'></div>
<div class='ticket-id'>
#${id}
</div>
<div data-id="${id}" class='ticket-task' contenteditable="true">
${task   }
</div>`;


let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
let actualTaskDiv=ticketDiv.querySelector(".ticket-task")
actualTaskDiv.addEventListener("input",function(e){

    let updatedTask=e.currentTarget.innerText
    let allTickets=JSON.parse(localStorage.getItem("AllTickets"))
    let currID=e.currentTarget.getAttribute("data-id")

    allTickets[currID].taskValue=updatedTask

    localStorage.setItem("AllTickets",JSON.stringify(allTickets));

})
ticketColorDiv.addEventListener("click", function (e) {
    // let colors = ["pink", "blue", "green", "black"];
    let currTicketId=e.currentTarget.getAttribute("data-id")
    let currColor = e.currentTarget.classList[1]; //green
    //console.log(e.currentTarget.getAttribute("data-id"))
    let index = -1;
    for (let i = 0; i < colors.length; i++) {
        if (colors[i] == currColor) index = i;
    }

    index++;
    index = index % 4;

    let newColor = colors[index];
    let AllTickets=JSON.parse(localStorage.getItem("AllTickets"))
    AllTickets[currTicketId].color=newColor;
    localStorage.setItem("AllTickets",JSON.stringify(AllTickets))

    ticketColorDiv.classList.remove(currColor);
    ticketColorDiv.classList.add(newColor);

    // grid.append(ticketDiv)
});

 ticketDiv.addEventListener("click",function(e){
     if(deleteMode==true){
        let currTicketId=e.currentTarget.getAttribute("data-id")

         e.currentTarget.remove()
         let allTickets=JSON.parse(localStorage.getItem("AllTickets"))
         delete allTickets[currTicketId]
         localStorage.setItem("AllTickets",JSON.stringify(allTickets))

     }
 })

            grid.append(ticketDiv);

          
            div.remove()
        }
        else if (e.key === "Escape") {
            div.remove()
        }
    });


    body.append(div);

})

function loadTasks(color){

    let ticketOnUI=document.querySelectorAll(".ticket")
    
    for(let i=0;i<ticketOnUI.length;i++){
        ticketOnUI[i].remove()
    }

//step1 fetch all ticket data
let allTickets=JSON.parse(localStorage.getItem("AllTickets"))

//2 create single ticket ui for tickets
for(x in allTickets){
    let currTicketId=x
    let singleTicketObj=allTickets[x]

    //paseed black color
    if(color){
        if(color!=singleTicketObj.color) continue;
    }
    let ticketDiv = document.createElement("div");
    ticketDiv.setAttribute("data-id",currTicketId)
    ticketDiv.classList.add("ticket")
    ticketDiv.innerHTML = `<div data-id="${currTicketId}" class='ticket-color ${singleTicketObj.color}'></div>
<div class='ticket-id'>
#${currTicketId}
</div>
<div data-id="${currTicketId}" class='ticket-task' contenteditable="true">
${singleTicketObj.taskValue   }
</div>`;

//3 attach ticket listeners
//4 add ticket in the grid ui

let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
let actualTaskDiv=ticketDiv.querySelector(".ticket-task")
actualTaskDiv.addEventListener("input",function(e){

    let updatedTask=e.currentTarget.innerText
    let allTickets=JSON.parse(localStorage.getItem("AllTickets"))
    let currID=e.currentTarget.getAttribute("data-id")

    allTickets[currID].taskValue=updatedTask

    localStorage.setItem("AllTickets",JSON.stringify(allTickets));

})
ticketColorDiv.addEventListener("click", function (e) {
    // let colors = ["pink", "blue", "green", "black"];
    let currTicketId=e.currentTarget.getAttribute("data-id")
    let currColor = e.currentTarget.classList[1]; //green
    //console.log(e.currentTarget.getAttribute("data-id"))
    let index = -1;
    for (let i = 0; i < colors.length; i++) {
        if (colors[i] == currColor) index = i;
    }

    index++;
    index = index % 4;

    let newColor = colors[index];
    let AllTickets=JSON.parse(localStorage.getItem("AllTickets"))
    AllTickets[currTicketId].color=newColor;
    localStorage.setItem("AllTickets",JSON.stringify(AllTickets))

    ticketColorDiv.classList.remove(currColor);
    ticketColorDiv.classList.add(newColor);

    // grid.append(ticketDiv)
});

 ticketDiv.addEventListener("click",function(e){
     if(deleteMode==true){
        let currTicketId=e.currentTarget.getAttribute("data-id")

         e.currentTarget.remove()
         let allTickets=JSON.parse(localStorage.getItem("AllTickets"))
         delete allTickets[currTicketId]
         localStorage.setItem("AllTickets",JSON.stringify(allTickets))

     }
 })
 grid.append(ticketDiv);

}

}