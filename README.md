# Bang Replay 💥

**View this project:** https://bang.zsrobinson.com

This is a simple redirection engine <em>(not a search engine!)</em> that
keeps track of your searches locally. Inspired by
<a href="https://unduck.link/">Und\*ck</a> by Theo Browne and extended by
IndexedDB to save previous queries. This was mostly a learning exercise
and proof of concept for using IndexedDB in a larger project, and only
uses vanilla JavaScript APIs without any libraries or build steps. If I’m
going to recommend someone learn vanilla HTML/CSS/JS before using
something like React, then I figured I should know what the regular
IndexedDB API looks like before using a wrapper for it (and hey, I might
as well use vanilla HTML/CSS/JS too while I’m at it). Adding a Service
Worker to cache the page resources locally would make this much more
usuable as a real search engine, but it’s <em>really</em> hard — there’s a
reason Theo just
<a href="https://github.com/vite-pwa/vite-plugin-pwa">used a library</a>
for it. While only a limited number of hardcoded bangs are supported here,
it would be pretty trivial to instead perform a lookup on all of the ones
that DuckDuckGo uses themselves.

Changing the default search engine on firefox is weird, had to follow [this thread on Stack Exchange](https://superuser.com/a/1756774).
