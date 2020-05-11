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


//
// To see the 3 most recent scraped (by song)
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
