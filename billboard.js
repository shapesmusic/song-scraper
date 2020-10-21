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

  source_id = 732; // SELECT last_insert_rowid();

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
  ('Billboard', 'The Hot 100', 'Week of October 24, 2020', '2020-10-24 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-10-24');


INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-10-20 07:46:41.222222', 732, 'Baby, I’m Jealous', 'Bebe Rexha Featuring Doja Cat', NULL),
  ('2020-10-20 07:46:41.223223', 732, 'Hole In The Bottle', 'Kelsea Ballerini', NULL),
  ('2020-10-20 07:46:41.223223', 732, 'Sofia', 'Clairo', NULL)
;
