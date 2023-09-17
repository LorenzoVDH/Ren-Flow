function randomLightColour() {
    let r = Math.floor(Math.random() * 128) + 128; // Generate a random value between 128 and 255 for red
    let g = Math.floor(Math.random() * 128) + 128; // Generate a random value between 128 and 255 for green
    let b = Math.floor(Math.random() * 128) + 128; // Generate a random value between 128 and 255 for blue
    return "#" + r.toString(16) + g.toString(16) + b.toString(16); // Convert RGB values to hex color code
  }

export default randomLightColour; 