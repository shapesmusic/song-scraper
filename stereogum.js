// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'Stereogum' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDateUpper = document.getElementsByClassName("date")[0].innerText.trim();
  publicationDate = publicationDateUpper.slice(0, 1) + publicationDateUpper.slice(1).toLowerCase();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get source name info
  chartTitle = document.getElementsByClassName("hero__title headline")[0].innerText;
  parentStream = chartTitle;
  instanceName = "Week of " + publicationDate;

  // Get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Stereogum\', "
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
    ('Stereogum', 'The 5 Best Songs Of The Week', 'Week of December 2, 2022', '2022-12-02 12:00:00.000000', 'https://www.stereogum.com/2207272/the-5-best-songs-of-the-week-461/lists/the-5-best-songs-of-the-week/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1464; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("list-module__title small");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/- "(.*?)"/)[1]; // may need " or “” type quotation marks
    artist_name = elements[i].innerText.match(/.+?(?= - ")/)[0]; // may need " or “ type quotation marks
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
//          find and replace "ft."
//

  songsData =
  [
    {
        "title": "Dark Blue",
        "artist_name": "One Step Closer",
        "video_id": null,
        "capture_date": "2022-12-28 08:10:35.123123",
        "source_id": 1464,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Texas",
        "artist_name": "BigXthaPlug",
        "video_id": null,
        "capture_date": "2022-12-28 08:10:35.124124",
        "source_id": 1464,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rotten Bun",
        "artist_name": "mui zyu",
        "video_id": null,
        "capture_date": "2022-12-28 08:10:35.124124",
        "source_id": 1464,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Violent Night (A Christmas Tale)",
        "artist_name": "Chubby And The Gang",
        "video_id": null,
        "capture_date": "2022-12-28 08:10:35.124124",
        "source_id": 1464,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Famous Last Words (An Ode To Eaters)",
        "artist_name": "Ethel Cain",
        "video_id": null,
        "capture_date": "2022-12-28 08:10:35.124124",
        "source_id": 1464,
        "song_id": 13252,
        "duplicate": true
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
  // If ’ replaced, check again for duplicate

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('Dark Blue', 'One Step Closer', NULL),
  ('Texas', 'BigXthaPlug', NULL),
  ('Rotten Bun', 'mui zyu', NULL),
  ('Violent Night (A Christmas Tale)', 'Chubby And The Gang', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13267; // SELECT last_insert_rowid();

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
  ('2022-12-28 08:10:35.123123', '1464', '13264'),
  ('2022-12-28 08:10:35.124124', '1464', '13265'),
  ('2022-12-28 08:10:35.124124', '1464', '13266'),
  ('2022-12-28 08:10:35.124124', '1464', '13267'),
  ('2022-12-28 08:10:35.124124', '1464', '13252')
  ;

  // Update to source_song table
