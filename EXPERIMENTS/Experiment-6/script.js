// Selecting elements
let heading = document.getElementById("heading");
let input = document.getElementById("inputText");
let para = document.getElementById("para");
// Buttons
let changeTextBtn = document.getElementById("changeTextBtn");
let colorBtn = document.getElementById("colorBtn");
let fontBtn = document.getElementById("fontBtn");
let toggleBtn = document.getElementById("toggleBtn");
let resetBtn = document.getElementById("resetBtn");
// 1. Change Heading Text (onclick)
changeTextBtn.onclick = function() {
    heading.innerText = input.value;
};
// 2. Change Background Color (addEventListener)
colorBtn.addEventListener("click", function() {
    document.body.style.backgroundColor = "lightblue";
});
// 3. Change Font Size (onmouseover)
fontBtn.onmouseover = function() {
    heading.style.fontSize = "40px";
};
// 4. Show/Hide Paragraph
let isVisible = true;
toggleBtn.addEventListener("click", function() {
    if (isVisible) {
        para.style.display = "none";
        isVisible = false;
    } else {
        para.style.display = "block";
        isVisible = true;
    }
});
// 5. Input Change Event (onchange)
input.onchange = function() {
    console.log("Input changed to: " + input.value);
};
// 6. Reset Page
resetBtn.addEventListener("click", function() {
    heading.innerText = "Welcome to JavaScript DOM";
    document.body.style.backgroundColor = "white";
    heading.style.fontSize = "24px";
    para.style.display = "block";
    input.value = "";
});