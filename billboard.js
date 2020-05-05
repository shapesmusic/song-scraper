//
// Step 1: get source data
//

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // get and format publicationDate
  publicationDate = document.getElementsByClassName('date-selector__button button--link')[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format(); // to ISO

  // build the object
  source = { // a streamInstance
    "parentEntity": "Billboard",
    "parentStream": "The Hot 100",
    "instanceName": "Week of " + publicationDate,
    "publicationDate": publicationDateFormatted,
    "location": window.location.href,
  };

  JSON.stringify(source, null, 4)


//
// Step 2: get songs data
//
  sourceId = "5eb0e81665bca35b26437f21" // update with source ID

  elements = document.getElementsByClassName('chart-list__element display--flex');

  songs = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];
      isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
      songName = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
      artistName = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

      song = {
        "captureDate": moment(new Date()).format(),
        "captureSource": "ObjectId(" + sourceId + ")", // FIXME: should not be a string
        "songName": songName.innerText.trim(),
        "artistName": artistName.innerText.trim(),
        "videoId": ""
      };

      if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

        songs.push(song);

      };

  };

  JSON.stringify(songs, null, 4)
