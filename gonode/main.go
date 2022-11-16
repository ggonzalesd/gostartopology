package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func updateFromEditor(w http.ResponseWriter, req *http.Request) {
	enableCors(&w)

	var documentEditor DocumentEditor

	decoder := json.NewDecoder(req.Body)

	if decoder.Decode(&documentEditor) == nil {
		fmt.Println("---------------------------------")
		for _, lines := range documentEditor.Doc {
			fmt.Println(lines)
		}
		fmt.Println("---------------------------------")
		fmt.Println()

	} else {
		fmt.Println("ERROR")
	}
}

func main() {

	http.HandleFunc("/update-doc", updateFromEditor)

	fmt.Println("Listen al 8080")
	http.ListenAndServe("192.168.1.44:8080", nil)

}
