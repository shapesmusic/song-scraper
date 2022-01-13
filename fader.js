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
    ('The Fader', '10 songs you need in your life this week', 'Week of January 12, 2022', '2022-01-12 12:00:00.000000', 'https://www.thefader.com/2022/01/12/songs-you-need-kae-tempest-destroyer-sasami');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1098; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("headline");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/"(.*?)"/)[1]; // may need " or “” type quotation marks (usually "), and – style dash
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
        "title": "Tintoretto, It's for You",
        "artist_name": "Destroyer",
        "video_id": null,
        "capture_date": "2022-01-12 09:31:27.516516",
        "source_id": 1098,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Say It",
        "artist_name": "SASAMI",
        "video_id": null,
        "capture_date": "2022-01-12 09:31:27.516516",
        "source_id": 1098,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Doctor, My Eyes",
        "artist_name": "Khamari",
        "video_id": null,
        "capture_date": "2022-01-12 09:31:27.516516",
        "source_id": 1098,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Expiration Date",
        "artist_name": "MICHELLE",
        "video_id": null,
        "capture_date": "2022-01-12 09:31:27.516516",
        "source_id": 1098,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Less Than Zero",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-12 09:31:27.516516",
        "source_id": 1098,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "More Pressure",
        "artist_name": "Kae Tempest ft. Kevin Abstract",
        "video_id": null,
        "capture_date": "2022-01-12 09:31:27.517517",
        "source_id": 1098,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "One Way Lover",
        "artist_name": "Eric Nam",
        "video_id": null,
        "capture_date": "2022-01-12 09:31:27.517517",
        "source_id": 1098,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Spin-Off",
        "artist_name": "Big Cheeko ft. Mach-Hommy",
        "video_id": null,
        "capture_date": "2022-01-12 09:31:27.517517",
        "source_id": 1098,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lonely",
        "artist_name": "CMAT",
        "video_id": null,
        "capture_date": "2022-01-12 09:31:27.517517",
        "source_id": 1098,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gameboy",
        "artist_name": "Hook",
        "video_id": null,
        "capture_date": "2022-01-12 09:31:27.517517",
        "source_id": 1098,
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
  ('Tintoretto, It’s for You', 'Destroyer', NULL),
  ('Say It', 'SASAMI', NULL),
  ('Doctor, My Eyes', 'Khamari', NULL),
  ('Expiration Date', 'MICHELLE', NULL),
  ('Less Than Zero', 'The Weeknd', NULL),
  ('More Pressure', 'Kae Tempest ft. Kevin Abstract', NULL),
  ('One Way Lover', 'Eric Nam', NULL),
  ('Spin-Off', 'Big Cheeko ft. Mach-Hommy', NULL),
  ('Lonely', 'CMAT', NULL),
  ('Gameboy', 'Hook', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11486; // SELECT last_insert_rowid();

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
  ('2022-01-12 09:31:27.516516', '1098', '11477'),
  ('2022-01-12 09:31:27.516516', '1098', '11478'),
  ('2022-01-12 09:31:27.516516', '1098', '11479'),
  ('2022-01-12 09:31:27.516516', '1098', '11480'),
  ('2022-01-12 09:31:27.516516', '1098', '11481'),
  ('2022-01-12 09:31:27.517517', '1098', '11482'),
  ('2022-01-12 09:31:27.517517', '1098', '11483'),
  ('2022-01-12 09:31:27.517517', '1098', '11484'),
  ('2022-01-12 09:31:27.517517', '1098', '11485'),
  ('2022-01-12 09:31:27.517517', '1098', '11486')
  ;

  // Update to source_song table
