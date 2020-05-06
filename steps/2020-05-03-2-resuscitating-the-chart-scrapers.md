Just gonna start by piecing this back together. JamesK helped me kick this off with a Billboard scraper in January 2019, and then I wrapped my head around it that summer and built scrapers for several other charts, and used them through, it seems, only the 24th of August.

James’s original page-in-a-page iframe scraper never worked, though, so these scrapers are some javascript that I paste into the browser console, and then copy out the results. Trying to remember this, don’t laugh: I’d formatted the console logs so I could copy/paste them into the [ArchieML Sandbox](http://archieml.org/sandbox.html), which gave me a JSON, and then I used an online JSON to CSV converter, pasted the CSV into the bottom of the playlist spreadsheet, and then cleaned it up, put it in the right columns, and so forth.

Thing is, as of now, the scrapers don’t seem to work, with the exception of the Pitchfork scraper. Which means, not too surprisingly, that these sites have changed the names of some of their class selectors, or changed some other structuring, in the 9ish months since I’ve tried to use these scrapers. So my first step will be to troubleshoot that, starting with Billboard.

By the way, I’m doing this in the Brave browser, because the avalanche of ads and trackers on big music sites like these make them pretty difficult to load, and even to *see*, much less work with.

So first off, the sourceDate selector has changed. So I’ll update that. Second, `setTimeout` and `console.log.bind` don’t work in Brave. Well, `setTimeout` on its own at least still logs the value, but not any differently than a plain ol’ `console.log()` does. It does work in Chrome, though. But since, going forward, I’ll want to use this in Brave, and I’ll also probably want to create a JSON instead of just logging to the console, I’m going to simplify the logs, for now, to just plain`console.log()`.

And then, yup, all the other elements have changed, too, so that’s easy enough to update. Billboard is different from the other charts, though, in that it only grabs songs that are “new” this week, and there’s a line of code in JamesK’s method for grabbing only the new songs that I don’t understand for the life of me, especially since the page has changed too much for me to test it out:

```javascript

 if(trendIcon.length > 0){  // this part makes sense. if trendIcon has anything in it, the song is new.
    isNew = trendIcon[0].src.indexOf('-new') > -1;  // but this line??
 }

```

 So until I can talk to James, I’ll take a break and [update](https://github.com/davidforrest/Song-Scraper/commit/3635d62303b8372b9f7f440f0c982cd5533c7558) the Complex scraper, and make it [output JSON](https://github.com/davidforrest/Song-Scraper/commit/8ef6d99e338c34a771d4c38b13dc03763e279141) instead of logging a big list of stuff to the console. Once I get caught up, though, It’d probably be helpful to my future self to download and archive the html source files for pages that require me to make significant updates to the scraper going forward. That way I’ll have an easier time finding an equivalent for the selectors I used for older versions of the page.

All this because I want to listen to some new music!


 [go on →](2020-05-04-scraping-into-the-player.md)
