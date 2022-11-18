package main

type Nodemsg struct {
	Cmd      string   `json:"cmd"`
	Addr     string   `json:"addr"`
	Modified int64    `json:"modified"`
	Remotes  []string `json:"remotes"`
}
