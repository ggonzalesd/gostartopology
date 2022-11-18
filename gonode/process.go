package main

import (
	"encoding/json"
	"fmt"
	"net"
)

func proccess(conection net.Conn) {
	var msg Nodemsg
	defer conection.Close()

	decoder := json.NewDecoder(conection)
	encoder := json.NewEncoder(conection)

	decoder.Decode(&msg)

	switch msg.Cmd {
	case "net_join":
		remotesBlock <- true
		encoder.Encode(Nodemsg{"net_welcome", hostname, 0, remotes})
		for _, remote := range remotes {
			go updatenetwork(remote, msg.Addr)
		}
		remotes = append(remotes, msg.Remotes...)
		remotes = append(remotes, msg.Addr)
		fmt.Printf("%s: %v\n", "welcone", remotes)
		<-remotesBlock
		documentBlock <- true
		remoteDocs[msg.Addr] = DocumentEditor{0, []string{}}
		<-documentBlock
	case "net_update":
		remotesBlock <- true
		remotes = append(remotes, msg.Remotes...)
		fmt.Printf("%s: %v\n", "update", remotes)
		<-remotesBlock
	case "sync_doc":
		documentBlock <- true
		remotesBlock <- true

		remoteDocs[msg.Addr] = DocumentEditor{msg.Modified, msg.Remotes}

		for _, remote := range remotes {
			fmt.Println(remoteDocs[remote].Modified, "", document.Modified)
			if remoteDocs[remote].Modified > document.Modified {
				document = remoteDocs[remote]
				fmt.Println("UPDATE: ", document)
			}
		}

		<-documentBlock
		<-remotesBlock
	}
}
