package aws

import (
	"bufio"
	"errors"
	"os"
	"os/user"
	"path/filepath"
	"strings"
)

var (
	ErrCredentialsNotFoundInEnv = errors.New("Cannot find AWS Credentials in environment")
)

type AWSCredential struct {
	AccessKeyID string
	SecretAccessKey string
}

// Get AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from env vars
func GetCredFromEnv(cred *AWSCredential) error {
	cred.AccessKeyID = os.Getenv("AWS_ACCESS_KEY_ID")
	cred.SecretAccessKey = os.Getenv("AWS_SECRET_ACCESS_KEY")

	if len(cred.AccessKeyID) == 0 || len(cred.SecretAccessKey) == 0 {
		return ErrCredentialsNotFoundInEnv
	} else {
		return nil
	}
}

// Read shared credentials file, and AWS_PROFILE
func GetCredFromProfile(cred *AWSCredential) error {
	usr, err := user.Current()

	if err != nil {
		return err
	}

	file, err := os.Open(filepath.Join(usr.HomeDir, ".aws", "credentials"))

	if err != nil {
		return err
	}

	profile := os.Getenv("AWS_PROFILE")
	if len(profile) == 0 {
		profile = "default";
	}

	scanner := bufio.NewScanner(file)

	f := func(line string) {
		switch parts := strings.Split(line, "="); strings.TrimSpace(parts[0]) {
		case "aws_access_key_id": cred.AccessKeyID = strings.TrimSpace(parts[1])
		case "aws_secret_access_key": cred.SecretAccessKey = strings.TrimSpace(parts[1])
		}
	}

	for scanner.Scan() {
		if (strings.TrimSpace(scanner.Text()) == "[" + profile + "]") {
			scanner.Scan()
			f(scanner.Text())
			scanner.Scan()
			f(scanner.Text())
			break
		}
	}

	if err := scanner.Err(); err != nil {
		return err
	}

	if len(cred.AccessKeyID) == 0 || len(cred.SecretAccessKey) == 0 {
		return ErrCredentialsNotFoundInEnv
	}

	return nil
}

func ResolveCred() (cred *AWSCredential, err error) {
	cred = &AWSCredential{}

	err = GetCredFromEnv(cred)

	if err != nil {
		// fallback
		err = GetCredFromProfile(cred)
	}

	return cred, err
}
