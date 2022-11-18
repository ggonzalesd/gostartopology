package main

import (
	"fmt"
	"net/http"
	"os"
	"time"
)

var (
	document      DocumentEditor
	remoteDocs    map[string]DocumentEditor
	documentBlock chan bool
	hostname      string
	hostclient    string
	remotes       []string
	remotesBlock  chan bool
)

func main() {
	if len(os.Args) > 2 {
		remotesBlock = make(chan bool, 1)
		documentBlock = make(chan bool, 1)
		document = DocumentEditor{time.Now().UnixNano(), make([]string, 0)}
		remoteDocs = make(map[string]DocumentEditor)

		hostname = os.Args[1]
		hostclient = os.Args[2]

		fmt.Println("hostname:", hostname)
		fmt.Println("hostclient:", hostclient)

		for _, remote := range os.Args[3:] {
			// Join to Star Network
			fmt.Println("Remote:", remote)
			go joinnetwork(remote)
		}

		http.HandleFunc("/update-doc", updateFromEditor)
		http.HandleFunc("/refresh-doc", refreshToEditor)

		go http.ListenAndServe(hostclient, nil)

		listenStarnetwork()
	} else {
		fmt.Fprintln(os.Stderr, "./main <nodehost:port> <clienthost:port>")
		fmt.Fprintln(os.Stderr, "./main <nodehost:port> <clienthost:port> <noderemote:port>")
	}
}
