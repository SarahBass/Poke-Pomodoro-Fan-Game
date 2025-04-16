const flashImg = document.getElementById('flashImg');
setInterval(() => {
  const now = new Date();
  const show = now.getSeconds() % 2 === 0; // Show every even second
  flashImg.style.display = show ? 'block' : 'none'; // Show/hide based on condition
}, 500);

document.addEventListener("mousemove", function (event) {
  console.log("X: " + event.clientX + " Y: " + event.clientY);
});
