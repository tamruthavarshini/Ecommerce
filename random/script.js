document.addEventListener("scroll", function () {
    let scrollValue = window.scrollY;
    
    // Adjust the multiplier for better movement range
    let moveAmount = Math.min(scrollValue * 0.3, 200); // Max move limit
  
    document.querySelector(".left-image").style.transform = `translate(-${moveAmount}px, -50%)`;
    document.querySelector(".right-image").style.transform = `translate(${moveAmount}px, -50%)`;
  });
  