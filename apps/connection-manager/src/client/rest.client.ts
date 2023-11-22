import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export default class RestClientService {
  public constructor(private readonly httpService: HttpService) {}

  public async post(url: string, payload: object) {
    return lastValueFrom(
      this.httpService
        .post(url, payload)
        .pipe(map((response) => response.data)),
    );
  }
}
