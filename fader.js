// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 246 // from the chart page

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
    ('The Fader', '10 songs you need in your life this week', 'No. 246 Week of March 23, 2022', '2022-03-23 12:00:00.000000', 'https://www.thefader.com/2022/03/23/songs-you-need-normani-black-midi-sudan-archives');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1177; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("headline");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/[“"](.*?)[”"]/)[1];
    artist_name = elements[i].innerText.match(/[–-—] ([\s\S]*)$/)[1]; // still gets stuck on &nbsp;
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
        "title": "Fair",
        "artist_name": "Normani",
        "video_id": null,
        "capture_date": "2022-05-26 09:25:02.962962",
        "source_id": 1177,
        "song_id": 11863,
        "duplicate": true
    },
    {
        "title": "IF THERE’S NO SEAT IN THE SKY (WILL YOU FORGIVE ME???)",
        "artist_name": "Saya Gray",
        "video_id": null,
        "capture_date": "2022-05-26 09:25:02.962962",
        "source_id": 1177,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Home Maker",
        "artist_name": "Sudan Archives",
        "video_id": null,
        "capture_date": "2022-05-26 09:25:02.962962",
        "source_id": 1177,
        "song_id": 11887,
        "duplicate": true
    },
    {
        "title": "Iced Tea",
        "artist_name": "Joyce Wrice and KAYTRANADA",
        "video_id": null,
        "capture_date": "2022-05-26 09:25:02.962962",
        "source_id": 1177,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Let It Fly",
        "artist_name": "Veeze",
        "video_id": null,
        "capture_date": "2022-05-26 09:25:02.962962",
        "source_id": 1177,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "pinky ring",
        "artist_name": "Joy Orbison",
        "video_id": null,
        "capture_date": "2022-05-26 09:25:02.962962",
        "source_id": 1177,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Moonlight On Vermont",
        "artist_name": "Black Midi",
        "video_id": null,
        "capture_date": "2022-05-26 09:25:02.962962",
        "source_id": 1177,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "2020",
        "artist_name": "ZelooperZ feat. Apropos",
        "video_id": null,
        "capture_date": "2022-05-26 09:25:02.962962",
        "source_id": 1177,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sarcastic",
        "artist_name": "Yayoyanoh",
        "video_id": null,
        "capture_date": "2022-05-26 09:25:02.962962",
        "source_id": 1177,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Get On",
        "artist_name": "Brandon Banks",
        "video_id": null,
        "capture_date": "2022-05-26 09:25:02.962962",
        "source_id": 1177,
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
  ('IF THERE’S NO SEAT IN THE SKY (WILL YOU FORGIVE ME???)', 'Saya Gray', NULL),
  ('Iced Tea', 'Joyce Wrice and KAYTRANADA', NULL),
  ('Let It Fly', 'Veeze', NULL),
  ('pinky ring', 'Joy Orbison', NULL),
  ('Moonlight On Vermont', 'Black Midi', NULL),
  ('2020', 'ZelooperZ feat. Apropos', NULL),
  ('Sarcastic', 'Yayoyanoh', NULL),
  ('Get On', 'Brandon Banks', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11930; // SELECT last_insert_rowid();

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
  ('2022-05-26 09:25:02.962962', '1177', '11863'),
  ('2022-05-26 09:25:02.962962', '1177', '11923'),
  ('2022-05-26 09:25:02.962962', '1177', '11887'),
  ('2022-05-26 09:25:02.962962', '1177', '11924'),
  ('2022-05-26 09:25:02.962962', '1177', '11925'),
  ('2022-05-26 09:25:02.962962', '1177', '11926'),
  ('2022-05-26 09:25:02.962962', '1177', '11927'),
  ('2022-05-26 09:25:02.962962', '1177', '11928'),
  ('2022-05-26 09:25:02.962962', '1177', '11929'),
  ('2022-05-26 09:25:02.962962', '1177', '11930')
  ;

  // Update to source_song table
