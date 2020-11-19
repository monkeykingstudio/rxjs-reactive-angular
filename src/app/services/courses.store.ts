import { MessagesService } from './../messages/messages.service';
import { LoadingService } from './../loading/loading.service';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { Course, sortCoursesBySeqNo } from './../model/course';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private loading: LoadingService,
    private messages: MessagesService) {

    this.loadAllCourses();
  }

  loadAllCourses() {
    const loadCourses$ = this.httpClient.get<Course[]>('/api/courses')
      .pipe(
        map(val => val['payload']),
        catchError(err => {
          const message = 'Could not load courses';
          this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(val => this.subject.next(val))
      );

      this.loading.showLoaderUntilCompleted(loadCourses$)
      .subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {

    const courses = this.subject.getValue();
    const index = courses.findIndex(course => course.id === courseId);

    const newCourse: Course = {
      ...courses[index],
      ...changes
    };

    const newCourses: Course[] = courses.slice(0);

    newCourses[index] = newCourse;

    this.subject.next(newCourses);

    return this.httpClient.put(`/api/courses/${courseId}`, changes)
      .pipe(
        
      )

  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
    .pipe(
      map(courses => courses
        .filter(course => course.category === category)
          .sort(sortCoursesBySeqNo))
    );
  }

}
