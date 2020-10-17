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

//
// Step 2: get songs data
//

  source_id = 729; // SELECT last_insert_rowid();

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
  ('Billboard', 'The Hot 100', 'Week of October 17, 2020', '2020-10-17 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-10-17');


INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-10-17 01:51:50.075075', 729, 'Runnin', '21 Savage & Metro Boomin', NULL),
  ('2020-10-17 01:51:50.075075', 729, 'Mr. Right Now', '21 Savage & Metro Boomin Featuring Drake', NULL),
  ('2020-10-17 01:51:50.075075', 729, 'Wonder', 'Shawn Mendes', NULL),
  ('2020-10-17 01:51:50.075075', 729, 'Glock In My Lap', '21 Savage & Metro Boomin', NULL),
  ('2020-10-17 01:51:50.075075', 729, 'Rich N*gga Sh*t', '21 Savage & Metro Boomin Featuring Young Thug', NULL),
  ('2020-10-17 01:51:50.076076', 729, 'Don’t Stop', 'Megan Thee Stallion Featuring Young Thug', NULL),
  ('2020-10-17 01:51:50.076076', 729, 'Slidin', '21 Savage & Metro Boomin', NULL),
  ('2020-10-17 01:51:50.076076', 729, 'Many Men', '21 Savage & Metro Boomin', NULL),
  ('2020-10-17 01:51:50.076076', 729, 'Fallin’', 'Why Don’t We', NULL),
  ('2020-10-17 01:51:50.076076', 729, 'Outta Time', 'Bryson Tiller Featuring Drake', NULL),
  ('2020-10-17 01:51:50.076076', 729, 'My Dawg', '21 Savage & Metro Boomin', NULL),
  ('2020-10-17 01:51:50.076076', 729, 'Brand New Draco', '21 Savage & Metro Boomin', NULL),
  ('2020-10-17 01:51:50.076076', 729, 'Lovesick Girls', 'BLACKPINK', NULL),
  ('2020-10-17 01:51:50.076076', 729, 'Snitches & Rats', '21 Savage & Metro Boomin Featuring Young Nudy', NULL),
  ('2020-10-17 01:51:50.077077', 729, 'No Opp Left Behind', '21 Savage & Metro Boomin', NULL),
  ('2020-10-17 01:51:50.077077', 729, 'Levitating', 'Dua Lipa Featuring DaBaby', NULL),
  ('2020-10-17 01:51:50.077077', 729, 'Steppin On N*ggas', '21 Savage & Metro Boomin', NULL),
  ('2020-10-17 01:51:50.077077', 729, 'RIP Luv', '21 Savage & Metro Boomin', NULL),
  ('2020-10-17 01:51:50.077077', 729, 'Always Forever', 'Bryson Tiller', NULL),
  ('2020-10-17 01:51:50.077077', 729, 'Years Go By', 'Bryson Tiller', NULL),
  ('2020-10-17 01:51:50.077077', 729, 'Said N Done', '21 Savage & Metro Boomin', NULL)
;
