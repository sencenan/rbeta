package model

import (
	"strings"
)

const (
	SEP string = "-"
)

// Format: rbeta-<namespace>-datasrc-<name>
type DataSourceName struct {
	namespace string
	name string
}

// Format: rbeta-<namespace>-datasrc-<name>-reducer-<name>
type ReducerName struct {
	namespace string
	name string
}

// Name related to reducers
// - source: ddb table
// - reducer functions: lambda functions

MakeDDBName(ns string, tableName string) string {
}

MakeReducerName(ns string, tableName string, reducerName string) string {
}
