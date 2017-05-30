= InSTEDD Platform Common =

This is project consist on common files to be used among InSTEDD platform projects in order to have a unified look and feel.

== How to develop ==

To compile javascript files:
  $ rake js
To compile stylesheets files:
  $ rake css

To compile all
  $ rake all

This is a plain compass project http://compass-style.org

  $ cd <working-copy>
  $ bundle install

  To compile on demand:
  $ compass compile

  To monitor your project for changes and automatically recompile:
  $ compass watch

== How to preview ==

Under ./samples there are .html file that consumes ./theme directly

== How to use it ==

On your project you should copy ./theme folder
  include:
    stylesheets/theme.css
    jquery
    jquery-ui (may not be required)
    javascripts/theme.js

== Serving the project locally ==

  sudo python -m SimpleHTTPServer 80

(be sure to run rake before serving it)
