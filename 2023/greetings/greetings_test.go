package greetings

import (
	"regexp"
	"testing"
)

func TestHelloName(t *testing.T){
	name:="Sigurd"
	want := regexp.MustCompile(`\b`+name+`\b`)
	msg,err := Hello(name)
	if !want.MatchString(msg) || err != nil{
		t.Fatalf(`Hello("Sigurd") = %q,  want match for %#q, nil`, msg,  want)
	}

}

func TestHelloEmpty(t *testing.T){
	msg,err := Hello("")
	if msg != "" || err == nil {
		t.Fatalf(`Hello("") = %q, want ""`, msg)
	}
}