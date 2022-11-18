package main

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
)

func syncdocument(remote string) {
	if connection, err := net.Dial("tcp", remote); err == nil {
		defer connection.Close()
		fmt.Printf("Join to network: %s\n", remote)

		encoder := json.NewEncoder(connection)

		documentBlock <- true
		encoder.Encode(Nodemsg{"sync_doc", hostname, document.Modified, document.Doc})
		<-documentBlock

	} else {
		fmt.Fprintln(os.Stderr, "[ERROR] Imposible unirse a: ", remote, "::", err)
	}
}
