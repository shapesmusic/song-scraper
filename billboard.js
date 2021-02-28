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
    ('Billboard', 'The Hot 100', 'Week of January 9, 2021', '2021-01-09 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-01-09');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 765; // SELECT last_insert_rowid();
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
        "title": "Good Days",
        "artist_name": "SZA",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.264264",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Still Trappin'",
        "artist_name": "Lil Durk & King Von",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.264264",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Redman",
        "artist_name": "Lil Durk",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.265265",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Slay3r",
        "artist_name": "Playboi Carti",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.265265",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Go2DaMoon",
        "artist_name": "Playboi Carti Featuring Kanye West",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.265265",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Refugee",
        "artist_name": "Lil Durk",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.265265",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Monsters",
        "artist_name": "All Time Low Featuring Demi Lovato & blackbear",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.265265",
        "source_id": 765,
        "song_id": 9692,
        "duplicate": true
    },
    {
        "title": "Vamp Anthem",
        "artist_name": "Playboi Carti",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.265265",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Down To One",
        "artist_name": "Luke Bryan",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.265265",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "New N3on",
        "artist_name": "Playboi Carti",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.265265",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Death Ain't Easy",
        "artist_name": "Lil Durk",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.265265",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Just The Way",
        "artist_name": "Parmalee x Blanco Brown",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.266266",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "M3tamorphosis",
        "artist_name": "Playboi Carti Featuring Kid Cudi",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.266266",
        "source_id": 765,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Good Ones",
        "artist_name": "Gabby Barrett",
        "video_id": null,
        "capture_date": "2021-02-27 04:26:25.266266",
        "source_id": 765,
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
  ('Good Days', 'SZA', NULL),
  ('Still Trappin’', 'Lil Durk & King Von', NULL),
  ('Redman', 'Lil Durk', NULL),
  ('Slay3r', 'Playboi Carti', NULL),
  ('Go2DaMoon', 'Playboi Carti Featuring Kanye West', NULL),
  ('Refugee', 'Lil Durk', NULL),
  ('Vamp Anthem', 'Playboi Carti', NULL),
  ('Down To One', 'Luke Bryan', NULL),
  ('New N3on', 'Playboi Carti', NULL),
  ('Death Ain’t Easy', 'Lil Durk', NULL),
  ('Just The Way', 'Parmalee x Blanco Brown', NULL),
  ('M3tamorphosis', 'Playboi Carti Featuring Kid Cudi', NULL),
  ('The Good Ones', 'Gabby Barrett', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9728; // SELECT last_insert_rowid();

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
  ('2021-02-27 04:26:25.264264', '765', '9716'),
  ('2021-02-27 04:26:25.264264', '765', '9717'),
  ('2021-02-27 04:26:25.265265', '765', '9718'),
  ('2021-02-27 04:26:25.265265', '765', '9719'),
  ('2021-02-27 04:26:25.265265', '765', '9720'),
  ('2021-02-27 04:26:25.265265', '765', '9721'),
  ('2021-02-27 04:26:25.265265', '765', '9692'),
  ('2021-02-27 04:26:25.265265', '765', '9722'),
  ('2021-02-27 04:26:25.265265', '765', '9723'),
  ('2021-02-27 04:26:25.265265', '765', '9724'),
  ('2021-02-27 04:26:25.265265', '765', '9725'),
  ('2021-02-27 04:26:25.266266', '765', '9726'),
  ('2021-02-27 04:26:25.266266', '765', '9727'),
  ('2021-02-27 04:26:25.266266', '765', '9728')
  ;

  // Update to source_song table
