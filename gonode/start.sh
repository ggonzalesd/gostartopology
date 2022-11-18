tilix -e "./main localhost:8000 localhost:9000" &
sleep 1
tilix -e "./main localhost:8001 localhost:9001 localhost:8000" &
tilix -e "./main localhost:8002 localhost:9002 localhost:8000" &