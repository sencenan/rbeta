package main

import (
	"os"
	"fmt"

	"gopkg.in/alecthomas/kingpin.v2"

	I "github.com/sencenan/rbeta/rbeta-cli/cmd/init"
	R "github.com/sencenan/rbeta/rbeta-cli/cmd/reducer"
)

const Version = "0.0.1"

var (
	rbeta = kingpin.New("rbeta-cli", "rbeta-cli")
	initCmd = &I.InitCmd{}
	mapCmd = &R.MapCmd{}
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Error: %s \n", r)
		}
	}()

	rbeta.Version(Version)

	initCmd.Bind(rbeta, "init")
	mapCmd.Bind(rbeta, "map")

	kingpin.MustParse(rbeta.Parse(os.Args[1:]))
}
