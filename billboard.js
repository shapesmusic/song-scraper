//
// Step 0: check recent scraped
//

SELECT instance_name FROM source WHERE parent_entity = 'Billboard' ORDER BY publication_date DESC LIMIT 8;

//
// Step 1: get source data
//

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // get and format publicationDate
  publicationDate = document.getElementsByClassName('date-selector__button button--link')[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // URL changes once current chart is archived
  currentChartLocation = window.location.href + "/" + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'Week of "
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + currentChartLocation + "\');"
  )

  // Paste the statement in Step 3 below and insert the source into the db

//
// Step 2: get songs data
//

  source_id = 740; // SELECT last_insert_rowid();

  elements = document.getElementsByClassName('chart-list__element display--flex');

  songs = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];
      isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
      songName = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
      artistName = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

      capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
      title = songName.innerText.trim();
      artist_name = artistName.innerText.trim();
      video_id = ""; // excluding from SQL statement

      song = String(
        "\n(\'" + capture_date + "\', "
        + source_id + ", "
        + "\'" + title + "\', "
        + "\'" + artist_name + "\', "
        + "NULL)"
      );

      if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

        songs.push(song);

      };
  };

  console.log(String(songs));

//
// Step 3: paste final statements below:
//

// replace any ' in strings with ’


INSERT INTO source
  (parent_entity, parent_stream, instance_name, publication_date, location)
VALUES
  ('Billboard', 'The Hot 100', 'Week of November 7, 2020', '2020-11-07 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-11-07');


INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-11-03 09:15:54.900900', 740, 'Positions', 'Ariana Grande', NULL),
  ('2020-11-03 09:15:54.901901', 740, 'Forever After All', 'Luke Combs', NULL),
  ('2020-11-03 09:15:54.903903', 740, 'Tyler Herro', 'Jack Harlow', NULL),
  ('2020-11-03 09:15:54.904904', 740, 'Spicy', 'Ty Dolla $ign Featuring Post Malone', NULL),
  ('2020-11-03 09:15:54.904904', 740, 'The Other Guy', 'Luke Combs', NULL),
  ('2020-11-03 09:15:54.904904', 740, 'Damage', 'H.E.R.', NULL),
  ('2020-11-03 09:15:54.904904', 740, 'Back To The Streets', 'Saweetie Featuring Jhene Aiko', NULL),
  ('2020-11-03 09:15:54.904904', 740, 'So Done', 'The Kid LAROI', NULL),
  ('2020-11-03 09:15:54.904904', 740, 'Cold As You', 'Luke Combs', NULL),
  ('2020-11-03 09:15:54.904904', 740, 'Practice', 'DaBaby', NULL),
  ('2020-11-03 09:15:54.905905', 740, 'La Toxica', 'Farruko', NULL),
  ('2020-11-03 09:15:54.905905', 740, 'Head & Heart', 'Joel Corry X MNEK', NULL),
  ('2020-11-03 09:15:54.905905', 740, 'Wine, Beer, Whiskey', 'Little Big Town', NULL)
;
