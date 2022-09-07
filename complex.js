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
    ('Complex', 'The Best New Music This Week', 'Lil Baby, Yeat, Ari Lennox, and More', '2022-09-02 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-september-2/kenny-beats-slowthai-family-tree');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1354; // SELECT last_insert_rowid();
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
        "title": "Detox",
        "artist_name": "Lil Baby",
        "video_id": null,
        "capture_date": "2022-09-07 03:27:41.973973",
        "source_id": 1354,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Talk",
        "artist_name": "Yeat",
        "video_id": null,
        "capture_date": "2022-09-07 03:27:41.974974",
        "source_id": 1354,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Queen Space",
        "artist_name": "Ari Lennox & Summer Walker",
        "video_id": null,
        "capture_date": "2022-09-07 03:27:41.974974",
        "source_id": 1354,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Moving Too Fast",
        "artist_name": "Pi’erre Bourne ft. Young Nudy",
        "video_id": null,
        "capture_date": "2022-09-07 03:27:41.974974",
        "source_id": 1354,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Too Much",
        "artist_name": "Freddie Gibbs ft. Moneybagg Yo",
        "video_id": null,
        "capture_date": "2022-09-07 03:27:41.974974",
        "source_id": 1354,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hell",
        "artist_name": "EST Gee",
        "video_id": null,
        "capture_date": "2022-09-07 03:27:41.974974",
        "source_id": 1354,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Ain’t Gone Hold Ya",
        "artist_name": "DJ Drama & Jeezy",
        "video_id": null,
        "capture_date": "2022-09-07 03:27:41.974974",
        "source_id": 1354,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "24-8",
        "artist_name": "Smino",
        "video_id": null,
        "capture_date": "2022-09-07 03:27:41.974974",
        "source_id": 1354,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Give Me A Sign",
        "artist_name": "Quando Rondo & NBA YoungBoy",
        "video_id": null,
        "capture_date": "2022-09-07 03:27:41.974974",
        "source_id": 1354,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Family Tree",
        "artist_name": "Kenny Beats ft. slowthai",
        "video_id": null,
        "capture_date": "2022-09-07 03:27:41.974974",
        "source_id": 1354,
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
  ('Detox', 'Lil Baby', NULL),
  ('Talk', 'Yeat', NULL),
  ('Queen Space', 'Ari Lennox & Summer Walker', NULL),
  ('Moving Too Fast', 'Pi’erre Bourne ft. Young Nudy', NULL),
  ('Too Much', 'Freddie Gibbs ft. Moneybagg Yo', NULL),
  ('Hell', 'EST Gee', NULL),
  ('I Ain’t Gone Hold Ya', 'DJ Drama & Jeezy', NULL),
  ('24-8', 'Smino', NULL),
  ('Give Me A Sign', 'Quando Rondo & NBA YoungBoy', NULL),
  ('Family Tree', 'Kenny Beats ft. slowthai', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12793; // SELECT last_insert_rowid();

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
  ('2022-09-07 03:27:41.973973', '1354', '12784'),
  ('2022-09-07 03:27:41.974974', '1354', '12785'),
  ('2022-09-07 03:27:41.974974', '1354', '12786'),
  ('2022-09-07 03:27:41.974974', '1354', '12787'),
  ('2022-09-07 03:27:41.974974', '1354', '12788'),
  ('2022-09-07 03:27:41.974974', '1354', '12789'),
  ('2022-09-07 03:27:41.974974', '1354', '12790'),
  ('2022-09-07 03:27:41.974974', '1354', '12791'),
  ('2022-09-07 03:27:41.974974', '1354', '12792'),
  ('2022-09-07 03:27:41.974974', '1354', '12793')
  ;

  // Update to source_song table
