import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Course} from '../model/course';

@Injectable({
  providedIn: 'root'
})

export class CoursesService {
  constructor(private http: HttpClient) {

  }

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses")
      .pipe(
        map(res => res["payload"]),
        shareReplay()
      );
  }
}
