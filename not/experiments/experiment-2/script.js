const mainHeading = document.getElementById('mainHeading');
const headingInput = document.getElementById('headingInput');
const contentPara = document.getElementById('contentPara');
// 1. Change Heading
document.getElementById('btnHeading').addEventListener('click', function() {
if (headingInput.value !== "") {
mainHeading.innerText = headingInput.value;
}
});
// 2. Change Background Color
document.getElementById('btnBg').addEventListener('click', function() {
const colors = ['#f8d7da', '#d4edda', '#d1ecf1', '#fff3cd'];
const randomColor = colors[Math.floor(Math.random() * colors.length)];
document.body.style.backgroundColor = randomColor;
});
// 3. Increase Font Size 
let fontSize = 18;
document.getElementById('btnFont').addEventListener('click', function() {
fontSize += 2;
contentPara.style.fontSize = fontSize + "px";
});
// 4. Show/Hide Paragraph
document.getElementById('btnToggle').addEventListener('click', function() {
if (contentPara.style.visibility === "hidden") {
contentPara.style.visibility = "visible";
} else {
contentPara.style.visibility = "hidden";
}
});
// 5. Reset
document.getElementById('btnReset').addEventListener('click', function() {
mainHeading.innerText = "Welcome to JavaScript Lab";
document.body.style.backgroundColor = "#e9ecef";
contentPara.style.fontSize = "18px";
contentPara.style.visibility = "visible";
fontSize = 18;
headingInput.value = "";
});