package main

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
)

func joinnetwork(remote string) {
	var msg Nodemsg
	if connection, err := net.Dial("tcp", remote); err == nil {
		defer connection.Close()

		fmt.Printf("Join to network: %s\n", remote)

		encoder := json.NewEncoder(connection)
		decoder := json.NewDecoder(connection)

		remotesBlock <- true
		encoder.Encode(Nodemsg{"net_join", hostname, 0, remotes})
		decoder.Decode(&msg)
		remotes = append(remotes, msg.Remotes...)
		remotes = append(remotes, remote)
		fmt.Printf("%s: %v\n", "connect", remotes)
		<-remotesBlock
		documentBlock <- true
		remoteDocs[remote] = DocumentEditor{0, []string{}}
		<-documentBlock

	} else {
		fmt.Fprintln(os.Stderr, "[ERROR] Imposible unirse a: ", remote, "::", err)
	}
}
