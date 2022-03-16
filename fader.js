// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 243 // from the chart page

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
    ('The Fader', '10 songs you need in your life this week', 'No. 243 Week of March 02, 2022', '2022-03-02 12:00:00.000000', 'https://www.thefader.com/2022/03/15/tracklist-cover-art-phife-dawg-forever');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1166; // SELECT last_insert_rowid();
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
        "title": "Eurovision",
        "artist_name": "Central Cee ft. Rondodasosa, Baby Gang, A2Anti, Morad, Beny Jr, Ashe 22, Freeze Corleone",
        "video_id": null,
        "capture_date": "2022-03-16 08:46:52.825825",
        "source_id": 1166,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Only Love From Now On",
        "artist_name": "Carmen Villain",
        "video_id": null,
        "capture_date": "2022-03-16 08:46:52.827827",
        "source_id": 1166,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I’m Tired",
        "artist_name": "Labrinth and Zendaya",
        "video_id": null,
        "capture_date": "2022-03-16 08:46:52.827827",
        "source_id": 1166,
        "song_id": 11773,
        "duplicate": true
    },
    {
        "title": "Garden of Our Neighbour",
        "artist_name": "GOON",
        "video_id": null,
        "capture_date": "2022-03-16 08:46:52.827827",
        "source_id": 1166,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "the sheesh battle",
        "artist_name": "bbymutha",
        "video_id": null,
        "capture_date": "2022-03-16 08:46:52.827827",
        "source_id": 1166,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bodies of Water",
        "artist_name": "HAAi",
        "video_id": null,
        "capture_date": "2022-03-16 08:46:52.827827",
        "source_id": 1166,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Morning Man",
        "artist_name": "Asa",
        "video_id": null,
        "capture_date": "2022-03-16 08:46:52.827827",
        "source_id": 1166,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Baby",
        "artist_name": "Charli XCX",
        "video_id": null,
        "capture_date": "2022-03-16 08:46:52.827827",
        "source_id": 1166,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "the dealer",
        "artist_name": "Nilüfer Yanya",
        "video_id": null,
        "capture_date": "2022-03-16 08:46:52.827827",
        "source_id": 1166,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Know",
        "artist_name": "DJ Paypal",
        "video_id": null,
        "capture_date": "2022-03-16 08:46:52.827827",
        "source_id": 1166,
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
  ('Eurovision', 'Central Cee ft. Rondodasosa, Baby Gang, A2Anti, Morad, Beny Jr, Ashe 22, Freeze Corleone', NULL),
  ('Only Love From Now On', 'Carmen Villain', NULL),
  ('Garden of Our Neighbour', 'GOON', NULL),
  ('the sheesh battle', 'bbymutha', NULL),
  ('Bodies of Water', 'HAAi', NULL),
  ('Morning Man', 'Asa', NULL),
  ('Baby', 'Charli XCX', NULL),
  ('the dealer', 'Nilüfer Yanya', NULL),
  ('I Know', 'DJ Paypal', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11835; // SELECT last_insert_rowid();

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
  ('2022-03-16 08:46:52.825825', '1166', '11827'),
  ('2022-03-16 08:46:52.827827', '1166', '11828'),
  ('2022-03-16 08:46:52.827827', '1166', '11773'),
  ('2022-03-16 08:46:52.827827', '1166', '11829'),
  ('2022-03-16 08:46:52.827827', '1166', '11830'),
  ('2022-03-16 08:46:52.827827', '1166', '11831'),
  ('2022-03-16 08:46:52.827827', '1166', '11832'),
  ('2022-03-16 08:46:52.827827', '1166', '11833'),
  ('2022-03-16 08:46:52.827827', '1166', '11834'),
  ('2022-03-16 08:46:52.827827', '1166', '11835')
  ;

  // Update to source_song table
