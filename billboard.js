//
// Step 0: Check recent scraped
//

  SELECT instance_name FROM source WHERE parent_entity = 'Billboard' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName('date-selector__button button--link')[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href + "/" + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'Week of "
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + pastChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  )


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of January 23, 2021', '2021-01-23 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-01-23');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 767; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-list__element display--flex');

  songsData = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];
      isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
      songName = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
      artistName = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

      title = songName.innerText.trim();
      artist_name = artistName.innerText.trim();
      video_id = null;
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

      if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

        songsData.push(songData);

      };
  };

  JSON.stringify(songsData, null, 4);


//
// Step 3: Stage songsData, prune unwanted songs, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Drivers License",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.406406",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wasted On You",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.407407",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sand In My Boots",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.408408",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Best Friend",
        "artist_name": "Saweetie Featuring Doja Cat",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.408408",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Warning",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.408408",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "865",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.408408",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dangerous",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.409409",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Neon Eyes",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.409409",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "More Surprised Than Me",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.409409",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Whiskey'd My Way",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.409409",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Your Bartender",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.409409",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Outlaw",
        "artist_name": "Morgan Wallen Featuring Ben Burgess",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.409409",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Only Thing That's Gone",
        "artist_name": "Morgan Wallen Featuring Chris Stapleton",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.410410",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Streets",
        "artist_name": "Doja Cat",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.410410",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "This Bar",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.410410",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wonderin' Bout The Wind",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.410410",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pick Up Your Feelings",
        "artist_name": "Jazmine Sullivan",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.410410",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Girl Like Me",
        "artist_name": "Jazmine Sullivan Featuring H.E.R.",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.410410",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Buss It",
        "artist_name": "Erica Banks",
        "video_id": null,
        "capture_date": "2021-02-27 07:48:12.410410",
        "source_id": 767,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Stay Down%'
    AND artist_name LIKE '%durk%'
  ;

  // If duplicates:
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
  ('Drivers License', 'Olivia Rodrigo', NULL),
  ('Wasted On You', 'Morgan Wallen', NULL),
  ('Sand In My Boots', 'Morgan Wallen', NULL),
  ('Best Friend', 'Saweetie Featuring Doja Cat', NULL),
  ('Warning', 'Morgan Wallen', NULL),
  ('865', 'Morgan Wallen', NULL),
  ('Dangerous', 'Morgan Wallen', NULL),
  ('Neon Eyes', 'Morgan Wallen', NULL),
  ('More Surprised Than Me', 'Morgan Wallen', NULL),
  ('Whiskey’d My Way', 'Morgan Wallen', NULL),
  ('Your Bartender', 'Morgan Wallen', NULL),
  ('Outlaw', 'Morgan Wallen Featuring Ben Burgess', NULL),
  ('Only Thing That’s Gone', 'Morgan Wallen Featuring Chris Stapleton', NULL),
  ('Streets', 'Doja Cat', NULL),
  ('This Bar', 'Morgan Wallen', NULL),
  ('Wonderin’ Bout The Wind', 'Morgan Wallen', NULL),
  ('Pick Up Your Feelings', 'Jazmine Sullivan', NULL),
  ('Girl Like Me', 'Jazmine Sullivan Featuring H.E.R.', NULL),
  ('Buss It', 'Erica Banks', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9756; // SELECT last_insert_rowid();

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
  ('2021-02-27 07:48:12.406406', '767', '9738'),
  ('2021-02-27 07:48:12.407407', '767', '9739'),
  ('2021-02-27 07:48:12.408408', '767', '9740'),
  ('2021-02-27 07:48:12.408408', '767', '9741'),
  ('2021-02-27 07:48:12.408408', '767', '9742'),
  ('2021-02-27 07:48:12.408408', '767', '9743'),
  ('2021-02-27 07:48:12.409409', '767', '9744'),
  ('2021-02-27 07:48:12.409409', '767', '9745'),
  ('2021-02-27 07:48:12.409409', '767', '9746'),
  ('2021-02-27 07:48:12.409409', '767', '9747'),
  ('2021-02-27 07:48:12.409409', '767', '9748'),
  ('2021-02-27 07:48:12.409409', '767', '9749'),
  ('2021-02-27 07:48:12.410410', '767', '9750'),
  ('2021-02-27 07:48:12.410410', '767', '9751'),
  ('2021-02-27 07:48:12.410410', '767', '9752'),
  ('2021-02-27 07:48:12.410410', '767', '9753'),
  ('2021-02-27 07:48:12.410410', '767', '9754'),
  ('2021-02-27 07:48:12.410410', '767', '9755'),
  ('2021-02-27 07:48:12.410410', '767', '9756')
  ;

  // Update to source_song table
