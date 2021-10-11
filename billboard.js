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
    ('Billboard', 'The Hot 100', 'Week of October 9, 2021', '2021-10-09 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-10-09/2021-10-09');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 957; // SELECT last_insert_rowid();
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
//          find and replace "Featured" with "ft."
//

  songsData =
  [
      {
          "title": "My Universe",
          "artist_name": "Coldplay x BTS",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.154154",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Bad Morning",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.158158",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Your Heart",
          "artist_name": "Joyner Lucas & J. Cole",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.158158",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Too Easy",
          "artist_name": "Gunna & Future",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.158158",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "No Where",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.158158",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Hold Me Down",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.159159",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Nevada",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.159159",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "50 Shots",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.159159",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Smoke Strong",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.159159",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Break Or Make Me",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.159159",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Sincerely",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.160160",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "I Can't Take It Back",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.160160",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Forgiato",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.160160",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rich Shit",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.160160",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "For Tonight",
          "artist_name": "Giveon",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.161161",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Baddest Thing",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.161161",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Chosen",
          "artist_name": "Blxst & Tyga ft. Ty Dolla $ign",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.161161",
          "source_id": 957,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Toxic Punk",
          "artist_name": "YoungBoy Never Broke Again",
          "video_id": null,
          "capture_date": "2021-10-11 12:15:16.161161",
          "source_id": 957,
          "song_id": 9821,
          "duplicate": true
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
  ('My Universe', 'Coldplay x BTS', NULL),
  ('Bad Morning', 'YoungBoy Never Broke Again', NULL),
  ('Your Heart', 'Joyner Lucas & J. Cole', NULL),
  ('Too Easy', 'Gunna & Future', NULL),
  ('No Where', 'YoungBoy Never Broke Again', NULL),
  ('Hold Me Down', 'YoungBoy Never Broke Again', NULL),
  ('Nevada', 'YoungBoy Never Broke Again', NULL),
  ('50 Shots', 'YoungBoy Never Broke Again', NULL),
  ('Smoke Strong', 'YoungBoy Never Broke Again', NULL),
  ('Break Or Make Me', 'YoungBoy Never Broke Again', NULL),
  ('Sincerely', 'YoungBoy Never Broke Again', NULL),
  ('I Can’t Take It Back', 'YoungBoy Never Broke Again', NULL),
  ('Forgiato', 'YoungBoy Never Broke Again', NULL),
  ('Rich Shit', 'YoungBoy Never Broke Again', NULL),
  ('For Tonight', 'Giveon', NULL),
  ('Baddest Thing', 'YoungBoy Never Broke Again', NULL),
  ('Chosen', 'Blxst & Tyga ft. Ty Dolla $ign', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10818; // SELECT last_insert_rowid();

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
  ('2021-10-11 12:15:16.154154', '957', '10802'),
  ('2021-10-11 12:15:16.158158', '957', '10803'),
  ('2021-10-11 12:15:16.158158', '957', '10804'),
  ('2021-10-11 12:15:16.158158', '957', '10805'),
  ('2021-10-11 12:15:16.158158', '957', '10806'),
  ('2021-10-11 12:15:16.159159', '957', '10807'),
  ('2021-10-11 12:15:16.159159', '957', '10808'),
  ('2021-10-11 12:15:16.159159', '957', '10809'),
  ('2021-10-11 12:15:16.159159', '957', '10810'),
  ('2021-10-11 12:15:16.159159', '957', '10811'),
  ('2021-10-11 12:15:16.160160', '957', '10812'),
  ('2021-10-11 12:15:16.160160', '957', '10813'),
  ('2021-10-11 12:15:16.160160', '957', '10814'),
  ('2021-10-11 12:15:16.160160', '957', '10815'),
  ('2021-10-11 12:15:16.161161', '957', '10816'),
  ('2021-10-11 12:15:16.161161', '957', '10817'),
  ('2021-10-11 12:15:16.161161', '957', '10818'),
  ('2021-10-11 12:15:16.161161', '957', '9821')
  ;

  // Update to source_song table
