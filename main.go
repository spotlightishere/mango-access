package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/logrusorgru/aurora/v3"
)

func logRequest(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Print("\n")

		log.Printf("%s %s", aurora.Cyan(r.Method), r.URL)
		// TODO: remove header dumping
		for name, value := range r.Header {
			log.Print(aurora.Magenta(name), " ", "=>", " ", aurora.Yellow(value))
		}
		handler.ServeHTTP(w, r)
	})
}

func main() {
	log.Print("Listening...")
	http.Handle("/", http.FileServer(http.Dir("./site")))

	// Listen on a locally bound port so that this can be used in conjunction with mango-upgrade.
	panic(http.ListenAndServe("127.0.0.1:4453", logRequest(http.DefaultServeMux)))
}
