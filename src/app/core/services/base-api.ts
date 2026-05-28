import { HttpClient } from '@angular/common/http';

export abstract class BaseApi {
  constructor(protected http: HttpClient) {}
}
