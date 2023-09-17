function darkenColour(hexColour, percentage) {
  var num = parseInt(hexColour.slice(1), 16);
  var amt = Math.round(2.55 * percentage); 
  var R = (num >> 16) - amt;
  var B = (num >> 8 & 0x00FF) - amt;
  var G = (num & 0x0000FF) - amt;

  R = Math.max(R, 0);
  B = Math.max(B, 0);
  G = Math.max(G, 0);

  var darkenedHexColour = "#" + (R.toString(16).padStart(2, '0')) + (B.toString(16).padStart(2, '0')) + (G.toString(16).padStart(2, '0'));

  return darkenedHexColour;
}

export default darkenColour; 