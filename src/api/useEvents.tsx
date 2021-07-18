import { useState, useCallback } from 'react';
import api from './api.constants';

export interface ParsedEvent extends Omit<ApiEvent, 'id'> {
  eventID: number;
  timestampDate: number;
}

export interface ApiEvent {
  id: number;
  fancy_id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  event_url: string;
  image_url: string;
  year: string;
  start_date: string;
  virtual_event: boolean;
}

export type ApiEvents = ApiEvent[];
export type Events = ParsedEvent[];
export type FetchEventsCallback = () => void;

export interface EventsState {
  alreadyFetched: boolean;
  error: string;
  data: Events | [];
}

export interface EventsHook {
  events: EventsState;
  fetchEvents: FetchEventsCallback;
}

function parseEvents(apiEvents: ApiEvents): Events {
  const poapEvents: Events = [];

  apiEvents.forEach((event: ApiEvent) => {
    const newEvent: ParsedEvent = {
      eventID: event.id,
      fancy_id: event.fancy_id,
      name: event.name,
      description: event.description,
      city: event.city,
      country: event.country,
      event_url: event.event_url,
      image_url: event.image_url,
      year: event.year.toString(),
      start_date: event.start_date,
      timestampDate: Date.parse(event.start_date),
      virtual_event: event.virtual_event,
    };

    poapEvents[event.id] = newEvent;
  });

  return poapEvents;
}

const useEvents = (): EventsHook => {
  const [events, setEvents] = useState<EventsState>({
    alreadyFetched: false,
    error: '',
    data: [],
  });

  const execute = async () => {
    try {
      const response: Response = await fetch(`${api.rest}/events`);
      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse);
      }

      const data: Events = parseEvents(jsonResponse);

      setEvents({
        alreadyFetched: true,
        error: '',
        data,
      });
    } catch {
      setEvents({
        alreadyFetched: true,
        error: `there was an error fetching EVENTS from the API`,
        data: [],
      });
    }
  };

  // to avoid infinite calls when inside a `useEffect`
  const fetchEvents = useCallback<FetchEventsCallback>(execute, []);

  return { events, fetchEvents };
};

export default useEvents;
