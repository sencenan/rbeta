package init

import (
	"fmt"
	// "reflect"

	"gopkg.in/alecthomas/kingpin.v2"
	"github.com/aws/aws-sdk-go/aws/session"

	"github.com/sencenan/rbeta/rbeta-cli/terraform"
	"github.com/sencenan/rbeta/rbeta-cli/aws"
)

type InitCmd struct {
	namespace string
	dryrun bool
}

func (cmd *InitCmd) Bind(app *kingpin.Application, name string) (clause *kingpin.CmdClause) {
	clause = app.Command(name, "init rbeta").Action(cmd.run);

	clause.
		Flag(
			"namespace", "Name space for the rbeta deployment.",
		).Short('n').Required().StringVar(&cmd.namespace)

	clause.
		Flag(
			"dryrun", "dryrun the init process.",
		).Short('d').BoolVar(&cmd.dryrun)

	return
}

// Init:
// 0) setup namespace and aws region
// 1) create IAM roles + policies
// 2) create table to track all the reducer states
func (cmd *InitCmd) run(ctx *kingpin.ParseContext) (err error) {
	// 0) check if terraform is present
	terraform.MustExists()

	// 1) setup s3 bucket for remote state, fails if already exists, or cannot create
	_, err = aws.ResolveCred()

	if (err != nil) {
		return err
	}

	sess, err := session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	})
	creds, err := sess.Config.Credentials.Get()
	fmt.Printf("%s \n", creds.AccessKeyID)
	fmt.Printf("%s \n", creds.SecretAccessKey)
	fmt.Printf("%s \n", *sess.Config.Region)

	// 2) create terraform config

	// 3) plan terraform

	// 4) execute the terraform

	return err
}
