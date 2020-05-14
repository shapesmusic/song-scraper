// Scroll to the bottom of the page first, so all the React stuff loads.
// FIXME: sometimes two songs are grouped as one entry. this messes up vIDs.

//
// Step 0: Check most recent scraped
//

  db.sources.aggregate( [
    { $match :
      {
        parentEntity : "New York Times"
      }
    },
    { $sort : { publicationDate: -1 } },
    { $limit : 3 },
    { $project:
      {
        "parentEntity" : 0,
        "parentStream" : 0,
        "location" : 0
      }
    }
  ] ).pretty();


//
// Step 1: get source data
//

  title = document.getElementsByTagName("h1")[0].innerText;
  instanceName = title.match(/[^:]+$/)[0].trim();
  publicationDate = document.getElementsByTagName("time")[1].dateTime;

  // build the object
  source = { // a streamInstance
    "parentEntity": "New York Times",
    "parentStream": "The Playlist",
    "instanceName": instanceName,
    "publicationDate": publicationDate,
    "location": window.location.href,
  };

  JSON.stringify(source, null, 4)


//
// Step 2: get songs data
//

  sourceId = "5ebd6774f282c7b199ec3e2e" // update with source ID

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);


  songs = [];

  elements = document.getElementsByClassName("css-1hmt70a eoo0vm40"); // this class changes periodically
  for (var i=0; i<elements.length; i++){

    merged = elements[i].innerText;
    songName = merged.match(/, ‘(.*?)’$/)[1] // $ gives you the last apostrophe, so it doesn't cut off words like "ain't, etc."
    artistName = merged.match(/.+?(?=, ‘)/)[0];
    // vidUrl = document.getElementsByClassName("css-1u3pw94")[i].innerHTML;
    // videoId = vidUrl.match(/embed\/([^"]{0,})/)[1];

    // template song to fill in manually
    song = {
      "captureDate": moment(new Date()).format(),
      "captureSource": "ObjectId(" + sourceId + ")", // FIXME: should not be a string
      "songName": songName,
      "artistName": artistName,
      "videoId": "" // videoId
    };

    songs.push(song);

  };

  JSON.stringify(songs, null, 4)

  // Add videoIds manually & prune songs
  // format ObjectId("") before adding songs to the db
