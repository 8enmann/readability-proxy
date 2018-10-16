var read = require('node-readability')
const Readability = require("readability");
var request = require('request-promise-native');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const express = require('express')
const app = express()
const port = 3000

const UA = "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"
var options = {
  headers: {
    'User-Agent': UA
  }
}

// Try eg http://localhost:3000/?url=http://www.google.com
app.get('/', async (req, res) => {
  try {
    var result;
    if (req.query.moz) {
      result = await mozParse(req.query.url)
    } else {
      result = await parse(req.query.url)
    }
    res.send(result)
  } catch (e) {
    res.send('failed to parse ' + e)
  }
})

// Uncomment for fast testing
//parse('')
//mozParse()

async function mozParse(url) {
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
  //console.log(article.content)
  return article.content

}

async function parse(url) {
  if (!url || url === '') {
    url = 'http://howtonode.org/really-simple-file-uploads'
  }
  console.log('fetching ' + url)
  return new Promise(function(resolve, reject) {
    read(url, function(err, article, meta) {
      if (err) {
        console.log(err)
        reject(err)
        return
      }
      // Main Article
      //console.log(article.content);
      // Title
      //console.log(article.title);

      // HTML Source Code
      //console.log(article.html);

      // DOM
      //console.log(article.document);

      // Response Object from Request Lib
      //console.log(meta);

      // Close article to clean up jsdom and prevent leaks
      if (article) {
        resolve(article.content)
        article.close()
        return
      }
      reject('empty article')
    })
  })
}

app.listen(port, () => console.log(`http://localhost:${port}`))
