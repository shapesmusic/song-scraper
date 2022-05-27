// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 247 // from the chart page

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
    ('The Fader', '10 songs you need in your life this week', 'No. 247 Week of March 30, 2022', '2022-03-30 12:00:00.000000', 'https://www.thefader.com/2022/05/26/songs-you-need-emma-jean-thackray-wiki-golden-green');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1181; // SELECT last_insert_rowid();
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
        "title": "Tamagotchi",
        "artist_name": "Omar Apollo",
        "video_id": null,
        "capture_date": "2022-05-26 05:53:16.090090",
        "source_id": 1181,
        "song_id": 11906,
        "duplicate": true
    },
    {
        "title": "Somebody Like You",
        "artist_name": "Bree Runway",
        "video_id": null,
        "capture_date": "2022-05-26 05:53:16.090090",
        "source_id": 1181,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Warm Chris",
        "artist_name": "Aldous Harding",
        "video_id": null,
        "capture_date": "2022-05-26 05:53:16.090090",
        "source_id": 1181,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "She’s Not Around / Maybe The Next Time",
        "artist_name": "Jay Worthy & Larry June",
        "video_id": null,
        "capture_date": "2022-05-26 05:53:16.091091",
        "source_id": 1181,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Carry",
        "artist_name": "Rema",
        "video_id": null,
        "capture_date": "2022-05-26 05:53:16.091091",
        "source_id": 1181,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Creative Source",
        "artist_name": "Braxe + Falcon",
        "video_id": null,
        "capture_date": "2022-05-26 05:53:16.091091",
        "source_id": 1181,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "AirMax’s",
        "artist_name": "Meekz",
        "video_id": null,
        "capture_date": "2022-05-26 05:53:16.091091",
        "source_id": 1181,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Voice Of God",
        "artist_name": "Crimeapple",
        "video_id": null,
        "capture_date": "2022-05-26 05:53:16.091091",
        "source_id": 1181,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Acid In My Blood",
        "artist_name": "Channel Tres",
        "video_id": null,
        "capture_date": "2022-05-26 05:53:16.091091",
        "source_id": 1181,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pardon?",
        "artist_name": "Otoboke Beaver",
        "video_id": null,
        "capture_date": "2022-05-26 05:53:16.091091",
        "source_id": 1181,
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
  ('Somebody Like You', 'Bree Runway', NULL),
  ('Warm Chris', 'Aldous Harding', NULL),
  ('She’s Not Around / Maybe The Next Time', 'Jay Worthy & Larry June', NULL),
  ('Carry', 'Rema', NULL),
  ('Creative Source', 'Braxe + Falcon', NULL),
  ('AirMax’s', 'Meekz', NULL),
  ('Voice Of God', 'Crimeapple', NULL),
  ('Acid In My Blood', 'Channel Tres', NULL),
  ('Pardon?', 'Otoboke Beaver', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11962; // SELECT last_insert_rowid();

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
  ('2022-05-26 05:53:16.090090', '1181', '11906'),
  ('2022-05-26 05:53:16.090090', '1181', '11954'),
  ('2022-05-26 05:53:16.090090', '1181', '11955'),
  ('2022-05-26 05:53:16.091091', '1181', '11956'),
  ('2022-05-26 05:53:16.091091', '1181', '11957'),
  ('2022-05-26 05:53:16.091091', '1181', '11958'),
  ('2022-05-26 05:53:16.091091', '1181', '11959'),
  ('2022-05-26 05:53:16.091091', '1181', '11960'),
  ('2022-05-26 05:53:16.091091', '1181', '11961'),
  ('2022-05-26 05:53:16.091091', '1181', '11962')
  ;

  // Update to source_song table
