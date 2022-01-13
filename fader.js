// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName("posted")[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get source name info
  chartTitle = document.getElementsByTagName("h1")[0].innerText;
  parentStream = chartTitle;
  instanceName = "Week of " + publicationDate;

  // Get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'The Fader\', "
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
    ('The Fader', '10 songs you need in your life this week', 'Week of January 05, 2022', '2022-01-05 12:00:00.000000', 'https://www.thefader.com/2022/01/05/songs-you-need-zannie-mike-ethan-flynn');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1097; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("headline");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/“(.*?)”/)[1]; // may need " or “” type quotation marks
    artist_name = elements[i].innerText.match(/– ([\s\S]*)$/)[1] // may need " or “ type quotation marks
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
//          find and replace fe~at. with "ft."
//

  songsData =
  [
    {
        "title": "mechanical bull",
        "artist_name": "zannie",
        "video_id": null,
        "capture_date": "2022-01-12 09:23:12.827827",
        "source_id": 1097,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "same",
        "artist_name": "Claire Rousay and More Eaze",
        "video_id": null,
        "capture_date": "2022-01-12 09:23:12.828828",
        "source_id": 1097,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "In My World",
        "artist_name": "MIKE",
        "video_id": null,
        "capture_date": "2022-01-12 09:23:12.828828",
        "source_id": 1097,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "99 Cent",
        "artist_name": "Valee & CHASETHEMONEY ft. Lil Stl",
        "video_id": null,
        "capture_date": "2022-01-12 09:23:12.828828",
        "source_id": 1097,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Killing Womb",
        "artist_name": "Vein.fm",
        "video_id": null,
        "capture_date": "2022-01-12 09:23:12.828828",
        "source_id": 1097,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "4th & Cherry",
        "artist_name": "Seafood Sam",
        "video_id": null,
        "capture_date": "2022-01-12 09:23:12.828828",
        "source_id": 1097,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Happy New Year",
        "artist_name": "Let's Eat Grandma",
        "video_id": null,
        "capture_date": "2022-01-12 09:23:12.828828",
        "source_id": 1097,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Signal",
        "artist_name": "Muni Long",
        "video_id": null,
        "capture_date": "2022-01-12 09:23:12.828828",
        "source_id": 1097,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Superstition",
        "artist_name": "Ethan P. Flynn and Vegyn",
        "video_id": null,
        "capture_date": "2022-01-12 09:23:12.828828",
        "source_id": 1097,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Inhalation of God",
        "artist_name": "Prolaps",
        "video_id": null,
        "capture_date": "2022-01-12 09:23:12.828828",
        "source_id": 1097,
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
  ('mechanical bull', 'zannie', NULL),
  ('same', 'Claire Rousay and More Eaze', NULL),
  ('In My World', 'MIKE', NULL),
  ('99 Cent', 'Valee & CHASETHEMONEY feat. Lil Stl', NULL),
  ('The Killing Womb', 'Vein.fm', NULL),
  ('4th & Cherry', 'Seafood Sam', NULL),
  ('Happy New Year', 'Let’s Eat Grandma', NULL),
  ('No Signal', 'Muni Long', NULL),
  ('Superstition', 'Ethan P. Flynn and Vegyn', NULL),
  ('Inhalation of God', 'Prolaps', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11476; // SELECT last_insert_rowid();

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
  ('2022-01-12 09:23:12.827827', '1097', '11467'),
  ('2022-01-12 09:23:12.828828', '1097', '11468'),
  ('2022-01-12 09:23:12.828828', '1097', '11469'),
  ('2022-01-12 09:23:12.828828', '1097', '11470'),
  ('2022-01-12 09:23:12.828828', '1097', '11471'),
  ('2022-01-12 09:23:12.828828', '1097', '11472'),
  ('2022-01-12 09:23:12.828828', '1097', '11473'),
  ('2022-01-12 09:23:12.828828', '1097', '11474'),
  ('2022-01-12 09:23:12.828828', '1097', '11475'),
  ('2022-01-12 09:23:12.828828', '1097', '11476')
  ;

  // Update to source_song table
