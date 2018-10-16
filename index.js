const Readability = require('readability');
const extractor = require('unfluff');
var request = require('request-promise-native');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Try eg http://localhost:3000/?url=http://www.google.com
app.get('/', async (req, res) => {
  try {
    var result = await parse(req.query.url)
    if (req.query.json) {
      res.json(result)
    } else {
      res.send(result.content)
    }
  } catch (e) {
    res.send('failed to parse ' + e)
  }
})

// Uncomment for fast testing
//parse('')

async function parse(url) {
  if (!url || url === '') {
    url = 'http://howtonode.org/really-simple-file-uploads'
  }
  console.log('fetching ' + url)
  var response = await request({
    uri: url
    // This seems to mess up the parser. Exclude for now.
    //headers: {'User-Agent': UA}
  })
  // Using this instead of request seemed way slower than request for some reason.
  //var dom = await JSDOM.fromURL(url)

  var dom = new JSDOM(
    response,
    {
      url: url,
      contentType: "text/html",
      includeNodeLocations: true,
      features: {
        FetchExternalResources: false,
        ProcessExternalResources: false
      }
    })
  //console.log(dom.window.document.querySelector("p").textContent);
  var article = new Readability(dom.window.document).parse();
  var data = extractor.lazy(response);
  article.image = data.image()
  article.author = data.author()
  article.date = data.date()
  //console.log(article.content)
  return article

}


app.listen(port, () => console.log(`http://localhost:${port}`))
