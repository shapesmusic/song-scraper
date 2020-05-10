// Scroll to the bottom of the page first, so all the React stuff loads
// Always check the last song name to make sure everything got scraped

//
// Step 1: get source data
//

  chartTitle = document.getElementsByClassName("story-title story-title__article")[0].innerText;
  parentStream = chartTitle.match(/.+?(?=:)/)[0];
  instanceName = chartTitle.match(/[^:]+$/)[0].trim();

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // get and format publicationDate
  publicationDate = document.getElementsByClassName("info-row__datetime")[0].innerHTML.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format(); // to ISO

  // build the object
  source = { // a streamInstance
    "parentEntity": "Complex",
    "parentStream": parentStream,
    "instanceName": instanceName,
    "publicationDate": publicationDateFormatted,
    "location": window.location.href,
  };

  JSON.stringify(source, null, 4)


//
// Step 2: get songs data
//

  sourceId = "5eb2404e8e1f3aed7d986b74" // update with source ID

  elements = document.getElementsByClassName("article__copy clearfix");
  element = elements[0].getElementsByTagName("h3"); // sometimes h2 or h3
  videoUrl = document.getElementsByClassName("video-lazyload");

  songs = [];

  for (var i=0; i<element.length; i++){
    songName = element[i].innerText.match(/, “(.*?)”/)[1]; // may need " or “” type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artistName = element[i].innerText.match(/.+?(?=, “)/)[0]; // may need " or “ type quotation marks
    videoId = videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0]; // example: url("https://i.ytimg.com/vi/gejbbL1AaJk/hqdefault.jpg")

    song = {
      "captureDate": moment(new Date()).format(),
      "captureSource": "ObjectId(" + sourceId + ")", // FIXME: should not be a string
      "songName": songName,
      "artistName": artistName,
      "videoId": videoId
    };

    songs.push(song);

  };

  JSON.stringify(songs, null, 4)


//
// To see most recent scraped
//

  db.sources.aggregate( [
    { $match :
      {
        parentStream : "Best New Music This Week"
      }
    },
    { $sort : { publicationDate: -1 } },
    { $project:
      {
        "_id" : 0,
        "parentEntity" : 0,
        "parentStream" : 0,
        "instanceName" : 0,
        "location" : 0
      }
    }
  ] ).pretty();
