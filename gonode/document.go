package main

type DocumentEditor struct {
	Modified int64    `json:"modified"`
	Doc      []string `json:"doc"`
}
