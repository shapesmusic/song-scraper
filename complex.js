// TODO: format the date and time (using moment.js?)
// TODO: push these into a JSON
// TODO: scroll to the bottom of the page first, so all the React stuff loads.

elements = document.getElementsByClassName("article__copy clearfix");
element = elements[0].getElementsByTagName('h2');
sourceDate = document.getElementsByClassName("info-row__datetime");
vidUrl = document.getElementsByClassName("video-lazyload");
for (var i=0; i<element.length; i++){
  merged = element[i].innerHTML;
  song = merged.match(/, “(.*?)”/)[1];
  artist = merged.match(/.+?(?=, “)/);
  vid = vidUrl[i].style.backgroundImage.match(/vi\/([^\/]{0,})/)[1];

  setTimeout (console.log.bind (console, "dateAdded: " + new Date()));
  setTimeout (console.log.bind (console, "source: " + "Complex Best New Music This Week"));
  setTimeout (console.log.bind (console, "sourceDate: " + sourceDate[0].innerHTML.trim()));
  setTimeout (console.log.bind (console, "songName: " + song));
  setTimeout (console.log.bind (console, "artistName: " + artist));
  setTimeout (console.log.bind (console, "videoID: " + vid));
};
