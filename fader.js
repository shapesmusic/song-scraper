// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 252 // from the chart page

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
    ('The Fader', '10 songs you need in your life this week', 'No. 252 Week of May 09, 2022', '2022-05-09 12:00:00.000000', 'https://www.thefader.com/2022/05/09/songs-you-need-wu-lu-daboii-duke-deuce-muddymya');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1206; // SELECT last_insert_rowid();
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
        "title": "Blame",
        "artist_name": "Wu-Lu",
        "video_id": null,
        "capture_date": "2022-05-29 07:43:15.077077",
        "source_id": 1206,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Submission",
        "artist_name": "Organ Tapes",
        "video_id": null,
        "capture_date": "2022-05-29 07:43:15.077077",
        "source_id": 1206,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jealousy",
        "artist_name": "George Riley",
        "video_id": null,
        "capture_date": "2022-05-29 07:43:15.078078",
        "source_id": 1206,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Drugs & Rovers",
        "artist_name": "MuddyMya",
        "video_id": null,
        "capture_date": "2022-05-29 07:43:15.078078",
        "source_id": 1206,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ojitos Lindos",
        "artist_name": "Bad Bunny feat Bomba Estéreo",
        "video_id": null,
        "capture_date": "2022-05-29 07:43:15.078078",
        "source_id": 1206,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Understand",
        "artist_name": "Mall Grab ft. Turnstile's Brendan Yates",
        "video_id": null,
        "capture_date": "2022-05-29 07:43:15.078078",
        "source_id": 1206,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mistakes",
        "artist_name": "Sharon Van Etten",
        "video_id": null,
        "capture_date": "2022-05-29 07:43:15.078078",
        "source_id": 1206,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "CRUNKSTARZ",
        "artist_name": "Duke Deuce",
        "video_id": null,
        "capture_date": "2022-05-29 07:43:15.078078",
        "source_id": 1206,
        "song_id": 12155,
        "duplicate": true
    },
    {
        "title": "The Deal",
        "artist_name": "DaBoii ft. Drakeo The Ruler",
        "video_id": null,
        "capture_date": "2022-05-29 07:43:15.078078",
        "source_id": 1206,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nascer, Viver, Morrer",
        "artist_name": "Tim Bernardes",
        "video_id": null,
        "capture_date": "2022-05-29 07:43:15.078078",
        "source_id": 1206,
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
  ('Blame', 'Wu-Lu', NULL),
  ('Submission', 'Organ Tapes', NULL),
  ('Jealousy', 'George Riley', NULL),
  ('Drugs & Rovers', 'MuddyMya', NULL),
  ('Ojitos Lindos', 'Bad Bunny feat Bomba Estéreo', NULL),
  ('Understand', 'Mall Grab ft. Turnstile’s Brendan Yates', NULL),
  ('Mistakes', 'Sharon Van Etten', NULL),
  ('The Deal', 'DaBoii ft. Drakeo The Ruler', NULL),
  ('Nascer, Viver, Morrer', 'Tim Bernardes', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12165; // SELECT last_insert_rowid();

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
  ('2022-05-29 07:43:15.077077', '1206', '12157'),
  ('2022-05-29 07:43:15.077077', '1206', '12158'),
  ('2022-05-29 07:43:15.078078', '1206', '12159'),
  ('2022-05-29 07:43:15.078078', '1206', '12160'),
  ('2022-05-29 07:43:15.078078', '1206', '12161'),
  ('2022-05-29 07:43:15.078078', '1206', '12162'),
  ('2022-05-29 07:43:15.078078', '1206', '12163'),
  ('2022-05-29 07:43:15.078078', '1206', '12155'),
  ('2022-05-29 07:43:15.078078', '1206', '12164'),
  ('2022-05-29 07:43:15.078078', '1206', '12165')
  ;

  // Update to source_song table
