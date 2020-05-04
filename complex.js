// TODO: format the date and time (using moment.js?)
// TODO: push these into a JSON
// Scroll to the bottom of the page first, so all the React stuff loads.
// Always check the last song name to make sure everything got scraped.

elements = document.getElementsByClassName("article__copy clearfix");
element = elements[0].getElementsByTagName("h2");
sourceDate = document.getElementsByClassName("info-row__datetime");
vidUrl = document.getElementsByClassName("custom-embed")
for (var i=0; i<element.length; i++){
  merged = element[i].innerText;
  song = merged.match(/, “(.*?)”/)[1]; // may need " type quotation marks, or a comma after the artist name
  artist = merged.match(/.+?(?=, “)/)[0]; // may need " type quotation marks
  vid = vidUrl[i].getElementsByTagName("iframe")[0].src.match(/embed\/([^"]{0,})/)[1];

  console.log("dateAdded: " + new Date());
  console.log("source: " + "Complex Best New Music This Week");
  console.log("sourceDate: " + sourceDate[0].innerHTML.trim());
  console.log("sourceUrl: " + window.location.href);
  console.log("songName: " + song);
  console.log("artistName: " + artist);
  console.log("videoID: " + vid);
};
