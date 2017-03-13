package reducer

import (
	"gopkg.in/alecthomas/kingpin.v2"
)

type MapCmd struct {
	namespace string
}

func (cmd *MapCmd) Bind(app *kingpin.Application, name string) (clause *kingpin.CmdClause) {
	clause = app.Command(name, "map rbeta").Action(cmd.run);

	clause.
		Flag(
			"namespace", "Name space for the rbeta deployment.",
		).
		Short('n').
		Required().
		StringVar(&cmd.namespace)

	return
}

func (cmd *MapCmd) run(ctx *kingpin.ParseContext) (err error) {
	// add new reducer

	// start a map task lambda that re-insert each record

	return
}
