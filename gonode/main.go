package main

import (
	"fmt"
	"net/http"
	"time"
)

var (
	document   DocumentEditor
	docChannel chan bool
)

func main() {
	docChannel = make(chan bool, 1)

	fmt.Println("Time: ", time.Now().UnixNano())

	document = DocumentEditor{time.Now().UnixNano(), make([]string, 0)}

	http.HandleFunc("/update-doc", updateFromEditor)
	http.HandleFunc("/refresh-doc", refreshToEditor)

	fmt.Println("Listen al 8080")
	http.ListenAndServe(":8080", nil)

}
