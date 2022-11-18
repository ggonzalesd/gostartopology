package main

import (
	"fmt"
	"net"
	"os"
)

func listenStarnetwork() {
	if listen, err := net.Listen("tcp", hostname); err == nil {
		defer listen.Close()
		fmt.Printf("Hosting Server at '%s'\n", hostname)
		for {
			if conection, err := listen.Accept(); err == nil {
				go proccess(conection)
			} else {
				fmt.Fprintln(os.Stderr, err)
			}
		}
	} else {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(-1)
	}
}
