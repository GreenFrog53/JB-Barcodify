
// Select the element with the specific class and ID
const pluElement = document.querySelector('.zm2jk14#pdp-title-plu');

if (pluElement) {
  
  // Extract the current PLU number (assuming it's after the colon)
  const currentPlu = pluElement.textContent.split(':')[1].trim();
  // Print the original PLU to the console
  console.log("Original PLU:", currentPlu);
  
  const baseUrl = 'http://bwipjs-api.metafloor.com/?bcid=code128&text='

  // Create a new image element
  const image = new Image();
  image.src = baseUrl + currentPlu;

  // Replace the element content with the image
  pluElement.textContent = ""; // Clear existing plu
  pluElement.appendChild(image);

} else {
  console.log("PLU element not found on this webpage.");
}

// Made with love xx