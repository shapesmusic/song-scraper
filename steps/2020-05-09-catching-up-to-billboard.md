Well, now that all the songs and sources are in the database, I’m thinking about what to do next. Broadly, that’s looking like two things: one, get caught up to scraping, and two, get that db-starter-app going from scratch, with a mind toward different views to add different things to the database.

So a pretty low lift--a break here on a Saturday--is to figure out how to figure out what’s left to scrape to get caught up. So I want to query the database for all the dates a particular source was scraped, in chronological order, with the most recent date first.

One thing I’ll want in my toolkit here is [that step](https://github.com/davidforrest/Database-references/blob/master/steps/querying-multiple-collections.md) I wrote on aggregated queries. At least I think that’s going to be relevant. A glance at the MongoDB [`cursor.sort()` documentation](https://docs.mongodb.com/manual/reference/method/cursor.sort/#examples) shows me that I can start my journey with a simple query like this:

```Javascript

db.sources.find( { parentStream: "The Hot 100" } ).sort( { publicationDate: -1 } ).pretty()

```

That gives me all Billboard Hot 100 charts, sorted in descending order by publication date. Which is exactly what I want, really. But I could also make the result a little easier to read by using aggregation and `$project`, in which case it looks like I have to use [`$sort`](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/) instead of `cursor.sort()`:

```Javascript

db.sources.aggregate( [
  { $match :
    {
      parentStream : "The Hot 100"
    }
  },
  { $sort : { publicationDate: -1 } },
  { $project:
    {
      "_id" : 0,
      "parentEntity" : 0,
      "parentStream" : 0,
      "publicationDate" : 0,
      "location" : 0
    }
  }
] ).pretty();

```

Isn’t that nice? So now I can see that indeed, November 9, 2019 was the most recent chart I scraped, and I can also see that there are a few of other random weeks missing:

- Week of May 18, 2019
- Week of July 21, 2018
- Week of March 3, 2018

And somehow there’s a week of January 3 *and* January 6, 2018, although these both seem to be legitimate charts. Huh. [Looks like](https://www.billboard.com/video/early-release-billboard-hot-100-top-10-january-3rd-2018-countdown-official-8078711) maybe Billboard did a partial early release on that week? Well, okay, I’ll go ahead and catch up on the rest.

But first, a pause for some human error. I scraped the May 18, 2019 chart just fine, but then I accidentally plugged in the URL for the July 21, *2019* (not 2018) chart, and Billboard took me to the next closest chart, which was July 27, 2019, and that’s what I scraped. Oops. So now if I query `db.sources.find({instanceName: "Week of July 27, 2019"}).pretty()` I get two results. I have to delete one of them, and I also have to delete all the songs associated with the duplicate copy (but not the songs associated with the original copy).

When I inserted the duplicate, Mongo returned the `ObjectId`, so I can delete that document easily enough with:

```Javascript

db.sources.deleteOne( {_id: ObjectId("5eb704726c790abcd85f0e5c") } )

```

I also got a list of IDs of the songs I inserted, and it turns out I can delete all of them using the [$in operator](https://docs.mongodb.com/manual/reference/operator/query/in/index.html) like so:

```Javascript

db.songs.remove( { _id :
    { $in:
      [
      ObjectId("5eb704e06c790abcd85f0e5d"),
      ObjectId("5eb704e06c790abcd85f0e5e"),
      ObjectId("5eb704e06c790abcd85f0e5f"),
      ObjectId("5eb704e06c790abcd85f0e60"),
      ObjectId("5eb704e06c790abcd85f0e61"),
      ObjectId("5eb704e06c790abcd85f0e62"),
      ObjectId("5eb704e06c790abcd85f0e63"),
      ObjectId("5eb704e06c790abcd85f0e64"),
      ObjectId("5eb704e06c790abcd85f0e65"),
      ObjectId("5eb704e06c790abcd85f0e66")
      ]
    }
} );

```

That’s good to know, because I can use the `$in` operator with other kinds of queries, too, not just `remove()`. And speaking of which, what’s the difference between the [delete](https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/#db.collection.deleteOne) (One or Many) and [remove](https://docs.mongodb.com/manual/reference/method/db.collection.remove/) operators in Mongo? I know you use `drop()` to get rid of a whole collection, but could I have also used `remove()` instead of `deleteOne()` to delete my duplicate source? Turns out that yes, I could have. I’m going to shelf the question of the difference for now, though, except to say that I’m sticking with `remove()` as my go-to operator for deleting (removing?) documents from a collection. It just feels better than delete. Even saying “remove” is so much more mellow than saying “delete,” which is a pretty solid criteria for choosing an operator.

And with that sorted out, I caught Billboard up to the current chart. Thinking forward, `db.songs.count( { videoId: "" } )` tells me there are 480 post-spreadsheet songs that don’t yet have video IDs, so my next step there is to figure out which of those are duplicates. And alongside that, I’ll want to start planning which sources to prioritize scraping going forward, especially now that I can spit out a list of all the sources already in there. And also, alongside *that*, it’s time to start building that db starter app.

It’s been a pretty chill Saturday.


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [go on →](20-05-10-listen-to-a-source.md)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; or\
[← go back](2020-05-07-more-interim-source-examples.md)
