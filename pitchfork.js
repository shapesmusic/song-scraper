//TODO: if contains "Best New Track" change source name
    // meta = document.getElementsByClassName("track-collection-item__meta");
    // meta[i].getElementsByClassName("bnm");
//TODO: regex strip quotations from song songName
//TODO: regex [ft. artists in song name in brackets]

elements = document.getElementsByClassName("artist-list");
for (var i=0; i<elements.length; i++){
  artist = elements[i].innerText;
  song = elements[i].nextElementSibling.innerText;

  setTimeout (console.log.bind (console, "dateAdded: " + new Date()));
  setTimeout (console.log.bind (console, "source: " + "Pitchfork Reviews and Best New Tracks"));
  setTimeout (console.log.bind (console, "sourceDate: " + document.getElementsByClassName("pub-date")[i].textContent.trim()));
  setTimeout (console.log.bind (console, "sourceUrl: " + window.location.href));
  setTimeout (console.log.bind (console, "songName: " + song));
  setTimeout (console.log.bind (console, "artistName: " + artist));
  setTimeout (console.log.bind (console, "videoID: " + ""));
};
