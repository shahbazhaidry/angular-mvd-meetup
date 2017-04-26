import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as fromRoot from './../reducers';
import * as meetup from './../actions/meetup';
import { MeetupService } from './../../services';
import { MeetupConstants } from "../../constans/meetup";

@Injectable()
export class MeetupEffects {
    constructor(
        private actions$: Actions,
        private meetupService: MeetupService,
        private store$: Store<fromRoot.State>
    ) { }

    @Effect() loadMeetups$ = this.actions$
        .ofType(
            meetup.ActionTypes.LOAD_INIT_MEETUPS,
            meetup.ActionTypes.UPDATE_FILTER_TOPIC,
            meetup.ActionTypes.REMOVE_FILTER_TOPIC,
            meetup.ActionTypes.UPDATE_SHOW_VIEW
        )
        .withLatestFrom(this.store$)
        // Array destructuring... en TypeScript feature
        .filter(([action, state]: [Action, fromRoot.State]) => state.meetup.viewGroupOrMeetupSelected === MeetupConstants.MEETUP_EVENTS)
        .map(([action, state]: [Action, fromRoot.State]) =>
            ({
                topics: state.meetup.selectedTopics.join(' '),
                latitude: state.meetup.coordinates.latitude,
                longitude: state.meetup.coordinates.longitude
            })
        )
        .switchMap((payload) => this.meetupService.getMeetups(payload.topics, payload.latitude, payload.longitude)
            .map(payload => new meetup.LoadMeetupsCompleteAction(payload.results))
            .catch(error => Observable.of(new meetup.LoadMeetupsFailAction({ error })))
        );

    @Effect() loadGroups$ = this.actions$
        .ofType(
            meetup.ActionTypes.LOAD_INIT_GROUPS,
            meetup.ActionTypes.UPDATE_FILTER_TOPIC,
            meetup.ActionTypes.REMOVE_FILTER_TOPIC,
            meetup.ActionTypes.UPDATE_SHOW_VIEW
        )
        .withLatestFrom(this.store$)
        // Array destructuring... en TypeScript feature
        .filter(([action, state]: [Action, fromRoot.State]) => state.meetup.viewGroupOrMeetupSelected === MeetupConstants.MEETUP_GROUPS)
        .map(([action, state]) =>
            ({
                topics: state.meetup.selectedTopics,
                latitude: state.meetup.coordinates.latitude,
                longitude: state.meetup.coordinates.longitude
            })
        )
        .switchMap((payload) => this.meetupService.getMeetupGroups(payload.topics, payload.latitude, payload.longitude)
            .map(payload => new meetup.LoadGroupsCompleteAction(payload))
            .catch(error => Observable.of(new meetup.LoadGroupsFailAction({ error })))
        );
}