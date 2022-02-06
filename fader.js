// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 239 // from the chart page

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
    ('The Fader', '10 songs you need in your life this week', 'No. 239 Week of February 02, 2022', '2022-02-02 12:00:00.000000', 'https://www.thefader.com/2022/02/04/watch-the-full-trailer-for-the-kanye-west-doc-jeen-yus');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1125; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("headline");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/“(.*?)”/)[1]; // may need " or “” type quotation marks (usually "), and – style dash
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
        "title": "One",
        "artist_name": "Amber Mark",
        "video_id": null,
        "capture_date": "2022-02-05 05:47:33.964964",
        "source_id": 1125,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Who Hotter Than Gee",
        "artist_name": "EST Gee",
        "video_id": null,
        "capture_date": "2022-02-05 05:47:33.965965",
        "source_id": 1125,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "King of the Galaxy",
        "artist_name": "BabyTron",
        "video_id": null,
        "capture_date": "2022-02-05 05:47:33.965965",
        "source_id": 1125,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Beg For You",
        "artist_name": "Charli XCX featuring Rina Sawayama",
        "video_id": null,
        "capture_date": "2022-02-05 05:47:33.965965",
        "source_id": 1125,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cry Mfer",
        "artist_name": "My Idea",
        "video_id": null,
        "capture_date": "2022-02-05 05:47:33.965965",
        "source_id": 1125,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "New Tricks: Art, Aesthetics, and Money",
        "artist_name": "Kilo Kish ft. Vince Staples",
        "video_id": null,
        "capture_date": "2022-02-05 05:47:33.965965",
        "source_id": 1125,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sugar Slip (The Lick)",
        "artist_name": "Leon Vynehall",
        "video_id": null,
        "capture_date": "2022-02-05 05:47:33.965965",
        "source_id": 1125,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Anxiety",
        "artist_name": "Coi Leray",
        "video_id": null,
        "capture_date": "2022-02-05 05:47:33.965965",
        "source_id": 1125,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Impossible",
        "artist_name": "Röyksopp ft. Alison Goldfrapp",
        "video_id": null,
        "capture_date": "2022-02-05 05:47:33.965965",
        "source_id": 1125,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fortune Teller",
        "artist_name": "NoCap",
        "video_id": null,
        "capture_date": "2022-02-05 05:47:33.965965",
        "source_id": 1125,
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
  ('One', 'Amber Mark', NULL),
  ('Who Hotter Than Gee', 'EST Gee', NULL),
  ('King of the Galaxy', 'BabyTron', NULL),
  ('Beg For You', 'Charli XCX featuring Rina Sawayama', NULL),
  ('Cry Mfer', 'My Idea', NULL),
  ('New Tricks: Art, Aesthetics, and Money', 'Kilo Kish ft. Vince Staples', NULL),
  ('Sugar Slip (The Lick)', 'Leon Vynehall', NULL),
  ('Anxiety', 'Coi Leray', NULL),
  ('Impossible', 'Röyksopp ft. Alison Goldfrapp', NULL),
  ('Fortune Teller', 'NoCap', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11616; // SELECT last_insert_rowid();

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
  ('2022-02-05 05:47:33.964964', '1125', '11607'),
  ('2022-02-05 05:47:33.965965', '1125', '11608'),
  ('2022-02-05 05:47:33.965965', '1125', '11609'),
  ('2022-02-05 05:47:33.965965', '1125', '11610'),
  ('2022-02-05 05:47:33.965965', '1125', '11611'),
  ('2022-02-05 05:47:33.965965', '1125', '11612'),
  ('2022-02-05 05:47:33.965965', '1125', '11613'),
  ('2022-02-05 05:47:33.965965', '1125', '11614'),
  ('2022-02-05 05:47:33.965965', '1125', '11615'),
  ('2022-02-05 05:47:33.965965', '1125', '11616')
  ;

  // Update to source_song table
