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
  pubDateUpper = document.getElementsByClassName('c-tagline  a-font-primary-medium-xs u-font-size-11@mobile-max u-letter-spacing-0106 u-letter-spacing-0089@mobile-max lrv-u-line-height-copy lrv-u-text-transform-uppercase lrv-u-margin-a-00 lrv-u-padding-l-075 lrv-u-padding-l-00@mobile-max')[0].innerText.trim();
  pubDateLower = pubDateUpper.toLowerCase();
  publicationDate = pubDateLower.charAt(0).toUpperCase() + pubDateLower.slice(1, 8) + pubDateLower.charAt(8).toUpperCase() + pubDateLower.slice(9);

  publicationDateFormatted = moment(publicationDate.slice(8), "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href + moment(publicationDate.slice(8), "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'"
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of October 21, 2023', '2023-10-21 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2023-10-21');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1738; // SELECT last_insert_rowid();
  song_id = null;

  // elements = document.getElementsByClassName('chart-list__element display--flex');
  elements = document.getElementsByClassName('o-chart-results-list-row-container');


  songsData = [];

  // if this returns empty songsData[], make sure responsive sizing is for browser, not tablet, etc.
  for (var i=1; i<elements.length; i++){ // does not include the No. 1 song.
      element = elements[i];

      isNew = element.getElementsByClassName('c-label  u-width-40 a-font-primary-bold-xxs lrv-u-color-grey-darkest u-background-color-yellow lrv-u-text-align-center');

      songName = element.getElementsByClassName('c-title  a-no-trucate a-font-primary-bold-s u-letter-spacing-0021 lrv-u-font-size-18@tablet lrv-u-font-size-16 u-line-height-125 u-line-height-normal@mobile-max a-truncate-ellipsis u-max-width-330 u-max-width-230@tablet-only')[0];
      artistName = element.getElementsByClassName('c-label  a-no-trucate a-font-primary-s lrv-u-font-size-14@mobile-max u-line-height-normal@mobile-max u-letter-spacing-0021 lrv-u-display-block a-truncate-ellipsis-2line u-max-width-330 u-max-width-230@tablet-only')[0];

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

      if(isNew.length == 1 && isNew[0].innerText == "NEW"){

        songsData.push(songData);

      };
  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates,
//          find and replace "Featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "IDGAF",
        "artist_name": "Drake ft. Yeat",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.729729",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Virginia Beach",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.730730",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Calling For You",
        "artist_name": "Drake ft. 21 Savage",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.730730",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Daylight",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.730730",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fear Of Heights",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.730730",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rich Baby Daddy",
        "artist_name": "Drake ft. Sexyy Red & SZA",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.730730",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gently",
        "artist_name": "Drake ft. Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.730730",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Amen",
        "artist_name": "Drake ft. Teezo Touchdown",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "7969 Santa",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "8am In Charlotte",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "What Would Pluto Do",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bahamas Promises",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tried Our Best",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Members Only",
        "artist_name": "Drake ft. PARTYNEXTDOOR",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All The Parties",
        "artist_name": "Drake ft. Chief Keef",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Drew A Picasso",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Another Late Night",
        "artist_name": "Drake ft. Lil Yachty",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Away From Home",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "BBL Love Interlude",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Polar Opposites",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.731731",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Screw The World Interlude",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.732732",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wild Ones",
        "artist_name": "Jessie Murph & Jelly Roll",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.732732",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "She Calls Me Back",
        "artist_name": "Noah Kahan With Kacey Musgraves",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.733733",
        "source_id": 1738,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Y Lloro",
        "artist_name": "Junior H",
        "video_id": null,
        "capture_date": "2023-10-17 07:50:04.734734",
        "source_id": 1738,
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
  // If ’ replaced, check again for duplicate

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('IDGAF', 'Drake ft. Yeat', NULL),
  ('Virginia Beach', 'Drake', NULL),
  ('Calling For You', 'Drake ft. 21 Savage', NULL),
  ('Daylight', 'Drake', NULL),
  ('Fear Of Heights', 'Drake', NULL),
  ('Rich Baby Daddy', 'Drake ft. Sexyy Red & SZA', NULL),
  ('Gently', 'Drake ft. Bad Bunny', NULL),
  ('Amen', 'Drake ft. Teezo Touchdown', NULL),
  ('7969 Santa', 'Drake', NULL),
  ('8am In Charlotte', 'Drake', NULL),
  ('What Would Pluto Do', 'Drake', NULL),
  ('Bahamas Promises', 'Drake', NULL),
  ('Tried Our Best', 'Drake', NULL),
  ('Members Only', 'Drake ft. PARTYNEXTDOOR', NULL),
  ('All The Parties', 'Drake ft. Chief Keef', NULL),
  ('Drew A Picasso', 'Drake', NULL),
  ('Another Late Night', 'Drake ft. Lil Yachty', NULL),
  ('Away From Home', 'Drake', NULL),
  ('BBL Love Interlude', 'Drake', NULL),
  ('Polar Opposites', 'Drake', NULL),
  ('Screw The World Interlude', 'Drake', NULL),
  ('Wild Ones', 'Jessie Murph & Jelly Roll', NULL),
  ('She Calls Me Back', 'Noah Kahan With Kacey Musgraves', NULL),
  ('Y Lloro', 'Junior H', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14906; // SELECT last_insert_rowid();

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
  ('2023-10-17 07:50:04.729729', '1738', '14883'),
  ('2023-10-17 07:50:04.730730', '1738', '14884'),
  ('2023-10-17 07:50:04.730730', '1738', '14885'),
  ('2023-10-17 07:50:04.730730', '1738', '14886'),
  ('2023-10-17 07:50:04.730730', '1738', '14887'),
  ('2023-10-17 07:50:04.730730', '1738', '14888'),
  ('2023-10-17 07:50:04.730730', '1738', '14889'),
  ('2023-10-17 07:50:04.731731', '1738', '14890'),
  ('2023-10-17 07:50:04.731731', '1738', '14891'),
  ('2023-10-17 07:50:04.731731', '1738', '14892'),
  ('2023-10-17 07:50:04.731731', '1738', '14893'),
  ('2023-10-17 07:50:04.731731', '1738', '14894'),
  ('2023-10-17 07:50:04.731731', '1738', '14895'),
  ('2023-10-17 07:50:04.731731', '1738', '14896'),
  ('2023-10-17 07:50:04.731731', '1738', '14897'),
  ('2023-10-17 07:50:04.731731', '1738', '14898'),
  ('2023-10-17 07:50:04.731731', '1738', '14899'),
  ('2023-10-17 07:50:04.731731', '1738', '14900'),
  ('2023-10-17 07:50:04.731731', '1738', '14901'),
  ('2023-10-17 07:50:04.731731', '1738', '14902'),
  ('2023-10-17 07:50:04.732732', '1738', '14903'),
  ('2023-10-17 07:50:04.732732', '1738', '14904'),
  ('2023-10-17 07:50:04.733733', '1738', '14905'),
  ('2023-10-17 07:50:04.734734', '1738', '14906')
  ;

  // Update to source_song table
