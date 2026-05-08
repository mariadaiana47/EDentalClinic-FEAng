import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

/** Wrapper minimal pe HttpClient pentru a evita repetitia ${apiUrl} in fiecare service. */
export abstract class BaseApi {
  protected readonly http = inject(HttpClient);
}
