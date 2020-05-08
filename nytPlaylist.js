// Scroll to the bottom of the page first, so all the React stuff loads.
// FIXME: sometimes two songs are grouped as one entry. this messes up vIDs.

//
// Step 1: get source data
//

  title = document.getElementsByTagName("h1")[0].innerText;
  parentStream = title.match(/.+?(?=:)/)[0];
  instanceName = title.match(/[^:]+$/)[0].trim();
  publicationDate = document.getElementsByTagName("time")[1].dateTime;

  // build the object
  source = { // a streamInstance
    "parentEntity": "New York Times",
    "parentStream": parentStream,
    "instanceName": instanceName,
    "publicationDate": publicationDate,
    "location": window.location.href,
  };

  JSON.stringify(source, null, 4)


//
// Step 2: get songs data
//

  elements = document.getElementsByClassName("css-edk2dh eoo0vm40");
  for (var i=0; i<elements.length; i++){
    merged = elements[i].innerHTML;
    song = merged.match(/, ‘(.*?)’$/)[1] // $ gives you the last apostrophe, so it doesn't cut off words like "ain't, etc."
    artist = merged.match(/.+?(?=, ‘)/)[0];
    vidUrl = document.getElementsByClassName("css-1u3pw94")[i].innerHTML;
    vid = vidUrl.match(/embed\/([^"]{0,})/)[1];

    setTimeout (console.log.bind (console, "dateAdded: " + new Date()));
    setTimeout (console.log.bind (console, "songName: " + song));
    setTimeout (console.log.bind (console, "artistName: " + artist));
    setTimeout (console.log.bind (console, "videoID: " + vid)); // temp removed `+ vid` but put it back if there aren't any double or non-YT vids this wk...
  };

  //vIDs only (gets all YT vids, including double-entries, skips non-YT):
  elements = document.getElementsByClassName("css-1u3pw94");
  for (var i=0; i<elements.length; i++){
    vidUrl = elements[i].innerHTML;
    vid = vidUrl.match(/embed\/([^"]{0,})/)[1];
    setTimeout (console.log.bind (console, "videoID: " + vid));
  };

  // line break between entries (this doesn't work):
  console.log("\n\n");
