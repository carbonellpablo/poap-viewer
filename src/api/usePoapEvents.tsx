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
  year: number;
  start_date: string;
  virtual_event: boolean;
}

export type ApiEvents = ApiEvent[];
export type PoapEvents = ParsedEvent[];
export type GetPoapEventsCallback = () => void;

export interface PoapEventsState {
  alreadyFetched: boolean;
  error: boolean;
  data: PoapEvents | [];
}

export interface PoapEventsHook {
  poapEvents: PoapEventsState;
  getPoapEvents: GetPoapEventsCallback;
}

function parseEvents(apiEvents: ApiEvents): PoapEvents {
  const poapEvents: PoapEvents = [];

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
      year: event.year,
      start_date: event.start_date,
      timestampDate: Date.parse(event.start_date),
      virtual_event: event.virtual_event,
    };

    poapEvents[event.id] = newEvent;
  });

  return poapEvents;
}

const usePoapEvents = (): PoapEventsHook => {
  const [poapEvents, setPoapEvents] = useState<PoapEventsState>({
    alreadyFetched: false,
    error: false,
    data: [],
  });

  const execute = async () => {
    try {
      const response: Response = await fetch(`${api.rest}/events`);
      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse);
      }

      const data: PoapEvents = parseEvents(jsonResponse);

      setPoapEvents((currentState: PoapEventsState) => ({
        ...currentState,
        alreadyFetched: true,
        data,
      }));
    } catch (e) {
      setPoapEvents((currentState: PoapEventsState) => ({
        ...currentState,
        alreadyFetched: true,
        error: true,
      }));

      // eslint-disable-next-line no-console
      console.log('poap events api', e);
    }
  };

  // to avoid infinite calls when inside a `useEffect`
  const getPoapEvents = useCallback<GetPoapEventsCallback>(execute, []);

  return { poapEvents, getPoapEvents };
};

export default usePoapEvents;
