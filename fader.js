// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 253 // from the chart page

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
    ('The Fader', '10 songs you need in your life this week', 'No. 253 Week of May 16, 2022', '2022-05-16 12:00:00.000000', 'https://www.thefader.com/2022/05/16/songs-you-need-blunt-chunks-hitkdd-glorilla-crack-cloud');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1211; // SELECT last_insert_rowid();
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
        "title": "FNF (Let’s Go)",
        "artist_name": "Hitkidd and Glorilla",
        "video_id": null,
        "capture_date": "2022-05-29 05:41:18.226226",
        "source_id": 1211,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hieroglyphics",
        "artist_name": "Editrix",
        "video_id": null,
        "capture_date": "2022-05-29 05:41:18.227227",
        "source_id": 1211,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Topside Freestyle",
        "artist_name": "Shaudy Kash and Top$ide",
        "video_id": null,
        "capture_date": "2022-05-29 05:41:18.227227",
        "source_id": 1211,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Please Yourself",
        "artist_name": "Crack Cloud",
        "video_id": null,
        "capture_date": "2022-05-29 05:41:18.227227",
        "source_id": 1211,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Canção da Cura",
        "artist_name": "Sessa",
        "video_id": null,
        "capture_date": "2022-05-29 05:41:18.227227",
        "source_id": 1211,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Part Of Me",
        "artist_name": "Blunt Chunks",
        "video_id": null,
        "capture_date": "2022-05-29 05:41:18.227227",
        "source_id": 1211,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wrong For It",
        "artist_name": "Obongjayar ft. Nubya Garcia",
        "video_id": null,
        "capture_date": "2022-05-29 05:41:18.227227",
        "source_id": 1211,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "In The Dark",
        "artist_name": "MISZCZYK ft. Lætitia Sadler",
        "video_id": null,
        "capture_date": "2022-05-29 05:41:18.227227",
        "source_id": 1211,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ptolemaea",
        "artist_name": "Ethel Cain",
        "video_id": null,
        "capture_date": "2022-05-29 05:41:18.227227",
        "source_id": 1211,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Purple Hearts",
        "artist_name": "Kendrick Lamar ft. Summer Walker and Ghostface Killah",
        "video_id": null,
        "capture_date": "2022-05-29 05:41:18.227227",
        "source_id": 1211,
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
  ('FNF (Let’s Go)', 'Hitkidd and Glorilla', NULL),
  ('Hieroglyphics', 'Editrix', NULL),
  ('Topside Freestyle', 'Shaudy Kash and Top$ide', NULL),
  ('Please Yourself', 'Crack Cloud', NULL),
  ('Canção da Cura', 'Sessa', NULL),
  ('Part Of Me', 'Blunt Chunks', NULL),
  ('Wrong For It', 'Obongjayar ft. Nubya Garcia', NULL),
  ('In The Dark', 'MISZCZYK ft. Lætitia Sadler', NULL),
  ('Ptolemaea', 'Ethel Cain', NULL),
  ('Purple Hearts', 'Kendrick Lamar ft. Summer Walker and Ghostface Killah', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12225; // SELECT last_insert_rowid();

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
  ('2022-05-29 05:41:18.226226', '1211', '12216'),
  ('2022-05-29 05:41:18.227227', '1211', '12217'),
  ('2022-05-29 05:41:18.227227', '1211', '12218'),
  ('2022-05-29 05:41:18.227227', '1211', '12219'),
  ('2022-05-29 05:41:18.227227', '1211', '12220'),
  ('2022-05-29 05:41:18.227227', '1211', '12221'),
  ('2022-05-29 05:41:18.227227', '1211', '12222'),
  ('2022-05-29 05:41:18.227227', '1211', '12223'),
  ('2022-05-29 05:41:18.227227', '1211', '12224'),
  ('2022-05-29 05:41:18.227227', '1211', '12225')
  ;

  // Update to source_song table
