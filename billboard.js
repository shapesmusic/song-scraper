// Billboard

const elements = document.getElementsByClassName(
  "o-chart-results-list-row-container"
);

const songsData = [];

// if this returns empty songsData[], make sure responsive sizing is for browser, not tablet, etc.
for (let i = 1; i < elements.length; i++) {
  // does not include the No. 1 song.
  const element = elements[i];

  const isNew = element.getElementsByClassName(
    "c-label  u-width-40 a-font-primary-bold-xxs lrv-u-color-grey-darkest u-background-color-yellow lrv-u-text-align-center"
  );

  const songName = element.getElementsByClassName(
    "c-title  a-no-trucate a-font-primary-bold-s u-letter-spacing-0021 lrv-u-font-size-18@tablet lrv-u-font-size-16 u-line-height-125 u-line-height-normal@mobile-max a-truncate-ellipsis u-max-width-330 u-max-width-230@tablet-only"
  )[0];
  const artistName = element.getElementsByClassName(
    "c-label  a-no-trucate a-font-primary-s lrv-u-font-size-14@mobile-max u-line-height-normal@mobile-max u-letter-spacing-0021 lrv-u-display-block a-truncate-ellipsis-2line u-max-width-330 u-max-width-230@tablet-only"
  )[0];

  const title = songName ? songName.innerText.trim() : '';
  const artist_name = artistName ? artistName.innerText.trim() : '';
  const video_id = null;

  const songData = {
    title: title,
    artist_name: artist_name,
    video_id: video_id
  };

  if (isNew.length === 1 && isNew[0].innerText === "NEW") {
    songsData.push(songData);
  }
}

// Build the SQL Statement
const songs = [];

for (let i = 0; i < songsData.length; i++) {
  const title = songsData[i].title.replace(/'/g, "’");
  const artistName = songsData[i].artist_name.replace(/'/g, "’");

  const song = `  ('${title}', '${artistName}', NULL)`;
  songs.push(song);
}

console.log(
  `INSERT INTO NMT
  (title, artist_name, video_id)
VALUES
${songs.join(",\n")}
;`
);
