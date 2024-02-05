const express = require('express');
const bodyParser = require('body-parser');
const marked = require('marked');
const cors = require('cors');
const hljs = require("highlight.js");
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/convertTextToHtml', (req, res) => {
    let { markdownText, highlightedCode } = req.body, finalHtml

    try {
      const html = marked.parse(markdownText, {
        gfm: true,
        highlight: (code, lang) => {
          const highlighted = hljs.highlight(lang, code).value;
          return `<pre><code class="hljs">${highlighted}</code></pre>`;
        },
      });
  
      finalHtml = html.replace(/<pre><code>([^<]*)<\/code><\/pre>/g, highlightedCode);
      res.json({ html: finalHtml });
    } catch (error) {
      console.error("Error converting text to HTML", error);
      res.status(500).json({ error: "Failed to convert text" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
