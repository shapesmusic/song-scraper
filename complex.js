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
  // If ’ replaced, check again for duplicate

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Complex', 'The Best New Music This Week', 'Brent Faiyaz, Burna Boy, Ken Carson, and More', '2022-07-08 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-july-8/key-glock-diapers');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1289; // SELECT last_insert_rowid();
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
        "title": "Role Model",
        "artist_name": "Brent Faiyaz",
        "video_id": null,
        "capture_date": "2022-07-15 04:02:27.589589",
        "source_id": 1289,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Toni-Ann Singh",
        "artist_name": "Burna Boy ft. Popcaan",
        "video_id": null,
        "capture_date": "2022-07-15 04:02:27.590590",
        "source_id": 1289,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Go",
        "artist_name": "Ken Carson",
        "video_id": null,
        "capture_date": "2022-07-15 04:02:27.590590",
        "source_id": 1289,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bitch I’m Nice",
        "artist_name": "Doechii",
        "video_id": null,
        "capture_date": "2022-07-15 04:02:27.590590",
        "source_id": 1289,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Danhausen",
        "artist_name": "Westside Gunn",
        "video_id": null,
        "capture_date": "2022-07-15 04:02:27.590590",
        "source_id": 1289,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Paris To Tokyo",
        "artist_name": "Fivo Foreign & Kid LAROI",
        "video_id": null,
        "capture_date": "2022-07-15 04:02:27.590590",
        "source_id": 1289,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Mas",
        "artist_name": "Murda Beatz ft. Quavo, Pharrell, J Balvin & Anitta",
        "video_id": null,
        "capture_date": "2022-07-15 04:02:27.590590",
        "source_id": 1289,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Survivor’s Guilt",
        "artist_name": "Joey Badass",
        "video_id": null,
        "capture_date": "2022-07-15 04:02:27.590590",
        "source_id": 1289,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Life Is Good",
        "artist_name": "SiR ft. Scribz Riley",
        "video_id": null,
        "capture_date": "2022-07-15 04:02:27.590590",
        "source_id": 1289,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Diapers",
        "artist_name": "Key Glock",
        "video_id": null,
        "capture_date": "2022-07-15 04:02:27.590590",
        "source_id": 1289,
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
  ('Role Model', 'Brent Faiyaz', NULL),
  ('Toni-Ann Singh', 'Burna Boy ft. Popcaan', NULL),
  ('Go', 'Ken Carson', NULL),
  ('Bitch I’m Nice', 'Doechii', NULL),
  ('Danhausen', 'Westside Gunn', NULL),
  ('Paris To Tokyo', 'Fivo Foreign & Kid LAROI', NULL),
  ('No Mas', 'Murda Beatz ft. Quavo, Pharrell, J Balvin & Anitta', NULL),
  ('Survivor’s Guilt', 'Joey Badass', NULL),
  ('Life Is Good', 'SiR ft. Scribz Riley', NULL),
  ('Diapers', 'Key Glock', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12502; // SELECT last_insert_rowid();

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
  ('2022-07-15 04:02:27.589589', '1289', '12493'),
  ('2022-07-15 04:02:27.590590', '1289', '12494'),
  ('2022-07-15 04:02:27.590590', '1289', '12495'),
  ('2022-07-15 04:02:27.590590', '1289', '12496'),
  ('2022-07-15 04:02:27.590590', '1289', '12497'),
  ('2022-07-15 04:02:27.590590', '1289', '12498'),
  ('2022-07-15 04:02:27.590590', '1289', '12499'),
  ('2022-07-15 04:02:27.590590', '1289', '12500'),
  ('2022-07-15 04:02:27.590590', '1289', '12501'),
  ('2022-07-15 04:02:27.590590', '1289', '12502')
  ;

  // Update to source_song table
