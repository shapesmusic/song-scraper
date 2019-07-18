// Scroll to the bottom of the page first, so all the React stuff loads.
// sometimes two songs are grouped as one entry. keep an eye out.

elements = document.getElementsByClassName("css-edk2dh eoo0vm40");
for (var i=0; i<elements.length; i++){
  merged = elements[i].innerHTML;
  song = merged.match(/, ‘(.*?)’$/)[1] // $ gives you the last apostrophe, so it doesn't cut off words like "ain't, etc."
  artist = merged.match(/.+?(?=, ‘)/)[0];
  vidUrl = document.getElementsByClassName("css-1u3pw94")[i].innerHTML;
  vid = vidUrl.match(/embed\/([^"]{0,})/)[1];

  setTimeout (console.log.bind (console, "dateAdded: " + new Date()));
  setTimeout (console.log.bind (console, "source: " + "NYT Playlist"));
  setTimeout (console.log.bind (console, "sourceDate: " + document.getElementsByClassName("css-rqb9bm e16638kd0")[0].dateTime.trim()));
  setTimeout (console.log.bind (console, "sourceUrl: " + window.location.href));
  setTimeout (console.log.bind (console, "songName: " + song));
  setTimeout (console.log.bind (console, "artistName: " + artist));
  setTimeout (console.log.bind (console, "videoID: " + vid));
};
