// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 248 // from the chart page

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
    ('The Fader', '10 songs you need in your life this week', 'No. 248 Week of April 06, 2022', '2022-04-06 12:00:00.000000', 'https://www.thefader.com/2022/04/06/songs-you-need-kehlani-harry-styles-yeat');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1186; // SELECT last_insert_rowid();
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
        "title": "Big tonka",
        "artist_name": "Yeat feat Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2022-05-27 07:11:58.955955",
        "source_id": 1186,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "As It Was",
        "artist_name": "Harry Styles",
        "video_id": null,
        "capture_date": "2022-05-27 07:11:58.962962",
        "source_id": 1186,
        "song_id": 11940,
        "duplicate": true
    },
    {
        "title": "Coming Down",
        "artist_name": "Ari Lennox",
        "video_id": null,
        "capture_date": "2022-05-27 07:11:58.962962",
        "source_id": 1186,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nets vs 76ers",
        "artist_name": "Papo2oo4",
        "video_id": null,
        "capture_date": "2022-05-27 07:11:58.962962",
        "source_id": 1186,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sirens",
        "artist_name": "Flume feat. Caroline Polachek",
        "video_id": null,
        "capture_date": "2022-05-27 07:11:58.962962",
        "source_id": 1186,
        "song_id": 11952,
        "duplicate": true
    },
    {
        "title": "The Science of Imaginary Solutions",
        "artist_name": "James Krivchenia",
        "video_id": null,
        "capture_date": "2022-05-27 07:11:58.962962",
        "source_id": 1186,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Up At Night",
        "artist_name": "Kehlani feat. Justin Bieber",
        "video_id": null,
        "capture_date": "2022-05-27 07:11:58.962962",
        "source_id": 1186,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "21212",
        "artist_name": "DJ Travella",
        "video_id": null,
        "capture_date": "2022-05-27 07:11:58.962962",
        "source_id": 1186,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fair",
        "artist_name": "Bear1boss",
        "video_id": null,
        "capture_date": "2022-05-27 07:11:58.962962",
        "source_id": 1186,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Eye Tell (!)",
        "artist_name": "Jim Legxacy",
        "video_id": null,
        "capture_date": "2022-05-27 07:11:58.962962",
        "source_id": 1186,
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
  ('Big tonka', 'Yeat feat Lil Uzi Vert', NULL),
  ('Coming Down', 'Ari Lennox', NULL),
  ('Nets vs 76ers', 'Papo2oo4', NULL),
  ('The Science of Imaginary Solutions', 'James Krivchenia', NULL),
  ('Up At Night', 'Kehlani feat. Justin Bieber', NULL),
  ('21212', 'DJ Travella', NULL),
  ('Fair', 'Bear1boss', NULL),
  ('Eye Tell (!)', 'Jim Legxacy', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12009; // SELECT last_insert_rowid();

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
  ('2022-05-27 07:11:58.955955', '1186', '12002'),
  ('2022-05-27 07:11:58.962962', '1186', '11940'),
  ('2022-05-27 07:11:58.962962', '1186', '12003'),
  ('2022-05-27 07:11:58.962962', '1186', '12004'),
  ('2022-05-27 07:11:58.962962', '1186', '11952'),
  ('2022-05-27 07:11:58.962962', '1186', '12005'),
  ('2022-05-27 07:11:58.962962', '1186', '12006'),
  ('2022-05-27 07:11:58.962962', '1186', '12007'),
  ('2022-05-27 07:11:58.962962', '1186', '12008'),
  ('2022-05-27 07:11:58.962962', '1186', '12009')
  ;

  // Update to source_song table
