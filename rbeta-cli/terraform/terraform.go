package terraform

import (
	"os"
	"os/exec"
)

func MustExists() {
	if _, err := exec.Command("which", "terraform").Output(); err != nil {
		panic("Cannot find terraform executable")
	}
}

func Call(args ...string) {
	cmd := exec.Command("terraform", args...)

	cmd.Stdout = os.Stdout

	cmd.Run()
}
