// TODO: format the date and time (using moment.js?)
// Scroll to the bottom of the page first, so all the React stuff loads.
// Always check the last song name to make sure everything got scraped.

elements = document.getElementsByClassName("article__copy clearfix");
element = elements[0].getElementsByTagName("h2");
sourceDate = document.getElementsByClassName("info-row__datetime");
vidUrl = document.getElementsByClassName("custom-embed")

array = [];

for (var i=0; i<element.length; i++){
  merged = element[i].innerText;
  song = merged.match(/, “(.*?)”/)[1]; // may need " type quotation marks, or a comma after the artist name
  artist = merged.match(/.+?(?=, “)/)[0]; // may need " type quotation marks
  vid = vidUrl[i].getElementsByTagName("iframe")[0].src.match(/embed\/([^"]{0,})/)[1];

  obj = {
    "dateAdded": "",
    "source": "",
    "sourceDate": "",
    "sourceUrl": "",
    "songName": "",
    "artistName": "",
    "videoID": ""
  };

  obj.dateAdded = new Date();
  obj.source = "Complex Best New Music This Week";
  obj.sourceDate = sourceDate[0].innerHTML.trim();
  obj.sourceUrl = window.location.href;
  obj.songName = song;
  obj.artistName = artist;
  obj.videoID = vid;

  array.push(obj);

};

JSON.stringify(array, null, 4)
