import './TokenDetails.css';

import { AccountBadge } from '../../shared/types';

interface Props {
  badgeToRender: AccountBadge | null | undefined;
}

export default function TokenDetails({ badgeToRender }: Props): JSX.Element {
  return (
    <div className="TokenDetails">
      {badgeToRender ? (
        <>
          <h1>{badgeToRender.name}</h1>
          <div className="container">
            <img src={badgeToRender.imageURL} alt={badgeToRender.name} />
            <div className="textContent">
              <div className="tokenInfo">
                <h3>Token</h3>
                <h4>ID</h4>
                <h6>{badgeToRender.tokenID}</h6>
                <h4>Blockchain</h4>
                <h6>{badgeToRender.chain}</h6>
                <h4>Owner</h4>
                <h6>{badgeToRender.owner}</h6>
              </div>
              <div className="eventInfo">
                <h3>Event</h3>
                {badgeToRender.event_url ? (
                  <>
                    <h4>URL</h4>
                    <h6>{badgeToRender.event_url}</h6>
                  </>
                ) : null}
                <h4>Date</h4>
                <h6>{badgeToRender.start_date}</h6>

                <h4>Location</h4>
                <h6>
                  {badgeToRender.city ? `${badgeToRender.city}, ` : null}
                  {badgeToRender.country}
                  {badgeToRender.virtual_event ? ' (virtual event)' : null}
                </h6>
                {badgeToRender.description ? (
                  <>
                    <h4>Description</h4>
                    <p>{badgeToRender.description}</p>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
