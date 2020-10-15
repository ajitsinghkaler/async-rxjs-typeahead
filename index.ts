import { fromEvent, of } from "rxjs";
import { ajax } from "rxjs/ajax";

import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
  catchError,
  filter
} from "rxjs/operators";

interface Country {
  name: string;
}

const countriesRequest = keys =>
  ajax
    .getJSON<Country[]>(`https://restcountries.eu/rest/v2/name/${keys}`)
    .pipe(catchError(() => of([{ name: "No countries found" }])));

fromEvent(document.getElementById("type-ahead"), "keyup")
  .pipe(
    debounceTime(200),
    map((e: any) => e.target.value),
    filter(e => !!e),
    tap(console.log),
    distinctUntilChanged(),
    switchMap(countriesRequest),
    map(resp => resp.map(country => country.name)),
    tap(c => (document.getElementById("output").innerText = c.join("\n")))
  )
  .subscribe();
