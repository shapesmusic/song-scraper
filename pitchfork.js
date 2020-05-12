// FIXME: regex strip quotations from songName
// FIXME: regex [ft. artists are in brackets] and IN SONG NAME, not ARTIST
// TODO: consider using uniqid instead of Mongo's _id when adding to multiple collections with references

//
// Step 0: check most recent scraped (displays 3 songs w/ sources)
//

  db.songs.aggregate( [
      { $lookup:
        {
         from: "sources",
         localField: "captureSource",
         foreignField: "_id",
         as: "songSources"
        }
      },
      {
        $unwind: "$songSources"
      },
      { $match :
        {
          "songSources.parentEntity" : "Pitchfork"
        }
      },
      { $match :
        {
          "songSources.parentStream" : {$exists: true} // optional: filter by stream
        }
      },
      { $sort : { "songSources.publicationDate" : -1 } },
      { $limit : 3 },
      { $project:
        {
          "_id" : 0,
          "captureDate" : 0,
          "captureSource" : 0,
          "artistName" : 0,
          "videoId" : 0,
          "songSources._id" : 0,
          "songSources.parentEntity" : 0,
          "songSources.instanceName" : 0,
          "songSources.location" : 0
        }
      }
    ] ).pretty();


//
// Step 1: add moment.js
//

  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);


//
// Step 2: get source instance dates without duplicates
//

  sourceDates = [];

  // get a list of source dates from songs
  elements = document.getElementsByClassName("artist-list");
  for (var i=0; i<elements.length; i++){

    publicationDate = document.getElementsByClassName("pub-date")[i].innerText.trim();
    publicationDateFormatted = moment(publicationDate, "MMMM DD YYYY").format(); // to ISO

    sourceDates.push(publicationDateFormatted);
  };

  // remove duplicate dates
  sourceSet = new Set(sourceDates);
  sourceArray = Array.from(sourceSet)

  // build sources object from dates
  sources = [];
  for (var i=0; i<sourceArray.length; i++){

    source = {
      "parentEntity": "Pitchfork",
      "parentStream": "Track Reviews",
      "instanceName": "",
      "publicationDate": sourceArray[i],
      "location": window.location.href
    }

    sources.push(source);

  };

  JSON.stringify(sources, null, 4);


//
// Step 3: get songs data w/ placeholder source
//

  songs = [];
  elements = document.getElementsByClassName("artist-list");
  for (var i=0; i<elements.length; i++){

    // date placeholder for source
    publicationDate = document.getElementsByClassName("pub-date")[i].innerText.trim();
    publicationDateFormatted = moment(publicationDate, "MMMM DD YYYY").format(); // to ISO

    song = {
      "captureDate": moment(new Date()).format(),
      "captureSource": publicationDateFormatted, // placeholder!
      "songName": elements[i].nextElementSibling.innerText,
      "artistName": elements[i].innerText,
      "videoId": ""
    }

    songs.push(song);

  }

  JSON.stringify(songs, null, 4);


//
// Step 4: add source references in songs
//

  // add new sources to the db

  // then get their _ids and dates
  db.sources.aggregate( [
    { $match :
      { _id :
          { $in:
            [
              ObjectId("5eb9fd21ea751b2f83a055de"), // replace with current
              ObjectId("5eb9fd21ea751b2f83a055df"),
              ObjectId("5eb9fd21ea751b2f83a055e0")
            ]
          }
      }
    },
    { $project:
      {
        "parentEntity" : 0,
        "parentStream" : 0,
        "instanceName" : 0,
        "location" : 0
      }
    }
  ] ).pretty()


  // turn that result into an array, "sourcesAdded"

  // add correct source _ids to songs
  for (var i=0; i<songs.length; i++){
    for (var j=0; j<sourcesAdded.length; j++){
      if(sourcesAdded[j].publicationDate == songs[i].captureSource){
        songs[i].captureSource = sourcesAdded[j]._id
      }
    }
  }

  // format ObjectId("") before adding songs to the db
