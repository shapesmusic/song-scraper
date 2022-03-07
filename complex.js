// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'Complex' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  chartTitle = document.getElementsByClassName("story-title story-title__article")[0].innerText;
  parentStream = chartTitle.match(/.+?(?=:)/)[0];
  instanceName = chartTitle.match(/[^:]+$/)[0].trim();

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName("info-row__datetime")[0].innerHTML.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Complex\', "
    + "\'" + parentStream + "\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Complex', 'Best New Music This Week', 'Kanye West, Conway the Machine, EarthGang, & More', '2022-02-25 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-kanye-conway-earthgang/kodak-black-i-wish');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1156; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("article-list");
  element = elements[0].getElementsByTagName("h2"); // sometimes h2 or h3
  // videoUrl = document.getElementsByClassName("video-lazyload");

  songsData = [];

  for (var i=0; i<element.length; i++){
    title = element[i].innerText.match(/, “(.*?)”/)[1]; // may need " or “” type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artist_name = element[i].innerText.match(/.+?(?=, “)/)[0]; // may need " or “ type quotation marks
    video_id = null
      // replace null with below to grab video IDs (when all songs are YT)
      // videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0];

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    songData = {
      'title' : title,
      'artist_name' : artist_name,
      'video_id' : video_id,
      'capture_date' : capture_date,
      'source_id' : source_id,
      'song_id' : song_id,
      'duplicate' : false
    };

    songsData.push(songData);

  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace f[slash] with "ft."
//

  songsData =
  [
    {
        "title": "We Did It Kid",
        "artist_name": "Kanye West ft. Baby Keem & Migos",
        "video_id": null,
        "capture_date": "2022-03-06 09:17:36.315315",
        "source_id": 1156,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Stressed",
        "artist_name": "Conway the Machine ft. Wallo267",
        "video_id": null,
        "capture_date": "2022-03-06 09:17:36.316316",
        "source_id": 1156,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "WATERBOYZ",
        "artist_name": "EarthGang, JID, & J. Cole",
        "video_id": null,
        "capture_date": "2022-03-06 09:17:36.316316",
        "source_id": 1156,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Freaky Deaky",
        "artist_name": "Doja Cat & Tyga",
        "video_id": null,
        "capture_date": "2022-03-06 09:17:36.316316",
        "source_id": 1156,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Little Story",
        "artist_name": "Kehlani",
        "video_id": null,
        "capture_date": "2022-03-06 09:17:36.316316",
        "source_id": 1156,
        "song_id": 11745,
        "duplicate": true
    },
    {
        "title": "PBC",
        "artist_name": "Flo Milli",
        "video_id": null,
        "capture_date": "2022-03-06 09:17:36.316316",
        "source_id": 1156,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Zatoichi",
        "artist_name": "Denzel Curry ft. slowthai",
        "video_id": null,
        "capture_date": "2022-03-06 09:17:36.316316",
        "source_id": 1156,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Wish",
        "artist_name": "Kodak Black",
        "video_id": null,
        "capture_date": "2022-03-06 09:17:36.316316",
        "source_id": 1156,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Set%'
    AND artist_name LIKE '%CJ%'
  ;

  // If any changes:
  // Update var songsData = the deduplicated list above


//
// Step 4: Update nonduplicates to the song table
//

  // Build the SQL statement
  songs = [];

  for (var i=0; i<songsData.length; i++){
    song = String(
      "\n(\'" + songsData[i].title + "\', "
      + "\'" + songsData[i].artist_name + "\', "
      + "NULL)"
    );

    if (songsData[i].duplicate == false){
      songs.push(song);
    }
  }
  console.log(String(songs));


  // Stage SQL statement
  // Replace any ' in strings with ’

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('We Did It Kid', 'Kanye West ft. Baby Keem & Migos', NULL),
  ('Stressed', 'Conway the Machine ft. Wallo267', NULL),
  ('WATERBOYZ', 'EarthGang, JID, & J. Cole', NULL),
  ('Freaky Deaky', 'Doja Cat & Tyga', NULL),
  ('PBC', 'Flo Milli', NULL),
  ('Zatoichi', 'Denzel Curry ft. slowthai', NULL),
  ('I Wish', 'Kodak Black', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11760; // SELECT last_insert_rowid();

  // Calculate the number of nonduplicate songs added
  nonduplicates = 0;

  for (var i=0; i<songsData.length; i++){
    if (songsData[i].duplicate == false){
      nonduplicates++
    }
  };

  // Update nonduplicate song_ids
  for (var i=0; i<songsData.length; i++){

    if (songsData[i].duplicate == false){
      songsData[i].song_id = (song_id - nonduplicates +1);
      nonduplicates--;
    }
  }

  // Build the SQL statement
  source_songs = [];

  for (var i=0; i<songsData.length; i++){
    source_song = String(
      "\n(\'" + songsData[i].capture_date + "\', "
      + "\'" + songsData[i].source_id + "\', "
      + "\'" + songsData[i].song_id + "\')"
    );

    source_songs.push(source_song);
  }

  console.log(String(source_songs));


  // Stage the SQL statement
  INSERT INTO source_song
    (capture_date, source_id, song_id)
  VALUES
  ('2022-03-06 09:17:36.315315', '1156', '11754'),
  ('2022-03-06 09:17:36.316316', '1156', '11755'),
  ('2022-03-06 09:17:36.316316', '1156', '11756'),
  ('2022-03-06 09:17:36.316316', '1156', '11757'),
  ('2022-03-06 09:17:36.316316', '1156', '11745'),
  ('2022-03-06 09:17:36.316316', '1156', '11758'),
  ('2022-03-06 09:17:36.316316', '1156', '11759'),
  ('2022-03-06 09:17:36.316316', '1156', '11760')
  ;

  // Update to source_song table
