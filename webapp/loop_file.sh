#!/usr/bin/expect

while :
do
	echo "Loop to output events running..." &&
	node quickstart.js > output_file.json &&
	sshpass -p "pi" scp output_file.json pi@10.10.197.8:/home/pi/Ricall/db/output_file.json &&
	sleep 10
done
