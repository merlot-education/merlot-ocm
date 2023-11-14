import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export default class RestClientService {
  constructor(private readonly httpService: HttpService) {}

  async delete(url: string) {
    return lastValueFrom(
      this.httpService.delete(url).pipe(map((response) => response.data)),
    );
  }

  async post(url: string, payload: object) {
    return lastValueFrom(
      this.httpService
        .post(url, payload)
        .pipe(map((response) => response.data)),
    );
  }

  async get(url: string) {
    return lastValueFrom(
      this.httpService.get(url).pipe(map((response) => response.data)),
    );
  }
}
