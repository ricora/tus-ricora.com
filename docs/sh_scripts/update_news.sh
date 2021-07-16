#!/bin/bash

function rmtmp() {
  # remove tmp file
  if [ -e "./foo" ]; then
    rm "./foo"
  fi
  if [ -e "./foo2" ]; then
    rm "./foo2"
  fi
}
function cancel() {
  status=$?
  echo "[ Exit status: $status ]"
  echo "exit."
  rmtmp
  exit $status
}
function fail() {
  status=$?
  echo "[ ERROR: $BASH_SOURCE:$LINENO - $BASH_COMMAND ]"
  echo "[ Exit status: $status ]"
  echo "exit."
  rmtmp
  exit $status
}

docs="~/www/lang/RICORA_HP/docs"

set -e -o pipefail
trap 'fail' ERR
trap 'cancel' 1 2 3 15

tabs -2
arr=(`~/www/lang/RICORA_HP/docs/sh_scripts/updates.sh`)

if [ "${#arr[@]}" -ne 0 ]; then
  if [ $# != 1 ]; then
    echo "[ Empty arguments: Specify 'auto' or 'custom'. ]"
    exit 1
  fi
  if [ $1 = "auto" ] || [ $1 = "custom" ]; then
    echo "${#arr[@]} Updates remain."
    # backup
    if [ ! -e ~/www/lang/RICORA_HP/docs/index.html.bak ]; then
      cp ~/www/lang/RICORA_HP/docs/index.html ~/www/lang/RICORA_HP/docs/index.html.bak
    fi
    if [ ! -e ~/www/lang/RICORA_HP/docs/news/news.xml.bak ]; then
      cp ~/www/lang/RICORA_HP/docs/news/news.xml ~/www/lang/RICORA_HP/docs/news/news.xml.bak
    fi
    for item in "${arr[@]}"; do
      echo -n "Give $item's title> "
      read input
      if [ -z $input ]; then
        echo "Title should not be empty. This file's update was skipped."
        continue
      fi
      today=`date "+%Y/%m/%d"`
      if [ $1 = "auto" ]; then
        title="Work: 「$input」のスライドを追加"
        content="スライド「$input」を<a href=\"\#work\" title=\"\">Work</a>のLTに追加しました。<br/>クリックでダウンロードしてください。"
      elif [ $1 = "custom" ]; then
        echo -n "Give $item\'s topic title> "
        read input2
        if [ -z $input2 ]; then
          echo "Topic title should not be empty. This file's update was skipped."
          continue
        fi
        echo -n "Give $item\'s topic contents> "
        read input3
        if [ -z $input3 ]; then
          echo "Topic contents should not be empty. This file's update was skipped."
          continue
        fi
        title="$input2"
        content="$input3"
      fi
      # insert
      new_item="  <item>\n    <date>$today</date>\n    <title>$title</title>\n    <content>$content</content>\n  </item>"
      cat ~/www/lang/RICORA_HP/docs/news/news.xml | sed "2a\\${new_item}" > ./foo
      cp ./foo ~/www/lang/RICORA_HP/docs/news/news.xml
      #cat "./hoge"
      insert_item="<li><a href=\"./LT/$item\">$input</a></li>"
      insert_line=`nl -w3 -nln -s: -ba ~/www/lang/RICORA_HP/docs/index.html | sed -n '/<div class="col work-item">/,/<\/div>/p' | sed -n '/<h4>LT<\/h4>/,/<\/div>/p' | grep '<li>' | cut -d: -f1 | tail -n1`
      sed "${insert_line}a\            ${insert_item}" ~/www/lang/RICORA_HP/docs/index.html > ./foo2
      cp ./foo2 ~/www/lang/RICORA_HP/docs/index.html
      echo "Success!"
      #cat "./fuga"
    done
  else
    echo "[ Invalid argument: $1. Specify 'auto' or 'custom'. ]"
    exit 1
  fi
else
  # Updateがないなら何もしない 
  echo "No Updates."
fi
# 正常に終わったらdocument_listに書き込む
for item in "${arr[@]}"; do
  echo "$item" >> ~/www/lang/RICORA_HP/docs/document_list
done

echo "[ Successfully completed ]"
echo "exit."
if [ -e ~/www/lang/RICORA_HP/docs/index.html.bak ]; then
  rm ~/www/lang/RICORA_HP/docs/index.html.bak
fi
if [ -e ~/www/lang/RICORA_HP/docs/news/news.xml.bak ]; then
  rm ~/www/lang/RICORA_HP/docs/news/news.xml.bak
fi
rmtmp
exit 0
