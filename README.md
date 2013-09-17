htmleditor
==========

edit html in browser using nicedit hosted by node.js script locally.

There are many WYSIWYG HTML editing environments on the web and on CMS servers now.
But there are still times you want to edit your HTML file locally, WYSIWYG style,
and the local apps that do that are gone or fading out.
Why not just use some client side javascript, and host the page locally?

Prerequisite:
  1. node.js
    http://nodejs.org/
  2. js-beautify
    https://npmjs.org/package/js-beautify

Usage:
  1. Run the script word.js on node.
    This serves any files on localhost through 8126 or any port you set the script to.
  2. Access any html file through URL
    http://localhost:8126word.html?file=[full_path_to_html_file]
  3. Edit file in the browser, click save to update the file.

ToDo:
  - No good way to create new file, or browse for local files (may be OK)

Note:
  NicEdit is a very compact and nice HTML editor.
  I had to change it a little to make the toolbar stay on top of the window.

