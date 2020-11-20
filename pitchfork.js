// FIXME: regex strip quotations from songName
// FIXME: regex [ft. artists are in brackets] and IN SONG NAME, not ARTIST
// TODO: consider using uniqid instead of Mongo's _id when adding to multiple collections with references

//
// Step 0: Check recent scraped
//

  SELECT song.title, source.publication_date
  FROM source_song
  INNER JOIN song
    ON song.id = source_song.song_id
  INNER JOIN source
    ON source.id = source_song.source_id
  WHERE source.parent_entity = 'Pitchfork'
  ORDER BY source.publication_date DESC LIMIT 8;

//
// Step 1: add moment.js
//

  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);


//
// Step 2: get source instance dates without duplicates
//

  // Note: a new song may already have an existing source!
  //
  // Songs released today have an "hours ago" date format, so enter YYYY-MM-DD manually
  //
  // Also may need to remove page number from "location" field if scrolling down a lot to catch up.

  sourceDates = [];

  // get a list of source dates from songs
  elements = document.getElementsByClassName("artist-list");
  for (var i=0; i<elements.length; i++){

    publicationDate = document.getElementsByClassName("pub-date")[i].innerText.trim();
    publicationDateFormatted = moment(publicationDate, "MMMM DD YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    sourceDates.push(publicationDateFormatted);
  };

  // remove duplicate dates
  sourceSet = new Set(sourceDates);
  sourceArray = Array.from(sourceSet)

  // build sources object from dates
  sources = [];
  for (var i=0; i<sourceArray.length; i++){

    publicationDate = sourceArray[i];
    chartLocation = window.location.href;

    source = String(
      "\n(\'Pitchfork\', "
      + "\'Track Reviews\', "
      + "NULL, "
      + "\'" + publicationDate + "\', "
      + "\'" + chartLocation + "\')"
    );

    sources.push(source);

  };

  console.log(String(sources));


//
// Step 3: get songs data w/ placeholder source
//

  songs = [];
  elements = document.getElementsByClassName("artist-list");
  for (var i=0; i<elements.length; i++){

    // date placeholder for source
    publicationDate = document.getElementsByClassName("pub-date")[i].innerText.trim();
    publicationDateFormatted = moment(publicationDate, "MMMM DD YYYY").format(); // to ISO

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
    title = elements[i].nextElementSibling.innerText.match(/“(.*?)”/)[1]; // everything inside the quotatino marks
    artist_name = elements[i].innerText;

    song = String(
      "\n(\'" + capture_date + "\', "
      + publicationDateFormatted + ", " // placeholder!
      + "\'" + title + "\', "
      + "\'" + artist_name + "\', "
      + "NULL)"
    );

    songs.push(song);

  }

  console.log(String(songs));


//
// Step 4: add source references in songs
//

  // add new sources to the db

  // then get their _ids and dates
  SELECT id, publication_date, parent_entity FROM source ORDER BY id DESC LIMIT 3;

  // manually add sources to songs.


  // TODO: update the code below to automate this process

  // turn that result into an array, "sourcesAdded"

  // the "songs" array already exists from scraping

  // add correct source _ids to songs
  for (var i=0; i<songs.length; i++){
    for (var j=0; j<sourcesAdded.length; j++){
      if(sourcesAdded[j].publicationDate == songs[i].captureSource){
        songs[i].captureSource = sourcesAdded[j]._id
      }
    }
  }

  JSON.stringify(songs, null, 4);


//
// Step 5: paste final statements below:
//

INSERT INTO source
  (parent_entity, parent_stream, instance_name, publication_date, location)
VALUES
  ('Pitchfork', 'Track Reviews', NULL, '2020-10-16 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/'),
  ('Pitchfork', 'Track Reviews', NULL, '2020-10-15 12:00:00.000000', 'https://pitchfork.com/reviews/tracks/')
;


INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-10-20 09:11:29.173173', 735, 'Let Me Love You Like a Woman', 'Lana Del Rey', NULL),
  ('2020-10-20 09:11:29.173173', 736, 'Robber', 'The Weather Station', NULL)
;
