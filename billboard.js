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
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of October 23, 2021', '2021-10-23 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-10-23');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1048; // SELECT last_insert_rowid();
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

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace "Featur~ing" with "ft."
//

  songsData =
  [
      {
          "title": "Who Want Smoke??",
          "artist_name": "Nardo Wick ft. G Herbo, Lil Durk & 21 Savage",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.280280",
          "source_id": 1048,
          "song_id": 11107,
          "duplicate": true
      },
      {
          "title": "Lo Siento BB:/",
          "artist_name": "Tainy, Bad Bunny & Julieta Venegas",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.281281",
          "source_id": 1048,
          "song_id": 10990,
          "duplicate": true
      },
      {
          "title": "Flocky Flocky",
          "artist_name": "Don Toliver ft. Travis Scott",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.281281",
          "source_id": 1048,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Easy On Me",
          "artist_name": "Adele",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.281281",
          "source_id": 1048,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "WFM",
          "artist_name": "Realestk",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.282282",
          "source_id": 1048,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Tequila Little Time",
          "artist_name": "Jon Pardi",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.282282",
          "source_id": 1048,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Freedom Was A Highway",
          "artist_name": "Jimmie Allen & Brad Paisley",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.282282",
          "source_id": 1048,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Like A Lady",
          "artist_name": "Lady A",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.282282",
          "source_id": 1048,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Life Goes On",
          "artist_name": "Oliver Tree",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.282282",
          "source_id": 1048,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "'Til You Can't",
          "artist_name": "Cody Johnson",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.282282",
          "source_id": 1048,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Who's In Your Head",
          "artist_name": "Jonas Brothers",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.282282",
          "source_id": 1048,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Just About Over You",
          "artist_name": "Priscilla Block",
          "video_id": null,
          "capture_date": "2021-10-19 05:11:32.282282",
          "source_id": 1048,
          "song_id": null,
          "duplicate": false
      }
  ]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Up%'
    AND artist_name LIKE '%Cardi%'
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
  ('Flocky Flocky', 'Don Toliver ft. Travis Scott', NULL),
  ('Easy On Me', 'Adele', NULL),
  ('WFM', 'Realestk', NULL),
  ('Tequila Little Time', 'Jon Pardi', NULL),
  ('Freedom Was A Highway', 'Jimmie Allen & Brad Paisley', NULL),
  ('Like A Lady', 'Lady A', NULL),
  ('Life Goes On', 'Oliver Tree', NULL),
  ('’Til You Can’t', 'Cody Johnson', NULL),
  ('Who’s In Your Head', 'Jonas Brothers', NULL),
  ('Just About Over You', 'Priscilla Block', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11123; // SELECT last_insert_rowid();

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
  ('2021-10-19 05:11:32.280280', '1048', '11107'),
  ('2021-10-19 05:11:32.281281', '1048', '10990'),
  ('2021-10-19 05:11:32.281281', '1048', '11114'),
  ('2021-10-19 05:11:32.281281', '1048', '11115'),
  ('2021-10-19 05:11:32.282282', '1048', '11116'),
  ('2021-10-19 05:11:32.282282', '1048', '11117'),
  ('2021-10-19 05:11:32.282282', '1048', '11118'),
  ('2021-10-19 05:11:32.282282', '1048', '11119'),
  ('2021-10-19 05:11:32.282282', '1048', '11120'),
  ('2021-10-19 05:11:32.282282', '1048', '11121'),
  ('2021-10-19 05:11:32.282282', '1048', '11122'),
  ('2021-10-19 05:11:32.282282', '1048', '11123')
  ;

  // Update to source_song table
