let addBtn = document.querySelector(".add-btn");
let taskContainer = document.querySelector(".task-container");
let mainContainer = document.querySelector(".main-container");
let submitBtn = document.querySelector(".enter");
let textAreaContainer = document.querySelector(".textarea-container");
let allColorSelect = document.querySelectorAll(".color-select");
let dltBtn = document.querySelector(".dlt-btn");
let lockBtn = document.querySelector(".lock");
let defaultParam = document.querySelector(".default");
let toolBoxColor = document.querySelectorAll(".color");
let DateInputSearch = document.querySelector(".dateSearch");
let searchBtn = document.querySelector(".search");

let addFlag = false;
let remFlag = false;
let lockToggle = false;

// To store all the possible colors and to access them.
let colors = ["lightsalmon","lightblue","lightgreen","lightpink"]; 

// Default color strip to be used inside the taskArea Container.
let taskContainerColorSelect = colors[colors.length-1];   

// To store all the data in the array
let allNotes = [];


if(localStorage.getItem("Notes")) {
    allNotes = JSON.parse(localStorage.getItem("Notes"));
    display(allNotes);
}


// Display the note writing area when add button is clicked
addBtn.addEventListener("click",() => {

    // addFlag == true , Display task-container
    // addFlag == false, Remove task-container    

    addFlag = !addFlag;
    if(addFlag) {
        opacityDown();
        taskContainer.style.display = "flex";
        
    } else{
        taskContainer.style.display = "none";
    }
    
})


// This is used to reduce the opacity of background when textarea-container is shown.
function opacityDown () {
    mainContainer.style.opacity = 0.2;
}


// This is used to increase the opacity of background when textarea-container is not shown.
function opacityUp () {
    mainContainer.style.opacity = 1;
}


//Remove the notes that are clicked when the delete button is active.
dltBtn.addEventListener("click",() => {
    
    remFlag = !remFlag;
    if(remFlag) {
        dltBtn.style.color = "red";
    }else {
        dltBtn.style.color = "black";
    }
})


// For Filtering of notes on the basis of Color of Notes and to display all the notes on doubleClick.
toolBoxColor.forEach((color) => {
    
    color.addEventListener("click", () => {
        let currToolBoxColor = color.classList[0];
        
        let filterNotes = allNotes.filter((Obj) => {
            return currToolBoxColor === Obj.colorStrip;
        });

        display(filterNotes);    
    })

    color.addEventListener("dblclick",()=> {
        display(allNotes);
    })
})


// This will display all the contents of arr object passed.
function display(arr) {

    mainContainer.innerHTML = "";
    arr.forEach((ele) => {
        disp(ele.colorStrip,ele.valueInput,ele.creationDate,ele.creationTime);
    })
}


// Color-select in the task-container and setting the border around the selected color in the note.
allColorSelect.forEach((color) => {
    
    allColorSelect[allColorSelect.length-1].classList.add("border");

    // taskContainerColorSelect = colors[colors.length-1];
    color.addEventListener("click",() => {
        
        allColorSelect.forEach((remcolor,index) => {
            remcolor.classList.remove("border");
        });

        color.classList.add("border");
        taskContainerColorSelect = color.classList[0];
    });
});


// To Create a new Note when user click the Submit Button
submitBtn.addEventListener("click",() => {
    let valueInput = textAreaContainer.value;
    
    if(valueInput!="") {
        createNote(taskContainerColorSelect,valueInput);
        
        defaultOperation();       
        opacityUp();

        taskContainer.style.display = "none";
        textAreaContainer.value = "";
        
    } else {
        submitBtn.style.display = "block";
    }

})


// These operations need to be performed every time user creates a new note.
function defaultOperation () {
    
    allColorSelect.forEach((remcolor,index) => {
        remcolor.classList.remove("border");
    });

    allColorSelect[allColorSelect.length-1].classList.add("border");
    display(allNotes);
    addFlag = false;
    taskContainerColorSelect = colors[colors.length - 1]; 
}


/* This is main Structure. 
   Notes are created on the basis of value passed and is appended to the 
   Main Container and also ColorStrip of note, Locking and Unlocking of note
   and Removing of note takes place through this
*/
function disp(colorStrip,valueInput,creationDate,creationTime) {

    let createNote = document.createElement("div");
    createNote.setAttribute("class","note-area");
    
    createNote.innerHTML = `
            <div class="note-color ${colorStrip}" ></div>
            <div class="note-time">
            <div>${creationDate}</div>
            <div >${creationTime}</div>
            </div>
            <div class="note-description"> ${valueInput}</div>
            <div class="class lock"><i class="fa-solid fa-lock"></i></div>
    `;

    mainContainer.appendChild(createNote);
    
    handleRemove(createNote);
    handleLock(createNote);
    changeColor(createNote);

}


/* This function will Create a new Note with the help of disp function
   And, add the data to allNotes array as well as to the local Stroage.
*/
function createNote(colorStrip,valueInput) {
    
    const date = new Date();
    let creationDate = date.toLocaleDateString();
    let creationTime = date.toLocaleTimeString();

    disp(colorStrip,valueInput,creationDate,creationTime)

    allNotes.push({colorStrip,valueInput,creationDate,creationTime});

    localStorage.setItem("Notes",JSON.stringify(allNotes));
}


// This will change the colorStrip of the Note passed.
function changeColor(note) {

    let noteColor = note.querySelector(".note-color");
    let noteDate = note.querySelector(".note-time");

    noteColor.addEventListener("click",() => {
        let date = noteDate.children[0].innerText;
        let time = noteDate.children[1].innerText;

        let currColor = noteColor.classList[1];
        let currColorIdx = colors.indexOf(currColor);
        currColorIdx++;
        
        if(currColorIdx == colors.length) {
            currColorIdx = 0;
        }

        let newColor = colors[currColorIdx];
        noteColor.classList.remove(currColor);
        noteColor.classList.add(newColor);

        allNotes.forEach(Obj => {
            if(Obj.creationTime === time && Obj.creationDate === date)
            {
                Obj.colorStrip = newColor;
            }
        })
        
        localStorage.setItem("Notes",JSON.stringify(allNotes));     // It will override the existing key "Notes". That means old allNotes will be cleared and new allNotes array will be pushed
    })
}


// This function will let you to edit an existing Note.
function handleLock(note) {

    let lockBar = note.querySelector(".lock");
    let lock = lockBar.children[0];
    let noteDate = note.querySelector(".note-time");
    let noteEdit = note.querySelector(".note-description");

    lock.addEventListener("click",() => {
        
        // LockToggle == True ==> Unlock Mode, Lock it.
        // LockToggle == False ==> Lock Mode, Unlock it.
        if(lockToggle){       
            lock.classList.remove("fa-lock-open");
            lock.classList.add("fa-lock");
            noteEdit.setAttribute("contenteditable","false");
        }else {                     
            lock.classList.remove("fa-lock");
            lock.classList.add("fa-lock-open");
            noteEdit.setAttribute("contenteditable","true");
        }

        let date = noteDate.children[0].innerText;
        let time = noteDate.children[1].innerText;
        
        allNotes.forEach(Obj => {
            if(Obj.creationDate === date && Obj.creationTime === time)
            {
                Obj.valueInput = noteEdit.innerText;
            }
        })

        localStorage.setItem("Notes",JSON.stringify(allNotes));

        lockToggle = !lockToggle;
    })
}


// This function will remove the multiple Notes simultaneously.
function handleRemove(note) {
    
    let noteDate = note.querySelector(".note-time");
    
    note.addEventListener("click",(e) => {
        
        // removeFlag == true ==> remove note
        if(remFlag ) {

            note.remove();

            let date = noteDate.children[0].innerText;
            let time = noteDate.children[1].innerText;
            
            allNotes.forEach((Obj,idx) => {
                if(Obj.creationDate === date && Obj.creationTime === time)
                {
                    allNotes.splice(idx,1);
                }
            })
        
            localStorage.setItem("Notes",JSON.stringify(allNotes));
        }
    })
}


// This will display only those notes whose dates is specfied in the date Input.
searchBtn.addEventListener("click",(e) => {

    if(DateInputSearch.value === "") {
        alert("Enter a Date.");
    }
    else{

        let dateSearch = new Date(DateInputSearch.value).toLocaleDateString();

        let filterNotes = allNotes.filter((Obj) => {
            return Obj.creationDate === dateSearch;
        });

        display(filterNotes);
    }
})