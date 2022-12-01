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
    ('Complex', 'The Best New Music This Week', 'Roddy Ricch, Pharrell, Travis Scott, Don Toliver, and More', '2022-11-18 12:00:00.000000', 'https://www.complex.com/music/the-best-new-music-this-week-november-18/foushee-lil-uzi-vert-spend-that-money');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1439; // SELECT last_insert_rowid();
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
        "title": "Blue Cheese",
        "artist_name": "Roddy Ricch",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.772772",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Down In Atlanta",
        "artist_name": "Pharrell & Travis Scott",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": 13197,
        "duplicate": true
    },
    {
        "title": "Do It Right",
        "artist_name": "Don Toliver",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Yah Know",
        "artist_name": "Chance the Rapper ft. King Promise",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thumbing",
        "artist_name": "Key Glock",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Spend It",
        "artist_name": "Babyface Ray ft. Blxst & Nija",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Ending",
        "artist_name": "BROCKHAMPTON",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Love Overdose",
        "artist_name": "Rod Wave",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Speshal",
        "artist_name": "Harry Fraud & 38 Spesh ft. Stove God Cooks",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wave",
        "artist_name": "SSGKobe",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blitz",
        "artist_name": "Destroy Lonely",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Spend That Money",
        "artist_name": "Fousheé ft. Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Awesome",
        "artist_name": "Kash Paige",
        "video_id": null,
        "capture_date": "2022-11-30 03:47:11.773773",
        "source_id": 1439,
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
  ('Blue Cheese', 'Roddy Ricch', NULL),
  ('Do It Right', 'Don Toliver', NULL),
  ('Yah Know', 'Chance the Rapper ft. King Promise', NULL),
  ('Thumbing', 'Key Glock', NULL),
  ('Spend It', 'Babyface Ray ft. Blxst & Nija', NULL),
  ('The Ending', 'BROCKHAMPTON', NULL),
  ('Love Overdose', 'Rod Wave', NULL),
  ('Speshal', 'Harry Fraud & 38 Spesh ft. Stove God Cooks', NULL),
  ('Wave', 'SSGKobe', NULL),
  ('Blitz', 'Destroy Lonely', NULL),
  ('Spend That Money', 'Fousheé ft. Lil Uzi Vert', NULL),
  ('Awesome', 'Kash Paige', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13216; // SELECT last_insert_rowid();

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
  ('2022-11-30 03:47:11.772772', '1439', '13205'),
  ('2022-11-30 03:47:11.773773', '1439', '13197'),
  ('2022-11-30 03:47:11.773773', '1439', '13206'),
  ('2022-11-30 03:47:11.773773', '1439', '13207'),
  ('2022-11-30 03:47:11.773773', '1439', '13208'),
  ('2022-11-30 03:47:11.773773', '1439', '13209'),
  ('2022-11-30 03:47:11.773773', '1439', '13210'),
  ('2022-11-30 03:47:11.773773', '1439', '13211'),
  ('2022-11-30 03:47:11.773773', '1439', '13212'),
  ('2022-11-30 03:47:11.773773', '1439', '13213'),
  ('2022-11-30 03:47:11.773773', '1439', '13214'),
  ('2022-11-30 03:47:11.773773', '1439', '13215'),
  ('2022-11-30 03:47:11.773773', '1439', '13216')
  ;

  // Update to source_song table
