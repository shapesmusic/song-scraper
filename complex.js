// TODO: trim & separate artist and song
// TODO: separate out the video ID
// TODO: add source into the song record. make it a complete song record.
// TODO: push these into a JSON
// TODO: add dateAdded & format dates (using moment?)

// sourceDate
element = document.getElementsByClassName("info-row__datetime");
console.log(element[0].innerHTML);

// artist(s) + title
elements = document.getElementsByClassName("article__copy clearfix");
element = elements[0].getElementsByTagName('h2');
for (var i=0; i<element.length; i++){
  console.log("artist+song: " + element[i].innerHTML);
};


// VID
vid = document.getElementsByClassName("video-lazyload");
for (var i=0; i<vid.length; i++){
  console.log(vid[i].style.backgroundImage);
};

// everything
elements = document.getElementsByClassName("article__copy clearfix");
element = elements[0].getElementsByTagName('h2');
sourceDate = document.getElementsByClassName("info-row__datetime");
vid = document.getElementsByClassName("video-lazyload");
for (var i=0; i<element.length; i++){
  setTimeout (console.log.bind (console, "artist+song: " + element[i].innerHTML.trim()));
  setTimeout (console.log.bind (console, "sourceDate: " + sourceDate[0].innerHTML.trim()));
  setTimeout (console.log.bind (console, "vid: " + vid[i].style.backgroundImage.trim()));
};
