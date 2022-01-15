package main

import (
	"strings"

	"github.com/google/uuid"
)

func GenerateKey() string {
	uuid := uuid.New().String()
	uuid = strings.ReplaceAll(uuid, "-", "")[0:30]
	uuid = strings.ToUpper(uuid)

	uuid = format(uuid)

	return uuid
}

func format(s string) string {
	for i := 0; i < len(s); i++ {
		if i > 0 && (i%6) == 0 {
			s = replaceAtIndex(s, '-', i)
		}
	}
	return s[1:]
}

func replaceAtIndex(in string, r rune, i int) string {
	out := []rune(in)
	out[i] = r
	return string(out)
}
