package main

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
)

func updatenetwork(remote string, newremote string) {
	if connection, err := net.Dial("tcp", remote); err == nil {
		defer connection.Close()

		encoder := json.NewEncoder(connection)
		encoder.Encode(Nodemsg{"net_update", hostname, 0, []string{newremote}})

	} else {
		fmt.Fprintln(os.Stderr, err)
	}
}
