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
    ('Complex', 'Best New Music This Week', 'Future, Lil Baby, Giveon, and More', '2022-04-29 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-april-29/tanna-leone-fatal-attraction');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1200; // SELECT last_insert_rowid();
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
        "title": "I’m On One",
        "artist_name": "Future ft. Drake",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.953953",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Frozen",
        "artist_name": "Lil Baby",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lie Again",
        "artist_name": "Giveon",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": 12098,
        "duplicate": true
    },
    {
        "title": "Everything",
        "artist_name": "Kehlani",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Handoutz",
        "artist_name": "Internet Money ft. Yeat",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Honest",
        "artist_name": "Justin Bieber ft. Don Toliver",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ninety One",
        "artist_name": "Action Bronson",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Goes By So Fast",
        "artist_name": "Toro Y Moi",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "They Don’t Know",
        "artist_name": "Bobby Shmurda",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Going Up",
        "artist_name": "Lil Tjay",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dog Food",
        "artist_name": "IDK ft. Denzel Curry",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Butterfly Doors",
        "artist_name": "Reuben Vincent",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fatal Attraction",
        "artist_name": "Tanna Leone",
        "video_id": null,
        "capture_date": "2022-05-28 05:31:18.954954",
        "source_id": 1200,
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
  ('I’m On One', 'Future ft. Drake', NULL),
  ('Frozen', 'Lil Baby', NULL),
  ('Everything', 'Kehlani', NULL),
  ('No Handoutz', 'Internet Money ft. Yeat', NULL),
  ('Honest', 'Justin Bieber ft. Don Toliver', NULL),
  ('Ninety One', 'Action Bronson', NULL),
  ('Goes By So Fast', 'Toro Y Moi', NULL),
  ('They Don’t Know', 'Bobby Shmurda', NULL),
  ('Going Up', 'Lil Tjay', NULL),
  ('Dog Food', 'IDK ft. Denzel Curry', NULL),
  ('Butterfly Doors', 'Reuben Vincent', NULL),
  ('Fatal Attraction', 'Tanna Leone', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12111; // SELECT last_insert_rowid();

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
  ('2022-05-28 05:31:18.953953', '1200', '12100'),
  ('2022-05-28 05:31:18.954954', '1200', '12101'),
  ('2022-05-28 05:31:18.954954', '1200', '12098'),
  ('2022-05-28 05:31:18.954954', '1200', '12102'),
  ('2022-05-28 05:31:18.954954', '1200', '12103'),
  ('2022-05-28 05:31:18.954954', '1200', '12104'),
  ('2022-05-28 05:31:18.954954', '1200', '12105'),
  ('2022-05-28 05:31:18.954954', '1200', '12106'),
  ('2022-05-28 05:31:18.954954', '1200', '12107'),
  ('2022-05-28 05:31:18.954954', '1200', '12108'),
  ('2022-05-28 05:31:18.954954', '1200', '12109'),
  ('2022-05-28 05:31:18.954954', '1200', '12110'),
  ('2022-05-28 05:31:18.954954', '1200', '12111')
  ;

  // Update to source_song table
