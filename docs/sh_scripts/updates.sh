#!/bin/bash
list=(`cat ~/www/lang/RICORA_HP/docs/document_list`)
docs=(`ls ~/www/lang/RICORA_HP/docs/LT/`)

#未更新のファイルを抜き出す
for i in "${list[@]}" "${docs[@]}"; do
  echo "$i";
done | sort | uniq -u
