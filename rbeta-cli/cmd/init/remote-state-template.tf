variable "access_key" {}
variable "secret_key" {}
variable "region" {
	default = "us-east-1"
}

provider "aws" {
	access_key = "${var.access_key}"
	secret_key = "${var.secret_key}"
	region = "${var.region}"
}

resource "aws_s3_bucket" "rbeta_remote_tf_state" {
	bucket = "rbeta.lmn.tf.remote"
	acl = "private"

	tags {
		Description = "rbeta remote terraform state bucket"
	}

	versioning {
		enabled = true
	}
}
