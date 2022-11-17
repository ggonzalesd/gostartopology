package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Add("Access-Control-Allow-Origin", "*")
	(*w).Header().Add("Access-Control-Allow-Methods", "*")
	(*w).Header().Add("Access-Control-Allow-Headers", "*")
	(*w).WriteHeader(http.StatusOK)
}

func updateFromEditor(w http.ResponseWriter, req *http.Request) {
	enableCors(&w)

	var documentEditor DocumentEditor

	decoder := json.NewDecoder(req.Body)
	if decoder.Decode(&documentEditor) == nil {
		document = documentEditor
		fmt.Println(document.Modified)
		fmt.Println("---------------------------------")
		for _, lines := range document.Doc {
			fmt.Println(lines)
		}
		fmt.Println("---------------------------------")
	} else {
		w.WriteHeader(http.StatusBadRequest)
	}
}

func refreshToEditor(w http.ResponseWriter, req *http.Request) {
	enableCors(&w)

	encoder := json.NewEncoder(w)

	encoder.Encode(document)
}
