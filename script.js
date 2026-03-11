let currentUser=localStorage.getItem("currentUser");

let tasksKey="tasks_"+currentUser;

let tasks=JSON.parse(localStorage.getItem(tasksKey))||[];

let currentFilter="all";
let searchQuery="";
let taskChart;

document.getElementById("welcomeUser").innerText="Welcome, "+currentUser;

displayTasks();



function addTask(){

let taskText=document.getElementById("taskInput").value;

let subject=document.getElementById("subjectInput").value;

if(subject==="Other"){
subject=document.getElementById("customSubject").value;
}

let priority=document.getElementById("priorityInput").value;

let date=document.getElementById("dateInput").value;

if(taskText===""){
alert("Enter a task");
return;
}

let task={
text:taskText,
subject:subject,
priority:priority,
date:date,
completed:false
};

tasks.push(task);

saveTasks();
displayTasks();

document.getElementById("taskInput").value="";
document.getElementById("dateInput").value="";
document.getElementById("customSubject").value="";

}



function displayTasks(){

let list=document.getElementById("taskList");

list.innerHTML="";

let today=new Date().toISOString().split("T")[0];

tasks.forEach((task,index)=>{

if(!task.text.toLowerCase().includes(searchQuery) &&
!task.subject.toLowerCase().includes(searchQuery)){
return;
}

if(currentFilter==="completed" && !task.completed) return;
if(currentFilter==="pending" && task.completed) return;

let li=document.createElement("li");

if(task.priority==="High"){
li.classList.add("high");
}
else if(task.priority==="Medium"){
li.classList.add("medium");
}
else{
li.classList.add("low");
}

if(task.date===today && !task.completed){
li.classList.add("dueToday");
setTimeout(()=>{
alert("Reminder: "+task.text+" is due today!");
},500);
}

let span=document.createElement("span");

span.innerText=task.priority+" | ["+task.subject+"] "+task.text+" - "+task.date;

if(task.completed){
span.style.textDecoration="line-through";
}



let completeBtn=document.createElement("button");
completeBtn.innerText="✔";

completeBtn.onclick=function(){
tasks[index].completed=!tasks[index].completed;
saveTasks();
displayTasks();
};



let editBtn=document.createElement("button");
editBtn.innerText="Edit";

editBtn.onclick=function(){

let newText=prompt("Edit task:",task.text);

if(newText!==null && newText.trim()!==""){
tasks[index].text=newText;
saveTasks();
displayTasks();
}

};



let deleteBtn=document.createElement("button");
deleteBtn.innerText="Delete";

deleteBtn.onclick=function(){
tasks.splice(index,1);
saveTasks();
displayTasks();
};



li.appendChild(span);
li.appendChild(completeBtn);
li.appendChild(editBtn);
li.appendChild(deleteBtn);

list.appendChild(li);

});



let completed=tasks.filter(task=>task.completed).length;
let total=tasks.length;
let pending=total-completed;

document.getElementById("totalTasks").innerText="Total Tasks: "+total;
document.getElementById("completedTasks").innerText="Completed: "+completed;
document.getElementById("pendingTasks").innerText="Pending: "+pending;



let percent=total===0?0:(completed/total)*100;

document.getElementById("progressBar").style.width=percent+"%";

document.getElementById("progressText").innerText=
"Progress: "+completed+" / "+total+" tasks completed";

updateChart(completed,pending);

}



function updateChart(completed,pending){

let ctx=document.getElementById("taskChart").getContext("2d");

if(taskChart){
taskChart.destroy();
}

taskChart=new Chart(ctx,{
type:"pie",
data:{
labels:["Completed","Pending"],
datasets:[{
data:[completed,pending],
backgroundColor:["#4CAF50","#FF5252"]
}]
}
});

}



function saveTasks(){
localStorage.setItem(tasksKey,JSON.stringify(tasks));
}



function toggleDarkMode(){
document.body.classList.toggle("dark");
}



function clearAllTasks(){

if(confirm("Delete all tasks?")){

tasks=[];
saveTasks();
displayTasks();

}

}



function filterTasks(filter){
currentFilter=filter;
displayTasks();
}



function searchTasks(){
searchQuery=document.getElementById("searchInput").value.toLowerCase();
displayTasks();
}



function checkCustomSubject(){

let subject=document.getElementById("subjectInput").value;

let customBox=document.getElementById("customSubject");

if(subject==="Other"){
customBox.style.display="inline-block";
}
else{
customBox.style.display="none";
}

}



function logout(){

localStorage.removeItem("loggedIn");
localStorage.removeItem("currentUser");

window.location.href="login.html";

}