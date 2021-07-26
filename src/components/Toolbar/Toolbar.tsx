import React from 'react';
import './Toolbar.css';

export interface Props {
  handleChangeToolbar: (e: React.ChangeEvent<HTMLFormElement>) => void;
}

export default function Toolbar({ handleChangeToolbar }: Props): JSX.Element {
  return (
      <form className="Toolbar" onChange={handleChangeToolbar} onSubmit={(e) => e.preventDefault()}>
        <input
          className="search"
          type="search"
          name="searchInput"
          id="searchInput"
          placeholder="search by name, description or location"
        />

          <label htmlFor="chain">
            Blockchain:
            <select name="chain" defaultValue="all">
              <option value="all">All</option>
              <option value="eth">ETH</option>
              <option value="xdai">xDAI</option>
            </select>
          </label>

          <label htmlFor="location">
            Location:
            <select name="location" id="location" defaultValue="all">
              <option value="all">All</option>
              <option value="premises">Premises</option>
              <option value="virtual"> Virtual</option>
            </select>
          </label>

          <label htmlFor="size">
            Size:
            <select name="size" id="size" defaultValue="large">
              <option value="large">Large</option>
              <option value="small">Small</option>
            </select>
          </label>

          <label htmlFor="sorting">
            Sorting:
            <select name="sorting" id="sorting" defaultValue="newest">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>

      </form>

  );
}
