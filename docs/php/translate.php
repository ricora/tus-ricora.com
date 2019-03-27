<?php
  if (isset($_GET["url"])) {
    header("Content-type: application/xml;");
    readfile($_GET["url"]);
  }
?>