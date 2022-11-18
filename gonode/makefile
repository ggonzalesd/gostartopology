
files=*.go

all: build run

test: build instancing


build:
	go build -o main ${files}

run:
	./main localhost:8000 localhost:9000

instancing:
	sh start.sh