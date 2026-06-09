import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export abstract class BaseApi {
  constructor(protected http: HttpClient) {}
}
