Uses [mozilla/readability](https://github.com/mozilla/readability) and [ageitgey/node-unfluff](https://github.com/ageitgey/node-unfluff) to serve stripped down pages and their metadata.

```sh
npm install
npm start
```

Accepts two query parameters:
* `url`: what page to scrape and process
* `json`: if `true`, return content and metadata, otherwise just the content.
