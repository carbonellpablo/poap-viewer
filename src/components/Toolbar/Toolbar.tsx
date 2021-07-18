import React from 'react';
import './Toolbar.css';

export interface Props {
  handleChangeToolbar: (e: React.ChangeEvent<HTMLFormElement>) => void;
}

export default function Toolbar({ handleChangeToolbar }: Props): JSX.Element {
  // eslint-disable-next-line no-console
  return (
    <div className="Toolbar">
      <form onChange={handleChangeToolbar} onSubmit={(e) => e.preventDefault()}>
        <div className="search">
          <input
            type="search"
            name="searchInput"
            id="searchInput"
            placeholder="search by name, description, location or date"
          />
        </div>
        <div className="filters">
          <select name="chain" id="chain" defaultValue="all">
            <option value="all">All</option>
            <option value="eth">ETH</option>
            <option value="xdai">xDAI</option>
          </select>
          <select name="location" id="location" defaultValue="all">
            <option value="all">All</option>
            <option value="premises">Premises</option>
            <option value="virtual"> Virtual</option>
          </select>
          <select name="size" id="size" defaultValue="large">
            <option value="large">Large</option>
            <option value="small">Small</option>
          </select>
          <select name="sorting" id="sorting" defaultValue="newest">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </form>
    </div>
  );
}
