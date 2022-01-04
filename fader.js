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
    ('The Fader', '10 songs you need in your life this week', 'Week of December 22, 2021', '2021-12-22 12:00:00.000000', 'https://www.thefader.com/2021/12/22/songs-you-need-fka-twigs-tierra-whack-chief-keef');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1091; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("headline");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/"(.*?)"/)[1]; // may need " or “” type quotation marks
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
//          find and replace with "ft."
//

  songsData =
  [
    {
        "title": "Tears In The Club",
        "artist_name": "FKA twigs ft. The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-04 11:59:21.481481",
        "source_id": 1091,
        "song_id": 11333,
        "duplicate": true
    },
    {
        "title": "Tuxedo",
        "artist_name": "Chief Keef ft. Tadoe",
        "video_id": null,
        "capture_date": "2022-01-04 11:59:21.481481",
        "source_id": 1091,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Butterflies",
        "artist_name": "MAX featuring FLETCHER",
        "video_id": null,
        "capture_date": "2022-01-04 11:59:21.481481",
        "source_id": 1091,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "On Call",
        "artist_name": "Nija",
        "video_id": null,
        "capture_date": "2022-01-04 11:59:21.481481",
        "source_id": 1091,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cutting Onions",
        "artist_name": "Tierra Whack",
        "video_id": null,
        "capture_date": "2022-01-04 11:59:21.482482",
        "source_id": 1091,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Moth In The Flame",
        "artist_name": "Boldy James & The Alchemist",
        "video_id": null,
        "capture_date": "2022-01-04 11:59:21.482482",
        "source_id": 1091,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Les Cerfs",
        "artist_name": "Nick Cave & Warren Ellis",
        "video_id": null,
        "capture_date": "2022-01-04 11:59:21.482482",
        "source_id": 1091,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dollar Signs",
        "artist_name": "YGTUT ft. Michael da Vinci",
        "video_id": null,
        "capture_date": "2022-01-04 11:59:21.482482",
        "source_id": 1091,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Will You Be? (CFCF Remix)",
        "artist_name": "Baltra",
        "video_id": null,
        "capture_date": "2022-01-04 11:59:21.482482",
        "source_id": 1091,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fastest Star (Julia Holter Remix)",
        "artist_name": "Beverly Glenn-Copeland",
        "video_id": null,
        "capture_date": "2022-01-04 11:59:21.482482",
        "source_id": 1091,
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
  ('Tuxedo', 'Chief Keef ft. Tadoe', NULL),
  ('Butterflies', 'MAX featuring FLETCHER', NULL),
  ('On Call', 'Nija', NULL),
  ('Cutting Onions', 'Tierra Whack', NULL),
  ('Moth In The Flame', 'Boldy James & The Alchemist', NULL),
  ('Les Cerfs', 'Nick Cave & Warren Ellis', NULL),
  ('Dollar Signs', 'YGTUT ft. Michael da Vinci', NULL),
  ('Will You Be? (CFCF Remix)', 'Baltra', NULL),
  ('Fastest Star (Julia Holter Remix)', 'Beverly Glenn-Copeland', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11429; // SELECT last_insert_rowid();

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
  ('2022-01-04 11:59:21.481481', '1091', '11333'),
  ('2022-01-04 11:59:21.481481', '1091', '11421'),
  ('2022-01-04 11:59:21.481481', '1091', '11422'),
  ('2022-01-04 11:59:21.481481', '1091', '11423'),
  ('2022-01-04 11:59:21.482482', '1091', '11424'),
  ('2022-01-04 11:59:21.482482', '1091', '11425'),
  ('2022-01-04 11:59:21.482482', '1091', '11426'),
  ('2022-01-04 11:59:21.482482', '1091', '11427'),
  ('2022-01-04 11:59:21.482482', '1091', '11428'),
  ('2022-01-04 11:59:21.482482', '1091', '11429')
  ;

  // Update to source_song table
