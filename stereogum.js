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
  ('Stereogum', 'The 5 Best Songs Of The Week', 'Week of November 4, 2022', '2022-11-04 12:00:00.000000', 'https://www.stereogum.com/2205023/the-5-best-songs-of-the-week-458/lists/the-5-best-songs-of-the-week/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1430; // SELECT last_insert_rowid();
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
        "title": "God Is A Circle",
        "artist_name": "Yves Tumor",
        "video_id": null,
        "capture_date": "2022-11-11 04:16:07.715715",
        "source_id": 1430,
        "song_id": 13125,
        "duplicate": true
    },
    {
        "title": "Getting It Right",
        "artist_name": "Caitlin Rose",
        "video_id": null,
        "capture_date": "2022-11-11 04:16:07.723723",
        "source_id": 1430,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Genesis 1:1",
        "artist_name": "BabyTron",
        "video_id": null,
        "capture_date": "2022-11-11 04:16:07.723723",
        "source_id": 1430,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Shirt",
        "artist_name": "SZA",
        "video_id": null,
        "capture_date": "2022-11-11 04:16:07.723723",
        "source_id": 1430,
        "song_id": 13097,
        "duplicate": true
    },
    {
        "title": "Fallout",
        "artist_name": "Yo La Tengo",
        "video_id": null,
        "capture_date": "2022-11-11 04:16:07.723723",
        "source_id": 1430,
        "song_id": 13127,
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
  ('Getting It Right', 'Caitlin Rose', NULL),
  ('Genesis 1:1', 'BabyTron', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13145; // SELECT last_insert_rowid();

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
  ('2022-11-11 04:16:07.715715', '1430', '13125'),
  ('2022-11-11 04:16:07.723723', '1430', '13144'),
  ('2022-11-11 04:16:07.723723', '1430', '13145'),
  ('2022-11-11 04:16:07.723723', '1430', '13097'),
  ('2022-11-11 04:16:07.723723', '1430', '13127')
  ;

  // Update to source_song table
