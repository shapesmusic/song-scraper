// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 249 // from the chart page

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
  instanceName = "No. " + fader_no + " Week of " + publicationDate;

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
    ('The Fader', '10 songs you need in your life this week', 'No. 249 Week of April 18, 2022', '2022-04-18 12:00:00.000000', 'https://www.thefader.com/2022/05/27/isaiah-rashad-comes-out-as-sexually-fluid-in-new-interview');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1191; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("headline");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/[“"](.*?)[”"]/)[1];
    artist_name = elements[i].innerText.match(/[–-—-] ([\s\S]*)$/)[1]; // still gets stuck on &nbsp;
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
        "title": "Camille’s Daughter",
        "artist_name": "KeiyaA",
        "video_id": null,
        "capture_date": "2022-05-27 09:33:04.483483",
        "source_id": 1191,
        "song_id": 12023,
        "duplicate": true
    },
    {
        "title": "Things You Said",
        "artist_name": "gglum",
        "video_id": null,
        "capture_date": "2022-05-27 09:33:04.483483",
        "source_id": 1191,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Neon Memories",
        "artist_name": "death's dynamic shroud",
        "video_id": null,
        "capture_date": "2022-05-27 09:33:04.483483",
        "source_id": 1191,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Stitch",
        "artist_name": "Alex G",
        "video_id": null,
        "capture_date": "2022-05-27 09:33:04.483483",
        "source_id": 1191,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Memories",
        "artist_name": "Conan Gray",
        "video_id": null,
        "capture_date": "2022-05-27 09:33:04.483483",
        "source_id": 1191,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sidelines",
        "artist_name": "Phoebe Bridgers",
        "video_id": null,
        "capture_date": "2022-05-27 09:33:04.483483",
        "source_id": 1191,
        "song_id": 12025,
        "duplicate": true
    },
    {
        "title": "AYE! (Free The Homies)",
        "artist_name": "Vince Staples",
        "video_id": null,
        "capture_date": "2022-05-27 09:33:04.483483",
        "source_id": 1191,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Treat Me",
        "artist_name": "Chlöe",
        "video_id": null,
        "capture_date": "2022-05-27 09:33:04.483483",
        "source_id": 1191,
        "song_id": 12016,
        "duplicate": true
    },
    {
        "title": "Let's Do It Again",
        "artist_name": "Jamie xx",
        "video_id": null,
        "capture_date": "2022-05-27 09:33:04.483483",
        "source_id": 1191,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Alive Ain't Always Living",
        "artist_name": "Quelle Chris",
        "video_id": null,
        "capture_date": "2022-05-27 09:33:04.483483",
        "source_id": 1191,
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
  ('Things You Said', 'gglum', NULL),
  ('Neon Memories', 'death’s dynamic shroud', NULL),
  ('Stitch', 'Alex G', NULL),
  ('Memories', 'Conan Gray', NULL),
  ('AYE! (Free The Homies)', 'Vince Staples', NULL),
  ('Let’s Do It Again', 'Jamie xx', NULL),
  ('Alive Ain’t Always Living', 'Quelle Chris', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12041; // SELECT last_insert_rowid();

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
  ('2022-05-27 09:33:04.483483', '1191', '12023'),
  ('2022-05-27 09:33:04.483483', '1191', '12035'),
  ('2022-05-27 09:33:04.483483', '1191', '12036'),
  ('2022-05-27 09:33:04.483483', '1191', '12037'),
  ('2022-05-27 09:33:04.483483', '1191', '12038'),
  ('2022-05-27 09:33:04.483483', '1191', '12025'),
  ('2022-05-27 09:33:04.483483', '1191', '12039'),
  ('2022-05-27 09:33:04.483483', '1191', '12016'),
  ('2022-05-27 09:33:04.483483', '1191', '12040'),
  ('2022-05-27 09:33:04.483483', '1191', '12041')
  ;

  // Update to source_song table
