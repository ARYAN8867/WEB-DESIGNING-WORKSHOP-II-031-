let Employees = [];
 function addEmployee() {           
    let Emp ={
        name: document.getElementById("name").value,
     age: document.getElementById("age").value,
         id :document.getElementById("id").value,
         department: document.getElementById("department").value,
   salary: document.getElementById("salary").value,
    }
     
 };
 Employees.push(Emp);
 alert("Employee Added Successfully!");

 function displayEmployees() {
    let output = " ";
    for (let Emp of Employees){
        output += Emp.name + " - " + Emp.salary + "\n";                                     
     }
    document.getElementById("output").innerHTML = output;
 }

 function filterEmployees() {
let result = Employees.filter(Emp => Emp.salary > "50,000");
let output = " ";
 }