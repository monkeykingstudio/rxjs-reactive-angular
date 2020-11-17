import { filter, map } from 'rxjs/operators';
import { Course, sortCoursesBySeqNo } from './../model/course';
import { Observable } from 'rxjs';
import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {

  courses$: Observable<Course[]>;

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
    .pipe(
      map(courses => courses
        .filter(course => course.category === category)
        .sort(sortCoursesBySeqNo))
    );
  }

}
